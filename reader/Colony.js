/**
 * Descendent of Piece
 */
function Colony(scene,data,cell,team) {
    this.piece = new MyCylinder(scene,new MyCylinderData("col",0.4,0,0.8,10,5));
    this.cell = cell;
    this.id = data.getId();

    Piece.call(this,scene,this.id,cell,team);

    this.transformation = new MyTransformation(data.getId());
    this.transformation.rotate('x',-Math.PI/2);
    this.transformation.translate(1,-1,0.1);
}

Colony.prototype = Object.create(Piece.prototype);

Colony.prototype.updateTransformation = function()
{
    this.transformation = new MyTransformation(this.id);
    this.transformation.rotate('x',-Math.PI/2);
    //se a celula onde estou tem um ship, devo colocar a peca mais a cima
    if(this.cell.getShip != null) {
        this.transformation.translate(1, -1.3, 0.1);
        console.log(aqui);
    }
    else
        this.transformation.translate(1,-1,0.1);
}


Colony.prototype.displayAux = function(animTransformation){
    this.scene.pushMatrix();

        this.scene.multMatrix(animTransformation.getMatrix());
        this.scene.multMatrix(this.transformation.getMatrix());

        var appearance = this.appearance;
        appearance.setTexture(this.texture);
        appearance.apply();
        this.piece.display();

    this.scene.popMatrix();
}
