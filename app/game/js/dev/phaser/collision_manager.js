"use strict";
/**
* Holds the collision data between gameobjects in the game
* Creates collision groups according to layers
*
* @class CollisionManager
* @param {Phaser.Game} game
*/
var CollisionManager = function(_game){
	this.game = _game;

	/**
	* Object containing data of layers ( as the CollisionGroup for example )
	* @property layersData
	*/
	this.layersData = new Object();

	this.nbLayers = 0;

	this.init();
}

/**
* Creates Layers according to the PhysicsSettings
* @method init
*/
CollisionManager.prototype.init = function(){
	//for each layer
	for(var key in PhysicsSettings.LAYERS){
		//Create it
		this.addLayer(key);
	}
}

/**
* Adds a layer
* @method addLayer
* @param {string} layerName Name of the new layer
* @returns {number} the ID of the created layer
*/
CollisionManager.prototype.addLayer = function(_layerName){

	this.layersData[_layerName] = { "id" : this.nbLayers,
									"objects" : new Array(),
									"name":_layerName,
									"group" : this.game.physics.p2.createCollisionGroup()
								 };

	this.nbLayers ++;
	return this.nbLayers-1;
}

/**
* Adds a gameobject to the collision managing of the game according to its layer
* @method addGameObject
* @param {GameObject} gameobject 
* @param {boolean} enableEvents Set to true if you want callbacks about collision events to be forwarded to the gameobject's behaviours
*/
CollisionManager.prototype.addGameObject = function(_gameobject,_enableEvents){

	_gameobject.collisionManager = this;

	//abort if the gameobject is not physical
	if( _gameobject.body == null)
		return;

	this.changeGameObjectLayer(_gameobject, _gameobject.layer, _enableEvents);
}

/**
* Changes the GameObject collisions groups accroding to the specified layer
* @method addGameObject
* @param {GameObject} gameobject 
* @param {string} layer Name of the new layer (check PhysicsSettings)
*/
CollisionManager.prototype.changeGameObjectLayer = function(_gameobject, _layer , _enableEvents){
	_gameobject.collisionManager = this;
	//abort if the gameobject is not physical
	if( _gameobject.body == null)
		return;
	_gameobject.body.clearCollision(true,true);


	var layerData = this.getLayerData(_layer);
	//  Sets the collision group of the body
    _gameobject.body.setCollisionGroup(layerData.group);

    //Get Names of layers that can collide with the gameobject 
    var collisions = PhysicsSettings.GetCollisionsForLayer(_gameobject.layer);	
    // Tells body to collide with layers enabled
    var collGroups = new Array();
    for(var i=0; i < collisions.length; i++){
    	//Get collidable layer collisionGroup
    	var group = this.getLayerData(collisions[i]).group;
    	if( group != null)
    		collGroups.push(group);
    }
    _gameobject.body.collides(collGroups);
	
    //let's enable events contact callbacks
	if( _enableEvents == true){
		_gameobject.enableEvents();
	}
}

//==================================================================
//						GETTERS
//==================================================================

/**
* Returns the collision data for the specified layer
* @method getCollisionData
* @param {string} layer Name of the layer
*/
CollisionManager.prototype.getLayerData = function(_layer){
	return this.layersData[ _layer ];
}
