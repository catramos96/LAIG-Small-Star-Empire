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
    //aplica na peca uma eliptical animation de raio = metade da distancia
    this.animStartTime = this.scene.getCurrTime();

    var controlPoints = [];
    var point = [];

    point.push(0,pointO.getX(),0,pointO.getZ(),0,0,0,1,1,1);
    controlPoints.push(point);

    point = [];
    var midX = (pointO.getX()+pointD.getX())/2;
    var midZ = (pointO.getZ()+pointD.getZ())/2;
    var height = 2;
    point.push(1,midX,height,midZ,0,0,0,1,1,1);
    controlPoints.push(point);

    point = [];
    point.push(2,pointD.getX(),0,pointD.getZ(),0,0,0,1,1,1);
    controlPoints.push(point);

    this.animation = new KeyFrameAnimation(this.id,2,controlPoints);
}

Piece.prototype.display = function ()
{
    var currTime = this.scene.getCurrTime();

    var animTransformation = new MyTransformation(this.id);
    var position = this.cell.getCoords();
    animTransformation.translate(position.getX(),position.getY(),position.getZ());

    if(this.animation != null)  //se ainda estiver na animacao
    {
        var endTime = this.animation.getTime() + this.animStartTime;
        //a animacao está a decorrer
        if(currTime <= endTime)
        {
            var elapTime = currTime-this.animStartTime;	//time since animation begined
            animTransformation = this.animation.getTransformation(elapTime);	//update the animTransformation

            console.log(animTransformation);
        }
        else    //ja acabou
        {
            this.animStartTime = 0;
            this.animation = null;
        }
    }

    this.displayAux(animTransformation);
}

//objetivos:
// Definir e atualizar o estado da peça