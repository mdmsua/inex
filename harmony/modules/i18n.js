"use strict";

let globalize = require('globalize');

globalize.load(
    require('cldr-data/supplemental/likelySubtags'),
    require('cldr-data/supplemental/currencyData'),
    require('cldr-data/main/en/currencies'),
    require('cldr-data/main/en/numbers')
);

module.exports = globalize('en');