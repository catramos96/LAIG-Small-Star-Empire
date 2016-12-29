/*
Class MyCell
*/
 function Cell(id,scene,coords,pos,texture,board,ship,piece) {
     CGFobject.call(this,scene);
     this.scene = scene;
     this.id = id;
     this.board = board;    //apontador para o tabuleiro a que pertence
     this.piece = piece;    //apontador para a peca que ocupa esta celula (trade/colony)
     this.ship = ship;      //apontador para a peca que ocupa esta celula (trade/colony)
     this.selected = 0;
     this.texture = texture;
     this.coords = coords;
     this.pos = pos;

     var appearances = this.scene.getMaterials();
     this.defaultAppearance = appearances.get("shiny").getAppearance();

     this.cell = new MyCylinder(scene,new MyCylinderData(id,1,1,0.1,6,5));
 }

 Cell.prototype = Object.create(CGFobject.prototype);

 Cell.prototype.setSelected = function(selected) {
    this.selected = selected;
 }

Cell.prototype.setPiece = function(piece) {
    this.piece = piece;

    if(piece != null)
        this.piece.setCell(this);
}

Cell.prototype.setShip = function(ship) {
    this.ship = ship;

    if(ship != null)
        this.ship.setCell(this);
}

Cell.prototype.getId = function() {
    return this.id;
}

Cell.prototype.getCoords = function() {
     return this.coords;
}

Cell.prototype.getPos = function() {
    return this.pos;
}

Cell.prototype.getBoard = function() {
    return this.board;
}

Cell.prototype.getPiece = function() {
    return this.piece;
}

Cell.prototype.getShip = function() {
    return this.ship;
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
    if(this.piece != null || this.ship != null)
    {
        this.board.pieceShader.setUniformsValues({selected: this.selected});
        this.board.pieceShader.setUniformsValues({uSampler: 0});

        if(this.piece != null)
        {
            this.board.pieceShader.setUniformsValues({team: this.piece.getTeam()});
            this.scene.registerForPick(id, this.piece);
            this.piece.display();
        }

        if(this.ship != null)
        {
            this.board.pieceShader.setUniformsValues({team: this.ship.getTeam()});
            this.scene.registerForPick(id, this.ship);
            this.ship.display();
        }
    }
}