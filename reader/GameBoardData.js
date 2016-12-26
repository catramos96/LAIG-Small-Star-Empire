 /**
 * Data Struct of MyGameBoardData
 * Descendent of MyPrimitive
 */
 function GameBoardData(id,board) {
     this.id = id;
	 this.board = board;
 }

 GameBoardData.prototype = new MyPrimitive(this.id);
 GameBoardData.prototype.constructor = GameBoardData;
 
/*
GETS
*/
 GameBoardData.prototype.getId = function(){
     return this.id;
 }
 
 GameBoardData.prototype.getBoard = function(){
     return this.board;
 }
