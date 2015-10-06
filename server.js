
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