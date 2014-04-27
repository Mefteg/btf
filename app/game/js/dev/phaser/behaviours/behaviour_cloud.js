"use strict";

var BehaviourCloud = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourCloud.prototype = Object.create(Behaviour.prototype);
BehaviourCloud.prototype.constructor = BehaviourCloud;

BehaviourCloud.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	this.speed = 0.3 + Math.random() * 0.3;

	this.deltaY = 2.5 + Math.random() * 5;

	var self = this;
	setTimeout(function() {
		self.goDown();
	}, Math.random() * 1000);
};

BehaviourCloud.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	go.x += -this.speed;

	if ((go.x + go.width * 0.5) < go.game.camera.x) {
		this.relocate();
    }
};

BehaviourCloud.prototype.goDown = function() {
	var go = this.gameobject;
	if (go.game) {
		this.tween = go.game.add.tween(go);
		this.tween.to({y: (go.y + this.deltaY)}, 1500, Phaser.Easing.Sinusoidal.InOut);
		this.tween.onComplete.add(this.goUp, this);
		this.tween.start();
	}
};

BehaviourCloud.prototype.goUp = function() {
	var go = this.gameobject;
	if (go.game) {
		this.tween = go.game.add.tween(go);
		this.tween.to({y: (go.y - this.deltaY)}, 1500, Phaser.Easing.Sinusoidal.InOut);
		this.tween.onComplete.add(this.goDown, this);
		this.tween.start();
	}
};

BehaviourCloud.prototype.relocate = function() {
	var go = this.gameobject;

	var delta = 1 + Math.random();
	go.x += delta * go.game.camera.width;
	go.y = 20 + go.height * 2 + Math.random() * 50;
};
