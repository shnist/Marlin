/**
 * 	Project Provider
 * 	Responsible for querying the database 
 */

ProjectProvider = function () {};
ProjectProvider.prototype.dummyData = [
{project: 'portfolio'},
{project: 'marlin'}
];


/**
 * Find All Projects
 * Extracts the names of all projects for the home page
 */

ProjectProvider.prototype.allProjects = function (callback) {
	callback(null, this.dummyData);
}


/**
 * Find Project
 * Extracts all data from the chosen project 
 */

ProjectProvider.prototype.findProject = function (name, callback) {
	callback();

}




// exports the project provider so it can be accessed elsewhere
exports.ProjectProvider = ProjectProvider;