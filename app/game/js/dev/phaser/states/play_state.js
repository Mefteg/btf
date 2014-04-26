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

	this.game.pollinator.destroy();
	this.game.plugins.add(Phaser.Plugin.Pollinator);
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.gravity.y = 9.81 * 10;
	this.collisionManager = new CollisionManager(this.game);

	this.game.world.setBounds(null);

	// GAMEOBJECTS

	this.createGameObjects();

	// BEHAVIOURS

	this.createBehaviours();
};

PlayState.prototype.update = function() {
	if (	this.txtPlay.input.justPressed()
		||	this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
		||	this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
		this.txtPlay.destroy();

		this.game.pollinator.dispatch("go");
	}
};

PlayState.prototype.createGameObjects = function() {
	// camera
	this.camera = new GameObject(this.game, 0, 0);
	this.game.add.existing(this.camera);

	// score
	this.score = new GameObject(this.game, 0, 0);
	this.game.add.existing(this.score);

	// seas
	this.seas = new Array();
	for (var i = 0; i < 3; i++) {
		var sea = new GameObject(this.game, 0, 0, 'sea');
		sea.layer = "obstacle";
		sea.x = this.game.camera.width * (i + 0.5);
		sea.y = 265;
		this.game.add.existing(sea);

		this.game.physics.p2.enable(sea);
		this.collisionManager.addGameObject(sea);
		sea.body.static = true;
		sea.body.setRectangle(sea.width, 10, 0, sea.height - 9, 0);

		this.seas.push(sea);
	};

	// fishes
	this.fishes = this.game.add.group();
	for (var i=0; i<5; i++) {
		var fish = new GameObject(this.game, 0, 0, 'fish');
		fish.layer = "fish";
		fish.x = Math.random() * this.game.camera.width;
		fish.y = 265 + 10 + Math.random() * 50;

		this.game.physics.p2.enable(fish);
		this.collisionManager.addGameObject(fish);

		this.fishes.add(fish);
	}

	// jetski
	this.jetski = new GameObject(this.game, 0, 0, 'jetski');
	this.jetski.name = "jetski";
	this.jetski.layer = "jetski";
	this.jetski.x = this.jetski.width * 0.5 + 20;
	this.jetski.y = this.seas[0].y - (this.jetski.height + 10);
	this.game.add.existing(this.jetski);
	this.game.physics.p2.enable(this.jetski);
	this.collisionManager.addGameObject(this.jetski);

	this.gazoline = new GameObject(this.game, 0, 0, 'gazoline');
	this.gazoline.x = this.game.camera.width * 0.75;
	this.gazoline.y = this.seas[0].y - (this.seas[0].height * 0.5);
	this.game.add.existing(this.gazoline);

	// gui gazoline
	this.guiGazoline = new GameObject(this.game, 0, 0, 'gazoline');
	this.guiGazoline.fixedToCamera = true;
	this.guiGazoline.cameraOffset.x = 10 + this.guiGazoline.width * 0.5;
	this.guiGazoline.cameraOffset.y = 10 + this.guiGazoline.height * 0.5;
	this.game.add.existing(this.guiGazoline);

	// gui frame bar
	this.guiFrameBar = new GameObject(this.game, 0, 0, 'guiframebar');
	this.guiFrameBar.fixedToCamera = true;
	this.guiFrameBar.cameraOffset.x = 40 + this.guiFrameBar.width * 0.5;
	this.guiFrameBar.cameraOffset.y = 10 + this.guiFrameBar.height * 0.5;
	this.game.add.existing(this.guiFrameBar);

	// gui bar
	this.guiBar = new GameObject(this.game, 0, 0, 'guibar');
	this.guiBar.fixedToCamera = true;
	this.guiBar.cameraOffset.x = 48 + this.guiBar.width * 0.5;
	this.guiBar.cameraOffset.y = 18 + this.guiBar.height * 0.5;
	this.game.add.existing(this.guiBar);

	// gui score
	this.guiScore = this.game.add.bitmapText(0, 0, 'btf_font', "Score 10000", 24);
	this.guiScore.name = "guiScore";
	this.guiScore.fixedToCamera = true;
	this.guiScore.cameraOffset.x = this.game.camera.width - 250;
	this.guiScore.cameraOffset.y = 12;
	this.game.add.existing(this.guiScore);

	// text play
	this.txtPlay = this.game.add.bitmapText(0, 0, 'btf_font', "PLAY", 64);
	this.txtPlay.fixedToCamera = true;
	this.txtPlay.cameraOffset.x = this.game.camera.width * 0.5 - 125;
	this.txtPlay.cameraOffset.y = this.game.camera.height * 0.5 - 50;
	this.txtPlay.inputEnabled = true;
};

PlayState.prototype.createBehaviours = function() {
	// camera
	var bCamera = new BehaviourCamera(this.camera, {follow: "jetski"});
	bCamera.create();
	this.camera.addBehaviour(bCamera);

	// score
	var bScore = new BehaviourScore(this.score, {bitmapText: "guiScore"});
	bScore.create();
	this.score.addBehaviour(bScore);

	// seas
	for (var i = 0; i < this.seas.length; i++) {
		var sea = this.seas[i];

		var bSea = new BehaviourSea(sea);
		bSea.create(this.seas, i);
		sea.addBehaviour(bSea);
	};

	// fishes
	for (var i = 0; i < this.fishes.length; i++) {
		var fish = this.fishes.getAt(i);

		var bFish = new BehaviourFish(fish);
		bFish.create();
		fish.addBehaviour(bFish);
	};

	// jetski
	var bJetski = new BehaviourJetski(this.jetski);
	bJetski.create();
	this.jetski.addBehaviour(bJetski);

	// gazoline
	var bGazoline = new BehaviourGazoline(this.gazoline);
	bGazoline.create(this.jetski);
	this.gazoline.addBehaviour(bGazoline);

	// gui bar
	var bGuiBar = new BehaviourGUIBar(this.guiBar);
	bGuiBar.create(this.jetski);
	this.guiBar.addBehaviour(bGuiBar);
};
