/*
Class MyGameBoard
*/
 function MyGameBoard(scene) {
     CGFobject.call(this,scene);
     this.scene = scene;

     this.boardM =   [[0,[1,-1,0],[0,-1,0],[2,-1,0],[4,-1,0],[3,-1,0],[0,-1,0],[1,-1,0]],		
                     [[0,-1,0],[6,0,4],[3,-1,0],[7,-1,0],[0,-1,0],[0,-1,0],[2,-1,0],[5,-1,0]],
                     [0,[2,-1,0],[0,-1,0],[0,-1,0],[3,-1,0],[2,-1,0],[4,-1,0],[1,-1,0]],
                     [[7,-1,0],[2,-1,0],[0,-1,0],[1,-1,0],[0,-1,0],[7,-1,0],[0,-1,0],[3,-1,0]],
                     [0,[3,-1,0],[4,-1,0],[0,-1,0],[5,-1,0],[2,-1,0],[1,-1,0],[3,-1,0]],
                     [[5,-1,0],[7,-1,0],[3,-1,0],[7,-1,0],[0,-1,0],[3,-1,0],[6,2,4],[2,-1,0]],
                     [0,[2,-1,0],[0,-1,0],[0,-1,0],[1,-1,0],[3,-1,0],[0,-1,0],[1,-1,0]]];

     this.cellsPos = [];
     this.boardCells = [];

     this.init();
 }

 MyGameBoard.prototype = Object.create(CGFobject.prototype);

 MyGameBoard.prototype.init = function(){
    
    var row = [];
    var xpos = 0;
    var zpos = 0;
    var nrows_max = this.boardM.length;
    var ncolumn_max = this.boardM[0].length;

    for(var i = 0; i < this.boardM.length;i++){            //row
        xpos = 0;

        for(var j = 0; j < this.boardM[i].length;j++){     //column

          if(this.boardM[i].length > ncolumn_max)
            ncolumn_max = this.boardM[i].length;

          if(this.boardM[i][j] == 0)
            xpos += 0.9;
          else{
              
               this.boardCells.push(new MyCell(this.scene));
               this.cellsPos.push(new MyPoint(xpos,0,zpos));
               xpos += 1.8;
          }
        }

        zpos += 1.6;
    }

    if(ncolumn_max*2 > nrows_max*1.7)           /*scale para board unitario*/
        this.scale = 1/(ncolumn_max*1.8);
    else
        this.scale = 1/(nrows_max*1.6);
 }

 MyGameBoard.prototype.display = function() {

    var x = 0, y = 0, z = 0;
    this.scene.pushMatrix();

       this.scene.scale(this.scale,this.scale,this.scale);
        
        for(var i = 0; i < this.boardCells.length;i++){        

            x = this.cellsPos[i].getX();
            y = this.cellsPos[i].getY();
            z = this.cellsPos[i].getZ();

            this.scene.pushMatrix();
                this.scene.translate(x,y,z);
                this.boardCells[i].display();
            this.scene.popMatrix();
        }
     this.scene.popMatrix();
 };
