/*
 Class Game
 */
function Game(scene) {
    this.scene = scene;

    //criacao de um board e dois boards auxiliares
    this.board = new GameBoard(scene,new GameBoardData("mainBoard"));
    //os tabuleiros auxiliares ja sao criados com as suas pecas
    this.boardAux1 = new AuxiliarBoard(scene, new AuxiliarBoardData("blueBoard","blue"));
    this.boardAux2 = new AuxiliarBoard(scene, new AuxiliarBoardData("redBoard","red"));
}

Game.prototype.display = function () {
    this.scene.pushMatrix();
        this.scene.scale(10,10,10);
        this.board.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.translate(0,0,-7.5);
        this.scene.scale(7.5,7.5,7.5);
        this.boardAux1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2,0,1,0);
        this.scene.translate(-7.5,0,-7.5);
        this.scene.scale(7.5,7.5,7.5);
        this.boardAux2.display();
    this.scene.popMatrix();
}

Game.prototype.picking = function (obj,id) {
    
}