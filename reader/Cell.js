/*
Class MyCell
*/
 function Cell(id,scene,texture,board,piece) {
     CGFobject.call(this,scene);
     this.scene = scene;
     this.id = id;
     this.board = board;    //apontador para o tabuleiro a que pertence
     this.piece = piece;    //apontador para a peca que ocupa esta celula
     this.selected = 0;
     this.texture = texture;

     var appearances = this.scene.getMaterials();
     this.defaultAppearance = appearances.get("shiny").getAppearance();

     this.cell = new MyCylinder(scene,new MyCylinderData(id,1,1,0.1,6,5));
 }

 Cell.prototype = Object.create(CGFobject.prototype);

 Cell.prototype.setSelected = function(selected) {
    this.selected = selected;
 }

Cell.prototype.setSelected = function(selected) {
    this.selected = selected;
}

Cell.prototype.setPiece = function(piece) {
    this.piece = piece;

    if(piece != null)
        this.piece.setCell(this);
}

Cell.prototype.getCoords = function() {

}

 Cell.prototype.display = function() {
     this.board.cellShader.setUniformsValues({selected: this.selected});
     this.board.cellShader.setUniformsValues({uSampler: 0});

     this.scene.pushMatrix();
        this.scene.translate(1,0,1);
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.rotate(-Math.PI/2,1,0,0);

        var appearance = this.defaultAppearance;
        appearance.setTexture(this.texture);
        appearance.apply();
        this.cell.display();
        this.defaultAppearance.apply();
    this.scene.popMatrix();
 };

Cell.prototype.displayPiece = function(id) {
    if(this.piece != null)
    {
        this.board.pieceShader.setUniformsValues({selected: this.selected});
        this.board.pieceShader.setUniformsValues({team: this.piece.getTeam()});
        this.board.pieceShader.setUniformsValues({uSampler: 0});

        this.scene.registerForPick(id, this.piece);

        this.piece.display();
    }
}