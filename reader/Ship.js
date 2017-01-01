/**
 * Descendent of Piece
 */
function Ship(scene,data,cell,team) {
    this.piece = new MyVehicle(scene);
    this.cell = cell;					/*Pointer to the cell where the ship is*/
    this.id = data.getId();

    Piece.call(this,scene,this.id,cell,team);

    this.transformation = new MyTransformation(data.getId());
    this.transformation.translate(0.5,0.1,0.5);
}

Ship.prototype = Object.create(Piece.prototype);

/*
@brief Function that updates the transformation on the ship
*/
Ship.prototype.updateTransformation = function()
{
    this.transformation = new MyTransformation(this.id);
    //se a celula onde estou tem outra peca, devo colocar o ship mais a baixo
    if(this.cell.getPiece != null){
        this.transformation.translate(0.5,0.1,0.2);
    }
    else
        this.transformation.translate(0.5,0.1,0.5);
}

/*
@brief Function that displays the ship piece
*/
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