/*
Class Board
*/
 function Board(scene,boardM) {

     this.scene = scene;

     this.cellShader = new CGFshader(this.scene.gl, "shaders/cell.vert", "shaders/cell.frag");
     this.pieceShader = new CGFshader(this.scene.gl, "shaders/piece.vert", "shaders/piece.frag");

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
              id++; //cell id
          }
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


 Board.prototype.display = function() {
     this.scene.logPicking();
     this.scene.clearPickRegistration();

     this.scene.setActiveShader(this.cellShader);
     this.displayAux(true);
     this.scene.setActiveShader(this.scene.defaultShader);

     this.scene.setActiveShader(this.pieceShader);
     this.displayAux(false);
     this.scene.setActiveShader(this.scene.defaultShader);
 };

Board.prototype.displayAux = function(isCell) {

    var x = 0, y = 0, z = 0, id = 1;
    this.scene.pushMatrix();
    this.scene.scale(this.scale,this.scale,this.scale);

    for(var i = 0; i < this.boardCells.length;i++){

        for(var j = 0; j < this.boardCells[i].length;j++){
            x = this.cellsPos[i][j].getX();
            y = this.cellsPos[i][j].getY();
            z = this.cellsPos[i][j].getZ();

            this.scene.pushMatrix();
            this.scene.translate(x,y,z);

            this.scene.registerForPick(id, this.boardCells[i][j]);   //Picking (duvida aqui)
            if(isCell)
            {
                this.boardCells[i][j].display();    //display de uma celula
            }
            else
            {
                this.boardCells[i][j].displayPiece();    //display de uma celula
            }
            this.scene.popMatrix();
            id++;
        }
    }
    this.scene.popMatrix();

}
