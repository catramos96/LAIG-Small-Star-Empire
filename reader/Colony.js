/**
 * Descendent of Piece
 */
function Colony(scene,data,cell) {
    this.piece = new MyCylinder(scene,new MyCylinderData("col",0.4,0,0.8,10,5));
    Piece.call(this,scene,data.getId(),this.cell);
}

Colony.prototype = Object.create(Piece.prototype);

Colony.prototype.display = function(){
    this.scene.pushMatrix();
        this.scene.translate(0,0,0.1);
        this.piece.display();
    this.scene.popMatrix();
}
