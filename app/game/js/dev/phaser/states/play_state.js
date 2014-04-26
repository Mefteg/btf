"use strict";

var PLAYER;
var BG;

var PlayState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Play", this, false);
};

PlayState.prototype = Object.create(Phaser.State.prototype);
PlayState.prototype.constructor = PlayState;

PlayState.prototype.preload = function() {

};

PlayState.prototype.create = function() {
	// SETTINGS

	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.gravity.y = 9.81 * 10;

	this.game.world.setBounds(null);

	// GAMEOBJECTS

	this.camera = new GameObject(this.game, 0, 0);

	this.sea = new Array();
	for (var i = 0; i < 3; i++) {
		var sprite = new GameObject(this.game, 0, 0, 'sea');
		sprite.x = this.game.camera.width * (i + 1) * 0.5;
		sprite.y = 265;
		this.game.add.existing(sprite);

		this.game.physics.p2.enable(sprite);
		sprite.body.static = true;
		sprite.body.setRectangle(sprite.width, 10, 0, sprite.height - 9, 0);

		this.sea.push(sprite);
	};

	this.jetski = new GameObject(this.game, 0, 0, 'jetski');
	this.jetski.name = "jetski";
	this.jetski.x = this.jetski.width * 0.5 + 20;
	this.jetski.y = this.sea[0].y - (this.jetski.height + 10);
	this.game.add.existing(this.jetski);
	this.game.physics.p2.enable(this.jetski);

	this.txtPlay = this.game.add.bitmapText(200, 100, 'btf_font','PLAY', 64);
	this.txtPlay.inputEnabled = true;

	// BEHAVIOURS
	var bCamera = new BehaviourCamera(this.camera, {follow: "jetski"});
	bCamera.create();
	this.jetski.addBehaviour(bCamera);

	var bJetski = new BehaviourJetski(this.jetski);
	bJetski.create();
	this.jetski.addBehaviour(bJetski);
};

PlayState.prototype.update = function() {
	if (	this.txtPlay.input.justPressed()
		||	this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
		||	this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
		this.txtPlay.destroy();

		this.game.pollinator.dispatch("go");
	}
};
