/**
 * Descendent of Piece
 */
function Trade(scene,data,cell,team) {
    this.piece = new MyCylinder(scene,new MyCylinderData("tr",0.4,0.4,0.8,10,5));
    this.cell = cell;			/*Pointer to the cell where the trade is*/
    this.id = data.getId();

    Piece.call(this,scene,this.id,cell,team);

    this.transformation = new MyTransformation(data.getId());
    this.transformation.rotate('x',-Math.PI/2);
    this.transformation.translate(1,-1,0.1);
}

Trade.prototype = Object.create(Piece.prototype);

/*
@brief Function that updates the trade's transformation
*/
Trade.prototype.updateTransformation = function()
{
    this.transformation = new MyTransformation(this.id);
    this.transformation.rotate('x',-Math.PI/2);
    //se a celula onde estou tem um ship, devo colocar a peca mais a cima
    if(this.cell.getShip != null) {
        this.transformation.translate(1, -1.4, 0.1);
    }
    else
        this.transformation.translate(1,-1,0.1);
}

/*
@brief Function that displays the trade
*/
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