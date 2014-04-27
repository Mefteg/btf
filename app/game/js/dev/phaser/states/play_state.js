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

	this.game.pollinator.on("gameover", this.gameOver, this);

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
		sea.body.static = true;
		sea.body.setRectangle(sea.width, 10, 0, sea.height - 9, 0);
		this.collisionManager.addGameObject(sea);

		this.seas.push(sea);
	};

	// undergrounds
	this.undergrounds = new Array();
	for (var i = 0; i < 3; i++) {
		var underground = new GameObject(this.game, 0, 0, 'sea');
		underground.layer = "obstacle";
		underground.x = this.game.camera.width * (i + 0.5);
		underground.y = this.game.camera.height + underground.height;
		this.game.add.existing(underground);

		this.game.physics.p2.enable(underground);
		underground.body.static = true;
		underground.body.setRectangle(underground.width, 10, 0, underground.height - 9, 0);
		this.collisionManager.addGameObject(underground);

		this.undergrounds.push(underground);
	};

	// kickers
	this.kickers = this.game.add.group();
	for (var i = 0; i < 1; i++) {
		var kicker = new GameObject(this.game, 0, 0, 'kicker');
		kicker.layer = "obstacle";
		kicker.x = this.game.camera.width * (i + 0.5);
		kicker.y = this.seas[0].y - 10 + 100;
		this.game.add.existing(kicker);

		this.game.physics.p2.enable(kicker);
		kicker.body.static = true;
		kicker.body.clearShapes();
		kicker.body.loadPolygon('kickerdata', 'kicker');
		
		/*var shape = kicker.body.data.shapes[0];
		console.log(shape);
		shape.vertices[0][0] = -1;
		shape.vertices[0][1] = 1;
		shape.updateTriangles();
		shape.updateArea();
		console.log(shape);*/

		this.collisionManager.addGameObject(kicker);

		kicker.body.debug = true;

		this.kickers.add(kicker);
	};

	// fishes
	this.fishes = this.game.add.group();
	for (var i=0; i<5; i++) {
		var fish = new GameObject(this.game, 0, 0, 'fish');
		fish.layer = "fish";

		fish.x = Math.random() * this.game.camera.width;
		fish.y = 265 + fish.height * 2 + Math.random() * 50;

		this.game.physics.p2.enable(fish);
		this.collisionManager.addGameObject(fish);

		this.fishes.add(fish);
	}

	// toxic emitter
	this.toxicEmitter = new GameObject(this.game, 0, 0);
	this.game.add.existing(this.toxicEmitter);

	// jetski
	this.jetski = new GameObject(this.game, 0, 0, 'jetski');
	this.jetski.name = "jetski";
	this.jetski.layer = "jetski";
	this.jetski.x = 0;
	this.jetski.y = this.seas[0].y - 10;
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

	// undergrounds
	for (var i = 0; i < this.undergrounds.length; i++) {
		var underground = this.undergrounds[i];

		var bSea = new BehaviourSea(underground);
		bSea.create(this.undergrounds, i);
		underground.addBehaviour(bSea);
	};

	// fishes
	for (var i = 0; i < this.fishes.length; i++) {
		var fish = this.fishes.getAt(i);

		var bFish = new BehaviourFish(fish);
		bFish.create();
		fish.addBehaviour(bFish);
	};

	// toxic emitter
	var bToxicEmitter = new BehaviourToxicEmitter(this.toxicEmitter);
	bToxicEmitter.create(this.collisionManager);
	this.toxicEmitter.addBehaviour(bToxicEmitter);

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

PlayState.prototype.gameOver = function() {
	this.game.state.start("Play");
};
