"use strict";
/**
* Script attached to a GameObject. Its update method is called every frame if the object exists.
* @class Behaviour
* @param {GameObject} gameobject The GameObject this behaviour is attached to
*/
var Behaviour = function(_gameobject, _args) {
	/**
	* Enables the behaviour. A disabled behaviour will not have its start(),update(), render() and contacts function called by its GameObject
	*
	* @property enabled
	* @type {boolean}
	* @default true
	*/
	this.enabled = true;
	
	/**
	* The GameObject this Behaviour is attached to
	*
	* @property gameobject
	* @type {GameObject}
	*/
	this.gameobject = _gameobject;

	/**
	* Arguments to the behaviour. Must be used in Behaviour.create
	*
	* @property args
	* @type object
	* @default null
	*/
	this.args = _args;
};

Behaviour.prototype.constructor = Behaviour;

/**
* Called when all gameobjects are created
*
* @method create
*/
Behaviour.prototype.create = function() {
	
};

/**
* Called each frame if the behaviour is enabled
*
* @method update
*/
Behaviour.prototype.update = function() {

};

Behaviour.prototype.render = function() {

};

/**
* Called when the scene is launching. All objects are created then.
*
* @method start
*/
Behaviour.prototype.start = function() {
};

/**
* Called when a body collision just begins
*
* @method onBeginContact
* @param {_otherBody} _otherBody
* @param {_myShape} _myShape
* @param {_otherShape} _otherShape
* @param {_equation} _equation
*/
Behaviour.prototype.onBeginContact = function(_otherBody, _myShape, _otherShape, _equation){

}

Behaviour.prototype.onContact = function(_otherBody){

}

/**
* Called when a body collision just ends
*
* @method onEndContact
* @param {_otherBody} _otherBody
* @param {_myShape} _myShape
* @param {_otherShape} _otherShape
* @param {_equation} _equation
*/
Behaviour.prototype.onEndContact = function(_otherBody, _myShape, _otherShape, _equation){
	
}