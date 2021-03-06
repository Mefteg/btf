"use strict";

var BehaviourJetski = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourJetski.prototype = Object.create(Behaviour.prototype);
BehaviourJetski.prototype.constructor = BehaviourJetski;

BehaviourJetski.prototype.create = function(_toxicEmitter) {
	Behaviour.prototype.create.call(this);

	this.toxicEmitter = _toxicEmitter;
	this.toxicDelay = 0;

	var go = this.gameobject;
	this.cursors = go.game.input.keyboard.createCursorKeys();

	go.gazoline = 25;
	go.canRide = false;

	go.game.pollinator.on("go", this.go, this);
	go.game.pollinator.on("refill", this.refill, this);

	go.body.moveRight(85);
};

BehaviourJetski.prototype.update = function() {
	Behaviour.prototype.update.call(this);

	var go = this.gameobject;

	var sqrMagnitude = go.body.velocity.x * go.body.velocity.x + go.body.velocity.y * go.body.velocity.y;
	if (go.canRide && sqrMagnitude < 1) {
		go.canRide = false;

		go.game.pollinator.dispatch("gameover");
	}

	var left = false;
	var right = false;
	var up = false;
	var down = false;

	var pointer = null;
	if (go.game.input.mousePointer.isDown) pointer = go.game.input.mousePointer;
	if (go.game.input.pointer1.isDown) pointer = go.game.input.pointer1;

	if (pointer) {
		if (pointer.y < go.game.camera.height * 0.25) {
			up = true;
		} else if (pointer.y > go.game.camera.height * 0.75) {
			down = true;
		}

		if (up == false && down == false) {
			if (pointer.x < go.game.camera.width * 0.25) {
				left = true;
			} else if (pointer.x > go.game.camera.width * 0.75) {
				right = true;
			}
		}
	}

	if (go.canRide) {
		if (this.cursors.right.isDown || right) {
			var usedGazoline = go.game.time.elapsed * 0.001 * 5;
			if (go.gazoline >= usedGazoline) {
				go.gazoline -= usedGazoline;

				var magnitude = go.body.world.pxmi(-100);
		        var angle = go.body.data.angle + Math.PI;

		        go.body.data.force[0] += magnitude * Math.cos(angle);
		        go.body.data.force[1] += magnitude * Math.sin(angle);

		        go.game.pollinator.dispatch("updateTank", {tank: go.gazoline});

		        if (this.toxicDelay == 0) {
		        	var x = go.x;
			        var y = go.y + go.height;
			        go.game.pollinator.dispatch("spread_toxic", {x: x, y: y});

			        this.toxicDelay = 500;
		        }		        
		    }
	    } else if (this.cursors.left.isDown || left) {
	    	var magnitude = go.body.world.pxmi(-100);
	        var angle = go.body.data.angle;

	        go.body.data.force[0] += magnitude * Math.cos(angle);
	        go.body.data.force[1] += magnitude * Math.sin(angle);

	        if (go.body.velocity.x > 0) go.body.velocity.x = 0;
	    } else if (this.cursors.up.isDown || up) {
	    	go.body.rotateLeft(25);
	    } else if (this.cursors.down.isDown || down) {
	    	go.body.rotateRight(25);
	    }
	}

	this.toxicDelay -= go.game.time.elapsed;
	if (this.toxicDelay < 0) this.toxicDelay = 0;

	go.game.pollinator.dispatch("updateTank", {tank: go.gazoline});
};

BehaviourJetski.prototype.go = function() {
	var go = this.gameobject;

	go.canRide = true;
	go.body.moveRight(300);

	go.game.pollinator.off("go", this.go, this);
};

BehaviourJetski.prototype.refill = function() {
	var go = this.gameobject;

	go.gazoline += 30;
	if (go.gazoline > 100) go.gazoline = 100;
};