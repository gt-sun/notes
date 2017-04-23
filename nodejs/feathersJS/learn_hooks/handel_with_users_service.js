

/*
For example, in a user service we only want to allow logged in users that are also admins 
to retrieve a list of all users and only allow any logged in user to retrieve its own information. 
When creating a new user we want to validate the input data and hash+salt their password. 
We also never want to expose the password hashes and salts through the API. 

*/

var feathers = require('feathers');
var mongodb = require('feathers-mongodb');
var hooks = require('feathers-hooks');
var bodyParser = require('body-parser')
var crypto = require('crypto');
var nodemailer = require('nodemailer');
// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'gmail.user@gmail.com',
        pass: 'userpass'
    }
});

// Hook that send an email to the user
function sendEmail(hook, next) {
  var userData = hook.data;
  var mailOptions = {
      from: 'Fred Foo ✔ <foo@blurdybloop.com>',
      to: userData.email,
      subject: 'Hello from feathers-hook',
      text: 'Hello ' + userData.name
  };

  transporter.sendMail(mailOptions, function(error, info){
    next(error);
  });
}

// Hook that creates a secure hash on the user object
function hashPw(hook, next) {
  var userData = hook.data;

  // Create a securely hashed password
  var salt = crypto.randomBytes(128).toString('base64');
  var shasum = crypto.createHash('sha256');

  shasum.update(userData.password + salt);

  // Set the hashed password and salt to the data
  hook.data.salt = salt;
  hook.data.password = shasum.digest('hex');

  next();
}

function isLoggedIn(hook, next) {
  if(!hook.params.user) {
    return next(new Error('You are not logged in'));
  }
  next();
}

function isAdmin(hook, next) {
  if(hook.params.user.groups.indexOf('admin') === -1) {
    return next(new Error('Only admin is allowed to do this'));
  }
  next();
}

function isCurrent(hook, next) {
  if(hook.params.user.id !== hook.id) {
    return next(new Error('You are not allowed to access this information'));
  }
  next();
}

function removePasswords(hook, next) {
  var data = hook.result;
  var removePassword = function(user) {
    delete user.password;
    delete user.salt;
  }

  // If returned from .find()
  if(Array.isArray(data)) {
    data.forEach(removePassword);
  } else {
    removePassword(data);
  }

  next();
}

var app = feathers()
  // Set up REST and SocketIO APIs
  .configure(feathers.rest())
  .configure(feathers.socketio())
  // Allow to add hooks to services
  .configure(hooks())
  // Parse HTTP bodies
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  // Register a MongoDB CRUD service on the users collection
  .use('/users', mongodb({
    db: 'feathers-demo',
    collection: 'users'
  }));


// Register the hooks
app.service('users').before({
    find: [ isLoggedIn, isAdmin ],
    get: [ isLoggedIn, isCurrent ],
    create: hashPw
  })
  .after(removePasswords)
  .after({
    create: sendEmail
  });

app.listen(3030);