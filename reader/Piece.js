/**
 * Super classe Piece
 */
function Piece(scene,id,cell) {
    this.scene = scene;
    this.cell = cell;
    this.id = id;
}

Piece.prototype.setCell = function (cell) {
    this.cell = cell;
}

//classe com apontador para um tile

//objetivos:
// Criar
// Definir e atualizar o estado da peça
// Desenhar
// Deslocar entre tile de origem e tile de destino