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

    //peca selecionada
    this.pieceSelected = null;
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
    //aqui vai ter restricoes tipo,é a vez do jogador 1 jogar, tem de escolher avioes, tem de esoclher colonias... etc
    if(obj instanceof Piece)
    {
        var cell = obj.getCell();   //descobrir qual e a sua celula
        cell.setSelected(true);     //marcar essa celula como selecionada (depois ele marca a peca correspondente)
        this.pieceSelected = obj;
    }
    else if(obj instanceof Cell)
    {
        if(this.pieceSelected != null) //verificar se ja ha uma peca selecionada
        {
            this.move(this.pieceSelected,this.pieceSelected.getCell(),obj);
            this.pieceSelected = null;
        }
    }
}

Game.prototype.move = function (piece, origin, dest) {
    var pointO = origin.getCoords();
    var pointD = dest.getCoords();

    piece.move(pointO,pointD);

    //retira a peca da celula de origem
    //retira a selecao

    //coloca a peca na celula de destino
    //retira a selecao
}