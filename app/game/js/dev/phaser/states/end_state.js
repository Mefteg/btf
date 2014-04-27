"use strict";

var EndState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("End", this, false);
};

EndState.prototype = Object.create(Phaser.State.prototype);
EndState.prototype.constructor = EndState;

EndState.prototype.init = function(_args) {
	this.score = _args.score;
	this.deadFishes = _args.deadFishes;
};

EndState.prototype.preload = function() {

};

EndState.prototype.create = function() {
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

EndState.prototype.update = function() {
	if (	this.go.input.justPressed(0)
		||	this.go.input.justPressed(1)) {

		this.game.state.start("Play", true, false, {
			go: true
		});
	}

	if (	this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)
		||	this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {

		this.game.state.start("Play", true, false, {
			go: true
		});
	}
};

EndState.prototype.render = function() {

};

EndState.prototype.createGameObjects = function() {
	this.sea = new GameObject(this.game, 0, 0, 'sea');
	this.sea.layer = "obstacle";
	this.sea.x = this.game.camera.width * 0.5;
	this.sea.y = 265;
	this.game.add.existing(this.sea);

	// fishes
	this.fishes = this.game.add.group();
	for (var i=0; i<this.deadFishes; i++) {
		var fish = new GameObject(this.game, 0, 0, 'fish');
		fish.layer = "fish";

		fish.x = Math.random() * this.game.camera.width;
		fish.y = 265 + fish.height * 2 + Math.random() * 50;

		this.game.physics.p2.enable(fish);
		this.collisionManager.addGameObject(fish);

		this.fishes.add(fish);
	}

	// clouds
	this.clouds = this.game.add.group();
	for (var i=0; i<5; i++) {
		var cloud = null;
		if (Math.random() < 0.5) {
			cloud = new GameObject(this.game, 0, 0, 'cloud1');
		} else {
			cloud = new GameObject(this.game, 0, 0, 'cloud2');
		}

		cloud.x = Math.random() * 2 * this.game.camera.width;
		cloud.y = 20 + cloud.height * 2 + Math.random() * 50;

		this.clouds.add(cloud);
	}

	// gui score
	var textGuiScore = "You achieve to make a score of";
	this.guiScore = this.game.add.bitmapText(0, 0, 'btf_font', textGuiScore, 28);
	this.guiScore.fixedToCamera = true;
	this.guiScore.cameraOffset.x = 50;
	this.guiScore.cameraOffset.y = 40;
	this.game.add.existing(this.guiScore);

	// gui points
	var textGuiPoints = "" + this.score;
	this.guiPoints = this.game.add.bitmapText(0, 0, 'btf_font', textGuiPoints, 48);
	this.guiPoints.fixedToCamera = true;
	this.guiPoints.cameraOffset.x = 240;
	this.guiPoints.cameraOffset.y = 80;
	this.game.add.existing(this.guiPoints);

	// gui dead fishes
	var textGuiDeadFishes = "And you kill " + this.deadFishes + " fishes";
	if (this.deadFishes <= 1) {
		textGuiDeadFishes = "And you kill " + this.deadFishes + " fish";
	}
	this.guiDeadFishes = this.game.add.bitmapText(0, 0, 'btf_font', textGuiDeadFishes, 28);
	this.guiDeadFishes.name = "guiDeadFishes";
	this.guiDeadFishes.fixedToCamera = true;
	this.guiDeadFishes.cameraOffset.x = 140;
	this.guiDeadFishes.cameraOffset.y = 150;
	this.game.add.existing(this.guiDeadFishes);

	// gui fun
	var textGuiFun = "so fun, right?!";
	this.guiFun = this.game.add.bitmapText(0, 0, 'btf_font', textGuiFun, 24);
	this.guiFun.name = "guiFun";
	this.guiFun.fixedToCamera = true;
	this.guiFun.cameraOffset.x = 200;
	this.guiFun.cameraOffset.y = 190;
	this.game.add.existing(this.guiFun);

	// button fullscreen
	this.btnFullscreen = this.game.add.button(
		0, 0, 'fullscreen', this.goFullscreen, this, 0, 0, 0);
	this.btnFullscreen.fixedToCamera = true;
	this.btnFullscreen.cameraOffset.x = 10;
	this.btnFullscreen.cameraOffset.y =
		this.game.camera.height - (this.btnFullscreen.height + 10);

	// go
	this.go = new GameObject(this.game, 0, 0);
	this.go.x = this.game.camera.width * 0.5;
	this.go.y = (this.btnFullscreen.cameraOffset.y - 10) * 0.5;
	this.go.width = this.game.camera.width;
	this.go.height = this.btnFullscreen.cameraOffset.y - 10;
	this.go.inputEnabled = true;
	this.game.add.existing(this.go);
};

EndState.prototype.createBehaviours = function() {
	// fishes
	for (var i = 0; i < this.fishes.length; i++) {
		var fish = this.fishes.getAt(i);

		var bFish = new BehaviourFish(fish);
		bFish.create();
		bFish.alive = false;
		fish.addBehaviour(bFish);
	};

	// clouds
	for (var i = 0; i < this.clouds.length; i++) {
		var cloud = this.clouds.getAt(i);

		var bCloud = new BehaviourCloud(cloud);
		bCloud.create();
		cloud.addBehaviour(bCloud);
	};
};

EndState.prototype.goFullscreen = function() {
	this.game.scale.startFullScreen(false);
};
