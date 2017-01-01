/**
 * Super classe Piece
 */
function Piece(scene,id,cell,team) {
    this.scene = scene;
    this.cell = cell;					/*Pointer to the cell where the piece is*/
    this.id = id;
    this.team = team;					/*Team that possesses the piece*/

    this.animStartTime = 0;
    this.animation = null;

    var textures = this.scene.getTextures();
    this.texture = textures.get("marmore").getAppearance();

    var appearances = this.scene.getMaterials();
    this.appearance = appearances.get("shiny").getAppearance();
}

/*
SETS
*/

/*
@brief Function that sets the piece's cell attributes
@param cell
*/
Piece.prototype.setCell = function (cell) {
    this.cell = cell;
}

/*
GETS
*/

/*
@brief Function that gets the piece's cell attributes
@returns cell
*/
Piece.prototype.getCell = function (cell) {
    return this.cell;
}

/*
@brief Function that gets the piece's team attributes
@returns team
*/
Piece.prototype.getTeam = function () {
    return this.team;
}

/*
@brief Function that gets the piece's appearance attributes
@returns appearance
*/
Piece.prototype.getAppearance = function () {
    return this.appearance;
}

/*
@brief Function that gets the piece's texture attributes
@returns texture
*/
Piece.prototype.getTexture = function () {
    return this.texture;
}

/*
MOVE
*/

/*
@brief Function that calculates the animationof the movement
between to cells points
@param pointO - origin point
@param pointD - destination point
*/
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

/*
DISPLAY
*/

/*
@brief Function that displays the piece
*/
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

            //console.log(animTransformation);
        }
        else    //ja acabou
        {
            this.animStartTime = 0;
            this.animation = null;
        }
    }

    this.displayAux(animTransformation);
}