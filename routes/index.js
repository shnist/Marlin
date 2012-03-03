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
	statisticsProvider.allStatistics(function (error, docs) {
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
	  response.render('project', {locals: {
		title : 'Marlin: Statistics for ' + project,
		statistics: docs

	  }});
	});
};