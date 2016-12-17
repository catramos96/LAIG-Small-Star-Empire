/*
Class Board
*/
 function Board(scene,boardM) {

     this.scene = scene;
     
     var textures = this.scene.getTextures();

     /*Cells Textures depending on the system type*/

     this.text_0planet = textures.get("0planet").getAppearance();
     this.text_1planet = textures.get("1planet").getAppearance();
     this.text_2planet = textures.get("2planet").getAppearance();
     this.text_3planet = textures.get("3planet").getAppearance();
     this.text_rnebula = textures.get("rnebula").getAppearance();
     this.text_bnebula = textures.get("bnebula").getAppearance();
     this.text_blackhole = textures.get("blackhole").getAppearance();
     this.text_rhomeworld = textures.get("rhomeworld").getAppearance();
     this.text_bhomeworld = textures.get("bhomeworld").getAppearance();
     this.textRed_aux = textures.get("redblack").getAppearance();
     this.textBlue_aux = textures.get("blueblack").getAppearance();

     this.boardM =  boardM;

     this.cellsPos = [];
     this.boardCells = [];
     this.init();

     console.log(this.boardCells);
 }

 Board.prototype.init = function(){
    
    var id = 1;
    var row = [];
    var xpos = 0;
    var zpos = 0;
    var nrows_max = this.boardM.length;
    var ncolumn_max = this.boardM[0].length;
    
    var board_cells_row = [];
    var pos_cells_row = [];

    for(var i = 0; i < this.boardM.length;i++){            //row
        xpos = 0;
        board_cells_row = [];
        pos_cells_row = [];

        for(var j = 0; j < this.boardM[i].length;j++){     //column

          if(this.boardM[i].length > ncolumn_max)
            ncolumn_max = this.boardM[i].length;

          if(this.boardM[i][j] == -1) //espaçamento inicial
            xpos += 0.9;
          else if(this.boardM[i][j] == -2) //espaçamento de uma celula
            xpos += 1.8;
          else{
               board_cells_row.push(this.createCell(id,this.boardM[i][j]));
               pos_cells_row.push(new MyPoint(xpos,0,zpos));
               xpos += 1.8;            //next column
          }
          id++; //cell id
        }
        this.boardCells.push(board_cells_row);
        this.cellsPos.push(pos_cells_row);
        zpos += 1.6;    //next row
    }

    if(ncolumn_max*2 > nrows_max*1.7)           /*scale para board unitario*/
        this.scale = 1/(ncolumn_max*1.8);
    else
        this.scale = 1/(nrows_max*1.6);
 }

/*
Creates the cell with the correct texture and id and pushes to the boardCells
*/
 Board.prototype.createCell = function(id,type) {

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
         case 10:
         {
             texture = this.textRed_aux;
             break;
         }
         case 11:
         {
             texture = this.textBlue_aux;
             break;
         }
     }

    return new MyCell(id,this.scene,texture);
 }

 Board.prototype.display = function() {

    var x = 0, y = 0, z = 0;
    this.scene.pushMatrix();

       this.scene.scale(this.scale,this.scale,this.scale);
        
        for(var i = 0; i < this.boardCells.length;i++){        

            for(var j = 0; j < this.boardCells[i].length;j++){        
                x = this.cellsPos[i][j].getX();
                y = this.cellsPos[i][j].getY();
                z = this.cellsPos[i][j].getZ();

                this.scene.pushMatrix();
                    this.scene.translate(x,y,z);
                    //Picking
                     this.scene.registerForPick(i+1, this.boardCells[i][j]);
                    this.boardCells[i][j].display();
                this.scene.popMatrix();
             }
        }
     this.scene.popMatrix();
 };
