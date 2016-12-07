 /**
 * Data Struct of MyGameBoardData
 * Descendent of MyPrimitive
 */
 function MyGameBoardData(id) {
     this.id = id;
 }

 MyGameBoardData.prototype = new MyPrimitive(this.id); 
 MyGameBoardData.prototype.constructor = MyGameBoardData;

/*
GETS
*/
 MyGameBoardData.prototype.getId = function(){
     return this.id;
 }
