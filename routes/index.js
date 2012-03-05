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
* @function findAllStatistics - get all statistics for the chosen project
*/
exports.projectWorst = function(request, response){
	var project = request.param('name');
	
	async.parallel({
		projectNames : function (callback) {
			statisticsProvider.allProjectNames(function (error, projectList) {
				callback(error, projectList);
			});
		},
		statistics : function (callback) {
			statisticsProvider.findAllStatistics(project, function (error, reports) {	  
				callback(error, reports)
			});
		}
	}, function (error, results) {
		if (error){
			response.send(error);
		} else {	
			response.render('project', {locals: {
				title : 'Marlin: Statistics for ' + results.statistics[0].name,
				name: results.statistics[0].name,
				projects: results.projectNames,
				statistics: results.statistics		
				}
			});
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