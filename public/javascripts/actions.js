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
            if(base.options.canvas) {
                base.canvas = $(base.options.canvas).data('arteest.draw');
            }

            // Initialize actions
            base.actionset = [
                {
                    key: '#save',
                    exe: base.save
                },
                {
                    key: '#add',
                    exe: base.add
                }
            ];

            base.setupActions();
        };

        base.setupActions = function() {            
            $(base.actionset).each(function() {
                var action = this;

                base.$el.find(action.key).each(function() {
                    $(this).tooltip({container: 'body'});

                    $(this).click(function() {                        
                        action.exe.call(base, this);
                    });
                });
            });
        };

		base.save = function(context) {
            $('#alerts .error').hide();
            $('#alerts .success').hide();

            var button = context;
            $(button).button('loading');
            
            $.post( "/save", { 
                name: $('#name').val(),
                email: $('#email').val(),
                width: base.canvas.el.width,
                height: base.canvas.el.height,
                strokes: base.canvas.strokes,
                prev: base.canvas.$el.data('prev-id') || null
            }, function(data) {
                if(data.error) {
                    $('#alerts .error .message').html(data.error);
                    $('#alerts .error').show();
                } else {
                    window.location = data.redirect;
                }

                $(button).button('reset');
            }, "json");
		};

        base.add = function(context) {
            $(context).closest('fieldset').remove(); // Hide add button

            // Insert new canvas
            var template = $('#template-canvas').html();
            var container = $(template).appendTo('#canvases');
            var canvas = $(container).find('canvas');
            var prev = $(container).prev().find('canvas').get(0); // Find previous canvas
            
            $(canvas).data('prev-id', $(prev).data('canvas')._id); // Set this prev id to id of previous canvas
            var blankCanvas = $(canvas).arteest_draw({
                width: $(canvas).width(),
                height: $(canvas).height()
            });

            // Store canvas reference
            base.canvas = $(blankCanvas).data('arteest.draw');

            // Reveal Tools
            $('#tools.disabled').removeClass('disabled');

            // Allow form submission
            $('#form').removeClass('disabled');

            // Animate to new canvas
            $('#canvases').animate({ scrollLeft: $(canvas).offset().left }, 'slow');
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