/**
 * Module Dependencies
 */

var async = require('async');
var builder = require('xmlbuilder');


/**
 * Build Provider
 * Responsible for generating build management files
 */

var BuildProvider = function () {};


/**
 * Process Form
 *
 */

BuildProvider.prototype.processForm = function(data, callback){
	console.log(data);
	callback(null, 'test');
	
}

/**
 * Build Properties a
 * Builds the xml properties of the file depending on the build manager
 * selected
 */
BuildProvider.prototype.buildProperties = function(data, callback){
	var doc = builder.create();
	console.log(data);
	var property;
	if (data.manager === 'ant'){
		for (property in data){
			if(data.hasOwnProperty(property)){
				
				
			}
		}
	}


	
	callback(null, doc);
	
}

/**
 * Validate
 * Method that co-ordinates the error checking of the form
 */
BuildProvider.prototype.validate = function (params, callback) {
	var defaultMessage = 'Sorry, we tried to check this forms for errors, but something went wrong. Please try again';
	
	async.parallel({
		emptyValues : function (callback) {
			BuildProvider.prototype.emptyValues(params, function (error, messages) {
				callback(error, messages);
			});
		},
		urlForm : function (callback) {
			BuildProvider.prototype.urlForm(params, function (error, messages) {
				callback(error, messages);
			});
		},
		manager : function(callback){
			BuildProvider.prototype.manager(params.manager, function(error, messages){
				callback(error, messages);
			});
		}
	}, function (error, messages) {
		if (error) {
			callback(error, null);
		} else {
			if(messages !== null){
				callback(null, messages);	
			} else {
				callback(defaultMessage, null)
			}
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
			callback(null, message);
		});
	} else {
		callback(null, null);
	}
}

/**
 * URL Form
 * Checks that the urls are well formed
 */

BuildProvider.prototype.urlForm = function (params, callback) {
	var urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
		urls = [],
		i = 0,
		prop;
	
	if (params.site === '' && params.marlin === ''){
		callback(null);
	} else {
		if (params.site !== ''){
			if (urlRegex.test(params.site) !== true){
				prop = {};
				prop['site-empty'] = '';
				urls.push(prop);
			}		
		}
		if (params.marlin !== ''){
			if (urlRegex.test(params.marlin) !== true){
				prop = {};
				prop['marlin-empty'] = '';
				urls.push(prop);
			}		
		}
		BuildProvider.prototype.createErrorMessage(urls, function(message){
			callback(null, message);
		});
	}
}

/**
 * Manager
 * Checks that build management selection option is not on select
 */
BuildProvider.prototype.manager = function (manager, callback){
	var buildManagers = [],	
		prop;

	if(manager === 'select'){
		prop={};
		prop['manager-select'] = '';
		buildManagers.push(prop);
		
		BuildProvider.prototype.createErrorMessage(buildManagers, function(message){
			callback(null, message);
		});
	} else {
		callback(null, null);
	}
	
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
					case 'site-empty':
						messages.push('Please fill in a valid URL for the site you want to test.');
						break;
					case 'marlin-empty':
						messages.push('Please fill in a valid URL for your Marlin server.');
						break;
					case 'manager-select':
						messages.push('Please select the Build Management Software you want to build the file for.');
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
