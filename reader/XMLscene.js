/**
 * XMLscene
 * Handles the scene.
 */
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

/**
 * Init scene with default values
 */
XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.enableTextures(true);

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clearDepth(100.0);

    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE); 	//cull face    = back, enable
    this.gl.depthFunc(this.gl.LEQUAL); 	//depth func  = LEQUAL, enable
    this.gl.frontFace(this.gl.CCW); 	//front face   = CCW

    this.setPickEnabled(true);
	
/*	//para a transparencia
	this.gl.enable(this.gl.BLEND);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE);
*/
	this.lastTime = -1;		//for update scene
    this.sceneNum = 0;
    this.lastSceneNum = -1;
    this.numCamera = 0; 	//actual camera

	this.scenes = ["garden.dsx","mySolarSystem.dsx"];
};

/**
 * Init Lights.
 * For each light processed by the parser it initializes them  with the scene and the id for light[i]
 * The individual initialization is done on the MyLight
 * It also creates 8 booleans (max number of lights) that the interface on/off supports
 */ 
XMLscene.prototype.initLights = function () {

	this.lights = [];
	
    for (var i = 0; i < this.graph.lightsList.length; i++) 
	{	
    	this.graph.lightsList[i].init(this,i);	//individual initialization

		this.lights[i].update();				//update
    }
};

/**
 * Init materials.
 * For each material processed by the parser calls the init function of MyMaterial
 */
XMLscene.prototype.initMaterials = function () {

    for (var [id, value] of this.graph.materialsList) {
    	value.init(this);
    }  
};

/**
 * Init textures.
 * For each texture processed by the parser it calls the function init from MyTexture
 */
XMLscene.prototype.initTextures = function () {
	
    for (var [id, value] of this.graph.texturesList) {
    	value.init(this);
    }
};

/**
 * Returns the list of textures
 * Used to pass the textures to the board for the cell texture
 */
XMLscene.prototype.getTextures = function () {
    return this.graph.texturesList;
};

/**
 * Returns the list of materials
 * Used to pass the material to the board for the cell texture
 */
XMLscene.prototype.getMaterials = function () {
    return this.graph.materialsList;
};

/**
 * Init textures.
 * Search for the default camera ant initializes it
 */
XMLscene.prototype.initCamera = function () {

	//For each perspective...
	for (var [id, value] of this.graph.perspectiveList){
		if(value.isDefault()){
			this.camera = new CGFcamera(value.angle, value.near, value.far, value.getFromVec(), value.getToVec());
			break;
		}
		this.numCamera++;
	}
	
	this.interface.setActiveCamera(this.camera);
};

/**
 * Improvement of tp1 for faster scene.
 */
XMLscene.prototype.initPrimitives = function () {
	
	this.primitivesInit = new Map();
	
	for (var [id, value] of this.graph.primitivesList) 
	{
		if(value instanceof MyCylinderData){
			this.primitivesInit.set(id,new MyCylinder(this, value));
		}
        else if(value instanceof MyCircleData){		//aditional primitive
            this.primitivesInit.set(id,new MyCircle(this,value));
        }
		else if(value instanceof MySphereData){
			this.primitivesInit.set(id,new MySphere(this, value));
		}
		else if(value instanceof MyTorusData){
			this.primitivesInit.set(id,new MyTorus(this, value));
		}
		else if(value instanceof MyPlaneData){			//aditional primitive
			this.primitivesInit.set(id,new MyPlane(this, value));
		}
        else if(value instanceof MyPatchData){			//aditional primitive
            this.primitivesInit.set(id,new MyPatch(this, value));
        }
		/*else if(value instanceof AuxiliarBoardData) {		//aditional primitive
            this.primitivesInit.set(id, new AuxiliarBoard(this, value));
        }
		else if(value instanceof TradeData){
			this.primitivesInit.set(id,new Trade(this,value,null));
		}
        else if(value instanceof ColonyData){
            this.primitivesInit.set(id,new Colony(this,value,null));
        }
        else if(value instanceof ShipData){
            this.primitivesInit.set(id,new Ship(this,value,null));
        }
        else if(value instanceof GameBoardData){		//aditional primitive
			this.primitivesInit.set(id,new GameBoard(this,value));
		}*/
	}
}

/**
 * Update Lights.
 * Method called every scene display.
 * Checks the status of every boolean. If its set to true then the light is switch on or otherwise.
 */
XMLscene.prototype.updateLights = function() {
	
	for (i = 0; i < this.graph.lightsList.length; i++){
		
		eval("var on = this."+this.graph.lightsList[i].getId());

		if(on) this.lights[i].enable();
		else this.lights[i].disable();

		this.lights[i].update();
	}
}

/**
 * Update Materials.
 * Method called by the interface each time the keys m/M are pressed.
 * For each component, the material index is incremented.
 */
XMLscene.prototype.updateMaterials = function () {

	for(var [id,value] of this.graph.componentsList){
		value.incMaterialIndex();
	}
};

/**
 * Update Camera.
 * Method called by the interface each time the keys v/V are pressed.
 * Each time the numCamera is incrementes and searches in the perspectiveList the one with the numCamera number.
 */
XMLscene.prototype.updateCamera = function () {
	
	this.numCamera++;
	if(this.numCamera == this.graph.perspectiveList.size)
		this.numCamera = 0;

	var i = 0;
	for (var [id, value] of this.graph.perspectiveList) {
		if(i == this.numCamera){
			this.camera = new CGFcamera(value.angle, value.near, value.far, value.getFromVec(), value.getToVec());
			break;
		}	
		i++;
    }
    this.interface.setActiveCamera(this.camera);
};

/**
 * Default appearance.
 * Puts the default values in the scene and updates the global ambient light.
 * Also updates the color values interpreted by the parser.
 */
XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);

	//ambient
	this.setGlobalAmbientLight(this.graph.getGlobals().getAmbient().getR(),
					this.graph.getGlobals().getAmbient().getG(),
					this.graph.getGlobals().getAmbient().getB(),
					this.graph.getGlobals().getAmbient().getA());
	//background
	this.gl.clearColor(this.graph.getGlobals().getBackground().getR(),
						this.graph.getGlobals().getBackground().getG(),
						this.graph.getGlobals().getBackground().getB(),
						this.graph.getGlobals().getBackground().getA());
};

/**
 * Update scene
 */
XMLscene.prototype.update = function(currTime) {
	if (this.lastTime == -1)	//first time
	{
		this.lastTime = currTime;
		return;
	}
	this.deltaTime = (currTime - this.lastTime)/1000;
}

XMLscene.prototype.getCurrTime = function() {
	return this.deltaTime;
}

/*
 * Picking Functions
 */

XMLscene.prototype.logPicking = function ()
{
	if (this.pickMode == false) {
		if (this.pickResults != null && this.pickResults.length > 0) {
			for (var i=0; i< this.pickResults.length; i++) {
				var obj = this.pickResults[i][0]; // o objeto seleccionado
				if (obj)
				{
					//criar aqui uma funcao para o game
					var customId = this.pickResults[i][1]; // o ID do objeto seleccionado
					console.log("Picked object: ", obj  ,", with pick id " + customId);

					this.game.picking(obj,customId);
				}
			}
			this.pickResults.splice(0,this.pickResults.length);
		}
	}
}

/**
 * Handler called when the graph is finally loaded. 
 * As loading is asynchronous, this may be called already after the application has started the run loop.
 * Faz as inicializacoes que requerem informacoes da leitura do parser.
 */
XMLscene.prototype.onGraphLoaded = function () {  
	this.axis = new CGFaxis(this, this.graph.getGlobals().getAxisLength(),0.05);

	this.initLights();

	this.initCamera();

	this.initMaterials();

	this.initTextures();	
	
	this.initPrimitives();

    this.ongoing = false;
};

/**
 * Display Components.
 * Method that displays a certain component.
 * Recieves the components to be displayed and the materials and texture of its ancestor.
 * Starts by applying the transformation matrix. 
 * Then interprets the materials and texture. It they are "inherit" then the component recieves them form the ancestor.
 * The correct texture and material is applyed.
 * The primitives are created.
 * It calls recursivelly (the following component of its child components)
 */
XMLscene.prototype.displayComponents = function (component,materials,texture) {

	this.pushMatrix();
	
	//Transformation matrix
	this.multMatrix(component.getTransformation().getMatrix());						//component transformation
	this.multMatrix(component.getAnimTransformation(this.deltaTime).getMatrix());	//animation transformation ate this deltaTime
	
	//Materials
	//var currMaterial = component.getCurrMaterial();
	if(component.getCurrMaterial() == "inherit")
	{
		component.setMaterials(materials);
	}

	//appearance associated to the material
	var appearance = component.getCurrMaterial().getAppearance();

	//texture
	var newTexture = component.getTexture();
	
	if(newTexture == "inherit")
	{
		newTexture = texture;
	}
	
	var lS = 1;
	var lT = 1;

	var textAppearance = null;
	
	//if not 'none' updates the appearance
	if(newTexture != "none")
	{
		textAppearance = newTexture.getAppearance();	//textAppearance
		lS = newTexture.getLengthS();
		lT = newTexture.getLengthT();
	}
	
	//Application of the material and texture
	appearance.setTexture(textAppearance);
	appearance.apply();

	//Draws the primitives (improvement of tp1)
	var primitives = component.getPrimitives();
	for (var i = 0; i < primitives.length; i++)
	{
	    var prim = primitives[i];	//informacoes sobre a primitiva (data)
	    var primInit = null;
	  
	    if(prim instanceof MyRectangleData)
		{
			primInit = new MyRectangle(this,prim,lS,lT);
			primInit.display();
	    }
	    else if(prim instanceof MyTriangleData)
		{
			primInit = new MyTriangle(this,prim,lS,lT);
			primInit.display();
	    }
	    else if(this.primitivesInit.has(prim.getId()))
		{
			primInit = this.primitivesInit.get(prim.getId());	//objeto com a primitiva

			primInit.display();
	    }
	}

	//next child component
	var components = component.getComponentsChilds();
	for (var i = 0; i < components.length; i++)
	{
		this.displayComponents(components[i],component.getMaterials(),newTexture);
	}

	this.popMatrix();
	return null;
}

/**
 * Display of scene.
 */
XMLscene.prototype.display = function () {

	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	//it's important that things depending on the proper loading of the graph only get executed after the graph has loaded correctly
	if (this.graph.loadedOk)
	{
		//update period of the scene
		this.setUpdatePeriod(10);
		
		// Initialize Model-View matrix as identity
		this.updateProjectionMatrix();
    	this.loadIdentity();

		// Apply transformations corresponding to the camera position relative to the origin
		this.applyViewMatrix();

		// Draw axis
		this.axis.display();

		//appearance
		this.setDefaultAppearance();

		//update lights
		this.updateLights();

		//para o picking
		this.logPicking();
		this.clearPickRegistration();

		//Processes the components
		this.displayComponents(this.graph.getRoot(),null,null);

		if(this.ongoing)
		{
            this.game.display();
        }
	}
};

/**
 * SETS
 */
XMLscene.prototype.setInterface = function(i) {
	this.interface = i;
}

XMLscene.prototype.changeScene = function() {
    this.sceneNum++;
    if(this.sceneNum == 2)
        this.sceneNum = 0;

    new MySceneGraph(this.scenes[this.sceneNum], this);
    this.interface.resetLightFolders();
}

XMLscene.prototype.automaticCamera = function() {

}

XMLscene.prototype.initGame = function(i) {
	this.ongoing = true;
    this.game = new Game(this,1,1);
    this.interface.addGameInfo();
}

XMLscene.prototype.quit = function (){
    this.ongoing = false;
    this.interface.resetGameFolders();
}
