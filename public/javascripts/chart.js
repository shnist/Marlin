var chart = window.chart || {};
var jsonData = [{
	'timeStamp' : 'commit one',
	'stylesheetsAtTop' : 25,
	'avoidCSSImport' : 20
},
{
	'timeStamp' : 'commit two',
	'stylesheetsAtTop' : 40,
	'avoidCSSImport' : 25
},
{
	'timeStamp' : 'commit three',
	'stylesheetsAtTop' : 25,
	'avoidCSSImport' : 20
},
{
	'timeStamp' : 'commit four',
	'stylesheetsAtTop' : 50,
	'avoidCSSImport' : 25
}];
var bestData = [{
	'timeStamp' : 'commit one',
	'avoidLongRunningScripts' : 100,
	'deferParsingJs' : 65
},
{
	'timeStamp' : 'commit two',
	'avoidLongRunningScripts' : 90,
	'deferParsingJs' : 70
},
{
	'timeStamp' : 'commit three',
	'avoidLongRunningScripts' : 85,
	'deferParsingJs' : 80
},
{
	'timeStamp' : 'commit four',
	'avoidLongRunningScripts' : 100,
	'deferParsingJs' : 80
}];
var jsData = [{
	'timeStamp' : 'commit one',
	'loadTime' : 100
},
{
	'timeStamp' : 'commit two',
	'loadTime' : 98
},
{
	'timeStamp' : 'commit three',
	'loadTime' : 80
},
{
	'timeStamp' : 'commit four',
	'loadTime' : 99
}];


chart = {
	init : function (dimensions, wireframeNumber){
		// remove the tables
		$('table', '.chart').addClass('hidden');
		
		chart.drawChart(jsonData, 'HTTP Worst Performance', 'http-chart', dimensions, wireframeNumber);
		chart.drawChart(jsData, 'JavaScript Performance', 'javascript-chart', dimensions, wireframeNumber);
		chart.drawChart(bestData, 'HTTP Best Performance', 'best-http-chart', dimensions, wireframeNumber);
	},
	drawChart : function (json, title, chartElement, dimensions, wireframeNumber){
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
		if (wireframeNumber === 2){
			chart.draw(data, {chartArea: {top: 10, left: 10}, width: dimensions[0], height: dimensions[1], title: title, vAxis:{maxValue: 100, minValue: 0}});
		} else if(wireframeNumber === 3) {
			chart.draw(data, {chartArea: {top: 50, left: 30}, legend: {position: 'top'},width: dimensions[0], height: dimensions[1], title:title, vAxis:{maxValue: 100, minValue: 0}});
		} else {
			chart.draw(data, {width: dimensions[0], height: dimensions[1], title: title, vAxis:{maxValue: 100, minValue: 0}});
		}
		
	
	}
};