/**
 * Module Dependencies
 */

var mongoose = require('mongoose');
var Report = require('../models/page_statistics');	

// database connection parameters
var host = 'localhost',
	port = 27017;
	
// creating a connection
mongoose.connect(host,'reports',port);

/**
 * 	Statistics Provider
 * 	Responsible for querying the database 
 */

StatisticsProvider = function () {};
StatisticsProvider.prototype.dummyData = [
{project: 'portfolio'},
{project: 'marlin'}
];


/**
 * Find All Statisticss
 * Extracts the names of all Statisticss for the home page
 */

StatisticsProvider.prototype.allProjectNames = function (callback) {
	callback(null, this.dummyData);
}


/**
 * Find Statistics
 * Extracts all data from the chosen Statistics 
 */

StatisticsProvider.prototype.findStatistics = function (name, callback) {
	/**
	 * Defaults:
	 * 	Date - From current to one week previously
	 */
	var project = name,
		dateFrom = '',
		dateTo = ''
	
	Report.find({}, function (error, reports) {
		callback(null, reports);
		
	});
}


/**
 * Gather Statistics
 * Gathers all statistics for instance of report
 */

StatisticsProvider.prototype.gatherStatistics = function (parameters, callback) {
	var revisionParams = {'user': parameters['gitUser'], 'password': parameters['gitPass'], 'repository': parameters['repository']},
		pageSpeedParams = {'url': parameters['url']},
		phantomParams = {'url': parameters['url']};
			
	this.git(revisionParams, function(error, revisionReport){
		//console.log(revisionReport);
	});
	
	this.pageSpeed(pageSpeedParams, function(error, httpReport){
		//console.log(httpReport);
	});

	this.phantom(phantomParams, function(error, phantomReport){
		//console.log(phantomReport);
	});		
}

/**
 * Each API query to gather data is split into modules
 * allowing us to swap in and out different apis
 */

/**
 * Github API
 */
StatisticsProvider.prototype.git = function (params, callback) {
	var user = params.user,
		password = params.password,
		repository = params.repository;
	
	
}

/**
 * Page Speed API
 */
StatisticsProvider.prototype.pageSpeed = function (params, callback) {
	var key = '';
	callback(null, 'pagespeed');
}

/**
 * Phantomjs API
 */
StatisticsProvider.prototype.phantom = function (params, callback) {
	callback(null, 'phantom');
}


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;