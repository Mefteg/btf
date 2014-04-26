"use strict";

var BehaviourSea = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourSea.prototype = Object.create(Behaviour.prototype);
BehaviourSea.prototype.constructor = BehaviourSea;

BehaviourSea.prototype.create = function(_seas, _index) {
	Behaviour.prototype.create.call(this);

	this.seas = _seas;
	this.index = _index;
};

BehaviourSea.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if ((go.x + go.width * 0.5) < go.game.camera.x) {
		var prevIndex = this.index - 1;
		if (this.index == 0) {
			prevIndex = 2;
		}

		go.body.x = this.seas[prevIndex].x + go.width;
		go.body.setRectangle(go.width, 10, 0, go.height - 9, 0);
		go.collisionManager.changeGameObjectLayer(go, go.layer);
    }
};
