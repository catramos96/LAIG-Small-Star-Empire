/**
 * Super classe Piece
 */
function Piece(scene,id,cell,team) {
    this.scene = scene;
    this.cell = cell;
    this.id = id;
    this.team = team;

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

    //calcula o seu ponto central

    //aplica na peca uma eliptical animation de raio = metade da distancia
    //(id,time,pc,rx,rz,0,Math.PI)
}

//objetivos:
// Definir e atualizar o estado da peça