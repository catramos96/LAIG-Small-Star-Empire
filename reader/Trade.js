/**
 * Descendent of Piece
 */
function Trade(scene,data,cell) {
    this.piece = new MyCylinder(scene,new MyCylinderData("tr",0.4,0.4,0.8,10,5));
    Piece.call(this,scene,data.getId(),this.cell);
}

Trade.prototype = Object.create(Piece.prototype);

Trade.prototype.display = function(){
    this.scene.pushMatrix();
        this.scene.translate(0,0,0.1);
        this.piece.display();
    this.scene.popMatrix();
}