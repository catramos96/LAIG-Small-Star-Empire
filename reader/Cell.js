/*
@brief Class MyCell
*/
 function Cell(id,scene,coords,pos,texture,board,ship,piece) {
     CGFobject.call(this,scene);
     this.scene = scene;
     this.id = id;
     this.board = board;   	 	//pointer to the board
     this.piece = piece;    	//pointer to the piece that occupies the cell(trade/colony)
     this.ship = ship;      	//pointer to the ship that occupies the cell
     this.selected = 0;			//if the cell is selected
     this.canMoveTo = 0;		//if the cell is one of the valid ones for the movement
     this.texture = texture;
     this.coords = coords;		//coordenates of the cell in the scene
     this.pos = pos;			//position of the cell in the board

     var appearances = this.scene.getMaterials();
     this.defaultAppearance = appearances.get("shiny").getAppearance();

     this.cell = new MyCylinder(scene,new MyCylinderData(id,1,1,0.1,6,5));
 }

 Cell.prototype = Object.create(CGFobject.prototype);

 /*
 SETS
 */
 
 /*
 @brief Function that sets the cell's selected attributes
 @param selected
 */
 Cell.prototype.setSelected = function(selected) {
    this.selected = selected;
 }

 /*
 @brief Function that sets the cell's canMoveTo attribute
 @param canMove
 */
 Cell.prototype.setCanMove = function(canMove) {
     this.canMoveTo = canMove;
    // console.log("set: "+this.canMoveTo);
 }

 /*
 @brief Function that sets the cell's piece attribute
 @param piece
 */
Cell.prototype.setPiece = function(piece) {
    this.piece = piece;

    if(piece != null)
        this.piece.setCell(this);
}

 /*
 @brief Function that sets the cell's ship attribute
 @param ship
 */
Cell.prototype.setShip = function(ship) {
    this.ship = ship;

    if(ship != null)
        this.ship.setCell(this);
}

/*
GETS
*/

 /*
 @brief Function that gets the cell's id attribute
 @returns id
 */
Cell.prototype.getId = function() {
    return this.id;
}

 /*
 @brief Function that gets the cell's coordinates attribute
 @returns coords
 */
Cell.prototype.getCoords = function() {
     return this.coords;
}

 /*
 @brief Function that gets the cell's position attribute
 @returns pos
 */
Cell.prototype.getPos = function() {
    return this.pos;
}

 /*
 @brief Function that gets the cell's board attribute
 @returns board 
 */
Cell.prototype.getBoard = function() {
    return this.board;
}

 /*
 @brief Function that gets the cell's piece attribute
 @returns piece 
 */
Cell.prototype.getPiece = function() {
    return this.piece;
}

 /*
 @brief Function that gets the cell's ship attribute
 @returns ship
 */
Cell.prototype.getShip = function() {
    return this.ship;
}

/*
DISPLAYS
*/

 /*
 @brief Function that displays the cell and the cell's shader (or not)
 */
 Cell.prototype.display = function() {
     this.board.cellShader.setUniformsValues({selected: this.selected});
     this.board.cellShader.setUniformsValues({canMove: this.canMoveTo});
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

  /*
 @brief Function that displays or not the shader on the piece
 */
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