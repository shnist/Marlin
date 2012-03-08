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
 * Write file
 * Creates the export file with the data it receives
 * params:
 * 	data - json string of reports
 */
ExportProvider.prototype.writeFile = function (data, callback) {
	var text = JSON.stringify(data),
		path = __dirname + 'upload_folder/export.csv';
	fs.writeFile(path, text, function (err) {
		if (err) {
			callback(err, null);
		} else {
			callback(null, 'success');
		}
	});
}

/**
 * Create Header Parameters
 * Create parameters to set appropriate header for exporting file
 */
ExportProvider.prototype.createHeaderParameters = function (callback) {
	var parameters = {
		file : 'upload-folder/export.csv',
		mimetype: 'text/csv'
	};
	callback(null, parameters);
}

/**
 * Read file
 * Read the file to the browser
 */
ExportProvider.prototype.readFile = function (file, callback){
	var fileName = path.basename(file);
	
	
}