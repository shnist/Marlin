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





// exports the Build provider so it can be accessed elsewhere
exports.BuildProvider = BuildProvider;
