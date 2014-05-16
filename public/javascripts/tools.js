;(function($) {
    if(!$.arteest) {
        $.arteest = {};
    };

    $.arteest.tools = function(el, options) {
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.$el.data('arteest.tools', base);

        base.init = function() {
            // Extend options
            base.options = $.extend({}, $.arteest.tools.defaultOptions, options);

            // Store canvas reference
            base.canvas = $(base.options.canvas).data('arteest.draw');

            // Initialize tools
            base.toolset = [
                {
                    key: '#tool-clear',
                    exe: base.clear
                },
                {
                    key: '#tool-play',
                    exe: base.play
                }
            ];

            base.setupTools();
        };

        base.setupTools = function() {
            $(base.toolset).each(function() {
                var tool = this;

                base.$el.find(tool.key).each(function() {
                    $(this).click(function() {                        
                        tool.exe.call(base);
                    });
                });
            });
        };

		base.clear = function() {
            base.canvas.reset();
            base.canvas.clear();
		};

        base.play = function() {
            base.canvas.play();
        }

        base.init();
    };

    $.arteest.tools.defaultOptions = {
        canvas: null
    };

    $.fn.arteest_tools = function(options) {
        return this.each(function() {
            (new $.arteest.tools(this, options));
        });
    };
})(jQuery);