/**
 * Descendent of Piece
 */
function Colony(scene,data) {
    this.piece = new MyCylinder(scene,new MyCylinderData("col",0.4,0,0.8,10,5));
    Piece.call(this,scene,data.getId(),this.piece);
}

Colony.prototype = Object.create(Piece.prototype);