var common = window.common || {};

/**
 * Methods that need to be applied on page load
 */
common.functions = {
	init : function () {
		common.validation.init();
		common.widgets.init();
		this.customSelect();
	},
	/* function that implements the custom select */
	customSelect : function (){
		$('#project-selection select').flyweightCustomSelect();
	}
};

/**
 * Widgets
 * Applies common functionality across the site
 */
common.widgets = {
	init : function () {
		common.widgets.apply($('body'));
	},
	/**
	 * Returned HTML from ajax can have event handlers applied
	 * to is selectively using the $context variable
	 */
	apply : function ($context) {
		common.widgets.datePicker($context.find('.has-date-picker'));
		common.widgets.accordion($context.find('.collapsible'));
	},
	/**
	 * Applies JQuery UI datepicker
	 */
	datePicker : function ($datePicker){
		$datePicker.each(function () {
			$(this).datepicker();	
		});
	},
	/**
	 * Applies custom accordion to the form
	 */
	accordion : function($accordion){
		$accordion.each(function () {
			$(this).find('ul').addClass('hidden');
			$(this).find('h3').click(function () {
				$('ul', $(this).parent('.collapsible')).slideToggle('slow').removeClass('hidden');
				$(this).parent('.collapsible').toggleClass('active');
			});
		
		});
	}
	
};


/**
 * Validation of forms
 */
common.validation = {
	init : function () {
		this.dateValidation();
	},
	/**
	 * Validates the date range of the form a
	 * From date cannot be higher than to date
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
	},
	/**
	 * Ensures that at least one option in the rules part of the
	 * rule options form is selected
	 */
	selectedOptions: function ($context, callback) {
		if($context.find('input:checked').length !== 0){
			callback(null);
		} else {
			callback('Please select at least one option.');
		}
	}
};

