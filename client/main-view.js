var $ = require('jquery');
var View = require('ampersand-view');
var templates = require('./templates');
var Game = require('./game');

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
		window.app.canvasSize = {width: $canvas.width(), height: $canvas.height()};
		console.log('canvas size is ' + window.app.canvasSize.width + ' x ' + window.app.canvasSize.height);

		var game = new Game($canvas);
		game.start();

		return this;
	}
});
