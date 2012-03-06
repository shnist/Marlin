/*
* GET home page.
*/

/**
* Module dependencies.
*/
var StatisticsProvider = require('../providers/statistics_provider').StatisticsProvider,
	ProjectProvider = require('../providers/project_provider').ProjectProvider;
var async = require('async');

// make a new instance of the Statistics provider
var statisticsProvider = new StatisticsProvider(),
	// make a new instance of the Project Provider
	projectProvider = new ProjectProvider();

exports.index = function(request, response){
	statisticsProvider.allProjectNames(function (error, docs) {
		response.render('index', { locals: {
				title : 'Marlin: Website Performance Tracker',
				projects: docs
			}
		});
	});
};

/**
* Project Worst
* This is the first page that users come to
* With JavaScript turned on this is the only page
* Shows bottom half of http rules
* @function allProjectNames - gets a list of monitored projects
* @function findStatistics - get all statistics for the chosen project
*/
exports.projectWorst = function(request, response){
	if (request.body.length === undefined){
		var search = request.param('name');
	} else {
		// a POST has been executed 
		// build search object with request.body parameters
	}
	
	async.parallel({
		projectNames : function (callback) {
			statisticsProvider.allProjectNames(function (error, projectList) {
				callback(error, projectList);
			});
		},
		statistics : function (callback) {
			statisticsProvider.findStatistics(search, function (error, reports) {	  
				callback(error, reports)
			});
		}
	}, function (error, results) {
		if (error){
			response.send(error);
		} else {
			/**
			 * Select the worst half of the http from the latest document
			 */
			var i = 0, j = 0, k = 0,
				http = results.statistics[0].http.rules,
				javascript = [],
				rules = [],
				selectedRules = [];
			
			rules = statisticsProvider.filterRules(http, request.url);
			rules = statisticsProvider.filterStatistics(rules, results.statistics);
			
			// created selected rules
			
			// checks to see which url the request came from
			if (request.url.match('/best')){
				response.render('best', {
					locals: {
						title: 'Marlin: Statistics for ' + request.param('name'),
						name: request.param('name'),
						projects: results.projectNames,
						statistics: results.statistics
					}
				});
			} else if (request.url.match('/javascript')){
				// filter out the javascript statistics
				for (j; j < results.statistics.lenght; j = j + 1){
					javascript.push(results.statistics[j].javascript);
				}
				
				console.log(javascript);
				response.render('javascript', {
					locals: {
						title: 'Marlin: Statistics for ' + request.param('name'),
						name: request.param('name'),
						projects: results.projectNames,
						statistics: results.statistics
					}
				});
				
				
				
				
			} else {
				//response.render('worst', {
				//	locals: {
				//		title: 'Marlin: Statistics for ' + request.param('name'),
				//		name: request.param('name'),
				//		projects: results.projectNames,
				//		statistics: results.statistics
				//	}
				//});
			}
			
			//response.render('project', {locals: {
			//	title : 'Marlin: Statistics for ' + results.statistics[0].name,
			//	name: results.statistics[0].name,
			//	projects: results.projectNames,
			//	statistics: results.statistics		
			//	}
			//});
		}
	});	
};

/**
 * Project Best
 * Shows the top half of http rules
 * @function allProjectNames = retrieves a list of all projects
 * @function findStatistics = find statistics based on the user's query
 */
exports.projectBest = function (request, response) {
	console.log(request);
	
}

/**
 * Project JavaScript
 * Show JavaScript performance statistics
 * @function allProjectNames = retrieves a list of projects
 */
exports.projectJavaScript = function (request, response){
	console.log(request);
}





exports.newReport = function (request, response) {
	/**
	* The parameters that are sent through:
	* project: The project name 
	* url: url of project to test
	* gitUser: git user name
	* gitPass: git password
	* repository: name of repository
	*/
	// request.query gets the values of the query string
	var parameters = request.query;
	projectProvider.gatherStatistics(parameters, function (error, docs){
		if(!error){
			response.send('The following report was successfully inserted into the database: ' + JSON.stringify(docs));
		} else {
			response.send('There as an error with inserting the report: ' + error);
		}
	});
}