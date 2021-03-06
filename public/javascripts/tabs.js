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
	init : function ($context) {
		// test that tabs are needed
		if($context.length > 0){
			var tabs = '<div id="tab-two" class="tab-page"></div>'+
			'<div id="tab-three" class="tab-page"></div>';
			$('.rule-title, .graph, .rule-options, .alerts').wrapAll('<div id="tab-one" class="tab-page"></div>');
			$('#content').append(tabs);
			$('.tab-navigation, .tab-page').wrapAll('<div id="tabs"></div>');
			
			$('li:first-child a', '.tab-navigation').attr('href', '#tab-one');
			$('li', '.tab-navigation').eq(1).children('a').attr('href', '#tab-two');
			$('li:last-child a', '.tab-navigation').attr('href', '#tab-three');
			
			$('body').append('<div id="island"></div>');
			
			$('#tabs').tabs();
			
			this.navEventHandlers();
		}
	},
	/**
	 * Navigation Event Handlers
	 * Triggers AJAX request to the appropriate page
	 */
	navEventHandlers : function () {
		$('.tab-navigation a').click(function (event) {
			event.preventDefault();
			var tab = $(this).attr('href');

			if ($(tab).html().trim() === ''){
				tabs.requestPage(tab);				
			}
		});
	
	},
	/**
	 * Request Page
	 * Sends an AJAX request to retrieve HTML content for right page
	 */
	requestPage : function (tab) {
		var project = $('input[name=project]', '#tab-one .rule-options').val(),
			page =  project + '/';
		if (tab !== '#tab-one') {
			if (tab === '#tab-two'){
				page = page + 'best';
			} else {
				page = page + 'javascript';
			}
		}
		$(tab).before('<div class="tab-overlay"><img src="../images/loader.gif" alt="Loading new graph" class="loader"></div>');
		$.ajax({
			url : page,
			dataType: 'html',
			type: 'get',
			success : function (data) {
				tabs.processHtml(data, tab);
				$('.tab-overlay').remove();
			},
			error: function (object, stat, error) {
				console.log(stat + ': ' + error);
			}
		});
	},
	/**
	 * Process HTML
	 * Extracts the relevant part of the HTML from the request page
	 * and injects it onto the page
	 */
	processHtml: function (html, tab) {
		// add the response to the dom.
		var island = $(html),
			$title = '',
			$results = '',
			$alerts = '',
			$form = '';
		
		// scrape the information out
		$title = island.find('.rule-title');
		$alerts = island.find('.alerts');
		$results = island.find('.graph');
		$form = island.find('.rule-options');
		
		$(tab).append($title, $alerts, $results, $form);
		
		// apply event handlers to new elements
		common.widgets.apply($(tab));
		chart.init($(tab));
	}
};
