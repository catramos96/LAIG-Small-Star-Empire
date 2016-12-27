/*
Class MyGameBoard
*/
 function GameBoard(scene,data) {
     var boardM =  [[-1,1,0,2,4,3,0,1],		/*default*/
                     [0,61,3,7,0,0,2,5],
                     [-1,2,0,0,3,2,4,1],
                     [7,2,0,1,0,7,0,3],
                     [-1,3,4,0,5,2,1,3],
                     [5,7,3,7,0,3,62,2],
                     [-1,2,0,0,1,3,0,1]];
                     

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