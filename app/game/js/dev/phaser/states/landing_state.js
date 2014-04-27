"use strict";

var LandingState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Landing", this, false);
};

LandingState.prototype = Object.create(Phaser.State.prototype);
LandingState.prototype.constructor = LandingState;

LandingState.prototype.init = function(_args) {
};

LandingState.prototype.preload = function() {

};

LandingState.prototype.create = function() {
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

LandingState.prototype.update = function() {
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

LandingState.prototype.render = function() {

};

LandingState.prototype.createGameObjects = function() {
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

	// gui title
	var textGuiTitle = "Beneath The\nFun";
	this.guiTitle = this.game.add.bitmapText(0, 0, 'btf_font', textGuiTitle, 64);
	this.guiTitle.align = 'center';
	this.guiTitle.fixedToCamera = true;
	this.guiTitle.cameraOffset.x = 80;
	this.guiTitle.cameraOffset.y = 60;
	this.game.add.existing(this.guiTitle);

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

LandingState.prototype.createBehaviours = function() {
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

	// clouds
	for (var i = 0; i < this.clouds.length; i++) {
		var cloud = this.clouds.getAt(i);

		var bCloud = new BehaviourCloud(cloud);
		bCloud.create();
		cloud.addBehaviour(bCloud);
	};
};

LandingState.prototype.goFullscreen = function() {
	this.game.scale.startFullScreen(false);
};
