"use strict";

var LevelUtilities = function() {

};

LevelUtilities.OBJECT_ATTRIBUTES = [
	"name", "x", "y", "width", "height", "behaviours", "layer", "visible",
	"key", "frame", "addToCollisionManager"
];

LevelUtilities.TYPE_GAME_OBJECT = "GameObject";
LevelUtilities.TYPE_PHASER_GROUP = "Phaser.Group";
LevelUtilities.TYPE_PHASER_WORLD = "Phaser.World";

LevelUtilities.CreateObjectByType = function(_object, _game) {
	var cObj = null;

	if (_object.type === LevelUtilities.TYPE_GAME_OBJECT) {
		cObj = new GameObject(_game);
		_game.add.existing(cObj);
	} else if (_object.type === LevelUtilities.TYPE_PHASER_GROUP) {
		cObj = new Phaser.Group(_game);
		_game.add.existing(cObj);
	} else if (_object.type === LevelUtilities.TYPE_PHASER_WORLD) {
		//cObj = new Phaser.World(_game);
	}

	return cObj;
}

LevelUtilities.GetType = function(_object) {
	var type = "";

	if (_object instanceof GameObject) {
		type = "GameObject";
	} else if (_object instanceof Phaser.Group) {
		type = "Phaser.Group";
	} else if (_object instanceof Phaser.World) {
		type = "Phaser.World";
	}

	return type;
};