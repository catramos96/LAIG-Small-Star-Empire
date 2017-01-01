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
	this.gui.add(this.scene, 'updateMaterials').name("Update Materials");
	this.gui.add(this.scene, 'changeScene').name("Change Scene");

    this.turn = null;
    this.time = null;
    this.nextSelection = null;
    this.undo = null;
    this.timeP1 = null;
    this.timeP2 = null;
    this.updateButton = null;
    this.camButton = null;

    this.initLightFolders();

    this.initMenuFolder();

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

MyInterface.prototype.initMenuFolder = function () {

    this.camerasGroup = this.gui.addFolder("Cameras");
    this.camerasGroup.open();
    this.updateCam();

	this.mainMenuGroup = this.gui.addFolder("Main Menu");
    this.mainMenuGroup.open();

    gameModes =  {"Human vs Human": 1, "Human vs Machine": 2, "Machine vs Machine": 3};
    difficulties =  {"Easy": 1, "Hard": 2};

    this.mainMenuGroup.add(this.scene,'gameMode',gameModes).name("Game Mode");
    this.mainMenuGroup.add(this.scene,'difficulty',difficulties).name("Difficulty");

    this.mainMenuGroup.add(this.scene,'initGame').name("Play Game");
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

/**
 * Quando atualiza a camara, se mudar para free, adiciona o botao de update, se não, retira-o
 */
MyInterface.prototype.updateCam = function () {
    if(this.scene.freeCam)  //freeCam => tem botao update
    {
        console.log('a');
        if(this.updateButton == null)   //no fim do jogo coloca o botao de update
        {
            this.updateButton = this.camerasGroup.add(this.scene, 'updateCamera').name("Update Camera"); //botao para mudar de camara
            console.log("coloca o update");
        }
    }
    else //!freeCam => tira botao update
    {
        console.log(this.updateButton);
        if(this.updateButton != null)   //no fim do jogo coloca o botao de update
        {
            this.updateButton.remove();
            this.updateButton = null;
            console.log("tira o update");
        }
    }

    console.log("eu vim ate aqui");
}

MyInterface.prototype.addGameInfo = function () {

	if(this.turn == null ||  this.nextSelection == null || this.time == null)    //significa que ainda nao ha informacoes (evita sobreposicoes)
	{
        this.camButton = this.camerasGroup.add(this.scene, 'automaticCamera').name("Free/Automatic Camera"); //adiciona quando comeca o jogo
        this.updateCam();

        this.mainMenuGroup = this.gui.removeFolder("Main Menu");

        this.gameMenuGroup = this.gui.addFolder("Game Menu");
        this.gameMenuGroup.open();
        //jogos ganhos pelas equipas

        if(this.scene.gameMode != 3)    //nao adiciona se for o gamemode m vs m
        {
            this.undo = this.gameMenuGroup.add(this.scene,'undo').name("Undo");
        }
        this.gameMenuGroup.add(this.scene,'quit').name("Quit");
        this.wins1 = this.gameMenuGroup.add(this.scene.wins,0).name('Red Team Wins : ').listen();
        this.wins2 = this.gameMenuGroup.add(this.scene.wins,1).name('Blue Team Wins : ').listen();

        this.matchMenuGroup = this.gui.addFolder("Match Board");
        this.matchMenuGroup.open();
        this.time = this.matchMenuGroup.add(this.scene.game.changingInfo,2).name('Time').listen();
        if(this.scene.gameMode != 3)    //nao adiciona se for o gamemode m vs m
        {
            this.timeP1 = this.matchMenuGroup.add(this.scene.game.timePlayers,0).name('Time for player 1 : ').listen();
            this.timeP2 = this.matchMenuGroup.add(this.scene.game.timePlayers,1).name('Time for player 2 : ').listen();
        }
        this.turn = this.matchMenuGroup.add(this.scene.game.changingInfo,0).name('Turn').listen();
        this.nextSelection = this.matchMenuGroup.add(this.scene.game.changingInfo,1).name('State').listen();
        this.matchMenuGroup.add(this.scene.gameModes, this.scene.gameMode).name('Game Mode').listen();
        this.matchMenuGroup.add(this.scene.difficulties, this.scene.difficulty).name('Difficulty').listen();
	}
};

MyInterface.prototype.addFinalGameInfo = function () {

    this.gameMenuGroup.add(this.scene.game,'movie').name("See movie");
    if(this.undo != null)
    {
        this.undo.remove();
        this.undo = null;
    }

    this.wins1.remove();
    this.wins1 = null;
    this.wins2.remove();
    this.wins2 = null;

    this.wins1 = this.gameMenuGroup.add(this.scene.wins,0).name('Red Team Wins : ').listen();
    this.wins2 = this.gameMenuGroup.add(this.scene.wins,1).name('Blue Team Wins : ').listen();

    this.scoreGroup = this.scoreGroup = this.gui.addFolder("Score Board");
    this.scoreGroup.add(this.scene.game.finalInfo, 1).name('Player 1 Score').listen();
    this.scoreGroup.add(this.scene.game.finalInfo, 2).name('Player 2 Score').listen();
    this.scoreGroup.add(this.scene.game.finalInfo, 0).name('Winner').listen();
};

/**
 * removes and resets
 */
MyInterface.prototype.resetGameFolders = function () {
    this.camerasGroup = this.gui.removeFolder("Cameras");
    this.mainMenuGroup = this.gui.removeFolder("Main Menu");
    this.gameMenuGroup = this.gui.removeFolder("Game Menu");
	this.matchMenuGroup = this.gui.removeFolder("Match Board");
	this.scoreGroup = this.gui.removeFolder("Score Board");

    this.camButton.remove();
    this.camButton = null;

    this.turn = null;
    this.time = null;
    this.time = null;
    this.nextSelection = null;
    this.undo = null;
    this.wins1 = null;
    this.wins2 = null;
    this.timeP1 = null;
    this.timeP2 = null;

	this.initMenuFolder();
};

MyInterface.prototype.resetLightFolders = function () {
    this.omniGroup = this.gui.removeFolder("Omni Lights");
    this.spotGroup = this.gui.removeFolder("Spot Lights");

    this.initLightFolders();
};

/**
 * Updates
 */
MyInterface.prototype.updateMatchInfo = function () {
    this.turn.remove();
    this.turn = null;

    this.nextSelection.remove();
    this.nextSelection = null;

    this.time.remove();
    this.time = null;

    this.time = this.matchMenuGroup.add(this.scene.game.changingInfo,2).name('Time').listen();
    if(this.scene.gameMode != 3)    //nao adiciona se for m vs m
    {
        this.timeP1.remove();
        this.timeP1 = null;
        this.timeP2.remove();
        this.timeP2 = null;

        this.timeP1 = this.matchMenuGroup.add(this.scene.game.timePlayers,0).name('Time for player 1 : ').listen();
        this.timeP2 = this.matchMenuGroup.add(this.scene.game.timePlayers,1).name('Time for player 2 : ').listen();
    }
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