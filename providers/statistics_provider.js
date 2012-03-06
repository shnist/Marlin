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
 * 	DateTo: DATE = today
 * 	DateFrom: DATE = yesterday
 * 	ProjectName: STRING = name of project
 */

StatisticsProvider.prototype.findStatistics = function (parameters, callback) {
	//86 400 000 = a day
	var dateFrom = null,
		dateTo = null,
		projectName = '';
		
	if (typeof(parameters) !== 'object'){
		// build default dates here,
		// find is not filtered
		dateFrom = (new Date().getTime() - 86400000);
		dateTo = new Date().getTime();
		projectName = parameters;
	} else {
		// get dates from post data
		dateFrom = new Date(parameters.dateFrom).getTime();
		dateTo = new Date(parameters.dateTo).getTime();
		projectName = parameters.name;
	}
		
	Report.find({name: projectName})
		.where('date').lte(dateTo)
		.where('date').gt(dateFrom)
	.run(function (err, docs){
		if(!err){
			if (docs.length !== 0){				
				callback(null, docs);	
			} else {
				callback('No results returned', null);
			}
		} else {
			callback(err, null);
		}
	});
}

/**
 * Filter Rules
 * Returns a subset of the rules to be shown on the page
 */
StatisticsProvider.prototype.filterRules = function (stats, url) {
	var rules = [], i = 0;
	if (url.match('/best')){
		
	} else if (url.match('/javascript')){
		
	} else {
		for (var j = 0; j < stats.length; j = j + 1){
			stats[j].http.rules.sort(function (a,b){return a.score-b.score})
		}
		// sort the array in numerical order asc
		//http.sort(function (a,b){return a.score-b.score});
	}
	for (i; i < (stats[0].http.rules.length / 2); i = i + 1){
		rules.push(stats[0].http.rules[i].id);
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


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;