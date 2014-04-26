"use strict";

var LandingState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Loading", this, false);
};

LandingState.prototype = Object.create(Phaser.State.prototype);
LandingState.prototype.constructor = LandingState;

LandingState.prototype.preload = function() {
}

LandingState.prototype.create = function() {
	this.jetski = new GameObject(this.game, 0, 0, 'jetski');
	this.jetski.x = this.game.camera.width * 0.5;
	this.jetski.y = this.game.camera.height * 0.5;
	this.game.add.existing(this.jetski);
}

LandingState.prototype.update = function() {
}

LandingState.prototype.render = function() {
}
