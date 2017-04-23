
//https://legacy.docs.feathersjs.com/hooks/usage.html

const feathers = require('feathers');
const memory = require('feathers-memory');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');

const app = feathers()
  .configure(rest())
  .configure(hooks())
  .use('/todos', memory());

app.listen(8000);

// Get the wrapped service object which will be used in the other examples
const todoService = app.service('todos');

todoService.before({
  all(hook) {
    if(!hook.params.user) {
      throw new Error('You need to be logged in');
    }
  },

  create(hook, next) {
    hook.data.createdAt = new Date();
  }
});


todoService.after({
  find(hook) {
    // Manually filter the find results
    hook.result = hook.result.filter(current => 
      current.companyId === hook.params.user.companyId
    );
  },

  get(hook) {
    if (hook.result.companyId !== hook.params.user.companyId) {
      throw new Error('You are not authorized to access this information');
    }
  }
});

/*
As service properties

You can also add before and after hooks to your initial service object right away 
by setting the before and after properties to the hook object. 
The following example has the same effect as the previous examples:
*/

const TodoService = {
  todos: [],

  get(id, params) {
    for (var i = 0; i < this.todos.length; i++) {
      if (this.todos[i].id === id) {
        return Promise.resolve(this.todos[i]);
      }
    }

    return Promise.reject(new Error('Todo not found'));
  },

  // Return all todos from this service
  find(params, callback) {
    return Promise.resolve(this.todos);
  },

  // Create a new Todo with the given data
  create(data, params, callback) {
    data.id = this.todos.length;
    this.todos.push(data);

    return Promise.resolve(data);
  },

  before: {
    find(hook) {
      if (!hook.params.user) {
        throw new Error('You are not logged in');
      }
    },

    create(hook) {
      hook.data.createdAt = new Date();
    }
  },

  after: {
    find(hook) {
      // Manually filter the find results
      hook.result = hook.result.filter(current =>
        current.companyId === hook.params.user.companyId
      );
    },

    get(hook) {
      if (hook.result.companyId !== hook.params.user.companyId) {
        throw new Error('You are not authorized to access this information');
      }
    }
  }
}

/*
Asynchronous hooks

Hooks also allow asynchronous processing either by returning a Promise or by calling a callback.

Promises

All hooks can return a Promise object for asynchronous operations:
*/

todoService.before({
  find(hook) {
    return new Promise((resolve, reject) => {

    });
  }
});
//If you t to change the hook object just chain the returned promise using .then:

todoService.before({
  find(hook) {
    return this.get().then(data => {
      hook.params.message = 'Ran through promise hook';
      // Always return the hook object
      return hook;
    });
  }
});
//ProTip: If a promise fails, the error will be propagated immediately and will exit out of the promise chain.

/*
Callbacks

Another way is to pass next callback as the second parameter that has to be called with (error, data).

ProTip: This is going to be removed in Feathers v3 in 2017. Please use promises.
*/
todoService.before({
  find(hook, next) {
    this.find().then(data => {
      hook.params.message = 'Ran through promise hook';
      hook.data.result = data;
      // With no error
      next();
      // or to change the hook object
      next(null, hook);
    });
  }
});

/*
Dynamic Registrations

If you register a before or after hook for a certain method in one place and then register another before or after hook for the same method, feathers-hooks will automatically execute them in a chained fashion in the order that they were registered.

Pro Tip: This works well if you have more dynamic or conditional hooks.
*/
const app = feathers().use('/users', userService);

// We need to retrieve the wrapped service object from app which has the added hook functionality
const userService = app.service('users');

userService.before({
    ...
});

// Somewhere else
userService.before({
    ...
});