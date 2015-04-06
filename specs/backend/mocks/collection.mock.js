'use strict';

function Collection() {
    this.items = [];
    this.findOne = function (item, callback) {
        var found = this.items.filter(function (element) {
            var props = [];
            for (var i in element) {
                if (element.hasOwnProperty(i)) {
                    props.push(i);
                }
            }
            var method = item.$and ? 'every' : item.$or ? 'some' : 'every';
            return props[method](function (prop) {
                var predicate = item.$and ? '$and' : item.$or ? '$or' : null,
                    expression = predicate ? item[predicate].filter(function (p) {
                        return item[p] === element[p];
                    }).length : (element[prop] === item[prop]);
                return prop === '_id' ? true : expression;
            });
        });
        return callback(null, found.length ? found[0] : null);
    };
    this.insertOne = function (item, options, callback) {
        item._id = new Date().getTime().toString();
        this.items.push(item);
        callback(null, {ops: [item]});
    };
}

module.exports = Collection;