/*
Class NewChessBoard
Modification of MyChessBoard where you can choose your planeDimensions
*/
function NewChessBoard(scene, data) {
     CGFobject.call(this,scene);

	this.scene = scene;
    this.dU = data.getDU();					//dimensões
    this.dV = data.getDV();					//dimensões
    this.sU = data.getSU();					//posição do "peão"
	this.sV = data.getSV();					//posição do "peão"
	this.texture = data.getTexture();
	this.c1 = data.getC1();					//cor primaria
	this.c2 = data.getC2();					//cor secundaria
	this.c3 = data.getC3();					//cor de peão selecionada

	this.dX = data.getDX();
	this.dY = data.getDY();

	//composition
	// x5 para um maior desnivel entre as celulas do tabuleiro
	this.plane = new MyPlane(this.scene,new MyPlaneData("plane",this.dX,this.dY,this.dU*5,this.dV*5));
	
	//shader
	this.shader = new CGFshader(this.scene.gl, "shaders/board.vert", "shaders/board.frag");

	this.shader.setUniformsValues({uSampler: 1});
	this.shader.setUniformsValues({du: this.dU});
	this.shader.setUniformsValues({dv: this.dV});

	this.shader.setUniformsValues({su: this.sU});
	this.shader.setUniformsValues({sv: this.sV});

	this.shader.setUniformsValues({c1: [this.c1.getR(),this.c1.getG(),this.c1.getB(),this.c1.getA()]});	//vec4
	this.shader.setUniformsValues({c2: [this.c2.getR(),this.c2.getG(),this.c2.getB(),this.c2.getA()]});	//vec4
	this.shader.setUniformsValues({c3: [this.c3.getR(),this.c3.getG(),this.c3.getB(),this.c3.getA()]});	//vec4

	console.log(this.shader.getUniformsValues());
 }


NewChessBoard.prototype = Object.create(CGFobject.prototype);
NewChessBoard.prototype.constructor = NewChessBoard;


NewChessBoard.prototype.getTexture= function() {
		return this.texture;
  };

NewChessBoard.prototype.display= function() {
  	this.scene.setActiveShader(this.shader);				//shader
	this.plane.display();
	this.scene.setActiveShader(this.scene.defaultShader);	//default shader
  };