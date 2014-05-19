;(function($) {
    if(!$.arteest) {
        $.arteest = {};
    };

    $.arteest.actions = function(el, options) {
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.$el.data('arteest.actions', base);

        base.init = function() {
            // Extend options
            base.options = $.extend({}, $.arteest.actions.defaultOptions, options);

            // Store canvas reference
            base.canvas = $(base.options.canvas).data('arteest.draw');

            // Initialize actions
            base.actionset = [
                {
                    key: '#save',
                    exe: base.save
                }
            ];

            base.setupActions();
        };

        base.setupActions = function() {
            $(base.actionset).each(function() {
                var tool = this;

                base.$el.find(tool.key).each(function() {
                    $(this).click(function() {                        
                        tool.exe.call(base);
                    });
                });
            });
        };

		base.save = function() {
            $('#alerts .error').hide();
            $('#alerts .success').hide();

            $.post( "/save", { 
                name: $('#name').val(),
                strokes: base.canvas.strokes 
            }, function(data) {
                if(data.error) {
                    $('#alerts .error .message').html(data.error);
                    $('#alerts .error').show();
                } else if(data.success) {
                    $('#alerts .success .message').html(data.link);
                    $('#alerts .success').show();
                } else {}
            }, "json");
		};

        base.init();
    };

    $.arteest.actions.defaultOptions = {
        canvas: null
    };

    $.fn.arteest_actions = function(options) {
        return this.each(function() {
            (new $.arteest.actions(this, options));
        });
    };
})(jQuery);