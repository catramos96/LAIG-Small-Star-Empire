/**
 * Class AuxiliarBoard derived from Board
 * @param scene
 * @param id
 * @param color
 * @param initialCoord
 * @constructor
 */
function AuxiliarBoard(scene,id,color,initialCoord) {

	this.team = 0;
    this.id = id;
    this.color = color;
    this.initialCoord = initialCoord;

	if(color == "red")
	{
        this.team = 1;
	}
    else if(color == "blue")
    {
        this.team = 2;
    }

    var boardM =   [[-2,0,0,0,0],
					[-1,0,0,0,0,0],
					[0,0,0,0,0,0],
       				[-1,0,0,0,0,0],
        			[-2,0,0,0,0]];

    Board.call(this,scene,id,boardM,initialCoord);
 }

AuxiliarBoard.prototype = Object.create(Board.prototype);

/**
 * Method that transverses the board matrix and returns the first cell with some piece instance of the structure received
 * @param structure colony, trade or ship
 * @returns cell or null if there is no piece
 */
AuxiliarBoard.prototype.getFirstPiece = function(structure) {

    for(var i = 0; i < this.boardCells.length; i++)
    {
        for (var j = 0; j < this.boardCells[i].length; j++)
        {
            var piece = this.boardCells[i][j].getPiece();

            if(piece instanceof structure)
                return this.boardCells[i][j];
        }
    }
    return null;
}

/**
 * Color of the team
 * @returns color
 */
AuxiliarBoard.prototype.getColor = function() {
    return this.color;
}

/*
 Creates the cell with the correct texture and id and pushes to the boardCells
 */
AuxiliarBoard.prototype.createCell = function(id,type,coords,pos) {

    var texture = this.textureSelector(type);

    var piece = null;
    var ship = null;
    if(id <= 16){
    	piece = new Colony(this.scene,new ColonyData(id),null,this.team);
	}else if(id >= 17 && id <= 20){
        piece = new Trade(this.scene,new TradeData(id),null,this.team);
	}else if(id >= 21 && id <= 24) {
        ship = new Ship(this.scene,new ShipData(id),null,this.team);
    }

    var cell = new Cell(id,this.scene,coords,pos,texture,this,ship,piece);
	if(piece != null)
		piece.setCell(cell);
	if(ship != null)
        ship.setCell(cell);

	return cell;
}