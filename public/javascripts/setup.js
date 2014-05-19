$(document).ready(function() {
	// Canvas
	var canvas = $('#canvas');
	$(canvas).arteest_draw({
		width: $(canvas).width(), 
		height: $(canvas.height())
	});

	// Tools
	$('#tools').arteest_tools({
		canvas: canvas
	});

	// Actions
	$('#actions').arteest_actions({
		canvas: canvas
	});
});