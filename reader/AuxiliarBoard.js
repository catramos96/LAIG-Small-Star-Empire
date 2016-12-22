/*
Class NewChessBoard
Modification of MyChessBoard where you can choose your planeDimensions
*/
function AuxiliarBoard(scene, data) {

	this.team = 0;
	if(data.getColor() == "red")
	{
        this.team = 1;
	}
    else if(data.getColor() == "blue")
    {
        this.team= 2;
    }

    var boardM =   [[-2,0,0,0,0],
					[-1,0,0,0,0,0],
					[0,0,0,0,0,0],
       				[-1,0,0,0,0,0],
        			[-2,0,0,0,0]];

    Board.call(this,scene,boardM);
 }

AuxiliarBoard.prototype = Object.create(Board.prototype);

/*
 Creates the cell with the correct texture and id and pushes to the boardCells
 */
AuxiliarBoard.prototype.createCell = function(id,type) {

    var texture = null;
	/*
	 systemType(0,'S',0).		%ZeroPlanet
	 systemType(1,'S',1).		%OnePlanet
	 systemType(2,'S',2).		%TwoPlanet
	 systemType(3,'S',3).		%ThreePlanet
	 systemType(4,'N','R').		%NebulaRed
	 systemType(5,'N','B').		%NebulaBlue
	 systemType(6,'H',' ').		%HomeWorld
	 systemType(7,'B',' ').	    %blackhole
	 */
    switch(this.team){
        case 1:
        {
            texture = this.textRed_aux;
            break;
        }
        case 2:
        {
            texture = this.textBlue_aux;
            break;
        }
    }

    var piece = null;
    if(id <= 16){
    	piece = new Colony(this.scene,new ColonyData(id),null,this.team);
	}else if(id >= 17 && id <= 20){
        piece = new Trade(this.scene,new TradeData(id),null,this.team);
	}else if(id >= 21 && id <= 24) {
        piece = new Ship(this.scene,new ShipData(id),null,this.team);
    }

    var cell = new Cell(id,this.scene,texture,this,piece);
	if(piece != null)
		piece.setCell(cell);
	return cell;
}