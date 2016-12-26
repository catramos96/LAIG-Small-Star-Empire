/**
 * Descendent of Piece
 */
function Ship(scene,data,cell,team) {
    this.piece = new MyVehicle(scene);
    Piece.call(this,scene,data.getId(),cell,team);
}

Ship.prototype = Object.create(Piece.prototype);

Ship.prototype.displayAux = function(){
    var appearance = this.appearance;
    appearance.setTexture(this.texture);

    this.scene.translate(0.5,0.1,0.5);
    appearance.apply();
    this.piece.display();
}