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

BuildProvider.prototype.validate = function (data, callback) {
	var property = '',
		empty = [];
	// error checking
	for (property in request.body){
		if(request.body.hasOwnProperty(property)){
			if(request.body[property] === ''){
				empty.push(request.body.property);
			}
		}
	}
	if(empty.length !== 0){
		callback(empty);

	}	
	
}





// exports the Build provider so it can be accessed elsewhere
exports.BuildProvider = BuildProvider;
