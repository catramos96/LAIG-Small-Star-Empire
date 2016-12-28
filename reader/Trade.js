/**
 * Descendent of Piece
 */
function Trade(scene,data,cell,team) {
    this.piece = new MyCylinder(scene,new MyCylinderData("tr",0.4,0.4,0.8,10,5));
    Piece.call(this,scene,data.getId(),cell,team);

    this.transformation = new MyTransformation(data.getId());
    this.transformation.rotate('x',-Math.PI/2);
    this.transformation.translate(1,-1,0.1);
}

Trade.prototype = Object.create(Piece.prototype);

Trade.prototype.displayAux = function(animTransformation){
    this.scene.pushMatrix();

        this.scene.multMatrix(animTransformation.getMatrix());
        this.scene.multMatrix(this.transformation.getMatrix());

        var appearance = this.appearance;
        appearance.setTexture(this.texture);
        appearance.apply();
        this.piece.display();

    this.scene.popMatrix();

}