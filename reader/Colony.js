/**
 * Descendent of Piece
 */
function Colony(scene,data,cell,team) {
    this.piece = new MyCylinder(scene,new MyCylinderData("col",0.4,0,0.8,10,5));
    Piece.call(this,scene,data.getId(),cell,team);
}

Colony.prototype = Object.create(Piece.prototype);

//mudar isto
Colony.prototype.displayAux = function(){
    var appearance = this.appearance;
    appearance.setTexture(this.texture);

    this.scene.translate(1,0.1,1);
    this.scene.rotate(-Math.PI/2,1,0,0);
    appearance.apply();
    this.piece.display();
}
