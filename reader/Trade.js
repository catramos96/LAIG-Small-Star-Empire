/**
 * Descendent of Piece
 */
function Trade(scene,data,cell) {
    this.piece = new MyCylinder(scene,new MyCylinderData("tr",0.4,0.4,0.8,10,5));
    this.cell = cell;
    Piece.call(this,scene,data.getId(),this.cell);
}

Trade.prototype = Object.create(Piece.prototype);

Trade.prototype.display = function(){
    this.piece.display();
}