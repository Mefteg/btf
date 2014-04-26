"use strict";

var GameCore = function($scope, $http, $routeParams) {

	this.$scope = $scope;
	this.$http = $http;
	this.$routeParams = $routeParams;
	
	var preload = function() {
	};

	var create = function() {
		var bootstate = new BootState(this);
		var loadstate = new LoadingState(this);
		var landingstate = new LandingState(this);
		var playstate = new PlayState(this);

		$scope.game.state.start("Boot");
	};

	var update = function() {
	};

	var render = function() {
	};

	var functions = {
		preload: preload,
		create: create,
		update: update,
		render: render
	};

	Phaser.Game.call(this,640, 360, Phaser.AUTO, 'phaser',functions);
}

GameCore.prototype = Object.create(Phaser.Game.prototype);
GameCore.prototype.constructor = GameCore;

