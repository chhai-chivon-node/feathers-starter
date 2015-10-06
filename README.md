Feathers.js Starter App
=====

Going to follow [this tutorial](https://medium.com/all-about-feathersjs/from-mongoose-models-to-a-real-time-api-with-feathersjs-ec1cc3fb0a5c) to migrate away from the MEAN stack and instead use Feathers.js. Feathers extends express and we can even use mongoose with it. The framework provides another layer of abstraction and realtime goodness.

#### Getting started
```
$ git clone git@github.com:cleechtech/mean-starter.git
$ mv mean-starter feathers-starter
$ cd feathers-starter
$ npm i
$ nodemon server
```

This gives us a MEAN app, let's change it up.

```
$ npm uninstall express --save
$ npm i feathers feathers-mongoose --save
```

Start `mongod` in a new tab for MongoDB. Then update **server.js** to use feathers instead of express:

```
var feathers = require('feathers'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
	cors = require('cors'),
	app = feathers();

// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./server/env')[env];

mongoose.connect(envConfig.db);

// FEATHERS CONFIG
app.use(bodyParser.json())
	.use(cors())
	.use(methodOverride())
	.use(cookieParser())
	.use(feathers.static(__dirname + '/public'))
	.configure(feathers.socketio()) // Enable Socket.io
	.configure(feathers.rest()) // Enable REST services
	.use(bodyParser.json()) // Turn on JSON parser for REST services
	.use(bodyParser.urlencoded({ extended: true })); // Turn on URL-encoded parser for REST services
	
// ROUTES
require('./server/routes')(app);

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});
```

Also update the **server/routes.js** file:

```
var feathers = require('feathers'),
	path = require('path'),
	rootPath = path.normalize(__dirname + '/../'),
	apiRouter = feathers.Router(),
	router = feathers.Router();

module.exports = function(app){	

	// angularjs catch all route
	router.get('/*', function(req, res) {
		res.sendFile(rootPath + 'public/index.html', { user: req.user });
	});

	app.use('/api', apiRouter);	// haven't built any api yet
	app.use('/', router);
};
```

Start the server with `nodemon server` and you will have a feathers starter app. It is almost exacly the same as the previous express starter. Let's add some feathers specific functionality.

### Creating Todos

First create the mongoose model:

```
$ mkdir server/models
$ touch server/models/todo.js
```

As installed above we will use [feathers-mongoose](https://github.com/feathersjs/feathers-mongoose). First make the model definition:

```
var Todo = {
    schema: {
        title: {type: String, required: true},
        description: {type: String},
        dueDate: {type: Date, 'default': Date.now},
        complete: {type: Boolean, 'default': false, index: true}
    },
    methods: {
        isComplete: function(){
            return this.complete;
        }
    },
    statics: {
    },
    virtuals: {
    },
    indexes: [
        {'dueDate': -1, background: true}
    ]
};

module.exports = Todo;

```

Next refactor our routes file:

```
var feathers = require('feathers'),
	path = require('path'),
	rootPath = path.normalize(__dirname + '/../'),
	router = feathers.Router(),
	mongooseService = require('feathers-mongoose'),
	Todo = require('./models/todo');

module.exports = function(app){	

	app.use('api/todos', new mongooseService('Todo', Todo));

	// angularjs catch all route
	router.get('/*', function(req, res) {
		res.sendFile(rootPath + 'public/index.html', { user: req.user });
	});

	app.use('/', router);
};
```

Now you can go to `http://localhost:3000/api/todos` and see an empty array for our lack of Todos.

### CRUD Todos

So now we will build out a frontend to perform CRUD operations. First do a POST request to add a todo:

```
$ curl --data "title=Testing&description=this is a test" http://localhost:3000/api/todos
```

