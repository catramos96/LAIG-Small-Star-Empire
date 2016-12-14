/**
 * Super classe Piece
 */
function Piece(scene,id,piece) {
    this.scene = scene;
    this.piece = piece;
    this.id = id;
}

Piece.prototype.display = function(){
    this.piece.display();
}

//classe com apontador para um tile

//objetivos:
// Criar
// Definir e atualizar o estado da peça
// Desenhar
// Deslocar entre tile de origem e tile de destino