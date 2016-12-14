/*
Class MyGameBoard
*/
 function MyGameBoard(scene) {
     var boardM =  [[-1,1,0,2,4,3,0,1],		
                     [0,61,3,7,0,0,2,5],
                     [-1,2,0,0,3,2,4,1],
                     [7,2,0,1,0,7,0,3],
                     [-1,3,4,0,5,2,1,3],
                     [5,7,3,7,0,3,62,2],
                     [-1,2,0,0,1,3,0,1]];
                     
   Board.call(this,scene,boardM);
 }
MyGameBoard.prototype = Object.create(Board.prototype);
