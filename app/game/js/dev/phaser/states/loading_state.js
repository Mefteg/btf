"use strict";

var LoadingState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Loading", this, false);
};

LoadingState.prototype = Object.create(Phaser.State.prototype);
LoadingState.prototype.constructor = LoadingState;

LoadingState.prototype.preload = function() {
	this.jetski = new GameObject(this.game, 0, 0, 'jetski');
	this.jetski.x = this.game.camera.width * 0.5;
	this.jetski.y = this.game.camera.height * 0.5;
	this.game.add.existing(this.jetski);

	this.game.load.spritesheet("sea", "assets/images/sea.png", 640, 20);
	this.game.load.spritesheet("gazoline", "assets/images/gazoline.png", 26, 28);
	this.game.load.spritesheet("fish", "assets/images/fish.png", 32, 22);
}

LoadingState.prototype.create = function() {
	this.game.state.start("Landing");
	//this.game.state.start("Play);
}

LoadingState.prototype.update = function() {
}

LoadingState.prototype.render = function() {
}
