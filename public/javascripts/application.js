$(function () {
  var dialog = Dialog($('#overlay')); 

  $('.review a').live('click', function () {
    var review = $(this),
        id = review.parent().parent().data('id'),
        rating = review.find('span').html();

    if (!review.hasClass('selected')) {
      $.post('/book/' + id, { _method: 'put', rating: rating }, function (res) {
        if (res.status === 'success') {
          review.parent().find('a.selected')
            .animate({ opacity: 0 }, 800, function () {
              $(this).removeClass('selected').animate({ opacity: 1 }, 800);
            });
          review.addClass('selected');
        }
      });
    } else {
      alert('An error occured whilst updating review');
    }
  });

  $('#add-book-button').click(function () {
    var dialogEl = $(dialog.display('#add-book').el),
        drop     = dialogEl.find('#drop'),
        canvas   = drop.html('<canvas />').find('canvas').get(0),
        context  = canvas.getContext('2d'),
        file;

    $(drop).bind({
      dragenter: function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('border', '3px dashed #736F6E');
      },

      dragleave: function (e) {
        e.stopPropagation();
        e.preventDefault();
        $(this).css('border', '3px dashed #CCCCCC');
      },

      dragover: function (e) {
        e.stopPropagation();
        e.preventDefault();
      },

      drop: (function () {
        var reader = new FileReader(),
            image  = new Image();

        image.onload = function () {
          var can    = document.createElement('canvas'),
              cxt    = can.getContext('2d'),
              width  = image.width,
              height = image.height;

          if (width > 180 || height > 236) {
            var xRatio = 180 / width,
                yRatio = 236 / height;
            
            if (xRatio * height < 236) {
              height = Math.ceil(xRatio * height);
              width = 180;
            } else {
              width = Math.ceil(yRatio * width);
              height = 236;
            }
          }

          can.width = image.width;
          can.height = image.height;
          cxt.drawImage(image, 0, 0);

          canvas.width = width;
          canvas.height = height;
          context.drawImage(can, 0, 0, width, height);

          $(canvas).css('margin-top', (height < 236) ? Math.ceil((236 - height) / 2) : 0);
        };

        return function (e) {
          e.stopPropagation();
          e.preventDefault();

          $(this).css('border', '3px dashed #CCCCCC');
          file = e.originalEvent.dataTransfer.files[0];

          reader.onload = (function (file) {
            return function (ev) {
              image.src = ev.target.result;
            };
          }(file));

          reader.readAsDataURL(file);
        };
      }())
    });

    dialogEl.find('a').click(function () {
      if (file) {
        $(this).text('Uploading');
        $.post('/book', { image: canvas.toDataURL() }, function (res) {
          dialog.hide();

          var book = '<div class="book" data-id="' + res + '">' +
                        '<img src="' + canvas.toDataURL() + '">' +
                        '<div class="review">' +
                            '<a class="r1"><span>1</span></a>' +
                            '<a class="r2"><span>2</span></a>' +
                            '<a class="r3"><span>3</span></a>' +
                            '<a class="r4"><span>4</span></a>' +
                            '<a class="r5"><span>5</span></a>' +
                        '</div>' +
                      '</div>';
          var newBook = $(book).appendTo('#books').css('opacity', 0);

          $('html').animate({ scrollTop: $(document).height() }, 'slow', function () {
            newBook.animate({ opacity: 1 }, 800);
          });
        });
      }
    });
    
    dialog.show();
  });
});
