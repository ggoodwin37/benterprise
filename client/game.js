var raf = require('raf');
var Ship = require('./ship');
var Rock = require('./rock');
var KeyHandler = require('./key-handler');
var drawObjects = require('./draw-objects');
var $ = require('jquery');

var constants = require('./constants');

function Game($canvas) {
	this.keyHandler = new KeyHandler($(document));
	this.keyHandler.on('keydown', this.onKeyDown.bind(this));
	this.keyHandler.on('keyup', this.onKeyUp.bind(this));

	this.ctx = $canvas.get(0).getContext('2d');
	this.canvasWidth = $canvas.width();
	this.canvasHeight = $canvas.height();

	this.createShip();
	this.createRocks();

	this.rafHandle = null;
	this.timerTick = this.timerTick.bind(this);
	this.lastTickTime = null;
}

Game.prototype.start = function() {
	this.scheduleTick();
};

Game.prototype.createShip = function() {
	var ship = new Ship();
	ship.x = this.canvasWidth / 2;
	ship.y = this.canvasHeight / 2;
	this.ship = ship;
};

Game.prototype.createRocks = function() {
	var i;
	var thisRock;
	var rockList = [];
	for (i = 0; i < constants.numSmallRocks; ++i) {
		thisRock = new Rock('small');
		thisRock.x = Math.random() * this.canvasWidth;
		thisRock.y = Math.random() * this.canvasHeight;
		rockList.push(thisRock);
	}
	for (i = 0; i < constants.numMediumRocks; ++i) {
		thisRock = new Rock('medium');
		thisRock.x = Math.random() * this.canvasWidth;
		thisRock.y = Math.random() * this.canvasHeight;
		rockList.push(thisRock);
	}
	for (i = 0; i < constants.numLargeRocks; ++i) {
		thisRock = new Rock('large');
		thisRock.x = Math.random() * this.canvasWidth;
		thisRock.y = Math.random() * this.canvasHeight;
		rockList.push(thisRock);
	}
	this.rockList = rockList;
};

Game.prototype.scheduleTick = function() {
	this.rafHandle = raf(this.timerTick);
};

Game.prototype.timerTick = function() {
	if (!this.lastTickTime) {
		this.lastTickTime = Date.now();
		this.scheduleTick();
		return;
	}
	var now = Date.now();

	var deltaMs = now - this.lastTickTime;
	this.lastTickTime = now;

	this.gameLoop(deltaMs);

	this.scheduleTick();
};

Game.prototype.gameLoop = function(deltaMs) {
	var self = this;

	// game logic
	if (this.ship.state == 'alive') {
		this.ship.updateShip(deltaMs);
		this.checkShipRockCollisions();
	} else if (this.ship.state == 'dead') {
		this.ship.deadTime -= deltaMs;
		if (this.ship.deadTime <= 0) {
			this.shipReborn();
		}
	}
	this.rockList.forEach(function(thisRock) {
		thisRock.updateRock(deltaMs);
	});

	// drawing
	drawObjects.clearCtx(this.ctx);
	this.ship.draw(this.ctx);
	this.rockList.forEach(function(thisRock) {
		thisRock.draw(self.ctx);
	});
};

Game.prototype.checkShipRockCollisions = function() {
	var self = this;

	// for now, do a brute-force check. later we can improve this by using a grid or something.
	// also, this doesn't handle collisions around the edges correctly.
	this.rockList.forEach(function(thisRock) {
		var dx = thisRock.x - self.ship.x;
		var dy = thisRock.y - self.ship.y;
		var distSquared = (dx * dx) + (dy * dy);
		var limitSquared = (thisRock.r + self.ship.r) * (thisRock.r + self.ship.r);
		if (distSquared < limitSquared) {
			self.shipHitRock();
			return;
		}
	});
};

Game.prototype.shipHitRock = function() {
	this.ship.state = 'dead';
	this.ship.deadTime = constants.shipDeadTimeMs;
};

Game.prototype.shipReborn = function() {
	this.createShip();
};

Game.prototype.onKeyDown = function(dir) {
	if (dir == 'left') {
		this.ship.turningLeft = true;
	} else if (dir == 'right') {
		this.ship.turningRight = true;
	} else if (dir == 'up') {
		this.ship.thrustersActive = true;
	} else if (dir == 'down') {
		// TODO: shooting
	}
};

Game.prototype.onKeyUp = function(dir) {
	if (dir == 'left') {
		this.ship.turningLeft = false;
	} else if (dir == 'right') {
		this.ship.turningRight = false;
	} else if (dir == 'up') {
		this.ship.thrustersActive = false;
	} else if (dir == 'down') {
	}
};

module.exports = Game;
