/**
 * Descendent of Piece
 */
function Ship(scene,data,cell,team) {
    this.piece = new MyVehicle(scene);
    Piece.call(this,scene,data.getId(),cell,team);

    this.transformation = new MyTransformation(data.getId());
    this.transformation.translate(0.5,0.1,0.5);
}

Ship.prototype = Object.create(Piece.prototype);

Ship.prototype.displayAux = function(animTransformation){
    this.scene.pushMatrix();

        this.scene.multMatrix(animTransformation.getMatrix());
        this.scene.multMatrix(this.transformation.getMatrix());

        var appearance = this.appearance;
        appearance.setTexture(this.texture);
        appearance.apply();
        this.piece.display();

    this.scene.popMatrix();
}