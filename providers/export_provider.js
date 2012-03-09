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
ExportProvider.prototype.path = '/exports/export.txt';

/**
 * Write file
 * Creates the export file with the data it receives
 * params:
 * 	data - json string of reports
 */

ExportProvider.prototype.writeFile = function (data, callback) {
	var path = __dirname + ExportProvider.prototype.path;
	
	ExportProvider.prototype.createCsv(data, function(error, text){
		if(error){
			console.log(error);
		} else {
			fs.writeFile(path, text, function (err) {
				if (err) {
					callback(err, null);
				} else {
					callback(null, path);
				}
			});
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
		mimetype: 'text/csv'
	};
	callback(null, parameters);
}

/**
 * Create CSV
 * Creates the CSV file using ya-csv module
 */
ExportProvider.prototype.createCsv = function (data, callback) {
	var i = 0, report, columns = [];
	// strip out mongo generated value:key pairs
	for (report in data[0]){
		// remove mongo appended values
		switch(report){
			case '_events':	case '_strictMode': case '_selected':
			case '_doc': case '_activePaths': case '_saveError':
			case '_validationError': case 'isNew': case '_pres':
			case '_posts': case 'save': case 'errors':
			case '_shardval': case 'base': case 'id':
			case '_id': case '_schema':	case 'db':
			case 'collection': case '_getPopulationKeys': case '_populate':
			case 'init': case '_delta':	case '_where':
			case 'remove': case '_registerHooks': case 'model':
			case 'options': case 'buildDoc': case '_storeShard':
			case 'hook': case 'pre': case 'post':
			case 'on': case 'once': case 'emit':
			case 'equals': case '_reset': case '_dirty':
			case 'validate': case 'schema': case 'error':
			case 'listeners': case 'removeAllListeners': case 'removeListener':
			case 'addListener': case 'setMaxListener': case 'toString':
			case 'toObject': case 'inspect': case 'try':
			case 'commit': case '_path': case 'setMaxListeners':
			case 'toJSON': case 'doQueue': case 'modified':
			case 'invalidate': case 'isSelected': case 'isInit':
			case 'get': case 'set': case 'doCast': case 'getValue':
			case 'setValue': case 'markModified': case 'modifiedPaths':
			case 'removePre': case '_lazySetupHooks': case 'isModified':
			case 'isDirectModified':
				delete report;
				break;
			default :
				columns.push(report);
		}
		// dig deeper if report contains an object
		console.log(data[0][report]);
		if(data[0][report]){
			
		}
		
		
	}
	// add the rows of data
	while (i < data.length){
		i = i + 1;
	}
	console.log(columns);
}

// exports the Statistics provider so it can be accessed elsewhere
exports.ExportProvider = ExportProvider;