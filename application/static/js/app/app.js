(function ($, window, Utils, undef) {

	'use strict';

    var $form = $('form'),
        $fields = $form.find('[data-validate]'),
        $submitBtn = $form.find('button[type=submit]');

    $submitBtn.on('click', function (e) {
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
    });

}(jQuery, this, Utils));
