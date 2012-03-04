/*
 * GET home page.
 */

/**
 * Module dependencies.
 */
var StatisticsProvider = require('../providers/statistics_provider').StatisticsProvider,
	ProjectProvider = require('../providers/project_provider').ProjectProvider;

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
  var parameters = request.query;
  projectProvider.gatherStatistics(parameters, function (error, docs){
	if(!error){
	  response.send('The following report was successfully inserted into the database: ' + JSON.stringify(docs));
	} else {
	  response.send('There as an error with inserting the report: ' + error);
	}
  });
}