"use strict";

var BehaviourCloud = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourCloud.prototype = Object.create(Behaviour.prototype);
BehaviourCloud.prototype.constructor = BehaviourCloud;

BehaviourCloud.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;
};

BehaviourCloud.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if ((go.x + go.width * 0.5) < go.game.camera.x) {
		this.relocate();
    }
};

BehaviourCloud.prototype.relocate = function() {
	var go = this.gameobject;

	var delta = 1 + Math.random();
	go.x += delta * go.game.camera.width;
	go.y = 20 + go.height * 2 + Math.random() * 50;
};
