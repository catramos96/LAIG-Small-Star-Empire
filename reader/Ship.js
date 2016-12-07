/**
 * Descendent of Piece
 */
function Ship(scene,data) {
    this.piece = new MyVehicle(scene);
    Piece.call(this,scene,data.getId(),this.piece);
}

Ship.prototype = Object.create(Piece.prototype);