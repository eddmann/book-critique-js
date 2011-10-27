var fs = require('fs'),
    noop = function () {};

module.exports = Store;

function Store (path) {
  this.path = path;
  this.ids = this.ids || 0;
  this.books = this.books || {};
};

Store.prototype.save = function (fn) {
  var data = JSON.stringify(this);
  fs.writeFile(this.path, data, fn || noop);
  return this;
};

Store.prototype.load = function (fn) {
  var self = this,
      fn = fn || noop;
    
  fs.readFile(this.path, 'utf-8', function (err, json) {
    if (err)
      return fn(err);

    var data = JSON.parse(json),
        keys = Object.keys(data),
        len  = keys.length;

    for (var i = 0; i < len; ++i) {
      self[keys[i]] = data[keys[i]];
    }

    fn();
  });

  return this;
};
