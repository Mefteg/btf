"use strict";

var BehaviourToxicEmitter = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
};

BehaviourToxicEmitter.prototype = Object.create(Behaviour.prototype);
BehaviourToxicEmitter.prototype.constructor = BehaviourToxicEmitter;

BehaviourToxicEmitter.prototype.create = function(_collisionManager) {
	Behaviour.prototype.create.call(this);

	this.collisionManager = _collisionManager;

	var go = this.gameobject;

	this.toxics = new Array(50);
	for (var i = 0; i < this.toxics.length; i++) {
		var toxic = new GameObject(go.game, 0, 0, 'toxic');
		toxic.layer = 'toxic';
		go.game.add.existing(toxic);

		go.game.physics.p2.enable(toxic);
		toxic.body.fixedRotation = true;
		this.collisionManager.addGameObject(toxic);

		var bToxic = new BehaviourToxic(toxic);
		bToxic.create();
		toxic.addBehaviour(bToxic);

		toxic.kill();

		this.toxics[i] = toxic;
	};

	go.game.pollinator.on("spread_toxic", this.spread, this);
};

BehaviourToxicEmitter.prototype.update = function() {
	Behaviour.prototype.update.call(this);

};

BehaviourToxicEmitter.prototype.spread = function(_args) {
	var x = _args.x;
	var y = _args.y;

	var nbToxics = 0;
	var nbToxicsMax = 3;
	var i = 0
	while (i < this.toxics.length && nbToxics < nbToxicsMax) {
		var toxic = this.toxics[i];

		if (toxic.alive == false) {
			var deltaX = Math.random() * 20;
			var deltaY = Math.random() * 20;

			toxic.revive();
			toxic.body.x = x - deltaX;
			toxic.body.y = y - deltaY;

			toxic.body.moveLeft(10 + Math.random() * 10);
			toxic.body.moveDown(20 + Math.random() * 10);

			nbToxics++;
		}

		i++;
	};
};
