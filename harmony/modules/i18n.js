"use strict";

let globalize = require('globalize');

globalize.load(
    require('cldr-data/supplemental/likelySubtags'),
    require('cldr-data/supplemental/currencyData'),
    require('cldr-data/supplemental/timeData'),
    require('cldr-data/supplemental/weekData'),
    require('cldr-data/main/en/currencies'),
    require('cldr-data/main/en/numbers'),
    require('cldr-data/main/en/ca-gregorian'),
    require('cldr-data/main/en/timeZoneNames')
);

module.exports = globalize('en');