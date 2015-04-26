'use strict';

let accounting = require('accounting'),
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
        let language = _.findWhere(currencies, {number: code}),
            symbol = language ? language.symbol : '';
        return accounting.formatMoney(number, symbol, 2, '.', ',');
    }
};

module.exports = currency;