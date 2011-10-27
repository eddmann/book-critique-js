var express  = require('express'),
    Resource = require('express-resource'),
    stylus   = require('stylus'),
    fs       = require('fs'),
    Store    = require('./lib/store');

require('./lib/fs.extras');

var app = module.exports = express.createServer();

function compile (str, path) {
  return stylus (str)
    .set('filename', path)
    .set('compress', true)
}

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  if (process.argv[2] === 'demo') {
    fs.delete('./book_store.json', function (err) {
      if (err && !err.message.match(/^ENOENT,/))
        return console.log(err);

      fs.copy('./_demo/book_store.json', './book_store.json', function (err) {
        console.log(err || '> copied database');
        store = new Store('./book_store.json');
        store.load();
      });
    });

    fs.delete('./public/images/books/', function (err) {
      if (err && !err.message.match(/^ENOENT,/))
        return console.log(err);

      fs.copy('./_demo/books', './public/images/books', function (err) {
        console.log(err || '> copied book images');
      });
    });
  } else {
    store = new Store('./book_store.json');
    store.load();
  }
  
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.get('/', function (req, res) { 
  res.render(__dirname + '/book_view.jade', { books: store.books, layout: false }); 
});
app.resource('book', require('./book_controller'));

app.listen(3000);

console.log("Express server listening on port %d in %s%s mode", 
  app.address().port,
  (process.argv[2] === 'demo') ? "'demo' " : '',
  app.settings.env);
