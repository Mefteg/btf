"use strict";

var BehaviourFish = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourFish.prototype = Object.create(Behaviour.prototype);
BehaviourFish.prototype.constructor = BehaviourFish;

BehaviourFish.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	go.body.data.gravityScale = 0;

	go.body.angle = Math.random() * 360;

	this.delay = 1000 + Math.random() * 1000;
};

BehaviourFish.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	go.body.setZeroRotation();

	if (this.delay < 0) {
		go.body.angle = go.body.angle + (-45 + Math.random() * 90);

		var x = Math.cos(this.degToRad(go.body.angle));
		var y = Math.sin(this.degToRad(go.body.angle));

		var speed = 20 + Math.random() * 20;
		go.body.velocity.x = x * speed;
		go.body.velocity.y = y * speed;

		this.delay = 1000 + Math.random * 1000;
	} else {
		this.delay -= go.game.time.elapsed;
	}
};

BehaviourFish.prototype.degToRad = function(_degrees) {
	return Math.PI * _degrees / 180;
};
