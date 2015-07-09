'use strict';
$(document).ready(function () {
    $('#category').change(function () {
        var val = $(this).val();
        $('#account-row').toggleClass('hidden', val !== 'TRX');
    })
});