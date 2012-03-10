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

/**
 * Find All Statisticss
 * Extracts the names of all Statisticss for the home page
 */

StatisticsProvider.prototype.allProjectNames = function (callback) {
	// sort orders the names so they can be reduced
	Report.find({}, ['name'], {sort: {name: 1}}, function (err, docs) {
		if (!err){
			var i = 0,
				names = [];
			// reduce the returned set so we only get one of each
			for (i; i < docs.length; i = i + 1){
				if (i === 0){
					names.push(docs[i].name);
				} else {
					if (names[names.length - 1] !== docs[i].name){
						names.push(docs[i].name);
					}
				}
			}
			callback(null, names);
		} else {
			callback(err, null);
		}
	});
}


/**
 * Find Statistics
 * Extracts all data from the chosen Statistics
 * Defaults:
 * 	ProjectName: STRING = name of project
 */

StatisticsProvider.prototype.findStatistics = function (parameters, callback) {
	//86 400 000 = a day
	var dateFrom = null,
		dateTo = null,
		projectName = '',
		query = null;
		
	if (typeof(parameters) !== 'object'){
		// build default dates here,
		// find is not filtered
		projectName = parameters;
		
		query = Report.find({name: projectName}).limit(4);
	} else {
		
		// get dates from post data
		dateFrom = new Date(parameters.dateFrom).getTime();
		dateTo = new Date(parameters.dateTo).getTime();
		projectName = parameters.name;
			
		query = Report.find({name: projectName}).where('date').lte(dateTo).where('date').gt(dateFrom)
	}
	
	query.exec(function (error, docs) {
		if(!error){
			if (docs.length !== 0){				
				callback(null, docs);	
			} else {
				callback('No results returned', null);
			}
		} else {
			callback(error, null);
		}
	});
}


/**
 * Filter Rules
 * Returns a subset of the rules to be shown on the page
 * 
 */
StatisticsProvider.prototype.filterRules = function (stats, url) {
	var rules = [], i = 0;
	
	if (url.match('/javascript') !== true){
		for (var j = 0; j < stats.length; j = j + 1){
			if (url.match('/best')){
				// numerical order descending
				stats[j].http.rules.sort(function (a,b){return b.score-a.score});
			} else {
				// numerical order ascending
				stats[j].http.rules.sort(function (a,b){return a.score-b.score});
			}
		}
		for (i; i < (stats[0].http.rules.length / 2); i = i + 1){
			rules.push(stats[0].http.rules[i].id);
		}
	}

	return rules;
}

/**
 * Returns a subset of the statistics depending on the page selected
 */
StatisticsProvider.prototype.filterStatistics = function (rules, statistics) {
	// loop through all the documents in the object
	var i = 0, j = 0, k = 0,
		results = [],
		instance = [];
	// loop through all the documents in the statistics object
	for (i; i < statistics.length; i = i + 1){
		// reset the array
		instance = [];
		// loop through each rule in the document
		for (j = 0; j < statistics[i].http.rules.length; j = j + 1){
			// loop through all the rules
			for (k = 0; k < rules.length; k = k + 1){
				// compare - if match, add object to instance				
				if (statistics[i].http.rules[j].id === rules[k]){
					instance.push(statistics[i].http.rules[j]);
				}
			}
		}
		// add instance to results
		results.push(instance);
	}
	return results;
}

/**
 * Filter Time Stamps
 * Sends back an array of time stamps
 */

StatisticsProvider.prototype.filterTimeStamps = function (reports) {
	var i = 0,
		timeStamps = [];
	for (i; i < reports.length; i = i + 1){
		timeStamps.push(reports[i].date);
	}
	return timeStamps;
}

/**
 * Find All Statistics
 * Extracts all data from the chosen Statistics
 * in preparation for export 
 */
StatisticsProvider.prototype.findAllStatistics = function (name, callback) {
	Report.find({name: name}, function(error, reports) {
		if(error){
			callback(error, null);
		} else {
			callback(null, reports);
		}
	});
}



// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;