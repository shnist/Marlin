var chart = window.chart || {};

chart = {
	init : function ($context){
		this.submit();
		
		if($context !== undefined){
			// auto submission on page load to create graph
			$('.rule-options', $context).submit();
		} else {
			// auto submission on page load to create graph
			$('.rule-options').submit();
		}
	},
	/**
	 * Submit
	 * Method that captures form submissions and triggers AJAX request
	 */
	submit : function () {
		var firstRun = true;
		$('.rule-options').submit(function (event) {
			event.preventDefault();
			
			var $form = $(this),
				project, chartType, searchOptions;
			
			// validate form
			common.validation.selectedOptions($form, function(error){
				if (error === null){
					if ($('.rule-list .error').length !== 0){
						$('.rule-list .error').remove();
					}
					project = $('input[name=project]', $form).val();
					chartType = $('input[name=chart-type]', $form).val();
					searchOptions = $form.serialize();
								
					// send off ajax request
					chart.retrieveData(project, chartType, searchOptions, $form);
				} else {
					if ($('.rule-list .error').length !== 0){
						$('.rule-list .error').remove();
					}
					$('.rule-list').append('<p class="error">' + error + '</p>');
				}
			});
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
				if ($('.tab-page .error').length !== 0){
					$('.tab-page .error').remove();
				}
				$('.rule-title').append('<p class="error">' + stat + ': ' + error + '</p>');
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
			i = 0, j = 0, k, title = '', options = { area: {}, vAxis: {}};
		
			
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
				for (k = 1; k < data.A.length; k = k + 1){
					if (type === 'javascript'){
						data.setValue(j, k, json.results[j][k-1].value);
					} else {
						data.setValue(j, k, json.results[j][k-1].score);
					}
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
	

			
			if(type === 'javascript'){
				options.maxValue = 10000;
				options.area.left = 80;
				options.vAxis.title = 'Time (ms)'
			} else {
				options.maxValue = 100;
				options.area.left = 50;
				options.vAxis.title = 'Score out of 100'
			}
		
			// move the table
			//chart.moveTable(type);
		
			var newChart = new google.visualization.LineChart(document.getElementById('chart-' + type));
			newChart.draw(data,
				{
					chartArea: {top: 50, left: options.area.left, width: '100%', height: '70%'},
					legend: {position: 'top'},
					width: 500,
					height: 300,
					title:title,
					vAxis:{maxValue: options.maxValue, minValue: 0, title: options.vAxis.title}
				}
			);
		} else {
			if ($('.tab-page .error').length !== 0){
				$('.tab-page .error').remove();
			}
			if(json.error.message !== undefined){
				$('.rule-title').after('<p class="error">' + json.error.message + '</p>');
			} else {
				$('.rule-title').after('<p class="error">' + json.error + '</p>');
			}
		}
	},
	/**
	 * Method that moves the table to a different part of the page
	 */
	moveTable : function (type) {
		var project = $('input[name=project]', '#tab-one .rule-options').val(),
			page =  project + '/';
			
		if (type !== 'worst') {
			if (tab === 'best'){
				page = page + 'best';
			} else {
				page = page + 'javascript';
			}
			$.ajax({
				url : page,
				dataType: 'html',
				type: 'get',
				success : function (data) {
					var island = $(data),
					$table = island.find('.statistics');
					
					$('table', '#chart-' + type).remove();
					$('#chart-' + type).siblings('form').after($table);
					
				},
				error: function (object, stat, error) {
					console.log(stat + ': ' + error);
				}
			});
			
			
		} else {
			
			$('#chart-' + type).siblings('form').after($('table', '#chart-' + type));
		}
		
		
		
		
		
		
	}
};