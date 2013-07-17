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

    return Utils;

}(jQuery, this, this.Utils || {}));
