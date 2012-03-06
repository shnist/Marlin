var chart = window.chart || {};

chart = {
	init : function (options){
		// remove the tables
		//$('table', '.chart').addClass('hidden');
		
		//console.log(options);
		this.submit(options);
		
		//chart.drawChart(jsonData, options.name, 'http-chart', options.dimensions);
		//chart.drawChart(jsData, 'JavaScript Performance', 'javascript-chart', dimensions);
		//chart.drawChart(bestData, 'HTTP Best Performance', 'best-http-chart', dimensions);
	},
	/**
	 * Submit
	 * Method that captures form submissions and triggers AJAX request
	 */
	submit : function (option) {
		$('.rule-options').submit(function (event) {
			event.preventDefault();
			var searchOptions = $(this).serialize();
			console.log(searchOptions);
			
			
			// send off ajax request
			chart.retrieveData(searchOptions);
		});
	},
	/**
	 * Retrieve Data
	 * Sends AJAX request to retrieve data from server
	 */
	retrieveData: function (searchOptions) {
		$.ajax({
			url : '',
			data: searchOptions,
			dataType: 'json',
			type: 'post',
			success : function (data) {
				$('.overlay').remove();
				$('#content.results').removeClass('ajax');
				// results stored here
				Boonbox.results = data;
				Boonbox.filters.dom.resetResults();
				Boonbox.filters.dom.addResults(data, 1);
			},
			error: function (object, stat, error) {
				//console.log(stat + ': ' + error);
			}
		});
	},
	drawChart : function (json, title, chartElement, dimensions){
		// new data table
		var data = new google.visualization.DataTable(),
			i = 0, j, k = 0, key, keys = [];
		
		// sets the number of columns and rows
		for (key in json[0]){
			keys.push(key);
			switch (key){
				case 'stylesheetsAtTop':
					key = 'Put CSS in Document Head';
					break;
				case 'avoidCSSImport':
					key = 'Avoid CSS Import';
					break;
				case 'loadTime':
					key = 'Page Load Time';
					break;
				case 'avoidLongRunningScripts':
					key = 'Avoid Long Running Scripts';
					break;
				case 'deferParsingJs':
					key = 'Defer Parsing JavaScript';
					break;				
				default:
					key = key;
			}
			if (key === 'timeStamp'){
				data.addColumn('string', key);
			} else {
				data.addColumn('number', key);
			}
		}
		
		// the number of rows is calculated by the length of the JSON array
		data.addRows(json.length);
		
		for (i; i < json.length; i = i + 1){
			data.setValue(i, 0, json[i].timeStamp);
			for (j = 1; j < data.B.length; j = j + 1){
				data.setValue(i, j, json[i][keys[j]]);
			}
		}
		
		var chart = new google.visualization.LineChart(document.getElementById(chartElement));
		chart.draw(data, {chartArea: {top: 50, left: 30}, legend: {position: 'top'},width: dimensions[0], height: dimensions[1], title:title, vAxis:{maxValue: 100, minValue: 0}});

		
	
	}
};