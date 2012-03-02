/*
 * GET home page.
 */

exports.index = function(req, res){
	statisticsProvider.allStatisticss(function (error, docs) {
		response.render('index', { locals: {
			projects: docs
			}
		});
	});
};