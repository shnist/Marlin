/**
 * Page Statistics Schema
 * Holds all the information
 */

/**
 * Module Dependencies
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;

var pageStatistics = new Schema({
	http: {
		score: Number,
		general: {
			numberResources: Number,
			htmlResponseBytes: String,
			cssResponseBytes: String,
			imageResponseBytes: String,
			javascriptResponseBytes: String,
			noJsResources: Number,
			noCssResources: Number
		},
		rules: {
			AvoidBadRequests: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			AvoidCssImport: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			AvoidExcessSerialization: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			AvoidLongRunningScripts: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			DeferParsingJavaScript: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			EliminateUnnecessaryReflows: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			EnableGzipCompression: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			InlineSmallCss: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			InlineSmallJavaScript: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			LeverageBrowserCaching: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			MakeLandingPageRedirectsCacheable: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			MinifyCss: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			MinifyHTML: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			MinifyJavaScript: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			MinimizeRedirects: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			MinimizeRequestSize: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			OptimizeImages: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			OptimizeTheOrderOfStylesAndScripts: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			PreferAsyncResources: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			PutCssInTheDocumentHead: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			RemoveQueryStringsFromStaticResources: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			ServeResourcesFromAConsistentUrl: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			ServeScaledImages: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			SpecifyACacheValidator: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			SpecifyAVaryAcceptEncodingHeader: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			SpecifyCharsetEarly: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			SpecifyImageDimensions: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			},
			SpriteImages: {
				localizedRuleName: String, ruleScore : Number, ruleImpact: String
			}
		}	
	},
	revision : {
		commitMessage: String,
		committer: String,
		noOfCommits: Number,
		timeOfLastCommit: Date
	},
	javascript : {
		pageLoadingTime: Number
	},
	name: String,
	date: Date
});

// exports the model so it can be accessed by other parts of the application
module.exports = mongoose.model('Report', pageStatistics);

