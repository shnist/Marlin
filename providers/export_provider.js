/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');

/**
 * 	Export Provider
 * 	Responsible for providing the export files
 */

ExportProvider = function () {};

/**
 * Default path for the exported file
 */
ExportProvider.prototype.path = '/exports/export.json';

/**
 * Write file
 * Creates the export file with the data it receives
 * params:
 * 	data - json string of reports
 */
ExportProvider.prototype.writeFile = function (data, callback) {
	console.log(data);
	var text = JSON.stringify(data),
		path = __dirname + ExportProvider.prototype.path;
	fs.writeFile(path, text, function (err) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, path);
		}
	});
}

/**
 * Create Header Parameters
 * Create parameters to set appropriate header for exporting file
 */
ExportProvider.prototype.createHeaderParameters = function (filePath, callback) {
	var parameters = {
		file : filePath,
		fileName : path.basename(filePath),
		mimetype: 'application/json'
	};
	callback(null, parameters);
}

// exports the Statistics provider so it can be accessed elsewhere
exports.ExportProvider = ExportProvider;