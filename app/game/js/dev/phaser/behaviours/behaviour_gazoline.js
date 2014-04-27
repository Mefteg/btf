"use strict";

var BehaviourGazoline = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourGazoline.prototype = Object.create(Behaviour.prototype);
BehaviourGazoline.prototype.constructor = BehaviourGazoline;

BehaviourGazoline.prototype.create = function(_jetski) {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	this.jetski = _jetski;

	this.deltaY = 35;

	this.goDown();
};

BehaviourGazoline.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if (this.jetski) {
		// if the jetski grabs the gasoline
		if (go.overlap(this.jetski)) {
			go.game.pollinator.dispatch("refill");

			this.relocate();
		}

		// if the jetski misses the gasoline
		if ((go.x + go.width) < go.game.camera.x) {
			this.relocate();
		}
	}
};

BehaviourGazoline.prototype.goDown = function() {
	var go = this.gameobject;
	if (go.game) {
		this.tween = go.game.add.tween(go);
		this.tween.to({y: (go.y + this.deltaY)}, 1500, Phaser.Easing.Sinusoidal.InOut);
		this.tween.onComplete.add(this.goUp, this);
		this.tween.start();
	}
};

BehaviourGazoline.prototype.goUp = function() {
	var go = this.gameobject;
	if (go.game) {
		this.tween = go.game.add.tween(go);
		this.tween.to({y: (go.y - this.deltaY)}, 1500, Phaser.Easing.Sinusoidal.InOut);
		this.tween.onComplete.add(this.goDown, this);
		this.tween.start();
	}
};

BehaviourGazoline.prototype.relocate = function() {
	var go = this.gameobject;
	go.x += go.game.camera.width * (3 + 2 * Math.random());
};
