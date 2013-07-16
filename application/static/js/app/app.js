(function ($, window, undef) {
	
	'use strict';
	
	var checkInput = {
		'year': function (val) {
			return val >= new Date().getFullYear();
		},
		'month': function (val) {
			return val >= 1 && val <= 12;
		},
		'day': function (val) {
			return val >= 1 && val <= 31;
		},
		'hour': function (val) {
			return val >= 0 && val <= 23;
		},
		'minute': function (val) {
			return val >= 0 && val <= 59;
		}
	};
	
	var Spinner = function (params) {
		this.init(params);
		this.bindEvents();
	};
	
	Spinner.prototype.init = function (params) {
		this.type = params.type;
		this.$el = $(params.selector);
        this.$input = this.$el.find('input');
        this.value = this.$input.val() !== '' ? parseInt(this.$input.val(), 10) : params.value;
	};
	
	Spinner.prototype.bindEvents = function () {
		var that = this,
			operation = {
				'add': function (val) { return (val += 1); },
				'sub': function (val) { return (val -= 1); }
			};
		this.$el.on('click', 'button', function (e) {
			that.value = that.$input.val() !== '' ? parseInt(that.$input.val(), 10) : that.value;
			that.value = operation[$(this).data('role')](that.value);
			if (checkInput[that.type](that.value)) {
				that.renderValue();
				return;
			}
			that.value = operation[$(this).data('undorole')](that.value);
		});
	};
    
    Spinner.prototype.renderValue = function () {
		var length = parseInt(this.$input.attr('maxlength'), 10),
			strLength = this.value.toString().length,
			pre = [],
			i;
		for (i = 0; i<length-strLength; i++) {
			pre.push('0');
		}
		this.$input.val([pre.join(''), this.value].join(''));
    };
    
    var myYear = new Spinner({ selector: '#yearWrapper', type: 'year', value: 2013 }),
	    myMonth = new Spinner({ selector: '#monthWrapper', type: 'month', value: 1 }),
	    myDay = new Spinner({ selector: '#dayWrapper', type: 'day', value: 1 }),
	    myHour = new Spinner({ selector: '#hourWrapper', type: 'hour', value: 0 }),
	    myMinute = new Spinner({ selector: '#minuteWrapper', type: 'minute', value: 0 });
    
}(jQuery, this));
