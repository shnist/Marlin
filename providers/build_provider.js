/**
 * Module Dependencies
 */

var async = require('async');


/**
 * Build Provider
 * Responsible for generating build management files
 */

var BuildProvider = function () {};

BuildProvider.prototype.processForm = function(data, callback){
	
	callback(null, 'test');
	
}


BuildProvider.prototype.buildFileElements = function(request, data, callback){
	
	
	callback(null, 'test');
	
}

/**
 * Validate
 * Method that co-ordinates the error checking of the form
 */
BuildProvider.prototype.validate = function (params, callback) {	
	async.parallel({
		emptyValues : function (callback) {
			BuildProvider.prototype.emptyValues(params, function (error) {
				callback(error);
			});
		},
		urlForm : function (callback) {
			BuildProvider.prototype.urlForm(params, function (error) {
				callback(error);
			});
		}
	}, function (error) {
		console.log('error: ' + error);
		
		if (error) {
			callback(error);
		} else {
			callback(null);
		}
	});		
}


/**
 * Empty Values
 * Checks that information was inserted into all parts of the form
 */
BuildProvider.prototype.emptyValues = function (params, callback) {
	var property = '',
		key = '',
		empty = [],
		prop;
	
	for (property in params){
		if(params.hasOwnProperty(property)){
			if(params[property] === ''){
				prop = {};
				prop[property] = params[property];
				empty.push(prop);
			}
		}
	}	
	if(empty.length !== 0){
		BuildProvider.prototype.createErrorMessage(empty, function(message){
			callback(message);
		});
	} else {
		callback(null);
	}
}

/**
 * URL Form
 * Checks that the urls are well formed
 */

BuildProvider.prototype.urlForm = function (data, callback) {
	var urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
	
	callback(null);
	
	
}


/**
 * Create error message
 * Creates an appropriate error message depending on the types of errors
 */
BuildProvider.prototype.createErrorMessage = function (error, callback) {
	var messages = [],
		i = 0,
		property;
	
	if(typeof(error) === 'object'){
		for(i; i < error.length; i = i + 1){
			for (property in error[i]){
				switch (property){
					case 'project':
						messages.push('Please fill in a value for the name of your project.');
						break;
					case 'user-name':
						messages.push('Please fill in your user name for the revision software you\'re using.');
						break;
					case 'user-password':
						messages.push('Please fill in your password.');
						break;
					case 'repository':
						messages.push('Please fill in the name of the repository you want to keep a track of.');
						break;
					case 'site':
						messages.push('Please fill in the URL of the site you want to track.');
						break;
					case 'marlin':
						messages.push('Please fill in the URL address of the Marlin server.');
						break;
					default:
						messages.push('Some of your inputs are empty. Please could you fill them in!');
						break;
				}
			}
		}
	}
	
	if(messages.length > 0){
		callback(messages);
	} else {
		callback(null);
	}
	
}

// exports the Build provider so it can be accessed elsewhere
exports.BuildProvider = BuildProvider;
