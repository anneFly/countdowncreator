var Ui = (function ($, window, Utils, Countdown, Ui, undef) {

    'use strict';

    Countdown = window.Countdown || {};

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
                that.value = $(this).val();
                that.renderValue();
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

    var CountdownView = function (params) {
        this.$el = $(params.selector);
        this.$fields = {
            'title': this.$el.find('[data-insert="title"]')
        };
        var fieldNames = ['days', 'hours', 'minutes', 'seconds'],
            i = 0;
        for (i; i<fieldNames.length; i++) {
            this.$fields[fieldNames[i]] = [
                this.$el.find(['[data-insert="', fieldNames[i], '"] .cd-number'].join('')),
                this.$el.find(['[data-insert="', fieldNames[i], '"] .cd-label'].join(''))
            ];
        }
    };

    var InputView = function (params) {
        this.$el = $(params.selector);
    };

    var UiForm = function (params) {
        var that = this;
        this.$el = $(params.selector);
        this.$validateFields = $(params.requiredFields);
        this.$previewBtn = $(params.previewBtn);
        this.$editBtn = $(params.editBtn);
        this.inputView = new InputView({ selector: params.inputViewSelector });
        this.countdownView = new CountdownView({ selector: params.countdownViewSelector });
        this.$el.on('submit', function () {
            return Utils.validateForm(that.$validateFields);
        });
        this.$previewBtn.on('click', function () {
            var valid = Utils.validateForm(that.$validateFields);
            if (valid) {
                var data = Utils.getCountdownData(that.$el.find('input'));
                Ui.Cd = new Countdown.create(data);
                Ui.Cd.startCounting();
                that.toggleView(that.inputView.$el, that.countdownView.$el);
            }
        });
        this.$editBtn.on('click', function () {
            Ui.Cd.stopCounting();
            that.toggleView(that.countdownView.$el, that.inputView.$el);
        });
    };

    UiForm.prototype.toggleView = function (from, to) {
        from.fadeOut(function() {
            to.fadeIn();
        });
    };

    Ui.updateView = function (data) {
        $.each(data, function (key, val) {
            if (key === 'title') { return; }
            var label = Utils.getLabel(key, val);
            Ui.form.countdownView.$fields[key][0].text(val);
            Ui.form.countdownView.$fields[key][1].text(label);
        });
        Ui.form.countdownView.$fields.title.text(data.title);
    };

    Ui.form = new UiForm({
        selector: 'form',
        requiredFields: '[data-validate]',
        previewBtn: 'button.show-preview',
        editBtn: 'button.show-edit',
        inputViewSelector: '.input-container',
        countdownViewSelector: '.countdown-container'
    });
    Ui.fields = [];
    Ui.fields.push(
        new Spinner({ selector: '#yearWrapper', type: 'year', value: new Date().getFullYear()}),
        new Spinner({ selector: '#monthWrapper', type: 'month', value: 1 }),
        new Spinner({ selector: '#dayWrapper', type: 'day', value: 1 }),
        new Spinner({ selector: '#hourWrapper', type: 'hour', value: 0 }),
        new Spinner({ selector: '#minuteWrapper', type: 'minute', value: 0 })
    );

    return Ui;

}(jQuery, this, this.Utils, this.Countdown || {}, this.Ui || {}));
