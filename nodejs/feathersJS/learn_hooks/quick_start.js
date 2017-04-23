const feathers = require('feathers');
const hooks = require('feathers-hooks');

const app = feathers().configure(hooks());

const service = require('feathers-memory');

// Initialize our service
app.use('/users', service());

// Get our initialized service so that we can bind hooks
const userService = app.service('/users');

const myHook = options => { // always wrap in a function so you can pass options and for consistency.
  return hook => {
    console.log('My custom hook ran');
    return Promise.resolve(hook); // A good convention is to always return a promise.
  };
};

// Set up our before hook
userService.before({
  all: [], // run hooks for all service methods
  find: [myHook()] // run hook on before a find. You can chain multiple hooks.
});