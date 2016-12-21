/*
Class NewChessBoard
Modification of MyChessBoard where you can choose your planeDimensions
*/
function AuxiliarBoard(scene, data) {

	var x = 0;
	if(data.getColor() == "red")
	{
		x = 10;
	}
    else if(data.getColor() == "blue")
    {
        x = 11;
    }

    var boardM =   [[-2,x,x,x,x],
					[-1,x,x,x,x,x],
					[x,x,x,x,x,x],
       				[-1,x,x,x,x,x],
        			[-2,x,x,x,x]];

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
    switch(type){
        case 10:
        {
            texture = this.textRed_aux;
            break;
        }
        case 11:
        {
            texture = this.textBlue_aux;
            break;
        }
    }

    var piece = null;
    if(id <= 16){
    	piece = new Colony(this.scene,new ColonyData(id),null);
	}else if(id >= 17 && id <= 20){
        piece = new Trade(this.scene,new TradeData(id),null);
	}else if(id >= 21 && id <= 24) {
        piece = new Ship(this.scene,new ShipData(id),null);
    }

    var cell = new Cell(id,this.scene,texture,this,piece);
	if(piece != null)
		piece.setCell(cell);
	return cell;
}