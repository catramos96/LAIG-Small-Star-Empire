/*
 Class Game
 */
possibleMoves = [];
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
    this.board = new GameBoard(this.scene,new GameBoardData(100,[[]],new MyPoint(-7.2,0,0)));
	
    //os tabuleiros auxiliares ja sao criados com as suas pecas
    this.boardAux1 = new AuxiliarBoard(scene, new AuxiliarBoardData(200,"blue", new MyPoint(1.2,0,-9)));
    this.boardAux2 = new AuxiliarBoard(scene, new AuxiliarBoardData(300,"red",new MyPoint(-12,0,-9)));

    //criacao dos jogadores ainda sem informacoes
    this.player1 = new Player("Blue");
    this.player2 = new Player("Red");
	
    this.turn = this.player1;	//default
	this.allMoves = [];			//para saber sequencia de jogadas

    this.currMove = null;

    this.initInfo = [modeName, difficultyName];
    this.finalInfo = [null, 0, 0];
	
	//TEMPORARIO
	this.init(1,difficulty + 1,mode + 1);
	
	
}

Game.prototype.getTurnInformation = async function(){
	this.prolog.makeRequest("possibleMoves(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() + ")",4);
	await sleep(500);
	possibleMoves = this.prolog.getServerResponse();
	
	this.changeState();
	
	/*
	Se for bot é preciso cha
	*/
	
	/*
	ApplyShader on possible moves
	*/
}

Game.prototype.makeMove = async function(CellI,CellF,Structure){
	var moveRequest;
	
	/*
	IR BUSCAR ESTAS INFORMAÇÕES A CELLI E CELLF !!!!!!!
	Structure = "'C'" ou "'T'"
	*/
	var RowI;
	var ColumnI;
	var RowF;
	var ColumnF;
	
	
	if(this.turn().getType() == "Human")
		moveRequest = "moveHuman(" + this.board.getPrologRepresentation() + "," + this.player1.getPrologRepresentation() + "," + RowI + "," + ColumnI + "," + "RowF" + "ColumnI" + "," + Structure + ")";
	//else(this.turn().getType() == "Computer") ...
	
	this.prolog.makeRequest(move,2);
	
	await sleep(500);
	var validMove = this.prolog.getServerResponse();
	
	/*
	Também se pode retornar este valor caso não seja para meter aqui a atualização dos estados de jogo
	*/
	if(validMove == 1){
		this.addMove(this.turn().CellI,CellF);
		this.changeTurn();
		this.state = 'INIT';
	}
	else if(validMove == 0){
		this.state='INIT';
	}
	else if(validMove == -1)
		this.state = 'END';
}


Game.prototype.addMove = function(Team,CellI,CellF){
	var move = new GameMove(this.turn(),CellI,CellF,this.player1.getPrologRepresentation(),this.player2.getPrologRepresentation(),this.board.getPrologRepresentation());
	this.allMoves.push(move);
	
	/*
		Outras coisas
	*/
}

/*
States
*/

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
            break;
        case 'END':
            this.endedGame();
            break;
        default:
            this.state = 'END';
    }

}

/*
GameInterations
*/

Game.prototype.picking = function (obj,id) {

    console.log(this.state);

    if(obj instanceof Piece && (this.state == 'SEL_SHIP' || this.state == 'SEL_PIECE'))
    {
        var team = obj.getTeam();
        var board = obj.getCell().getBoard().getId();

        //o objeto selecionado tem de ser da equipa correspondente
        // e se for trade ou colony tem de ser dum board auxiliar
        if((team == this.turn.getTeam()) && (this.state == 'SEL_PIECE' && board != 100)) {
            
            var cell = obj.getCell();   //descobrir qual e a sua celula
            cell.setSelected(true);     //marcar essa celula como selecionada (depois ele marca a peca correspondente)

            var lastPiece, lastCell;
            if(this.state == 'SEL_SHIP')
            {
                lastPiece = this.currMove.getShip();
                lastCell = this.currMove.getShipCell();
            }
            else if(this.state == 'SEL_SHIP')
            {
                lastPiece = this.currMove.getPiece();
                lastCell = this.currMove.getPieceCell();
            }

            if (lastPiece != null && lastPiece != obj)  //ja foi uma peca selecionada
            {
                lastCell.setSelected(false);
            }

            //adiciona a peca ao movimento
            if(this.state == 'SEL_SHIP')
                this.currMove.addShip(obj);
            else if(this.state == 'SEL_PIECE')
                this.currMove.addPiece(obj);

            this.changeState(); //já escolheu a peca, pode mudar de estado
        }
    }
    else if(obj instanceof Cell && this.state == 'SEL_TILE')
    {
        var idBoard = obj.getBoard().getId();

        if(id == 100)   //so posso selcionar celulas do board principal
        {
            var valid = true; //verificar se e uma peca valida em PROLOG

            if(valid)
            {
                this.currMove.addTile(obj);
                obj.setSelected(true);

                this.changeState(); //já escolheu a celula, pode mudar de estado
            }
        }
    }

    if(this.state == 'ANIM1'){
        this.currMove.makeShipMove();
        await sleep(2000);
        this.changeState(); //Acabou o movimento, mudo de estado
    }

    if(this.state == 'ANIM2') {
        this.currMove.makePieceMove();
        await sleep(2000);
        this.changeState(); //Acabou o movimento, mudo de estado
    }
}
/*
//ANTIGO SO PARA TESTES
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
}*/


Game.prototype.endedGame = function (){
    this.finalInfo = [this.player1.team, 0, 0];  //atualiza esta informacao

    this.scene.interface.addFinalGameInfo();
    this.scene.interface.removeSomeInfo();
}

Game.prototype.undo = function (){

}

/*
Shaders
*/

Game.prototype.applyShaderOnValidShips = function() {
    /*
     Shader em todas as células com os ships
     usar this.turn().obter a lista dos ships
     */
}

Game.prototype.applyShaderOnShipPossibleMoves = function(){
	/*
	Shader em todas as células de movimentos possiveis para o ship selecionado
	use:
	this.prolog.makeRequest("possibleMoves(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() + ")",4);
	await sleep(500);
	possibleMoves = this.prolog.getServerResponse();  -> Lista de movimentos possiveis (igual a prolog)
	
	*/
}

/*
INITS
*/

Game.prototype.createPlayer = function(team,type,ships,representation){
	if(team == 1){
		this.player1.setType(type);
		this.player1.setShips(ships);
		this.player1.setHomeBase(ships[0]);
		this.player1.setRepresentation(representation);
	}
	else if(team == 2){
		this.player2.setType(type);
		this.player2.setShips(ships);
		this.player2.setHomeBase(ships[0]);
		this.player2.setRepresentation(representation);
	}
}

Game.prototype.init = async function(BoardSize,Nivel,Mode){
    this.state = 'INIT';
	this.prolog.makeRequest("initGame(" + BoardSize + "," + Nivel + "," + Mode + ")",1);
	await sleep(500);

    console.log(this.player1.getPrologRepresentation());
    console.log(this.player2.getPrologRepresentation());
	console.log("First Player - " + this.turn.team);
}

/*
SETS
*/

Game.prototype.setGameBoard = function(board,representation){
    this.board.setBoard(board);
    this.board.setRepresentation(representation);
    console.log(this.board.getPrologRepresentation());
}

Game.prototype.setTurn = function(team){
    if(team == 1)
		this.turn = this.player1;
	else if(team == 2)
		this.turn = this.player2;
}

Game.prototype.changeTurn = function(){
    if(this.turn == this.player1)
		this.turn = this.player2;
	else
		this.turn = this.player1;
}

Game.prototype.setState = function(state){
    this.state = state;
	this.changeState();
}

/*
GETS
*/

Game.prototype.getTurn = function(){
    return this.turn;
}

Game.prototype.display = function() {

    this.scene.pushMatrix();
        this.scene.scale(10,10,10);
        this.board.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.scale(7.5,7.5,7.5);
        this.boardAux1.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
        this.scene.scale(7.5,7.5,7.5);
        this.boardAux2.display();
    this.scene.popMatrix();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}