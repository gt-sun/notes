

## 插入

```js
var mongoose = require('mongoose');
mongoose.connect('mongodb://42.51.33.105/test');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("Success!")

});

//everything is derived from a Schema
var kittySchema = mongoose.Schema({
  name: String
});

//compiling our schema into a Model.
var Kitten = mongoose.model('Kitten', kittySchema);

//create a kitten document
var silence = new Kitten();
silence.name = 'sunsun3'

silence.save();

//query : 指定查找
Kitten.find({ name: /^sunsun2/ },function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})

//query : 不带条件，查找all
Kitten.find(function (err, kittens) {
  if (err) return console.error(err);
  console.log(kittens);
})
db.close()
```