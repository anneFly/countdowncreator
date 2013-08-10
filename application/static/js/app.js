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

    Utils.labels = {
        'days': {
            sg: 'day',
            pl: 'days'
        },
        'hours': {
            sg: 'hour',
            pl: 'hours'
        },
        'minutes': {
            sg: 'minute',
            pl: 'minutes'
        },
        'seconds': {
            sg: 'second',
            pl: 'seconds'
        }
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

    Utils.getCountdownData = function ($fields) {
        var data = {};
        $.each($fields, function (i, el) {
            var key = $(el).attr('name'),
                val = $(el).val();
            data[key] = val;
        });
        return data;
    };

    Utils.getLabel = function (type, value) {
        return (value === 1 ? Utils.labels[type].sg : Utils.labels[type].pl);
    };

    return Utils;

}(jQuery, this, this.Utils || {}));

var Countdown = (function ($, window, Utils, Ui, Countdown, undef) {

    'use strict';

    window.Ui = window.Ui || Ui;

    var CdModel = function (params) {
        this.title = params.title;
        this.year = parseInt(params.year, 10);
        this.month = parseInt(params.month, 10);
        this.day = parseInt(params.day, 10);
        this.hour = parseInt(params.hour, 10);
        this.minute = parseInt(params.minute, 10);
        this.cdTime = this.getCdTime();
        this.timer = undef;
    };

    CdModel.prototype.getCdTime = function () {
        return new Date(this.year, this.month-1, this.day, this.hour, this.minute).getTime();
    };

    CdModel.prototype.calculateCountdown = function () {
        var nowTime = Date.now(),
            diffTime = this.cdTime > nowTime ? this.cdTime - nowTime : 0,
            diffDays = diffTime/1000/60/60/24 | 0,
            diffHours = (diffTime/1000/60/60 | 0) - (diffDays*24 | 0),
            diffMinutes = (diffTime/1000/60 | 0) - (diffDays*24*60 | 0) - (diffHours*60 | 0),
            diffSeconds = (diffTime/1000 | 0) - (diffDays*24*60*60 | 0) - (diffHours*60*60 | 0) - (diffMinutes*60 | 0);
        return {title: this.title, days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds};
    };

    CdModel.prototype.count = function (){
        var data = this.calculateCountdown();
        Ui.updateView(data);
        if (data.days === 0 && data.hours === 0 && data.minutes === 0 && data.seconds === 0) {
            this.stopCounting();
        }
    };

    CdModel.prototype.startCounting = function () {
        var that = this;
        this.timer = window.setInterval(function () {
            that.count();
        }, 1000);
    };

    CdModel.prototype.stopCounting = function () {
        var that = this;
        window.clearInterval(that.timer);
    };

    Countdown.create = function (data) {
        return new CdModel(data);
    };

    Countdown.createFromDate = function (obj) {
        var parts = obj.date.split(' '),
            date = parts[0],
            dateParts = date.split('-'),
            time = parts[1],
            timeParts = time.split(':'),
            data = {
                title: obj.title,
                year: dateParts[0],
                month: dateParts[1],
                day: dateParts[2],
                hour: timeParts[0],
                minute: timeParts[1]
            };
        return new CdModel(data);
    };

    return Countdown;

}(jQuery, this, this.Utils, this.Ui || {}, Countdown || {}));
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
        this.renderValue();
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
        this.$el.on('submit', function () {
            return Utils.validateForm(that.$validateFields);
        });
        this.$previewBtn.on('click', function () {
            var valid = Utils.validateForm(that.$validateFields);
            if (valid) {
                that.$el.removeClass('error');
                var data = Utils.getCountdownData(that.$el.find('input'));
                Ui.Cd = Countdown.create(data);
                Ui.Cd.startCounting();
                that.toggleView(that.inputView.$el, Ui.countdownView.$el);
            } else {
                that.$el.addClass('error');
            }
        });
        this.$editBtn.on('click', function () {
            Ui.Cd.stopCounting();
            that.toggleView(Ui.countdownView.$el, that.inputView.$el);
        });
    };

    UiForm.prototype.toggleView = function (from, to) {
        var that = this;
        from.fadeOut(function() {
            to.fadeIn();
            that.$el.toggleClass('preview-mode');
        });
    };

    var SuccessView = function (params) {
        this.$urlField = $(params.urlField);
        this.init();
    };

    SuccessView.prototype.init = function () {
        var protocol = window.location.protocol,
            hostname = window.location.hostname,
            origin = window.location.origin || [protocol, '//', hostname].join(''),
            relUrl = this.$urlField.val(),
            absUrl = [origin, relUrl].join('');
        this.$urlField.val(absUrl);
    };

    Ui.updateView = function (data) {
        $.each(data, function (key, val) {
            if (key === 'title') { return; }
            var label = Utils.getLabel(key, val);
            Ui.countdownView.$fields[key][0].text(val);
            Ui.countdownView.$fields[key][1].text(label);
        });
        Ui.countdownView.$fields.title.text(data.title);
    };

    Ui.countdownView = new CountdownView({ selector: '.countdown-container' });
    Ui.form = new UiForm({
        selector: 'form',
        requiredFields: '[data-validate]',
        previewBtn: 'button.show-preview',
        editBtn: 'button.show-edit',
        inputViewSelector: '.input-container'
    });
    Ui.fields = [];
    Ui.fields.push(
        new Spinner({ selector: '#yearWrapper', type: 'year', value: new Date().getFullYear()}),
        new Spinner({ selector: '#monthWrapper', type: 'month', value: new Date().getMonth() + 1 }),
        new Spinner({ selector: '#dayWrapper', type: 'day', value: new Date().getDate() }),
        new Spinner({ selector: '#hourWrapper', type: 'hour', value: new Date().getHours() }),
        new Spinner({ selector: '#minuteWrapper', type: 'minute', value: new Date().getMinutes() })
    );

    Ui.successView = new SuccessView({ urlField: '.copy-url input' });

    if (window.fetchedCountdown !== undef) {
        Ui.Cd = Countdown.createFromDate(window.fetchedCountdown);
        Ui.Cd.startCounting();
    }

    return Ui;

}(jQuery, this, this.Utils, this.Countdown || {}, this.Ui || {}));
