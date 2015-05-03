'use strict';

let i18n = require('../modules/i18n'),
    _ = require('underscore');

let currencies = require('cldr-data/main/en/currencies.json').main.en.numbers.currencies;

let currency = {
    get list() {
        return Object.keys(currencies).map(key => {
            let value = currencies[key];
            return {
                name: value.displayName,
                symbol: value.symbol
            }
        }).sort((left, right) => left.name.localeCompare(right.name));
    },
    format(number, code) {
        let language = currencies[code],
            symbol = language ? language.symbol : 'USD';
        return i18n.currencyFormatter(symbol)(number);
    }
};

module.exports = currency;