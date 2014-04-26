"use strict";

/**
* Import a level for a game.
*
* @class LevelImporterGame
* @constructor
*/
var LevelImporterGame = function() {
	LevelImporter.call(this);
};

LevelImporterGame.prototype = Object.create(LevelImporter.prototype);
LevelImporterGame.prototype.constructor = LevelImporterGame;

LevelImporterGame.prototype.doAfterImportObjectsAndBeforePromise = function(_objects, _game) {
	LevelImporter.prototype.doAfterImportObjectsAndBeforePromise.call(this, _objects, _game);

	this.createBehaviours(_game.world);
};

LevelImporterGame.prototype.importObject = function(_object, _game) {
	var cObj = LevelImporter.prototype.importObject.call(this, _object, _game);

	if (cObj.behaviours) {
		if (cObj.behaviours.length > 0) {
			for (var i = 0; i < cObj.behaviours.length; i++) {
				var behaviour = cObj.behaviours[i];
				var behaviourClass = behaviour.classname;

				var Class = (window || this)[behaviourClass];
				if (Class) {
					var args = JSON.parse(behaviour.args);
					var behaviour = new Class(cObj, args);
					cObj.behaviours[i] = behaviour;
				} else {
					console.error(
						"LevelImporterGame - Unkown behaviour: " + behaviourClass);
				}
			};
		}
	}

	// provisoire, en attendant de créer les bodies dans l'editeur
	if (cObj.addToCollisionManager == true) {
		var state = _game.state.getCurrentState();
		state.collisionManager.addGameObject(cObj,true);
	}

	return cObj;
}

/**
* Call Behaviour.create for each behaviours.
* Need to be called once when all gameobjects are created.
* (Recursive function)
*
* @method createBehaviours
* @param {object} current importable object
*/
LevelImporterGame.prototype.createBehaviours = function(_object) {
	if (_object.behaviours) {
		for (var i = 0; i < _object.behaviours.length; i++) {
			var behaviour = _object.behaviours[i];
			behaviour.create();
		};
	}

	if (_object.children) {
		for (var i = 0; i < _object.children.length; i++) {
			var child = _object.children[i];
			this.createBehaviours(child);
		};
	}
};