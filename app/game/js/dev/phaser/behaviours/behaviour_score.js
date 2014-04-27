"use strict";

var BehaviourScore = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourScore.prototype = Object.create(Behaviour.prototype);
BehaviourScore.prototype.constructor = BehaviourScore;

BehaviourScore.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	go.score = 0;
	go.bonus = 0;

	go.deadFishes = 0;

	go.game.pollinator.on("bonus", this.addBonus, this);
	go.game.pollinator.on("dead_fish", this.addDeadFish, this);

	if (this.args) {
		if (this.args.bitmapText) {
			this.bitmapText = GameObject.FindByName(this.gameobject.game.world, this.args.bitmapText);
		}
	}
};

BehaviourScore.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	go.score = Math.floor(go.game.camera.x * 0.1) + go.bonus;

	if (this.bitmapText) {
		this.bitmapText.text = "Score " + go.score;
	}
};

BehaviourScore.prototype.addBonus = function(_args) {
	var go = this.gameobject;

	go.bonus += _args.bonus;
};

BehaviourScore.prototype.addDeadFish = function(_args) {
	var go = this.gameobject;

	go.deadFishes++;
};
