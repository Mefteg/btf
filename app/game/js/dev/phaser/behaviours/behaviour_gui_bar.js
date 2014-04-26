"use strict";

var BehaviourGUIBar = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourGUIBar.prototype = Object.create(Behaviour.prototype);
BehaviourGUIBar.prototype.constructor = BehaviourGUIBar;

BehaviourGUIBar.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;
	this.initialX = go.cameraOffset.x;
	this.initialWidth = go.width;

	go.game.pollinator.on("updateTank", this.resize, this);
};

BehaviourGUIBar.prototype.update = function() {
	Behaviour.prototype.update.call(this);
};

BehaviourGUIBar.prototype.resize = function(_args) {
	var go = this.gameobject;

	var delta = Math.round(this.initialWidth * _args.tank * 0.01);
	var rect = new Phaser.Rectangle(0, 0, delta, go.height);
	go.crop(rect);
	go.cameraOffset.x = this.initialX - 100 + delta * 0.5;
};
