"use strict";

var PLAYER;
var BG;

var PlayState = function(_game) {
	Phaser.State.call(this, _game);
	_game.state.add("Play", this, false);
};

PlayState.prototype = Object.create(Phaser.State.prototype);
PlayState.prototype.constructor = PlayState;

PlayState.prototype.preload = function(){

}

PlayState.prototype.create = function(){
	//this has to be done since 2.0.3 is not working well with inputs
	this.game.inputManager.init();

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.collisionManager = new CollisionManager(this.game);
	this.game.physics.p2.gravity.y = PhysicsSettings.GLOBAL_GRAVITY;

	//init inventory for the currentlevel
	var inventory = new GameObject(this.game, 0 ,0 ,"", "inventory");
	inventory.addBehaviour( new InventoryManager(inventory) );

	//Bg
	BG = this.game.add.tileSprite(0, 0, 780, 486, 'background');
	BG.fixedToCamera = true;
	BG.x = this.game.camera.x;
	BG.y = this.game.camera.y;

	//PLAYER
	PLAYER = new GameObject(this.game,-100,100,"loopy");	
	PLAYER.debugBounds = true;
	var playerCtrl = new PlayerRunnerController(PLAYER);
	PLAYER.addBehaviour(playerCtrl);
	PLAYER.layer ="player";
	//Weapon
	var weaponObj = new GameObject(this.game,0,0,"","fork");
	var weaponScript = new Weapon(weaponObj);
	weaponObj.addBehaviour(weaponScript);
	weaponObj.layer = "player";
	weaponScript.setOwner(PLAYER);

	playerCtrl.weapon = weaponScript;

	// Add player to collisions and enable callbacks
    this.collisionManager.addGameObject(PLAYER,true);   
    this.collisionManager.addGameObject(weaponObj,true);

	this.game.add.existing(PLAYER);
	this.game.add.existing(weaponObj);

	//obstacles
	this.createObstacles();
	this.createCoins();
	//TriggerDeath
	var triggerDeath = new GameObject(this.game,0,320,"","triggerDeath");
	triggerDeath.layer = "death";
	//physics
	triggerDeath.enablePhysics(PhysicsSettings.STATIC);
	triggerDeath.enableSensor();
	triggerDeath.body.setRectangle( 17000, 10);	
	//behaviours
	var trigDeath = triggerDeath.addBehaviour( new Trigger(triggerDeath) );
	trigDeath.create({ callbackName : "die", interactives : ["player"], 
						messageObject: { typeDeath : "fall"}
						});
	// Add player to collisions and enable callbacks
    this.collisionManager.addGameObject(triggerDeath);  
    this.game.add.existing(triggerDeath); 

    //ENEMIES
    var /*enemyObj = new GameObject(this.game,100,0,"goomba","goomba1");
    enemyObj.layer = "enemy";
    enemyObj.addBehaviour( new Enemy(enemyObj));
    this.collisionManager.addGameObject(enemyObj);
    this.game.add.existing(enemyObj);*/

    enemyObj = new GameObject(this.game,600,-500,"goomba","goomba2");
    enemyObj.layer = "enemy";
    enemyObj.addBehaviour( new Enemy(enemyObj));
    this.collisionManager.addGameObject(enemyObj);
    this.game.add.existing(enemyObj);

    //MENU
    this.createMenu();

	//CAMERA
	this.game.camera.bounds = null;
	this.game.camera.follow(PLAYER);	
}

PlayState.prototype.update = function(){
	BG.tilePosition.x += PLAYER.body.velocity.x * 0.1;
}

PlayState.prototype.shutdown = function(){
	coinGO.getBehaviour(UILevelCoinsCount).destroy();
}

//===============================================================
//						OBSTACLES
//===============================================================
PlayState.prototype.createObstacles = function(){
	//Create a group for obstacles and enable the body
	this.obstacles = this.game.add.group();
    this.obstacles.enableBody = true;
    this.obstacles.physicsBodyType = Phaser.Physics.P2JS;
    //Create First Ground
	var obstacle;
	obstacle = this.createGround(100,300,1700,200,"groundA");

	//create wall right
	obstacle = this.createGround(500,100,300,300,"wallRight");
	obstacle = this.createGround(160,-30,50,200,"wallLeft");

	//create trigger Left
	obstacle = this.createGround(-100,0,100,300,"triggerDir1");
	obstacle.enableSensor();
	obstacle.disableDebugBounds();
	var triggerDir = obstacle.addBehaviour(new Trigger(obstacle));
	triggerDir.create({ callbackName : "changeDirection", interactives : ["player"], 
						messageObject: { direction : 1}
						} );


	//create trigger end level
	obstacle = this.createGround(910,160,50,50,"triggerEnd");
	obstacle.enableSensor();
	obstacle.disableDebugBounds();
	var obstScript = obstacle.addBehaviour(new Trigger(obstacle));
	obstScript.create({ callbackName : "win", interactives : ["player"]	});
}

PlayState.prototype.createGround = function(_x,_y,_width,_height,_name){
	var obstacle;
	obstacle = new GameObject(this.game,_x,_y,"",_name);
	obstacle.enablePhysics(PhysicsSettings.STATIC,_width,_height);
	obstacle.layer = "ground";
	obstacle.enableDebugBounds();
	this.collisionManager.addGameObject(obstacle); 
	this.obstacles.add(obstacle);
	return obstacle;
}


//===============================================================
//						COINS
//==============================================================

PlayState.prototype.createCoins = function(){
	this.coins = this.game.add.group();
    this.coins.enableBody = true;
    this.coins.physicsBodyType = Phaser.Physics.P2JS;

	var coin = this.createCoin(300,-200);
}

PlayState.prototype.createCoin = function(_x,_y){
	var coin = new GameObject(this.game,_x,_y,"coin","Coin");
	var collectScript = new Collectable(coin);
	coin.addBehaviour(collectScript);
	coin.addBehaviour( new Coin(coin) );
	coin.layer = "item"
	this.coins.add(coin);
	this.collisionManager.addGameObject(coin);
	return coin;
}


//===============================================================
//						MENU IN GAME
//==============================================================
var coinGO;
PlayState.prototype.createMenu = function(){
	var group = this.game.add.group();
	var beginCoins = new Phaser.Point( 530, 0 )
	//TOP RIGTH == coin
	coinGO = new GameObject(this.game,beginCoins.x,beginCoins.y + 24, "coin", "menu_coin");
	coinGO.fixedToCamera = true;
	coinGO.alpha = 0.8;
	coinGO.addBehaviour(new UILevelCoinsCount(coinGO));
	group.add(coinGO);
}