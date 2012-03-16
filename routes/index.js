/*
* GET home page.
*/

/**
* Module dependencies.
*/
var StatisticsProvider = require('../providers/statistics_provider').StatisticsProvider,
	ProjectProvider = require('../providers/project_provider').ProjectProvider;
	ExportProvider = require('../providers/export_provider').ExportProvider;
	BuildProvider = require('../providers/build_provider').BuildProvider;
var async = require('async');
var fs = require('fs');

// make a new instance of the Statistics provider
var statisticsProvider = new StatisticsProvider(),
	// make a new instance of the Project Provider
	projectProvider = new ProjectProvider(),
	// make a new instance of export provider
	exportProvider = new ExportProvider(),
	// make a new instance of build provider
	buildProvider = new BuildProvider();

exports.index = function(request, response){
	statisticsProvider.allProjectNames(function (error, docs) {
		response.render('index', { locals: {
				title : 'Marlin: Website Performance Tracker',
				projects: docs
			}
		});
	});
};

/**
* Project
* @function allProjectNames - gets a list of monitored projects
* @function findStatistics - get all statistics for the chosen project
*/
exports.project = function(request, response){
	var selectedRules = null,
		search = null;
	
	// if this is a post then create an array of user chosen stats to show
	if (request.body.submit !== undefined){
		search = {
			name : request.param('name'),
			dateTo : request.param('date-to'),
			dateFrom : request.param('date-from')
		};
	} else {
		search = request.param('name');	
	}
	
	
	async.parallel({
		projectNames : function (callback) {
			statisticsProvider.allProjectNames(function (error, projectList) {
				callback(error, projectList);
			});
		},
		statistics : function (callback) {
			statisticsProvider.findStatistics(search, function (error, reports) {
				callback(error, reports)
			});
		},
		countReports : function (callback){
			statisticsProvider.countReports(search, function(error, noOfReports){
				callback(error, noOfReports);
			});
		}
	}, function (error, results) {
		if (error){
			response.send(error);
		} else {
			/**
			 * Select the worst half of the http from the latest document
			 */
			var i = 0, j = 0, k = 0,
				http = results.statistics,
				rules = [],
				view = '';

			
			if (request.body.rules !== undefined){
				// create an array of selected statistics for chosen rules
				selectedRules = statisticsProvider.filterStatistics(request.body.rules, results.statistics);
			}
			
			
			if (request.url.match('/javascript')){
				view = 'javascript';
				// filter out the javascript statistics
				for (j; j < results.statistics.length; j = j + 1){
					rules.push(results.statistics[j].javascript);
				}				
			} else {
				if (request.url.match('/best')){
					view = 'best';
				} else{
					view = 'worst';
				}
				rules = statisticsProvider.filterRules(http, request.url);
				rules = statisticsProvider.filterStatistics(rules, results.statistics);
			}

			
			// render out the page
			response.render(view, {
				locals: {
					title: 'Marlin: Statistics for ' + request.param('name'),
					name: request.param('name'),
					projects: results.projectNames,
					statistics: rules,
					reports: results.statistics,
					selected: selectedRules,
					reportNo: results.countReports
				}
			});
		}
	});	
};

/**
 * Project Ajax
 * Shows the top half of http rules
 * @function allProjectNames = retrieves a list of all projects
 * @function findStatistics = find statistics based on the user's query
 */
exports.ajax = function (request, response) {
	var search =  {
			name : request.param('project'),
			dateTo : request.param('date-to'),
			dateFrom : request.param('date-from'),
			type: request.param('chart-type')
	},
	filtered = null;

	statisticsProvider.findStatistics(search, function (error, reports) {	  
		if(!error){			
			timeStamps = statisticsProvider.filterTimeStamps(reports);
			filtered = statisticsProvider.filterStatistics(request.param('rules'), reports, search.type);
			
			response.json({timeStamps: timeStamps, results: filtered});
		} else {
			response.json({error : error});
		}
	});
}

/**
 * New Report
 * Generates a new report
 * @function gatherStatistics = creates and stores new report
 */
exports.newReport = function (request, response) {
	/**
	* The parameters that are sent through:
	* project: The project name 
	* url: url of project to test
	* gitUser: git user name
	* gitPass: git password
	* repository: name of repository
	*/
	// request.query gets the values of the query string
	var parameters = request.query;
	projectProvider.gatherStatistics(parameters, function (error, docs){
		response.setHeader('Content-type', 'text/html');
		if(!error){
			response.send('The following report was successfully inserted into the database: ' + JSON.stringify(docs));
		} else {
			response.send('There as an error with inserting the report: ' + error);
		}
	});
}

/**
 * Exporting
 * Exports all the contents of the project into
 * a csv file
 */
exports.exporting = function (request, response) {
	statisticsProvider.findAllStatistics(request.params.name, function(error, data){
		if(error){
			console.log(error);
		} else {
			exportProvider.writeFile(data, function(error, path){
				if(error){
					console.log(error);
				} else {
					exportProvider.createHeaderParameters(path, function(error, params){
						if(error){
							console.log(error);
						} else {
							response.setHeader('Content-disposition', 'attachment; filename=' + params.filename);
							response.setHeader('Content-type', params.mimetype);
							response.download(params.file, function (error) {
								if (error){
									console.log(error);
								}
							}, function(error){
								if(error){
									console.log(error);
								}
							});
						}
					});
				}
			});
		}
	});
}


/**
 * Build
 * Generates a form that the user can input details and create
 * a build management file
 */
exports.build = function (request, response){
	response.render('build', { locals: {
			title : 'Marlin: Create a Build Management File'
		}
	});
}

/**
 * Create Build
 * Generates the build management file
 */
exports.createBuild = function(request, response){
	
	buildProvider.validate(request.body, function(error){
		if(error){
			response.render('build',{ locals: {
				title : 'Marlin: Create a Build Management File',
				messages : error
			}});
		} else {
			buildProvider.processForm(request, function(error, data){
				if (error){
					response.send(error);
				} else {
					buildProvider.buildFileElements(request, data, function(error, params){
						if(error){
							response.send(error);
						} else {
							console.log('end journey');
							
							//response.setHeader('Content-disposition', 'attachment; filename=' + params.fileName);
							//response.setHeader('Content-type', 'application/xml');
							//response.download(params.file, function (error) {
							//	if (error){
							//		console.log(error);
							//	}
							//}, function(error){
							//	if(error){
							//		console.log(error);
							//	}
							//});
						}
					});	
				}
			});
		}
	});
}