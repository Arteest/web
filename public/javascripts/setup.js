$(document).ready(function() {
	// Setup all canvases
	var canvases = $('.canvas canvas');
	$(canvases).each(function() {
		$(this).arteest_draw({
			width: $(this).width(), 
			height: $(this).height()
		});
	});

	// Add to polyptych on click
	$('#add').click(function() {
		$(this).remove(); // Hide add button

		// Insert new canvas
		var template = $('#template-canvas').html();
		var container = $(template).appendTo('#canvases');
		var canvas = $(container).find('canvas');
		var prev = $(container).prev().find('canvas').get(0); // Find previous canvas
		
		$(canvas).data('prev-id', $(prev).data('canvas')._id); // Set this prev id to id of previous canvas
		$(canvas).arteest_draw({
			width: $(canvas).width(),
			height: $(canvas).height()
		});

		// Reveal Tools
		$('#tools .disabled').removeClass('disabled');

		// Animate to new canvas
		$('#canvases').animate({ scrollLeft: $(canvas).offset().left }, 'slow');
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
});