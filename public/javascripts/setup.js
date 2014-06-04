$(document).ready(function() {
	// Canvas
	var canvases = $('.canvas canvas');
	$(canvases).each(function() {
		$(this).arteest_draw({
			width: $(this).width(), 
			height: $(this).height()
		});
	});

	// Add to drawing on click
	$('#add').click(function() {
		$(this).remove(); // Hide this button

		var template = $('.canvas canvas.template'); // Find template
		var prev = $(template).parent().prev().find('canvas').get(0); // Find previous canvas
		$(template).data('prev-id', $(prev).data('canvas')._id); // Set this prev id to id of previous canvas
		$(template).removeClass('template'); // Show this canvas
	});
});