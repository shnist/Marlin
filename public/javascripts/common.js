var common = window.common || {};


common.functions = {
	init : function () {
		//this.collapse();
		this.customSelect();
	},

	/* Function that creates the collapsible options */
	//collapse: function (){
	//	$('.collapsible ul').addClass('hidden');
	//	$('.collapsible h3').click(function () {
	//		$('ul', $(this).parent('.collapsible')).slideToggle('slow');
	//		$(this).parent('.collapsible').toggleClass('active');
	//	});
	//},
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
		//common.dateValidation();
	},
	/**
	 * Applies custom accordion to the form
	 */
	accordion : function($accordion){
		$accordion.each(function () {
			$(this).find('h3').click(function () {
				console.log($(this).parent('.collapsible'))
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
	

};

