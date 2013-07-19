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
        console.log(diffTime);
        return {days: diffDays, hours: diffHours, minutes: diffMinutes, seconds: diffSeconds};
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

    return Countdown;

}(jQuery, this, this.Utils, this.Ui || {}, Countdown || {}));