/**
 * Super classe Piece
 */
function Piece(scene,id,cell,team) {
    this.scene = scene;
    this.cell = cell;
    this.id = id;
    this.team = team;
}

Piece.prototype.setCell = function (cell) {
    this.cell = cell;
}

Piece.prototype.getTeam = function () {
    return this.team;
}

//classe com apontador para um tile

//objetivos:
// Criar
// Definir e atualizar o estado da peça
// Desenhar
// Deslocar entre tile de origem e tile de destino