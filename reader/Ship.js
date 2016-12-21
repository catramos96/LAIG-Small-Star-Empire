/**
 * Descendent of Piece
 */
function Ship(scene,data,cell) {
    this.piece = new MyVehicle(scene);
    this.cell = cell;
    this.scene = scene;
    Piece.call(this,scene,data.getId(),this.cell);
}

Ship.prototype = Object.create(Piece.prototype);

Ship.prototype.display = function(){
    this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.translate(-0.5,0,-0.5);
        this.piece.display();
    this.scene.popMatrix();
}