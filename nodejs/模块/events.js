

// ============实例1 注册事件，触发事件===================
/* 
The eventEmitter.on() method is used to register listeners, 
while the eventEmitter.emit() method is used to trigger the event.
*/

const EventEmitter = require('events')

class MyEmitter extends EventEmitter {}

var myEmitter = new MyEmitter()

myEmitter.on('event', function(a, b) {
  console.log('Targeted event', a, b)
  console.log(this)
})

myEmitter.emit('event', 'is a', 'is b')

// Targeted event is a is b
// MyEmitter {
//   domain: null,
//   _events: { event: [Function] },
//   _eventsCount: 1,
//   _maxListeners: undefined }


// ================实例2 Handling events only once============

// 默认下，listener will be invoked every time the named event is emitted.
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.on('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Prints: 2

//Using the eventEmitter.once() method, it is possible to register a listener that 
//is called at most once for a particular event. 
//Once the event is emitted, the listener is unregistered and then called.
const myEmitter = new MyEmitter();
let m = 0;
myEmitter.once('event', () => {
  console.log(++m);
});
myEmitter.emit('event');
// Prints: 1
myEmitter.emit('event');
// Ignored
