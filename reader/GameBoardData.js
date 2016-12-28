 /**
 * Data Struct of MyGameBoardData
 * Descendent of MyPrimitive
 */
 function GameBoardData(id,board,initialCoord) {
     this.id = id;
	 this.board = board;
	 this.initialCoord = initialCoord;
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

 GameBoardData.prototype.getInitCoord = function(){
     return this.initialCoord;
 }
