var common = window.common || {};

common = {
	init : function () {
		this.datePicker();
		this.collapse();
		this.customSelect();
	},
	/* Function that creates datepicker functionality */
	datePicker : function (){
		$('.has-date-picker').datepicker();
		common.dateValidation();
	},
	/* Function that creates the collapsible options */
	collapse: function (){
		$('.collapsible ul').addClass('hidden');
		$('.collapsible h3').click(function () {
			$('ul', $(this).parent('.collapsible')).slideToggle('slow');
			$(this).parent('.collapsible').toggleClass('active');
		});
	},
	/* function that implements the custom select */
	customSelect : function (){
		$('#project-selection select').flyweightCustomSelect();
	},
	/* method that validates the dates to make sure that the from is always before
	 * the two
	 */
	dateValidation : function (){
		
		$('.date input').blur(function (){
			$parentFieldset = $(this).parents('.date');
			var timer = setTimeout(function(){validate($parentFieldset)}, 500);
			function validate ($parentFieldset) {
				$('p.error', $parentFieldset).remove();
				$('.date-from', $parentFieldset).removeClass('error');
				
				var fromDate = $('.date-from', $parentFieldset).val(),
					toDate = $('.date-to', $parentFieldset).val(),
					fromTimeStamp = Date.parse(fromDate);
					toTimeStamp = Date.parse(toDate);
					
				if (fromTimeStamp > toTimeStamp){
					$('ul', $parentFieldset).prepend('<p class="error">Please select a date that is before the to date</p>');
					$('.date-from', $parentFieldset).addClass('error');
				}
			}
		});
	}
};