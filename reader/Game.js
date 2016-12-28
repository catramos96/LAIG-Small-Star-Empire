/*
 Class Game
 */
function Game(scene,mode,difficulty) {
    this.scene = scene;
    this.mode = mode;
    this.difficulty = difficulty;

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

	this.prolog = new Prolog(this);

    //criacao de um board e dois boards auxiliares
    this.board = new GameBoard(this.scene,new GameBoardData(100,[[]]));
	
    //os tabuleiros auxiliares ja sao criados com as suas pecas
    this.boardAux1 = new AuxiliarBoard(scene, new AuxiliarBoardData(200,"blue"));
    this.boardAux2 = new AuxiliarBoard(scene, new AuxiliarBoardData(300,"red"));

    //criacao dos jogadores ainda sem informacoes
    this.player1 = new Player("Blue");
    this.player2 = new Player("Red");
    this.turn = this.player1;	//default

    this.pieceSelected = null;
    this.cellSelected = null;

    this.initInfo = [modeName, difficultyName];
    this.finalInfo = [null, 0, 0];
	
	//TEMPORARIO
	this.init(2,difficulty + 1,mode + 1);
}

Game.prototype.init = async function(BoardSize,Nivel,Mode){
    this.state = 'INIT';
	this.prolog.makeRequest("initGame(" + BoardSize + "," + Nivel + "," + Mode + ")",1);
	await sleep(500);
	console.log(this.player1);
	console.log(this.player2);
	console.log("First Player - " + this.turn.team);

}

Game.prototype.createPlayer = function(team,type,ships){
	if(team == 1){
		this.player1.setType(type);
		this.player1.setShips(ships);
		this.player1.setHomeBase(ships[0]);
	}
	else if(team == 2){
		this.player2.setType(type);
		this.player2.setShips(ships);
		this.player2.setHomeBase(ships[0]);
	}
	
}

Game.prototype.picking = function (obj,id) {

    if(obj instanceof Piece && (this.state == 'SEL_SHIP' || this.state == 'SEL_PIECE'))
    {
        var cell = obj.getCell();   //descobrir qual e a sua celula
        cell.setSelected(true);     //marcar essa celula como selecionada (depois ele marca a peca correspondente)

        if(this.pieceSelected != null && this.pieceSelected != obj)
            this.pieceSelected.getCell().setSelected(false);

        this.pieceSelected = obj;

        this.changeState(); //já escolheu a peca, pode mudar de estado
    }
    else if((obj instanceof Cell && this.state == 'SEL_TILE'))
    {
        var valid = true; //verificar se e uma peca valida em PROLOG

        if(valid)
        {
            this.cellSelected = obj;

            this.cellSelected.setSelected(true);
            this.changeState(); //já escolheu a celula, pode mudar de estado
        }
    }

    if(this.state == 'ANIM1' || this.state == 'ANIM2')
    {
        this.move(this.pieceSelected,this.pieceSelected.getCell(),this.cellSelected);
        this.pieceSelected = null;

        if(this.state == 'ANIM2')
            this.cellSelected = null;
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

    //Acabou o movimento, mudo de estado
    this.changeState();
}

Game.prototype.endedGame = function (){
    this.finalInfo = [this.player1.team, 0, 0];  //atualiza esta informacao

    this.scene.interface.addFinalGameInfo();
    this.scene.interface.removeSomeInfo();
}

Game.prototype.changeState = function () {

    switch(this.state){
        case 'INIT':
            if(this.turn.type == "Human"){
                this.state = 'SEL_SHIP';
            }else{
                this.state = 'BOT';
                //chama uma funcao qql que escolhe a jogada do bot
            }
            break;
        case 'SEL_SHIP':
            this.state = 'SEL_TILE';
            break;
        case 'SEL_TILE':
            this.state = 'ANIM1';
            break;
        case 'ANIM1':
            if(this.turn.type == "Human"){
                this.state = 'SEL_PIECE';
            }else{
                this.state = 'ANIM2';
            }
            break;
        case 'SEL_PIECE':
            this.state = 'ANIM2';
            //executa o movimento aqui (?) para o mesmo tile de ao bocado
            break;
        case 'ANIM2':
            var hasPossibleMoves = true;    //verifica se ainda ha jogadas possiveis

            if(hasPossibleMoves)
                this.state = 'NEXT_TURN';
            else
                this.state = 'END';
            break;
        case 'NEXT_TURN':
            if(this.turn == this.player1)
                this.turn = this.player2;
            else
                this.turn = this.player1;
            break;
        case 'BOT':
            this.state = 'ANIM1';
            //executa aqui o movimento (?)
            break;
        case 'END':
            this.endedGame();
            break;
        default:
            this.state = 'END';
    }

}

Game.prototype.undo = function (){

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

Game.prototype.setGameBoard = function(board){
    /*Init Board*/
    this.board.setBoard(board);
}

Game.prototype.setTurn = function(player){
    this.turn = player;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}