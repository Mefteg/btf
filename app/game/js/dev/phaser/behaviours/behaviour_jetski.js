"use strict";

var BehaviourJetski = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourJetski.prototype = Object.create(Behaviour.prototype);
BehaviourJetski.prototype.constructor = BehaviourJetski;

BehaviourJetski.prototype.create = function() {
	Behaviour.prototype.create.call(this);

	var go = this.gameobject;
	this.cursors = go.game.input.keyboard.createCursorKeys();

	go.gazoline = 0;

	go.game.pollinator.on("go", this.go, this);
};

BehaviourJetski.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	if (this.cursors.right.isDown) {
		var usedGazoline = go.game.time.elapsed * 0.001 * 5;
		if (go.gazoline >= usedGazoline) {
			go.gazoline -= usedGazoline;

			var magnitude = go.body.world.pxmi(-100);
	        var angle = go.body.data.angle + Math.PI;

	        go.body.data.force[0] += magnitude * Math.cos(angle);
	        go.body.data.force[1] += magnitude * Math.sin(angle);
	    }
    } else if (this.cursors.left.isDown) {
    	var magnitude = go.body.world.pxmi(-100);
        var angle = go.body.data.angle;

        go.body.data.force[0] += magnitude * Math.cos(angle);
        go.body.data.force[1] += magnitude * Math.sin(angle);

        if (go.body.velocity.x > 0) go.body.velocity.x = 0;
    }
};

BehaviourJetski.prototype.go = function() {
	var go = this.gameobject;

	go.body.moveRight(300);
	go.gazoline = 100;

	go.game.pollinator.off("go", this.go, this);
};