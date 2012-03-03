/**
 * API for Querying the Database
 */

/**
 * Models
 */

var Report = require('../models/page_statistics');

/**
 * API Methods:
 * show: Shows statistics for particular project
 */

exports.show = function (request, response) {
	/**
	 * Defaults:
	 * 	Date - From current to one week previously
	 */
	Report.find({}, function (error, reports) {
	
	
	});
}