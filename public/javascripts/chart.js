var chart = window.chart || {};

chart = {
	init : function (){
		// remove the tables
		//$('table', '.chart').addClass('hidden');
		
		this.submit();
		
	},
	/**
	 * Submit
	 * Method that captures form submissions and triggers AJAX request
	 */
	submit : function () {
		$('.rule-options').submit(function (event) {
			event.preventDefault();
	
			var project = $('input[name=project]', this).val(),
				searchOptions = $(this).serialize();		
			
			// send off ajax request
			chart.retrieveData(project, searchOptions);
		});
	},
	/**
	 * Retrieve Data
	 * Sends AJAX request to retrieve data from server
	 */
	retrieveData: function (project, searchOptions) {
		$.ajax({
			url : project + '/ajax',
			data : searchOptions,
			dataType: 'json',
			type: 'post',
			success : function (data) {
				console.log(data);
				//chart.drawChart(data, project);
			},
			error: function (object, stat, error) {
				console.log(stat + ': ' + error);
			}
		});
	},
	drawChart : function (json, project){
		/**
		 * Dimensions default:
		 * [600, 300]
		 * HTTP Worst Performance
		 * HTTP Best Performance
		 * JavaScript Performance
		 */
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