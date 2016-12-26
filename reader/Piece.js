/**
 * Super classe Piece
 */
function Piece(scene,id,cell,team) {
    this.scene = scene;
    this.cell = cell;
    this.id = id;
    this.team = team;

    this.animStartTime = 0;
    this.animation = null;

    var textures = this.scene.getTextures();
    this.texture = textures.get("marmore").getAppearance();

    var appearances = this.scene.getMaterials();
    this.appearance = appearances.get("shiny").getAppearance();
}

Piece.prototype.setCell = function (cell) {
    this.cell = cell;
}

Piece.prototype.getCell = function (cell) {
    return this.cell;
}

Piece.prototype.getTeam = function () {
    return this.team;
}

Piece.prototype.getAppearance = function () {
    return this.appearance;
}

Piece.prototype.getTexture = function () {
    return this.texture;
}

Piece.prototype.move = function (pointO, pointD) {
    //calcula a distancia em linha reta de um para o outro
    var cpoint1 = vec3.fromValues(pointO.getX(),0,pointO.getZ());
    var cpoint2 = vec3.fromValues(pointD.getX(),0,pointD.getZ());

    //distance between cpoint1 and cpoint2
    var rx = vec3.distance(cpoint1,cpoint2)/2;

    //calcula o seu ponto central
    var pc = new MyPoint(cpoint1[0]+(cpoint2[0]-cpoint1[0])/2,0,cpoint1[2]+(cpoint2[2]-cpoint1[2])/2);

    console.log(pointO,pc,pointD);

    //aplica na peca uma eliptical animation de raio = metade da distancia
    this.animStartTime = this.scene.getCurrTime();
    this.animation = new EllipticalAnimation(this.id,2,pc,rx,rx*4/3,0,180);
}

Piece.prototype.display = function () {
    var currTime = this.scene.getCurrTime();

    var animTransformation = new MyTransformation(this.id);

    if(this.animation != null)  //se ainda estiver na animacao
    {
        console.log('a');
        var endTime = this.animation.getTime() + this.animStartTime;
        //a animacao está a decorrer
        if(currTime <= endTime)
        {
            var elapTime = currTime-this.animStartTime;	//time since animation begined
            animTransformation = this.animation.getTransformation(elapTime);	//update the animTransformation
        }
        else    //ja acabou
        {
            this.animStartTime = 0;
            this.animation = null;
        }
    }


    this.scene.pushMatrix();
        this.scene.multMatrix(animTransformation.getMatrix());
        //provavelmente vou ter que fazer aqui uma transformacao também para ele ir para cima. dunno
        this.displayAux();
    this.scene.popMatrix();
}

//objetivos:
// Definir e atualizar o estado da peça