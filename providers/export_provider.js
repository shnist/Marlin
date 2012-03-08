/**
 * Module dependencies
 */

var fs = require('fs');

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
 * Read file
 * Send created csv file to the browser
 */
ExportProvider.prototype.readFile = function (callback) {
	var file = 'upload-folder/export.csv',
	filename = path.basename(file),
	mimetype = 'text/csv';
	
	
}