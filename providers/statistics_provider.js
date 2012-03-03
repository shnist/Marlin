/**
 * Module Dependencies
 */

var mongoose = require('mongoose');
var Report = require('../models/page_statistics');
var request = require('request');

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
	// parameters for querying the apis
	var revisionParams = {'user': parameters['gitUser'], 'password': parameters['gitPass'], 'repository': parameters['repository']},
		pageSpeedParams = {'url': parameters['url']},
		phantomParams = {'url': parameters['url']};
	
	// objects for the report
	var commitInformation = {},
		httpInformation = {},
		javaScriptInfo = {},
		report = {};
		
	//async.parallel({
	//	git : this.git(revisionParams, callback),
	//	pageSpeed : this.pageSpeed(pageSpeedParams, callback),
	//	phantom : this.phantom(phantomParams, callback)
	//}, function (error, results) {
	//	console.log(results);
	//});
	
	this.git(revisionParams, function(error, revisionReport){
		// build repository information for the report
		//console.log(revisionReport);
	});
	
	this.pageSpeed(pageSpeedParams, function(error, httpReport){
		console.log(httpReport);
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
		repository = params.repository,
		// authentication url
		url = 'https://' + user + ':' + password + '@api.github.com';
	
	// first request is to extract the sha (unique id of the last commit)
	request({
		method : 'GET',
		uri: url + '/repos/' + user + '/' + repository + '/commits'
	}, function (error, res, body) {
		if (res.statusCode === 200){
			var report = JSON.parse(body),
				sha = report[0].sha;
			getCommitData(sha);
		}
	});

	// using the sha - data about the last commit can be obtained
	function getCommitData (sha) {
		request({
			method : 'GET',
			uri: url + '/repos/' + user + '/' + repository + '/commits/' + sha
		}, function (error, res, body) {
			if (res.statusCode === 200){
				var commitContent = JSON.parse(body);
				callback(null, commitContent.commit);
			} else {
				callback(error, null);
			}
		});
	}
}

/**
 * Page Speed API
 */
StatisticsProvider.prototype.pageSpeed = function (params, callback) {
	// key for google page speed api
	var key = 'AIzaSyCCBFg_7cCnZ4JfAXzemEkmbi18y7S8wMc',
		url = params.url;
	
	request({
		method : 'GET',
		uri : 'https://www.googleapis.com/pagespeedonline/v1/runPagespeed?url=' + url + '&key=' + key
	}, function (error, res, body){
		if (res.statusCode === 200){
			var report = JSON.parse(body);
			callback(null, report);
		} else {
			callback(error, null);
		}
	});
}

/**
 * Phantomjs API
 */
StatisticsProvider.prototype.phantom = function (params, callback) {
	callback(null, 'phantom');
}

/**
 * Insert New Report
 * Inserts a new report of statistics
 */

StatisticsProvider.prototype.insertReport = function (callback) {
	
}


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;