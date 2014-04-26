"use strict";

/**
* Import a level.
*
* @class LevelImporter
* @constructor
*/
var LevelImporter = function() {

};

/**
* Import all the level.
*
* @method import
* @param {Object} level The level to import
* @param {Phaser.Game} game The game where the level will be imported
* @param {function} promise A promise
*/
LevelImporter.prototype.import = function(_level, _game, _promise) {
	var loader = new Phaser.Loader(_game);
	this.importAssets(_level.assets, loader, _game);
	// if assets need to be loaded
	if (loader.totalQueuedFiles() > 0) {
		loader.start();
		loader.onLoadComplete.add(function() {
			// now assets are loaded, we can import objects
			this.importObjectsAndDo(_level.objects, _game, _promise);
		}, this);	
	} else {
		// directly create object
		this.importObjectsAndDo(_level.objects, _game, _promise);
	}
};

/***********
** ASSETS **
***********/

/**
* Import all the assets (images, sounds, etc...)
*
* @method importAssets
* @param {Object} assets Assets informations
* @param {Phaser.Loader} loader The loader used to import assets
*/
LevelImporter.prototype.importAssets = function(_assets, _loader) {
	this.importImages(_assets.images, _loader);
};

/***********
** IMAGES **
***********/

/**
* Import all the images
*
* @method importImages
* @param {Object} images Images informations
* @param {Phaser.Loader} loader The loader used to import images
*/
LevelImporter.prototype.importImages = function(_images, _loader) {
	for (var i = 0; i < _images.length; i++) {
		var img = _images[i];
		_loader.spritesheet(
			img.name, img.src, img.frameWidth, img.frameHeight);
	};
};

/************
** OBJECTS **
************/

/**
* Import all objects and do the promise
*
* @method importObjectsAndDo
* @param {Object} objects Objects informations
* @param {Phaser.Game} game The game where objects will be imported
* @param {function} promise A promise
*/
LevelImporter.prototype.importObjectsAndDo = function(_objects, _game, _promise) {
	var world = this.importObjects(_objects, _game);

	this.doAfterImportObjectsAndBeforePromise(_objects, _game);

	if (typeof _promise === "function") {
		_promise(null, _game);
	}
};

/**
* Import all objects
*
* @method importObjectsAndDo
* @param {Object} Objects objects informations
* @param {Phaser.Game} game The game where objects will be imported
*/
LevelImporter.prototype.importObjects = function(_parent, _game) {
	var cParent = null;
	if (_parent.name === "__world") {
		// do nothing (already created by Phaser)
		cParent = _game.world;
		cParent.setBounds(0, 0, _parent.width, _parent.height);
	} else {
		cParent = this.importObject(_parent, _game);
	}

	if (_parent.children != null) {
		for (var i = 0; i < _parent.children.length; i++) {
			var child = _parent.children[i];
			var cChild = this.importObjects(child, _game);
			if (cChild) {
				cParent.add(cChild);
			}
		};
	}

	return cParent;
}

/**
* Override this method to do something between the objects importation and
* the promise
*
* @method doAfterImportObjectsAndBeforePromise
* @param {Object} objects Objects informations
* @param {Phaser.Game} game The game where objects will be imported
*/
LevelImporter.prototype.doAfterImportObjectsAndBeforePromise = function(_object, _game) {

};

/**
* Import an object
*
* @method importObject
* @param {Object} object Object informations
* @param {Phaser.Game} game The game where objects will be imported
*/
LevelImporter.prototype.importObject = function(_object, _game) {
	var cObj = LevelUtilities.CreateObjectByType(_object, _game);

	if (cObj) {
		for (var i = 0; i < LevelUtilities.OBJECT_ATTRIBUTES.length; i++) {
			var attr = LevelUtilities.OBJECT_ATTRIBUTES[i];
			
			cObj[attr] = _object[attr];
		};

		if (cObj.key) {
			// we have to use "_object.frame" because cObj.frame is always null
			// if no texture is set
			var w = cObj.width;
			var h = cObj.height;
			cObj.loadTexture(cObj.key, _object.frame);
			cObj.width = w;
			cObj.height = h;
		}
	}

	return cObj;
}
