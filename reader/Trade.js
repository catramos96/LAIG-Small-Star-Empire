/**
 * Descendent of Piece
 */
function Trade(scene,data,cell,team) {
    this.piece = new MyCylinder(scene,new MyCylinderData("tr",0.4,0.4,0.8,10,5));
    Piece.call(this,scene,data.getId(),cell,team);
}

Trade.prototype = Object.create(Piece.prototype);

Trade.prototype.display = function(){
    this.scene.pushMatrix();
        this.scene.translate(1,0.1,1);
        this.scene.rotate(-Math.PI/2,1,0,0);
        this.piece.display();
    this.scene.popMatrix();
}