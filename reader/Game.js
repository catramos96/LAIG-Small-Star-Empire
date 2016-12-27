/*
 Class Game
 */
function Game(scene,mode,difficulty) {
    this.scene = scene;
    this.mode = mode;
    this.difficulty = difficulty;

	this.prolog = new Prolog(this);

    //criacao de um board e dois boards auxiliares
    this.board = new GameBoard(this.scene,new GameBoardData(100,[[]]));
	
    //os tabuleiros auxiliares ja sao criados com as suas pecas
    this.boardAux1 = new AuxiliarBoard(scene, new AuxiliarBoardData(200,"blue"));
    this.boardAux2 = new AuxiliarBoard(scene, new AuxiliarBoardData(300,"red"));
	
	//Players
	this.player1 = new Player("Red");
	this.player1 = new Player("Blue");

    this.pieceSelected = null;
    this.playerTurn = this.player1;

    switch (mode) {
        case 0: modeName = 'Player VS Player'; break;
        case 1: modeName = 'Player VS AI'; break;
        case 2: modeName = 'AI VS AI'; break;
        default: modeName = 'Player VS AI'; break;
    }
    switch (difficulty) {
        case 0: difficultyName = 'Easy'; break;
        case 1: difficultyName = 'Hard'; break;
        default: difficultyName = 'Easy'; break;
    }
	
    this.initInfo = [modeName, difficultyName];

    this.finalInfo = [null, 0, 0];

	this.turn = 1;	//default
	
	//TEMPORARIO
	this.gameInit(2,2,2);
}

Game.prototype.gameInit = async function(BoardSize,Nivel,Mode){
	this.prolog.makeRequest("initGame(" + BoardSize + "," + Nivel + "," + Mode + ")",1);
	await sleep(500);
	console.log(this.player1);
	console.log(this.player2);
	console.log("First Player - " + this.turn);
}

Game.prototype.undo = function (){

}

Game.prototype.endedGame = function (){

    this.finalInfo = [this.player1.team, 0, 0];  //atualiza esta informacao

    this.scene.interface.addFinalGameInfo();
    this.scene.interface.removeSomeInfo();
}

Game.prototype.createPlayer = function(team,type,ships){
	if(team == 1){
		this.player1 = new Player("Red");
		this.player1.setType(type);
		this.player1.setShips(ships);
		this.player1.setHomeBase(ships[0]);
	}
	else if(team == 2){
		this.player2 = new Player("Blue");
		this.player2.setType(type);
		this.player2.setShips(ships);
		this.player2.setHomeBase(ships[0]);
	}
	
}

Game.prototype.setGameBoard = function(board){
	/*Init Board*/
	this.board.setBoard(board);
}

Game.prototype.setTurn = function(player){
	this.turn = player;
}

Game.prototype.display = function() {
	
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

        if(this.pieceSelected != null && this.pieceSelected != obj)
            this.pieceSelected.getCell().setSelected(false);

        this.pieceSelected = obj;
    }
    else if(obj instanceof Cell)
    {
        if(this.pieceSelected != null) //verificar se ja ha uma peca selecionada
        {
            obj.setSelected(true);
            this.move(this.pieceSelected,this.pieceSelected.getCell(),obj);
            this.pieceSelected = null;
        }
    }
}

Game.prototype.move = function (piece, origin, dest) {
    var pointO = origin.getCoords();
    var pointD = dest.getCoords();

    piece.move(pointO,pointD);

    //retira a peca da celula de origem e a sua selecao
    origin.setSelected(false);
    origin.setPiece(null);

    //coloca a peca na celula de destino e retira a selecao
    dest.setSelected(false);
    dest.setPiece(piece);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}