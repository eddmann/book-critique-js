(function () {
  
  var fs   = require('fs'),
      util = require('util'),
      path = require('path');

  if (typeof fs.copy !== 'function') {
    fs.copy = function (src, dst, fn) {
      fs.stat(dst, function (err) {
        if (!err)
          return fn(new Error("'" + dst + "' already exists."));

        fs.stat(src, function (err, stat) {
          if (err)
            return fn(err);
          
          if (stat.isFile()) {
            fs.readFile(src, function (err, data) {
              fs.writeFile(dst, data, fn);
            });
          } else {
            fs.mkdir(dst, stat.mode, function (err) {
              if (err)
                return fn(err);

              fs.readdir(src, function (err, files) {
                (function copyFiles(err) {
                  if (err)
                    return fn(err);
                
                  var filename = files.shift();
                  if (filename === null || typeof filename === 'undefined')
                    return fn();
                
                  var file = src + '/' + filename,
                      newFile = dst + '/' + filename;

                  fs.stat(file, function (err, stat) {
                    if (stat.isDirectory()) {
                      fs.copy(file, newFile, copyFiles);
                    } else {
                      fs.readFile(file, function (err, data) {
                        fs.writeFile(newFile, data, copyFiles);
                      });
                    }
                  });
                }());
              });
            });
          }
        });
      });
    }
  }

  if (typeof fs.delete !== 'function') {
    fs.delete = function (path, fn) {
      fs.stat(path, function (err, stat) {
        if (err)
          return fn(err);

        if (stat.isFile()) {
          fs.unlink(path, fn);
        } else {
          fs.readdir(path, function (err, files) {
            if (err)
              return fn(err);
        
            (function rmfile(err) {
              var filename = files.shift();
              if (filename === null || typeof filename === 'undefined')
                return fs.rmdir(path, fn);

              var file = path + '/' + filename;
              fs.stat(file, function (err, stat) {
                if (err)
                  return fn(err);
          
                if (stat.isDirectory())
                  fs.delete(file, rmfile);
                else
                  fs.unlink(file, rmfile);
              });
            }());
          });
        }
      });      
    };
  }

}());
