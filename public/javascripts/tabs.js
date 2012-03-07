/**
 * Tabs
 * Controls the creation and event handling of
 * tabs for the different pages using JQuery UI
 */

var tabs = window.tabs || {};

tabs = {
	/**
	 * Creates the markup to inject the tabs
	 * Changes href of tab navigation
	 */
	init : function () {
		var tabs = '<div id="tab-two" class="tab-page"></div>'+
		'<div id="tab-three" class="tab-page"></div>';
		$('.rule-title, .graph, .rule-options').wrapAll('<div id="tab-one" class="tab-page"></div>');
		$('#content').append(tabs);
		$('.tab-navigation, .tab-page').wrapAll('<div id="tabs"></div>');
		
		$('li:first-child a', '.tab-navigation').attr('href', '#tab-one');
		$('li', '.tab-navigation').eq(1).children('a').attr('href', '#tab-two');
		$('li:last-child a', '.tab-navigation').attr('href', '#tab-three');
		
		$('#tabs').tabs();
	},
	requestPage : function () {
		
		
	}
};
