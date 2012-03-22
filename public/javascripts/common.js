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
		$('#project-selection select, #manager').flyweightCustomSelect();
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
		this.buildValidation.init($('#build-form'));
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
					$('ul', $parentFieldset).prepend('<p class="error">The date you\'ve picked is after the "to" date. Please select a "from" date that is before the "to" date.</p>');
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
	},
	buildValidation : {
		/**
		 * Deals with validating the form for the creation of the build
		 * files
		 */
		init : function ($context) {
			if ($context.length > 0) {
				this.submitValidate($context);
				this.blurValidate($context);
			}
		},
		/**
		 * Handles validation at form submission
		 */
		submitValidate : function ($context) {
			$context.submit(function(event){
				// remove error messages if they already exist
				if($('label.error').length){
					$('label.error').remove();
					$('.error').removeClass('error');
				}
	
				var message, urlTest;			
				$('li input[type=text]').each(function(){
					if($(this).val() === ''){
						event.preventDefault();
						// testing for empty values
						message = common.validation.buildValidation.createMessage($(this).prop('name'));
						$(this).addClass('error');
						$(this).parents('li').append('<label for="' + $(this).prop('id') + '" class="error">' + message + '</label>');
					} else if ($(this).prop('id') === 'site' || $(this).prop('id') === 'marlin'){
						// testing for valid urls 
						urlTest = common.validation.buildValidation.validURL($(this).val());
						if(urlTest === false){
							event.preventDefault();
							if ($(this).prop('id') === 'site'){
								message = common.validation.buildValidation.createMessage('site-empty');
							} else {
								message = common.validation.buildValidation.createMessage('marlin-empty');					
							}
							$(this).addClass('error');
							$(this).parents('li').append('<label for="' + $(this).prop('id') + '" class="error">' + message + '</label>');
						}
					}
				});
				// testing the value of the select option
				if($('select').val() === 'select'){
					event.preventDefault();
					message = common.validation.buildValidation.createMessage('manager-select');
					$('#manager-button').addClass('error');
					$('select', $context).parents('fieldset').append('<label for="' + $('select').prop('id') + '" class="error">' + message + '</label>')
				}
			});	
		},
		/**
		 * Validation on input blurs
		 */
		blurValidate : function ($context) {
			var message, urlTest;
			$('input', $context).blur(function (event) {
				if($(this).val() === ''){
					if ($(this).hasClass('error') !== true){
						message = common.validation.buildValidation.createMessage($(this).prop('name'));
						$(this).addClass('error');
						$(this).parents('li').append('<label for="' + $(this).prop('id') + '" class="error">' + message + '</label>');
					}
				} else {
					if ($(this).prop('id') === 'site' || $(this).prop('id') === 'marlin'){
						// testing for valid urls 
						urlTest = common.validation.buildValidation.validURL($(this).val());
						if(urlTest === false && $(this).hasClass('error') !== true){
							if ($(this).prop('id') === 'site'){
								message = common.validation.buildValidation.createMessage('site-empty');
							} else {
								message = common.validation.buildValidation.createMessage('marlin-empty');					
							}
							$(this).addClass('error');
							$(this).parents('li').append('<label for="' + $(this).prop('id') + '" class="error">' + message + '</label>');
						} else {
							common.validation.buildValidation.removeError($(this));
						}
					} else if ($(this).hasClass('error') === true) {
						// removing the errors if errors no longer exist
						common.validation.buildValidation.removeError($(this));
					}
				}
			});
			
		},
		/**
		 * Remove Erros
		 */
		removeError : function ($context) {
			$context.removeClass('error');
			$context.siblings('label.error').fadeOut(function (){
				$(this).remove();
			});
		},
		/**
		 * Test valid URLs
		 */
		validURL : function (url) {
			var urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
			return urlRegex.test(url);
		},
		/**
		 * Build the error messages for build validatoin
		 */
		createMessage : function (property) {
			switch (property){
				case 'project':
					return 'Please fill in a value for the name of your project.';
					break;
				case 'user-name':
					return 'Please fill in your user name for the revision software you\'re using.';
					break;
				case 'user-password':
					return 'Please fill in your password.';
					break;
				case 'repository':
					return 'Please fill in the name of the repository you want to keep a track of.';
					break;
				case 'site':
					return 'Please fill in the URL of the site you want to track.';
					break;
				case 'marlin':
					return 'Please fill in the URL address of the Marlin server.';
					break;
				case 'site-empty':
					return 'Please fill in a valid URL for the site you want to test.';
					break;
				case 'marlin-empty':
					return 'Please fill in a valid URL for your Marlin server.';
					break;
				case 'manager-select':
					return 'Please select the Build Management Software you want to build the file for.';
					break;
				default:
					return 'Some of your inputs are empty. Please could you fill them in!';
					break;
			}
		}
	}	
};

