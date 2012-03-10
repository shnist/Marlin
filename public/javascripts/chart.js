var chart = window.chart || {};

chart = {
	init : function (){
		this.submit();
		// auto submission on page load to create graph
		$('.rule-options').submit();
		
	},
	/**
	 * Submit
	 * Method that captures form submissions and triggers AJAX request
	 */
	submit : function () {
		$('.rule-options').submit(function (event) {
			event.preventDefault();
	
			var project = $('input[name=project]', this).val(),
				chartType = $('input[name=chart-type]', this).val(),
				searchOptions = $(this).serialize(),
				$form = $(this);
							
			// send off ajax request
			chart.retrieveData(project, chartType, searchOptions, $form);
		});
	},
	/**
	 * Retrieve Data
	 * Sends AJAX request to retrieve data from server
	 */
	retrieveData: function (project, chartType, searchOptions, $context) {
		// add the overlay
		$context.siblings('.graph').before('<div class="overlay"><img src="../images/loader.gif" alt="Loading new graph" class="loader"></div>');
		$.ajax({
			url : '/' + project + '/ajax',
			data : searchOptions,
			dataType: 'jsonp',
			type: 'get',
			success : function (data) {
				chart.drawChart(data, project, chartType);
				// remove the overlay
				$('.overlay').remove();
			},
			error: function (object, stat, error) {
				console.log(stat + ': ' + error);
			}
		});
	},
	drawChart : function (json, project, type){
		/**
		 * Dimensions default:
		 * [600, 300]
		 * HTTP Worst Performance
		 * HTTP Best Performance
		 * JavaScript Performance
		 */
		if (json.error === undefined){
			// new data table
			var data = new google.visualization.DataTable(),
			i = 0, j = 0, k, title = '';
			
			for (i; i < (json.results[0].length + 1); i = i + 1){
				// first column is timestamp
				if(i === 0){
					data.addColumn('string', 'Time Stamp');
				} else {
					data.addColumn('number', json.results[0][i-1].name);
				}
			}
			
			// the number of rows is calculated by the length of the results
			data.addRows(json.results.length);
			
			for (j; j < json.results.length; j = j + 1){
				data.setValue(j, 0, new Date(json.timeStamps[j]).toLocaleDateString() + ' ' + new Date(json.timeStamps[j]).toLocaleTimeString());
				for (k = 1; k < data.B.length; k = k + 1){
					data.setValue(j, k, json.results[j][k-1].score);
				}
			}
	
			// setting the title
			if (type === 'worst'){
				title = 'HTTP Worst Performance';
			} else if (type === 'best'){
				title = 'HTTP Best Performance';
			} else {
				title = 'JavaScript Performance';
			}
	
			// remove tables
			if ($('table', 'chart-' + type).hasClass('hidden') !== true){
				$('table', 'chart-' + type).addClass('hidden');
			}
			
			var chart = new google.visualization.LineChart(document.getElementById('chart-' + type));
			chart.draw(data, {chartArea: {top: 50, left: 30}, legend: {position: 'top'},width: 600, height: 300, title:title, vAxis:{maxValue: 100, minValue: 0}});
		} else {
			if(json.error.message !== undefined){
				console.log(json.error.message);
			} else {
				console.log(json.error);
			}
		}
	}
};