"use strict";

var BehaviourFish = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourFish.prototype = Object.create(Behaviour.prototype);
BehaviourFish.prototype.constructor = BehaviourFish;

BehaviourFish.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	go.enableEvents();

	go.body.data.gravityScale = 0;

	go.body.angle = Math.random() * 360;

	this.delay = 0;

	this.alive = true;
};

BehaviourFish.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if (go.x + go.width < go.game.camera.x) {
		this.relocate();
	}

	go.body.setZeroRotation();

	if (this.alive) {
		if (this.delay < 0) {
			this.computeDirection();

			this.delay = 1000 + Math.random() * 1000;
		} else {
			this.delay -= go.game.time.elapsed;
		}
	} else {
		go.body.angle = 0;
		go.body.velocity.x = 0;
		go.body.velocity.y = -50;

		if (go.y < 275) {
			go.body.velocity.y = 0;
		}
	}
	
};

BehaviourFish.prototype.computeDirection = function() {
	var go = this.gameobject;

	go.body.angle = go.body.angle + (-45 + Math.random() * 90);

	var x = Math.cos(this.degToRad(go.body.angle));
	var y = Math.sin(this.degToRad(go.body.angle));

	var speed = 25 + Math.random() * 25;
	go.body.velocity.x = x * speed;
	go.body.velocity.y = y * speed;
};

BehaviourFish.prototype.relocate = function() {
	var go = this.gameobject;

	this.alive = true;

	go.layer = "fish";
	go.collisionManager.changeGameObjectLayer(go, "fish");

	var delta = 1 + Math.random();
	go.body.x = go.game.camera.x + delta * go.game.camera.width;
	go.body.y = 265 + go.height * 2 + Math.random() * 50;
};

BehaviourFish.prototype.onBeginContact = function(_body2, _shapeA, _shapeB, _equation) {
	var go = this.gameobject;

	if (_body2.sprite.layer === "toxic") {
		go.layer = "default";
		go.collisionManager.changeGameObjectLayer(go, "default");
		this.alive = false;

		go.game.pollinator.dispatch("dead_fish");
	} else {
		go.body.angle = (go.body.angle + 150 + Math.random() * 60) % 360;
		this.computeDirection();
	}
	
};

BehaviourFish.prototype.degToRad = function(_degrees) {
	return Math.PI * _degrees / 180;
};
