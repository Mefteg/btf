"use strict";

var BehaviourToxic = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourToxic.prototype = Object.create(Behaviour.prototype);
BehaviourToxic.prototype.constructor = BehaviourToxic;

BehaviourToxic.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;

	this.delay = 2000;
};

BehaviourToxic.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if (go.alive == true) {
		if (this.delay == 0) {
			go.kill();
			
			this.delay = 2000;
		} else {
			this.delay -= go.game.time.elapsed;
			if (this.delay < 0) this.delay = 0;
		}
	}
};
