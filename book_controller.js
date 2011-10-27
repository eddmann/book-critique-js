var fs     = require('fs'),
    crypto = require('crypto');

exports.index = function (req, res) {
  res.send(store.books);
};

exports.create = function (req, res, next) {
  var img = req.body.image.replace(/^data:image\/png;base64,/, ''),
      buff = new Buffer(img, 'base64'),
      filename = crypto.createHash('md5')
                       .update(img + (new Date()).getTime())
                       .digest('hex');
  
  fs.writeFile('./public/images/books/' + filename + '.png', buff, function (err) {
    if (err)
      res.send({ error: err });

    var book = { 
      id: store.ids++,
      image: filename + '.png',
      rating: 0
    };
    
    store.books[book.id] = book;
    store.save();

    setTimeout(function () {
      res.send(book.id + '');
    }, 2500);
  });
};

exports.update = function (req, res, next) {
  var id = req.params.book,
      rating = req.body.rating,
      msg = 'error';

  if (rating >= 1 && rating <= 5 && store.books[id]) {
    store.books[id].rating = rating;
    store.save();
    msg = 'success';
  }

  res.send({ 'status': msg });
};

exports.destroy = function (req, res, next) { };
