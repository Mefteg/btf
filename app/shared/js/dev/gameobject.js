"use strict";
/**
* Base object 
*
* @class GameObject
* @param {Phaser.Game} game
* @param {number} x
* @param {number} y
* @param {string} texture Texture key
* @param {string} name Name of the GameObject
*/
var GameObject = function(_game, _x, _y, _texture,_name) {
	Phaser.Sprite.call(this, _game, _x, _y, _texture);
	this.anchor.setTo(0.5, 0.5);
	
	if( _name == null)
		this.name = "GameObject_"+_texture;
	else
		this.name = _name;
	/**
	* The collision layer index used to filter collisions
	* @property collLayer
	* @type {string}
	* @default "default"
	*/
	this.layer = "default";
	
	/**
	* The behaviours attached to the gameobject
	* @property behaviours
	* @type {Array}
	* @default array
	*/
	this.behaviours = new Array();

	/**
	* A reference to the current CollisionManager. Set when the GameObject is added to the CollisionManager
	* @property collisionManager
	* @type {CollisionManager}
	* @default null
	*/
	this.collisionManager = null;

	/*
	* If this is enabled, the gameobject will send contact events to its behaviours. Use enableEvents().
	* @property enableContactEvents
	* @type {boolean}
	* @default false
	*/
	this.enableContactEvents = false;

	this.debugBounds = false;
};

GameObject.prototype = Object.create(Phaser.Sprite.prototype);
GameObject.prototype.constructor = GameObject;

// Called when the scene is launching. All objects are created then.
GameObject.prototype.start = function() {
	if (this.exists && this.behaviours) {
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].start != null && this.behaviours[i].enabled )
				this.behaviours[i].start();
		}
	}
};

GameObject.prototype.update = function() {
	if (this.exists && this.behaviours) {
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].update != null && this.behaviours[i].enabled  )
				this.behaviours[i].update();
		}
	}
};

GameObject.prototype.render = function() {$
	if( this.exists ){
		for(var i=0; i < this.behaviours.length; i++){
			if( this.behaviours[i].render != null && this.behaviours[i].enabled  )
				this.behaviours[i].render();
		}
	}
};

//============================================================
//						PHYSICS
//============================================================

/**
* Creates a body and enable physics for the gameobject
* Also creates a variable gameobject in the {P2.Body} body
* @method enablePhysics
* @param {number} motionState : pick PhysicsSettings.STATIC, PhysicsSettings.KINEMATIC or PhysicsSettings.DYNAMIC
* @param {number} width : new width of the body rectangle
* @param {number} height : new height of the body rectangle
*/
GameObject.prototype.enablePhysics = function(_motionState,_width,_height){
	if( this.body == null)
		this.game.physics.p2.enable(this);
	this.body.gameobject = this;
	this.body.debug = this.debugBounds;
	// Set Motion State
	this.setMotionState(_motionState);
	//Set Rectangle
	if( _width != null && _height != null ){
		this.body.setRectangle(_width,_height,0,0,0);
	}
}

/**
* Enables the behaviours of the gameobject to receive the contact events
* Without that, onBeginContact and onEndContact are never called
* @method enableEvents 
*/
GameObject.prototype.enableEvents = function(){
	this.enableContactEvents = true;
	if( this.body != null ){
		this.body.onBeginContact.add(this.onBeginContact, this);
		this.body.onEndContact.add(this.onEndContact, this);
	}
}

/**
* Enables the sensor behaviour of the shapes of the GameObject
* @method enableSensor
* @param {Array} indexes Array of indexes of the shapes with we want to be sensors. If null, all the shapes will be sensors.
*/
GameObject.prototype.enableSensor = function(_indexes){
	if( this.body == null)
		return;
	var shapes = this.body.data.shapes;
	if(_indexes == null){
		for(var i=0 ; i < shapes.length; i++){
			shapes[i].sensor = true;
		}
	}else{
		for(var i=0 ; i < _indexes.length; i++){
			var index = _indexes[i];
			if( index < 0 || index >= shapes.length)
				continue;
			shapes[index].sensor = true;
		}
	}
}

/**
* Disables the sensor behaviour of the shapes of the GameObject
* @method disableSensor
* @param {Array} indexes Array of indexes of the shapes with we want to be physical. If null, all the shapes will be solid.
*/
GameObject.prototype.disableSensor = function(_indexes){
	if( this.body == null)
		return;
	var shapes = this.body.data.shapes;
	if(_indexes == null){
		for(var i=0 ; i < shapes.length; i++){
			shapes[i].sensor = false;
		}
	}else{
		for(var i=0 ; i < _indexes.length; i++){
			var index = _indexes[i];
			if( index < 0 || index >= shapes.length)
				continue;
			shapes[index].sensor = false;
		}
	}
}

/**
* Enable Bounds to be displayed ( if no body is affected yet, this will be effective when one is added )
* @method enableDebugBounds
*/
GameObject.prototype.enableDebugBounds = function(){
	this.debugBounds = true;
	if( this.body == null)
		return;
	this.body.debug = true;
}

/**
* Disable Bounds display( if no body is affected yet, this will be effective when one is added )
* @method disableDebugBounds
*/
GameObject.prototype.disableDebugBounds = function(){
	this.debugBounds = false;
	if( this.body == null)
		return;
	this.body.debug = false;
}

/**
* Changes the motion state of the gameobject body
*
*@method setMotionState
*@param {number} motionState PhysicsSettings.STATIC, PhysicsSettings.KINEMATIC or PhysicsSettings.DYNAMIC
*/
GameObject.prototype.setMotionState = function(_motionState){
	if(_motionState != null){
		this.body.motionState = _motionState;
		if( _motionState == PhysicsSettings.STATIC){
			this.body.mass = 0;
		}else{
			this.body.mass = 1;
		}
	}
}

/**
* Changes the current layer of the object, resetting collisions groups
*
* @method changeLayer
* @param {string} layer
*/
GameObject.prototype.changeLayer = function(_layer){
	if( this.collisionManager != null ){
		this.layer = _layer;
		this.collisionManager.changeGameObjectLayer(this,_layer,this.enableContactEvents);
	}
}

//======================================================================
//					CONTACT CALLBACK
//======================================================================

GameObject.prototype.onBeginContact = function(_body2, _shapeA, _shapeB, _equation){
	for(var i=0; i < this.behaviours.length; i++){
		if( this.behaviours[i].onBeginContact != null && this.behaviours[i].enabled )
			this.behaviours[i].onBeginContact(_body2, _shapeA, _shapeB, _equation);
	}
}

GameObject.prototype.onContact = function(_body2){
	//console.log("contact!");
	for(var i=0; i < this.behaviours.length; i++){
		if( this.behaviours[i].onContact != null && this.behaviours[i].enabled )
			this.behaviours[i].onContact(_body2);
	}
}

GameObject.prototype.onEndContact = function(_body2, _shapeA, _shapeB, _equation){
	for(var i=0; i < this.behaviours.length; i++){
		if( this.behaviours[i].onEndContact != null && this.behaviours[i].enabled )
			this.behaviours[i].onEndContact(_body2, _shapeA, _shapeB, _equation);
	}
}

//============================================================
//					BEHAVIOURS
//============================================================

/**
* Adds a behaviour to the gameobject
* @method addBehaviour
* @param {Behaviour} behaviour Behaviour instance
* @return the behaviour 
*/
GameObject.prototype.addBehaviour = function(_behaviour){
	this.behaviours.push(_behaviour);
	return _behaviour;
}

/**
* Returns the requested behaviour. If more than one is attaced, the first one is return. Use getBehaviours if you need them all
* This could be expensive. Do not do this at every frame. 
* @method getBehaviour
* @param {Behaviour} behaviour The behaviour class
* @returns {Behaviour} the behaviour, or null if not found
*/
GameObject.prototype.getBehaviour = function( _script ){
	for(var i = 0 ; i < this.behaviours.length; i++){
		if(this.behaviours[i] instanceof _script)
			return this.behaviours[i];
	}
	return null;
}

/**
* Returns all the requested behaviours attached to the object. 
* This could be expensive. Do not do this at every frame. 
* @method getBehaviour
* @param {Behaviour} behaviour The behaviour class
* @returns {Array} the behaviours in an array (might be empty)
*/
GameObject.prototype.getBehaviours = function( _script ){
	var array = new Array();
	for(var i = 0 ; i < this.behaviours.length; i++){
		if(this.behaviours[i] instanceof _script)
			return array.push( this.behaviours[i] );
	}
	return array;
}

/**
* Try to call the function on every behaviour attached to this GameObject 
* @method sendMessage
* @param {string} functionName
* @param {Object} messageObject : You might want to pass an object for the parameter of the function
*/
GameObject.prototype.sendMessage = function(_functionName, _messageObject){
	var BH;
	for(var i=0; i < this.behaviours.length; i++){
		BH = this.behaviours[i];
		if( BH[_functionName]){
			BH[_functionName](_messageObject);
		}
	}
}

//============================================================
//						GLOBALS
//============================================================

/**
* Find a gameobject by its name
*
* @method FindByName
* @param {Phaser.World | Phaser.Group | Phaser.Sprite} root Root of the search
* @param {string} name Gameobject's name
* @param {Phaser.World | Phaser.Group | Phaser.Sprite} Found gameobject
*/
GameObject.FindByName = function(_root, _name) {
	var gameobject = null;

	if (_root.name === _name) {
		gameobject = _root;
	} else {
		if (_root.children) {
			var i = 0;
			while (i < _root.children.length && gameobject == null) {
				var child = _root.children[i];
				if (GameObject.FindByName(child, _name)) {
					gameobject = child;
				}

				i++;
			};
		}
	}

	return gameobject;
};