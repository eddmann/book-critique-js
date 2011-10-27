(function() {
  
  function Dialog (overlay) {
    this.overlay = $(overlay);

    var that = this;
    this.overlay.click(function () { that.hide(); });
    $(window).resize(function() { that.resize(); });
  };

  Dialog.prototype.display = function (html) {
    if (this.el)
      this.el.remove();

    if ('#' === html[0])
      html = $(html).html();

    this.el = $('<div id="dialog">' + html + '</div>');

    return this;
  };

  Dialog.prototype.show = function () {
    this.el.appendTo('body');
    this.overlay.removeClass('hide');
    this.resize();
  };

  Dialog.prototype.hide = function () {
    this.el.remove();
    this.overlay.addClass('hide');
  };

  Dialog.prototype.resize = function () {
    var el = this.el;

    if (el) {
      el.css({
        top:  (window.innerHeight / 2) - el.height() / 2,
        left: (window.innerWidth / 2) - el.width() / 2
      });
    }
  };

  window['Dialog'] = function (overlay) {
    return new Dialog(overlay);
  };

}());
