"use strict";

var BehaviourKicker = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourKicker.prototype = Object.create(Behaviour.prototype);
BehaviourKicker.prototype.constructor = BehaviourKicker;

BehaviourKicker.prototype.create = function(_index) {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	var delta = _index + Math.random();
	go.x = delta * go.game.camera.width;
	this.relocate();
};

BehaviourKicker.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if ((go.x + go.width * 0.5) < go.game.camera.x) {
		this.relocate();
    }
};

BehaviourKicker.prototype.relocate = function() {
	var go = this.gameobject;

	var delta = 2 + Math.random() * 2;
	go.body.x = go.body.x + delta * go.game.camera.width;
	go.body.y = 245 + (-10 + Math.random() * 20);

	go.body.clearShapes();

	go.body.addPolygon({}, [
		[0, 32],
		[64, 32],
		[64, 0]
	]);

	go.body.data.shapeOffsets[0][0] = -0.5;
	go.body.data.shapeOffsets[0][1] = -0.2;

	go.collisionManager.changeGameObjectLayer(go, go.layer);
};
