 /**
 * Data Struct of MyGameBoardData
 * Descendent of MyPrimitive
 */
 function GameBoardData(id) {
     this.id = id;
 }

 GameBoardData.prototype = new MyPrimitive(this.id);
 GameBoardData.prototype.constructor = GameBoardData;

/*
GETS
*/
 GameBoardData.prototype.getId = function(){
     return this.id;
 }
