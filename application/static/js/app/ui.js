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

    Ui.fields = [];
    Ui.fields.push(
        new Spinner({ selector: '#yearWrapper', type: 'year', value: new Date().getFullYear() }),
        new Spinner({ selector: '#monthWrapper', type: 'month', value: 1 }),
        new Spinner({ selector: '#dayWrapper', type: 'day', value: 1 }),
        new Spinner({ selector: '#hourWrapper', type: 'hour', value: 0 }),
        new Spinner({ selector: '#minuteWrapper', type: 'minute', value: 0 })
    );

    return Ui;

}(jQuery, this, Utils, this.Ui || {}));