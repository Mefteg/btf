"use strict";

var BehaviourCamera = function(_gameobject, _args){	
	Behaviour.call(this,_gameobject, _args);
	
	/**
	* GameObject named "loopy"
	*
	* @property loopy
	* @type GameObject
	* @default null
	*/
	this.loopy = null;

	this.gameobject.game.camera.setBoundsToWorld();
};


BehaviourCamera.prototype = Object.create(Behaviour.prototype);
BehaviourCamera.prototype.constructor = BehaviourCamera;

/**
* Get gameobject loopy and follow it
*
* @method create
*/
BehaviourCamera.prototype.create = function() {
	if (this.args) {
		if (this.args.follow) {
			this.loopy = GameObject.FindByName(this.gameobject.game.world, this.args.follow);
			if (this.loopy) {
				var camera = this.gameobject.game.camera;
				camera.follow(this.loopy);
				camera.deadzone = new Phaser.Rectangle(
					0,
					camera.height * 0.1,
					camera.width * 0.5,
					camera.height - (camera.height * 0.1 + (camera.height - 280))
				);
			} else {
				console.warn("NOT FOUND: " + this.args.follow);
			}
		}
	} else {
		console.warn("No arguments");
	}
};

/**
* Update the camera
*
* @method update
*/
BehaviourCamera.prototype.update = function(){

};
