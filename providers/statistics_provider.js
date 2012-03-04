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
	Report.find({}, ['name'], {'group': 'name'}, function (err, docs) {
		if (!err){
			console.log(docs);
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


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;