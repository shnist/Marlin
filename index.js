/**
 * Module dependencies.
 */
var express = require('express'),
	routes = require('./routes'),
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
 * Home Page Routers
 * Gathers all Statisticss and displays them for the user to select one
 */
marlin.get('/', routes.index);

marlin.post('/', function (request, response) {
	var project = request.param('projects');
	/**
	 * First page is the "worst page"
	 * When JavaScript is turned on this is the only page
	 */
	response.redirect('/projects/' + project);
});

/**
 * Statistics Page Router
 * Shows stastics for the chosen Statistics
 */
/** 
 * GET - "worst", fetches the worst performing statistics 
 * When the user goes to project directly from url or from home page
 */
marlin.get('/projects/:name', routes.projectWorst);
/**
 * GET - best, fetches the best performing statistics
 * When the user submits a form on the project page
 */
//marlin.get('/projects/:name/best', routes.projectBest);
marlin.get('/projects/:name/best', routes.projectWorst);
/**
 * GET - javascript - fetches statistics for javascript performance
 */
//marlin.get('/projects/:name/javascript', routes.projectJavaScript);
marlin.get('/projects/:name/javascript', routes.projectWorst);

/**
 * POST - best - fetches statistics on the worst performing page
 */
marlin.post('/projects/:name', function (request, response) {
	console.log(request);
});
/**
 * POST - best - fetches statistics on the best performing page
 */
marlin.post('/projects/:name/best', function (request, response) {
	console.log(request);
});
/**
 * POST - javascript - fetches statistics on the javascript page
*/
marlin.post('/projects/:name/javascript', function (request, response) {
	console.log(request);
});


/**
 * New Report Page Router
 * Handles the creation of a new report
 */
marlin.get('/newreport', routes.newReport);


// listen on port 3000
marlin.listen(3000);
console.log("Express server listening on port %d in %s mode", marlin.address().port, marlin.settings.env);