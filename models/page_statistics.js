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
		rules: [
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			},
			{
				name: String, score : Number, impact: String, id: String
			}
		]
	},
	revision : {
		commitMessage: String,
		committer: String,
		timeOfCommit: Date
	},
	javascript : [
		{
			name: String, value: Number	
		}	
	],
	name: String,
	date: Date
});

// exports the model so it can be accessed by other parts of the application
module.exports = mongoose.model('Report', pageStatistics);

