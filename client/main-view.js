var $ = require('jquery');
var View = require('ampersand-view');
var templates = require('./templates');
var drawObjects = require('./draw-objects');

module.exports = View.extend({
	template: templates.body,
	autoRender: true,
	render: function () {
		this.renderWithTemplate();

		// TODO: resize handler
		var $canvasContainer = $('.canvas-container');
		var $canvas = $('[role="main-canvas"]');
		// canvas is funky and wants width/height attributes on the el rather than css.
		$canvas.attr('width', $canvasContainer.width()).attr('height', $canvasContainer.height());
		console.log('canvas size is ' + $canvas.width() + ' x ' + $canvas.height());

		// testing
		var cx = $canvas.width() / 2;
		var cy = $canvas.height() / 2;
		var radius = 10;
		var thetaDeg = 0;
		var thrusters = false;

		drawObjects.drawShip($canvas, cx, cy, radius, thetaDeg, thrusters);

		return this;
	}
});
