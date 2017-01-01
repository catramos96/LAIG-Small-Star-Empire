/**
 * Class GameBoard derived from Board
 * @param scene
 * @param id
 * @param board
 * @param initialCoord
 * @constructor
 */
 function GameBoard(scene,id,board,initialCoord) {
    var boardM =  [[-1,1,0,2,4,3,0,1],		//default
                     [0,61,3,7,0,0,2,5],
                     [-1,2,0,0,3,2,4,1],
                     [7,2,0,1,0,7,0,3],
                     [-1,3,4,0,5,2,1,3],
                     [5,7,3,7,0,3,62,2],
                     [-1,2,0,0,1,3,0,1]];
                     

	if(board.length == 1)
  		Board.call(this,scene,id,boardM,initialCoord);
	else
   		Board.call(this,scene,id,board,initialCoord);
	
	this.prologRepresentation = "";
 }
 
 GameBoard.prototype = Object.create(Board.prototype);

/**
 * Get
 * @returns {*|GameBoard}
 */
GameBoard.prototype.getBoard = function(){
    return this.board;
 }

/**
 * Get
 * @returns {string|*}
 */
GameBoard.prototype.getPrologRepresentation = function() {
	return this.prologRepresentation;
 }

/**
 * Set
 * @returns {string|*}
 */
 GameBoard.prototype.setRepresentation = function(rep) {
    this.prologRepresentation = rep;
 }

/**
 * Creates the cell with the correct texture and id to be pushed to the boardCells
 * @param id
 * @param type
 * @param coords
 * @param pos
 * @returns {Cell}
 */
 GameBoard.prototype.createCell = function(id,type,coords,pos) {
    var texture = this.textureSelector(type);
    return new Cell(id,this.scene,coords,pos,texture,this,null,null);
 }