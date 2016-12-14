/**
 * Descendent of Piece
 */
function Trade(scene,data) {
    this.piece = new MyCylinder(scene,new MyCylinderData("tr",0.4,0.4,0.8,10,5));
    Piece.call(this,scene,data.getId(),this.piece);
}

Trade.prototype = Object.create(Piece.prototype);