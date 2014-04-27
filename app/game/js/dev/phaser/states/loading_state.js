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

	this.game.load.bitmapFont("btf_font", "assets/fonts/btf.png", "assets/fonts/btf.fnt");

	this.game.load.spritesheet("sea", "assets/images/sea.png", 640, 20);
	this.game.load.spritesheet("kicker", "assets/images/kicker.png", 64, 32);
	this.game.load.spritesheet("gazoline", "assets/images/gazoline.png", 26, 28);
	this.game.load.spritesheet("fish", "assets/images/fish.png", 32, 22);
	this.game.load.spritesheet("toxic", "assets/images/toxic.png", 12, 12);
	this.game.load.spritesheet("guiframebar", "assets/images/guiframebar.png", 216, 28);
	this.game.load.spritesheet("guibar", "assets/images/guibar.png", 200, 12);

	this.game.load.physics('kickerdata', 'assets/physics_data/kickerdata.json');
};

LoadingState.prototype.create = function() {
	this.game.state.start("Play");
};

LoadingState.prototype.update = function() {

};

LoadingState.prototype.render = function() {

};
