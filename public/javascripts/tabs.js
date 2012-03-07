/**
 * Tabs
 * Controls the creation and event handling of
 * tabs for the different pages using JQuery UI
 */

var tabs = window.tabs || {};

tabs = {
	/**
	 * Creates the markup to inject the tabs
	 */
	init : function () {
		var tabs = '<div id="tab-two" class="tab-page"></div>'+
		'<div id="tab-three" class="tab-page"></div>';
		$('#content h2, .graph, .rule-options').wrapAll('<div id="tab-one" class="tab-page"></div>');
		$('#content').append(tabs);
		$('.tab-navigation, .tab-page').wrapAll('<div id="tabs"></div>');
		
		//$('#tabs').tabs();
		
		
		
	},
	requestPage : function () {
		
		
	}
};
