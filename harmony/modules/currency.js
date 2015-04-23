'use strict';

let numeral = require('numeral'),
    _ = require('underscore');

const currencies = [{
    number: 980,
    code: 'UAH',
    name: 'Ukrainian hryvnia',
    symbol: '\u20B4',
    language: 'uk-UA'
}, {
    number: 840,
    code: 'USD',
    name: 'United States dollar',
    symbol: '$'
}, {
    number: 978,
    code: 'EUR',
    name: 'Euro',
    symbol: '\u20AC',
    language: 'de'
}];

let currency = {
    get list() {
        return currencies;
    },
    format(number, code) {
        let lang = _.findWhere(currencies, {number: code});
        if (lang && lang.language) {
            numeral.language(lang.language, require(`numeral/languages/${lang.language}`));
        }
        return numeral(number).format('$0,0.00');
    }
};

module.exports = currency;