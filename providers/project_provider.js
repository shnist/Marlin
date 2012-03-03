/**
 * Module Dependencies
 */

var mongoose = require('mongoose');
var Report = require('../models/page_statistics');
var request = require('request');
var phantom = require('phantom');
var async = require('async');

// database connection parameters
var host = 'localhost',
	port = 27017;
	
// creating a connection
mongoose.connect(host,'reports',port);

/**
 * 	Project Provider
 * 	Responsible for generating and storing new reports
 */

ProjectProvider = function () {};

/**
 * Gather Statistics
 * Gathers all statistics for instance of report
 */

ProjectProvider.prototype.gatherStatistics = function (parameters, callback) {
	// parameters for querying the apis
	var revisionParams = {'user': parameters['gitUser'], 'password': parameters['gitPass'], 'repository': parameters['repository']},
		pageSpeedParams = {'url': parameters['url']},
		phantomParams = {'url': parameters['url']};
	
	// objects for the report
	var commitInformation = {},
		httpInformation = {},
		javaScriptInfo = {},
		report = {};
		
	async.parallel({
		revision : function (callback) {
			ProjectProvider.prototype.git(revisionParams, function(error, revisionReport) {
				callback(error, revisionReport);
			});
		},
		http : function (callback) {
			ProjectProvider.prototype.pageSpeed(pageSpeedParams, function(error, httpReport){
				callback(error, httpReport);
			});

		},
		javascript : function (callback) {
			ProjectProvider.prototype.phantom(phantomParams, function (error, phantomReport) {
				callback(error, phantomReport);
			});
		}
	}, function (error, results) {
		if (error !== undefined){
			console.log(results);
		} else {
			console.log(error);
		}
	});	
}

/**
 * Each API query to gather data is split into modules
 * allowing us to swap in and out different apis
 */

/**
 * Github API
 */
ProjectProvider.prototype.git = function (params, callback) {
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
ProjectProvider.prototype.pageSpeed = function (params, callback) {
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
ProjectProvider.prototype.phantom = function (params, callback) {
	var timeBeforePageRequest = Date.now(),
		url = params.url;
	
	phantom.create(function(ph) {
		return ph.createPage(function(page) {
			return page.open(url, function(status) {
				if (status === 'success'){
					// page loading time
					pageLoadingTime = Date.now() - timeBeforePageRequest;
					
					callback(null, pageLoadingTime);
					
					// values for page evaluate are returned in a callback
					//return page.evaluate((function() {
					//	return document.title;
					//}), function(result) {
					//	console.log('Page title is ' + result);
					//	return ph.exit();
					//});
					
					return ph.exit();
				} else {
					callback('failed to load: ' + url, null);
					return ph.exit();
				}
			});
		});
	});
}

/**
 * Generate New Report Object
 * Takes the JSON of API returns and remakes it into a report
 * for the database
 */

ProjectProvider.prototype.generateReportObject = function (callback) {
	
}

/**
 * Insert New Report
 * Inserts a new report of statistics
 */

ProjectProvider.prototype.insertReport = function (callback) {
	
}

// exports the Project provider so it can be accessed elsewhere
exports.ProjectProvider = ProjectProvider;