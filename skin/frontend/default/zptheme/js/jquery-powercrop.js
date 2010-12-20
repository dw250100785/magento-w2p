(function ($) {
  var methods = {
    destroy : function () {
      $container = this.data('power-crop-container')

      if ($container) {
        $container.remove();
        this.show();
      }
    }
  };

  $.fn.power_crop = function (method) {
    var settings = {
      simple: false,
      data: null,
      crop: function () {},
      stop: function () {}
    };

    if (methods[method])
      return methods[method]
               .apply(this, Array.prototype.slice.call(arguments, 1));
    else if (typeof method === 'object' || ! method)
      $.extend(settings, method);
    else
      $.error('Method ' +  method + ' does not exist on jQuery.power_crop');

    var $image = this.clone()
      .removeAttr('id')
      .removeAttr('class');

    var $image_top = $image.clone()
      .addClass('powercrop-image-top');

    var $container = $image
      .addClass('powercrop-image')
      .wrap('<div class="powercrop-container" />')
      .parent();

    if (settings.simple)
      $container.addClass('simple')

    this.hide().after($container).data('power-crop-container', $container);

    if (!settings.simple) {
      $image.resizable({
        aspectRatio: true,
        handles: 'ne, nw, se, sw',
        resize: function (event, ui) {
          $image_top_wrapper.css({
            width: ui.size.width,
            height: ui.size.height,
            top: ui.position.top - viewport_position.top - 1,
            left: ui.position.left - viewport_position.left - 1 });

          $image_top.css({
            width: ui.size.width,
            height: ui.size.height });

          image_position = $image_wrapper.position();

          invoke_on_event(settings.crop); },
        stop: function (event, ui) {
          image_position = $image_wrapper.position();

          var image_width = Math.round(ui.size.width);
          var image_height = Math.round(ui.size.height);

          $image_top_wrapper.css({
            width: image_width,
            height: image_height,
            top: image_position.top - viewport_position.top - 1,
            left: image_position.left - viewport_position.left - 1 });

          $image_top.css({
            width: image_width,
            height: image_height });

          $image.css({
            width: image_width,
            height: image_height });

          $image_wrapper.css({
            width: image_width,
            height: image_height });

          invoke_on_event(settings.stop); } });

      var $image_wrapper = $image.parent().draggable({
        drag: function (event, ui) {
          $image_top_wrapper.css({
            top: ui.position.top - viewport_position.top - 1,
            left: ui.position.left - viewport_position.left - 1 });

          image_position = ui.position;

          invoke_on_event(settings.crop); },
        stop: function (event, ui) {
          image_position = ui.position;

          invoke_on_event(settings.stop); } });

      $container.css({
        width: $image_wrapper.outerWidth(),
        height: $image_wrapper.outerHeight() });
    } else
      var $image_wrapper = $image;

    var $viewport = $('<div class="powercrop-viewport" />')
      .appendTo($container);

    $('<div class="powercrop-viewport-inner" />')
      .append($image_top)
      .appendTo($viewport);

    $viewport.append('<div class="powercrop-viewport-handle" />');

    $viewport
      .resizable({
        aspectRatio: !settings.simple,
        containment: $container,
        handles: 'ne, nw, se, sw',
        resize: function (event, ui) {
          $image_top_wrapper.css({
            top: image_position.top - ui.position.top - 1,
            left: image_position.left - ui.position.left - 1 });

          viewport_position = $viewport.position();

          invoke_on_event(settings.crop); },
        stop: function (event, ui) {
          viewport_position = $viewport.position();

          $image_top_wrapper.css({
            top: image_position.top - viewport_position.top - 1,
            left: image_position.left - viewport_position.left - 1 });

          invoke_on_event(settings.stop); } })
      .draggable({
        containment: $container,
        handle: 'div.powercrop-viewport-handle',
        drag: function (event, ui) {
          $image_top_wrapper.css({
            top: image_position.top - ui.position.top - 1,
            left: image_position.left - ui.position.left - 1 });

          viewport_position = ui.position;

          invoke_on_event(settings.crop); },
        stop: function (event, ui) {
          viewport_position = ui.position;

          invoke_on_event(settings.stop); } });

    if (!settings.simple) {
      $image_top.resizable({
        aspectRatio: true,
        handles: 'ne, nw, se, sw',
        resize: function (event, ui) {
          $image_wrapper.css({
            width: ui.size.width,
            height: ui.size.height,
            top: ui.position.top + viewport_position.top + 1,
            left: ui.position.left + viewport_position.left + 1 });

          $image.css({
            width: ui.size.width,
            height: ui.size.height });

          invoke_on_event(settings.crop); },
        stop: function (event, ui) {
          var image_top_position = $image_top_wrapper.position();

          var image_width = Math.round(ui.size.width);
          var image_height = Math.round(ui.size.height);

          $image_wrapper.css({
            width: image_width,
            height: image_height,
            top: image_top_position.top + viewport_position.top + 1,
            left: image_top_position.left + viewport_position.left + 1 });

          $image.css({
            width: image_width,
            height: image_height });

          $image_top.css({
            width: image_width,
            height: image_height });

          $image_top_wrapper.css({
            width: image_width,
            height: image_height });

          invoke_on_event(settings.stop); } });

      var $image_top_wrapper = $image_top.parent().draggable({
        drag: function (event, ui) {
          $image_wrapper.css({
            top: viewport_position.top + ui.position.top + 1,
            left: viewport_position.left + ui.position.left + 1 });

          image_position = $image_wrapper.position();

          invoke_on_event(settings.crop); },
        stop: function (event, ui) {
          image_position = $image_wrapper.position();

          invoke_on_event(settings.stop); } });
    } else
      var $image_top_wrapper = $image_top;

    var image_position = null;
    var viewport_position = null;

    update_position(complete_data(settings.data));

    function complete_data (data) {
      var default_data = {
        image: {
          width: $image.width(),
          height: $image.height(),
          position: { top: 0, left: 0 } },
        selection: {
          width: $image.width(),
          height: $image.height(),
          position: { top: 0, left: 0 } } };

     return $.extend(true, {}, default_data, data);
    }

    function update_position (data) {
      $image_wrapper.css({
        width: data.image.width,
        height: data.image.height,
        top: data.image.position.top,
        left: data.image.position.left });

      $image.css({
        width: data.image.width,
        height: data.image.height });

      image_position = data.image.position;

      $viewport.css({
        width: data.selection.width,
        height: data.selection.height,
        top: data.selection.position.top,
        left: data.selection.position.left });

      if (!settings.simple)
        $container.css({
          width: $viewport.outerWidth(),
          height: $viewport.outerHeight() });

      viewport_position = data.selection.position;

      $image_top_wrapper.css({
        width: data.image.width,
        height: data.image.height,
        top: image_position.top - viewport_position.top - 1,
        left: image_position.left - viewport_position.left - 1 });

      $image_top.css({
        width: data.image.width,
        height: data.image.height });
    }

    function invoke_on_event (callback) {
      callback({
        image: {
          width: $image.width(),
          height: $image.height(),
          position: image_position },
        selection: {
          width: $viewport.width(),
          height: $viewport.height(),
          position: viewport_position } });
    }

    return this;
  };
})(jQuery);