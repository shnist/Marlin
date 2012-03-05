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
		console.log('post request');
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


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;