// importing express server
var express = require('express'),
// importing projectProvider
	ProjectProvider = require('./providers/project_provider').ProjectProvider,
// create server 
	marlin = module.exports = express.createServer();

// CONFIGURATION
marlin.configure(function () {
	marlin.set('views', __dirname + '/views');
	// importing the jade html template engine
	marlin.set('view engine', 'jade');
	marlin.use(express.bodyParser());
	marlin.use(express.methodOverride());
	// importing the stylus css template engine
	marlin.use(require('stylus').middleware({ src: __dirname + '/public' }));
	marlin.use(marlin.router);
	marlin.use(express.static(__dirname + '/public'));
});

/**
 * Development configuration
 * Shows error clearly when in development mode
 */
marlin.configure('development', function(){
	marlin.use(express.errorHandler({dumpExceptions: true, showStack: true}));
});

/**
 * Production configuration
 * Errors do not show in production environment
 */
marlin.configure('production', function () {
	marlin.use(express.errorHandler());	
});


// ROUTERS
/**
 * Home Page Router
 * Gathers all projects and displays them for the user to select one
 */
marlin.get('/', function (request, response) {
	response.send('hello world');
	ProjectProvider.allProjects(function (error, docs) {
		response.send(docs);
	});
});

/**
 * Project Page Router
 * Shows stastics for the chosen project
 */
marlin.get('/projects/id:', function (request, response) {
	ProjectProvider.findProject(function () {
		response.send(docs);
	});
});


// listen on port 3000
marlin.listen(3000);