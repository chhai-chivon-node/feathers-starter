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