/**
 * MyInterface
 * @constructor
 */
function MyInterface(scene) {
	CGFinterface.call(this);
	this.scene = scene;
};

// interface object
MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);

    dat.GUI.prototype.removeFolder = function(name) {
        var folder = this.__folders[name];
        if (!folder) {
            return;
        }
        folder.close();
        this.__ul.removeChild(folder.domElement.parentNode);
        delete this.__folders[name];
        this.onResize();
    }

    dat.GUI.prototype.folderExists = function(name) {
        var folder = this.__folders[name];
        if (!folder) {
            return false;
        }
        return true;
    }

	// init GUI
	this.gui = new dat.GUI();

	//Methods to update camera/materials/scene
    this.gui.add(this.scene, 'automaticCamera').name("Automatic Camera");
	this.gui.add(this.scene, 'updateCamera').name("Update Camera");
	this.gui.add(this.scene, 'updateMaterials').name("Update Materials");
	this.gui.add(this.scene, 'changeScene').name("Change Scene");

	this.initGameFolders();

    this.initLightFolders();

	this.turn = null;
    this.nextSelection = null;

	return true;
};

/**
 * Initializations
 */
MyInterface.prototype.initLightFolders = function () {

    //LightsGroup to switch on/off lights
    this.omniGroup = this.gui.addFolder("Omni Lights");
    this.omniGroup.open();

    this.spotGroup = this.gui.addFolder("Spot Lights");
    this.spotGroup.open();
}

MyInterface.prototype.initGameFolders = function () {

	this.gameMenuGroup = this.gui.addFolder("Game Menu");
    this.gameMenuGroup.open();
    this.gameMenuGroup.add(this.scene,'initGame').name("Play Game");

    this.matchMenuGroup = this.gui.addFolder("Match Menu");
    this.matchMenuGroup.open();
};

/**
 * Aditions
 */
MyInterface.prototype.addLights = function(id, isSpot) {
	if(isSpot)
		this.spotGroup.add(this.scene, id);
	else
		this.omniGroup.add(this.scene, id);
}

MyInterface.prototype.addGameInfo = function () {

	if(this.turn == null ||  this.nextSelection == null)
	{
        this.gameMenuGroup.add(this.scene,'undo').name("Undo");
        this.gameMenuGroup.add(this.scene,'quit').name("Quit");

        this.turn = this.matchMenuGroup.add(this.scene.game.changingInfo,0).name('Turn').listen();
        this.nextSelection = this.matchMenuGroup.add(this.scene.game.changingInfo,1).name('State').listen();
        this.matchMenuGroup.add(this.scene.game.initInfo, 0).name('Game Mode').listen();
        this.matchMenuGroup.add(this.scene.game.initInfo, 1).name('Difficulty').listen();
	}
};

MyInterface.prototype.addFinalGameInfo = function () {
    this.gameMenuGroup.add(this.scene.game.finalInfo, 1).name('Player 1 Score').listen();
    this.gameMenuGroup.add(this.scene.game.finalInfo, 2).name('Player 2 Score').listen();
    this.gameMenuGroup.add(this.scene.game.finalInfo, 0).name('Winner').listen();
};

/**
 * removes and resets
 */
MyInterface.prototype.resetGameFolders = function () {
	this.matchMenuGroup = this.gui.removeFolder("Match Menu");
	this.gameMenuGroup = this.gui.removeFolder("Game Menu");

	this.initGameFolders();
    this.turn = null;
    this.nextSelection = null;
};

MyInterface.prototype.resetLightFolders = function () {
    this.omniGroup = this.gui.removeFolder("Omni Lights");
    this.spotGroup = this.gui.removeFolder("Spot Lights");

    this.initLightFolders();
};

MyInterface.prototype.removeSomeInfo = function () {
	this.turn.remove();
	this.turn = null;

    this.nextSelection.remove();
    this.nextSelection = null;
};

/**
 * Updates
 */
MyInterface.prototype.updateMatchInfo = function () {
	this.removeSomeInfo();

    this.turn = this.matchMenuGroup.add(this.scene.game.changingInfo,0).name('Turn').listen();
    this.nextSelection = this.matchMenuGroup.add(this.scene.game.changingInfo,1).name('State').listen();
}

/**
 * ProcessKeyboard
 * @param event {Event}
 */
MyInterface.prototype.processKeyboard = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyboard.call(this,event);
	
	// Check key codes
	switch (event.keyCode)
	{
		case 86: case 118: //Change Camera keys: V/v
			this.scene.updateCamera();
			break;
		case 77: case 109: //Change Material keys: M/m
			this.scene.updateMaterials();
			break;
		default:
			break;
	};
};