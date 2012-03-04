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
 */

StatisticsProvider.prototype.findStatistics = function (search, callback) {
	/**
	 * Defaults:
	 * 	Date - From current time to the day before
	 * 	86 400 000 = a day
	 */
	if (search.dateFrom === undefined){
		search.dateFrom = (new Date().getTime() - 86400000);
	}
	if (search.dateTo === undefined){
		search.dateTo = new Date().getTime()
	}
	/**
	 * Data Selection
	 * Chosing which items in the document to return
	 */
	// TO DO 
	
	
	Report.find({name: search.project}, [])
		.where('date').lte(search.dateTo)
		.where('date').gt(search.dateFrom)
	.run(function (err, docs){
		if(!err){
			/**
			 * Filters the results of the rules
			 * For the most recent document:
			 * Selects all rules that are lower than 40 - worst performing
			 * Selects all rules that are higher than 80 - best performing
			 */
			var i = 0, j = 0, worstPerforming = [], bestPerforming = [];
			for (j; j < docs[0].http.rules.length; j = j + 1){
				var score = docs[i].http.rules[j].score;
				if (score < 40){
					worstPerforming.push(docs[i].http.rules[j]);
				} else if (score > 80){
					bestPerforming.push(docs[i].http.rules[j]);
				}
			}		
			
			docs.worstPerforming = worstPerforming;
			docs.bestPerforming = bestPerforming;
			
			callback(null, docs);
		} else {
			callback(err, null);
		}
	});
}


// exports the Statistics provider so it can be accessed elsewhere
exports.StatisticsProvider = StatisticsProvider;