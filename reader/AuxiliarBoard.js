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
