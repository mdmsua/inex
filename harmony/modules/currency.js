'use strict';

let i18n = require('../modules/i18n'),
    _ = require('underscore');

let currencies = require('cldr-data/main/en/currencies.json').main.en.numbers.currencies;

let currency = {
    get list() {
        return Object.keys(currencies).map(key => {
            let value = currencies[key];
            return {
                key: key,
                name: value.displayName,
                symbol: value.symbol
            }
        }).sort((left, right) => left.name.localeCompare(right.name));
    },
    getOne(key) {
        return currencies[key];
    },
    format(number, code) {
        return i18n.currencyFormatter(code)(number);
    }
};

module.exports = currency;