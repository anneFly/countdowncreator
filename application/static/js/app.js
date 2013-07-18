var Utils = (function ($, window, Utils, undef) {

    'use strict';

    Utils.maxValues = {
        'year': 3000,
        'month': 12,
        'day': 31,
        'hour': 23,
        'minute': 59
    };

    Utils.minValues = {
        'year': new Date().getFullYear(),
        'month': 1,
        'day': 1,
        'hour': 0,
        'minute': 0
    };

    Utils.checkInput = function (type, val ) {
        return val !== '' && val >= Utils.minValues[type] && val <= Utils.maxValues[type];
    };

    Utils.checkDate = function (year, month, day) {
        var date = new Date(
                parseInt(year, 10),
                parseInt(month, 10) - 1,
                parseInt(day, 10)),
            yearValid = date.getFullYear() === parseInt(year, 10),
            monthValid = date.getMonth() === parseInt(month, 10) - 1,
            dayValid = date.getDate() === parseInt(day, 10);

        return yearValid && monthValid && dayValid;
    };

    Utils.validateForm = function ($fields) {
        var data = {},
            formValid = true;
        $.each($fields, function (i, el) {
            var key = $(el).data('validate'),
                val = $(el).val();
            data[key] = val;
        });
        $.each(data, function (k, v) {
            var valid = Utils.checkInput(k, parseInt(v, 10));
            $fields.filter(['[data-validate="', k, '"]'].join('')).toggleClass('invalid', !valid);
            formValid = formValid && valid;
        });
        if (!formValid) { return false; }

        return Utils.checkDate(data.year, data.month, data.day);
    };

    return Utils;

}(jQuery, this, this.Utils || {}));

var Ui = (function ($, window, Utils, Ui, undef) {

    'use strict';

    var Spinner = function (params) {
        this.init(params);
        this.bindEvents();
    };

    Spinner.prototype.init = function (params) {
        this.type = params.type;
        this.$el = $(params.selector);
        this.$input = this.$el.find('input');
        this.maxValue = Utils.maxValues[this.type];
        this.minValue = Utils.minValues[this.type];
        this.value = this.$input.val() !== '' ? parseInt(this.$input.val(), 10) : params.value;
    };

    Spinner.prototype.bindEvents = function () {
        var that = this,
            operation = {
                'add': function (val) { return (val += 1); },
                'sub': function (val) { return (val -= 1); }
            };
        this.$el.on('click', 'button', function (e) {
            if (that.$input.val() === '') {
                that.renderValue();
                return;
            }
            that.value = that.$input.val() !== '' ? parseInt(that.$input.val(), 10) : that.value;
            that.value = operation[$(this).data('role')](that.value);
            if (Utils.checkInput(that.type, that.value)) {
                that.renderValue();
                return;
            }
            that.value = operation[$(this).data('undorole')](that.value);
        });
        this.$input.on('blur', function (e) {
            if (Utils.checkInput(that.type, $(this).val())) {
                return true;
            }
            that.value = $(this).val() > that.maxValue ? that.maxValue : that.minValue;
            that.renderValue();
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

    var UiForm = function (params) {
        var that = this;
        this.$el = $(params.selector);
        this.$validateFields = $(params.requiredFields);
        this.$validateBtn = $(params.validateBtn);
        this.$el.on('submit', function () {
            return Utils.validateForm(that.$validateFields);
        });
        this.$validateBtn.on('click', function () {
            Utils.validateForm(that.$validateFields);
        });
    };

    Ui.form = new UiForm({selector: 'form', requiredFields: '[data-validate]', validateBtn: 'button.show-preview'});
    Ui.fields = [];
    Ui.fields.push(
        new Spinner({ selector: '#yearWrapper', type: 'year', value: new Date().getFullYear()}),
        new Spinner({ selector: '#monthWrapper', type: 'month', value: 1 }),
        new Spinner({ selector: '#dayWrapper', type: 'day', value: 1 }),
        new Spinner({ selector: '#hourWrapper', type: 'hour', value: 0 }),
        new Spinner({ selector: '#minuteWrapper', type: 'minute', value: 0 })
    );

    return Ui;

}(jQuery, this, this.Utils, this.Ui || {}));
