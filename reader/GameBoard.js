/*
Class MyGameBoard
*/
 function GameBoard(scene,data) {
     var boardM =  [[0,[1,-1,0],[5,-1,0],[2,-1,0],[0,-1,0]],		
					[[4,-1,0],[6,0,4],[3,-1,0],[7,-1,0],[3,-1,0]],
					[0,[2,-1,0],[0,-1,0],[4,-1,0],[1,-1,0]],
					[[7,-1,0],[2,-1,0],[5,-1,0],[6,2,4],[0,-1,0]],
					[0,[3,-1,0],[5,-1,0],[0,-1,0],[4,-1,0]]]
                     

  // Board.call(this,scene,data.getId(),boardM);
  if(data.getBoard().length == 1)
  		Board.call(this,scene,data.getId(),boardM);
  else
   		Board.call(this,scene,data.getId(),data.getBoard());
 
 }
 
 GameBoard.prototype = Object.create(Board.prototype);

/*
 Creates the cell with the correct texture and id and pushes to the boardCells
 */
GameBoard.prototype.createCell = function(id,type) {
    var texture = this.textureSelector(type);
    return new Cell(id,this.scene,texture,this,null);
}

GameBoard.prototype.getCell = function(row,column) {
       
}

GameBoard.prototype.move = function(oldcol, oldrow, newcol, newrow) {

}