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

//classe com apontador para um tile

//objetivos:
// Criar
// Definir e atualizar o estado da peça
// Desenhar
// Deslocar entre tile de origem e tile de destino