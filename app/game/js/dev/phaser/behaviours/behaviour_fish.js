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

	this.delay = 1000 + Math.random() * 1000;
};

BehaviourFish.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if (go.x + go.width < go.game.camera.x) {
		var delta = 1 + Math.random();
		go.body.x = go.game.camera.x + delta * go.game.camera.width;
	}

	go.body.setZeroRotation();

	if (this.delay < 0) {
		this.computeDirection();

		this.delay = 1000 + Math.random() * 1000;
	} else {
		this.delay -= go.game.time.elapsed;
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

BehaviourFish.prototype.onBeginContact = function(_body2, _shapeA, _shapeB, _equation) {
	var go = this.gameobject;

	go.body.angle = (go.body.angle +180) % 360;
	this.computeDirection();
};

BehaviourFish.prototype.degToRad = function(_degrees) {
	return Math.PI * _degrees / 180;
};
