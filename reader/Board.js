/*
Class Board
*/

 function Board(scene,id,boardM,initialCoord) {

     this.scene = scene;
     this.id = id;
     this.initialCoord = initialCoord;

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

     this.boardM =  boardM;

     this.cellsPos = [];
     this.boardCells = [];

     this.init();
 }

 Board.prototype.init = function(){
    
    this.cellsPos = [];
    this.boardCells = [];

    var id = 1;
    var row = [];
    var xpos = this.initialCoord.getX();
    var zpos = this.initialCoord.getZ();
    var nrows_max = this.boardM.length;
    var ncolumn_max = this.boardM[0].length;
    
    var board_cells_row = [];
    var pos_cells_row = [];
    var my_coords;

    for(var i = 0; i < this.boardM.length;i++){            //row
        xpos = this.initialCoord.getX();
        board_cells_row = [];
        pos_cells_row = [];
        var aux = 1;

        for(var j = 0; j < this.boardM[i].length;j++){     //column

          if(this.boardM[i].length > ncolumn_max){
              ncolumn_max = this.boardM[i].length;
          }
          if(this.boardM[i][j] == -1){ //espaçamento inicial
              xpos += 0.9;
              aux--;
          }
          else if(this.boardM[i][j] == -2){//espaçamento de uma celula
              xpos += 1.8;
              aux--;
          }
          else{
               my_coords = new MyPoint(xpos,0,zpos);
               board_cells_row.push(this.createCell(id,this.boardM[i][j],my_coords,[i+1,j+aux]));
               pos_cells_row.push(my_coords);
               xpos += 1.8;            //next column
              id++; //cell id
          }
        }
        this.boardCells.push(board_cells_row);
        this.cellsPos.push(pos_cells_row);
        zpos += 1.6;    //next row
    }

    if(ncolumn_max*2 > nrows_max*1.7)           //scale para board unitario
        this.scale = 1/(ncolumn_max*1.8);
    else
        this.scale = 1/(nrows_max*1.6);
 }

 Board.prototype.cellInPos = function(pos) {
     console.log("comeca");
     for(var i = 0; i < this.boardCells.length; i++)
     {
         for (var j = 0; j < this.boardCells[i].length; j++)
         {
             var cellPos = this.boardCells[i][j].getPos();
             console.log(cellPos);

             if (cellPos[0] == pos[0] && cellPos[1] == pos[1]) {
                 return this.boardCells[i][j];
             }
         }
     }
 }

 Board.prototype.setBoard = function(board) {
    this.boardM = board;
    this.init();
 }

Board.prototype.getId = function(board) {
   return this.id;
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

            if(isCell)
            {
                this.scene.translate(x,y,z);
                this.scene.registerForPick(this.id + id, this.boardCells[i][j]);   //Picking da celula
                this.boardCells[i][j].display();    //display de uma celula
            }
            else
            {
                this.scene.registerForPick(this.id +id, this.boardCells[i][j]);   //picking da peca
                this.boardCells[i][j].displayPiece(this.id + id);    //display de uma peca
            }
            this.scene.popMatrix();
            id++;
        }
    }
    this.scene.popMatrix();

}

Board.prototype.textureSelector = function(type){
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
    var texture = null;
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
    return texture;
}
