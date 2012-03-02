/**
 * Module dependencies.
 */
var express = require('express'),
	routes = require('./routes'),
	StatisticsProvider = require('./providers/statistics_provider').StatisticsProvider,
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

// make a new instance of the Statistics provider
var statisticsProvider = new StatisticsProvider();


// ROUTERS
/**
 * Home Page Router
 * Gathers all Statisticss and displays them for the user to select one
 */
marlin.get('/', routes.index);

/**
 * Statistics Page Router
 * Shows stastics for the chosen Statistics
 */
marlin.get('/statistics/id:', function (request, response) {
	statisticsProvider.findStatistics(function () {
		response.send(docs);
	});
});


// listen on port 3000
marlin.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);