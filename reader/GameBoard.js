/*
Class MyGameBoard
*/
 function GameBoard(scene) {
     var boardM =  [[-1,1,0,2,4,3,0,1],		
                     [0,61,3,7,0,0,2,5],
                     [-1,2,0,0,3,2,4,1],
                     [7,2,0,1,0,7,0,3],
                     [-1,3,4,0,5,2,1,3],
                     [5,7,3,7,0,3,62,2],
                     [-1,2,0,0,1,3,0,1]];
                     
   Board.call(this,scene,boardM);
 }
GameBoard.prototype = Object.create(Board.prototype);

/*
 Creates the cell with the correct texture and id and pushes to the boardCells
 */
GameBoard.prototype.createCell = function(id,type) {

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
        case 0:
        {
            texture = this.text_0planet;
            break;
        }
        case 1:
        {
            texture = this.text_1planet;
            break;
        }
        case 2:
        {
            texture = this.text_2planet;
            break;
        }
        case 3:
        {
            texture = this.text_3planet;
            break;
        }
        case 4:
        {
            texture = this.text_rnebula;
            break;
        }
        case 5:
        {
            texture = this.text_bnebula;
            break;
        }
        case 61:
        {
            texture = this.text_rhomeworld;
            break;
        }
        case 62:
        {
            texture = this.text_bhomeworld;
            break;
        }
        case 7:
        {
            texture = this.text_blackhole;
            break;
        }
    }

    return new Cell(id,this.scene,texture,this,null);
}

GameBoard.prototype.getCell = function(row,column) {
       
}

GameBoard.prototype.move = function(oldcol, oldrow, newcol, newrow) {

}