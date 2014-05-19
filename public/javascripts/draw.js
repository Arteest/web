;(function($) {
    if(!$.arteest) {
        $.arteest = {};
    };

    $.arteest.draw = function(el, options) {
        var base = this;

        base.$el = $(el);
        base.el = el;
        base.$el.data('arteest.draw', base);

        base.init = function() {
            // Extend options
            base.options = $.extend({}, $.arteest.draw.defaultOptions, options);

            // Initialize context variables
            base.context = base.el.getContext('2d');
            base.context.lineJoin = 'round';
            base.context.lineWidth = 10;
            base.context.strokeStyle = '#000';

            // Initialize canvas logic variables
            base.locked = false;
            base.fps = 30;
            base.cursor = {
                draw: 'draw',
                wait: 'wait'
            }

            // Star with a clean canvas
            base.reset();
            base.unlock();
            base.setupMouseEvents();

            // Check for loading errors
            var loadingError =  $('#alerts').data('init-error');
            if(loadingError) {
                $('#alerts .error .message').html(loadingError);
                $('#alerts .error').show();
            }

            // Check if loading a canvas
            if(base.$el.data('init-strokes') != null) {
                base.strokes = base.$el.data('init-strokes').strokes;
                base.play();
            }
        };

        base.setupMouseEvents = function() {
			base.$el.mousedown(function(e) {
                if(base.isLocked()) return;

  				var x = e.pageX - this.offsetLeft;
  				var y = e.pageY - this.offsetTop;

  				base.paint = true;
  				base.addClick(x, y, false);
  				base.redraw();
			});

			base.$el.mousemove(function(e){
                if(base.isLocked()) return;

                var x = e.pageX - this.offsetLeft;
                var y = e.pageY - this.offsetTop;

  				if(base.paint) {
    				base.addClick(x, y, true);
    				base.redraw();
  				}
			});

			base.$el.mouseup(function(e){
  				base.paint = false;
			});

			base.$el.mouseleave(function(e){
  				base.paint = false;
			});
        };

        base.addClick = function(x, y, dragging) {
            base.prev = {x:base.curr.x||x, y:base.curr.y||y, d:base.curr.d||dragging}; // || for first mousedown
            base.curr = {x:x, y:y, d:dragging};
            base.strokes.push({x:x, y:y, d:dragging});
        };

        base.redraw = function() {
            base.context.beginPath();

            if(base.curr.d) {
                // During movement use previous point as start of line
                base.context.moveTo(base.prev.x, base.prev.y);
                base.context.lineTo(base.curr.x, base.curr.y);
            } else {
                // On mousedown use current point as start of line (-1 pixel)
                base.context.moveTo(base.curr.x-1, base.curr.y-1);
                base.context.lineTo(base.curr.x, base.curr.y);
            }

            base.context.closePath();
            base.context.stroke();
		};

        base.lock = function() {
            base.locked = true;
            base.$el.removeClass(base.cursor.draw);
            base.$el.addClass(base.cursor.wait);
        }

        base.unlock = function() {
            base.locked = false;
            base.$el.removeClass(base.cursor.wait);
            base.$el.addClass(base.cursor.draw);            
        }

        base.isLocked = function() {
            return base.locked;
        }        

        base.reset = function() {
            base.paint = false;
            base.prev = {x:null, y:null, d:null};
            base.curr = {x:null, y:null, d:null};
            base.strokes = new Array();
        }        

		base.clear = function() {
            base.context.clearRect(0, 0, canvas.width, canvas.height);
            base.context.beginPath();
            base.context.closePath();
		};

        base.play = function() {
            if(base.isLocked()) return;
            if(!base.strokes) return;

            base.lock();
            base.clear();

            var i = 0;

            var interval = setInterval(function(){
                if(i >= base.strokes.length) {
                    clearInterval(interval);
                    base.unlock();
                } else {
                    if(base.strokes[i].d.toString() === 'true') {
                        base.prev = {x:base.strokes[i-1].x, y:base.strokes[i-1].y, d:base.strokes[i-1].d};
                        base.curr = {x:base.strokes[i].x, y:base.strokes[i].y, d:base.strokes[i].d};
                    } else {
                        base.prev = {x:base.strokes[i].x-1, y:base.strokes[i].y-1, d:base.strokes[i].d};
                        base.curr = {x:base.strokes[i].x, y:base.strokes[i].y, d:base.strokes[i].d};
                    }

                    base.redraw();                    
                }

                i++;
            }, 1000 / base.fps);   
        }

        base.init();
    };

    $.arteest.draw.defaultOptions = {
        width: 300,
        height: 300,
        context: null,
        tools: null
    };

    $.fn.arteest_draw = function(options) {
        return this.each(function() {
            (new $.arteest.draw(this, options));
        });
    };
})(jQuery);