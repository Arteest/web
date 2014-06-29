$(document).ready(function() {
	// Setup all canvases
	var canvases = $('.canvas canvas');
	$(canvases).each(function() {
		$(this).arteest_draw({
			width: $(this).width(), 
			height: $(this).height()
		});
	});

  // Setup actions
	$('#actions').arteest_actions({
		canvas: (canvases.length > 1 ? null : $(canvases).get(0))
	});

	// Alert on Startup
	var error = $(alerts).data('alert-error');
	var success = $(alerts).data('alert-success');
	if(error) {
		$('#alerts .error .message').html(error);
    $('#alerts .error').show();
	} else if(success) {
		$('#alerts .success .message').html(success);
    $('#alerts .success').show();
	}

	// Start scrolling automatically
	setTimeout(function(){
		var canvasesWidth = 0;
		$('#canvases li').each(function() {
			canvasesWidth += $(this).width();
		});

		$('#canvases').animate({ scrollLeft: canvasesWidth }, canvasesWidth);

		var $viewport = $('html, body');
		$viewport.bind("scroll mousedown DOMMouseScroll mousewheel keyup", function(e) {
    	if(e.which > 0 || e.type === "mousedown" || e.type === "mousewheel") {
         $('#canvases').stop();
         $viewport.unbind('scroll mousedown DOMMouseScroll mousewheel keyup');
    	}
		}); 
	}, 500);
});