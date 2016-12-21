/**
 * Descendent of Piece
 */
function Ship(scene,data,cell) {
    this.piece = new MyVehicle(scene);
    Piece.call(this,scene,data.getId(),cell);
}

Ship.prototype = Object.create(Piece.prototype);

Ship.prototype.display = function(){
    this.scene.pushMatrix();
        this.scene.translate(0.5,0.1,0.5);
        this.piece.display();
    this.scene.popMatrix();
}