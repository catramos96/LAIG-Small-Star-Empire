/**
 * Descendent of Piece
 */
function Colony(scene,data,cell) {
    this.piece = new MyCylinder(scene,new MyCylinderData("col",0.4,0,0.8,10,5));
    this.cell = cell;
    Piece.call(this,scene,data.getId(),this.cell);
}

Colony.prototype = Object.create(Piece.prototype);

Colony.prototype.display = function(){
    this.piece.display();
}
