"use strict";

var BootState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Boot", this, false);
};

BootState.prototype = Object.create(Phaser.State.prototype);
BootState.prototype.constructor = BootState;

BootState.prototype.preload = function() {
	// Boot
	this.game.stage.backgroundColor = "#007ef4";
	this.game.load.spritesheet('jetski', 'assets/images/jetski.png', 60, 32);

}

BootState.prototype.create = function() {
	this.game.plugins.add(Phaser.Plugin.Pollinator);
	this.game.state.start("Loading");	
}

BootState.prototype.update = function() {
}

BootState.prototype.render = function() {
}
