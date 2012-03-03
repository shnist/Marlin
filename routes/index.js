/*
 * GET home page.
 */

/**
 * Module dependencies.
 */
var StatisticsProvider = require('../providers/statistics_provider').StatisticsProvider;

// make a new instance of the Statistics provider
var statisticsProvider = new StatisticsProvider();

exports.index = function(request, response){
	statisticsProvider.allProjectNames(function (error, docs) {
		response.render('index', { locals: {
			title : 'Marlin: Website Performance Tracker',
			projects: docs
			}
		});
	});
};

exports.project = function(request, response){
	var project = request.param('name');

	statisticsProvider.findStatistics(project, function (error, docs) {
	  console.log(docs);
	  response.render('project', {locals: {
		title : 'Marlin: Statistics for ' + project,
		statistics: docs

	  }});
	});
};

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
  console.log(request.query);
  var parameters = request.query;
  statisticsProvider.gatherStatistics(parameters, function (error, docs){
	console.log(docs);  
  });
}