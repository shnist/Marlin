/**
 * Module Dependencies
 */

var mongoose = require('mongoose');

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
	var project = name;
	callback();
}


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;