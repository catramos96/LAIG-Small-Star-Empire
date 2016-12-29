/*
 Class Game

 1- vermelho
 2 - azul
 */
possibleMoves = [];
function Game(scene,mode,difficulty) {
    this.scene = scene;
    this.mode = mode;
    this.difficulty = difficulty;

	this.prolog = new Prolog(this);

    //criacao de um board e dois boards auxiliares
    this.board = new GameBoard(this.scene,new GameBoardData(100,[[]],new MyPoint(-7.2,0,0)));
	
    //os tabuleiros auxiliares ja sao criados com as suas pecas
    this.boardAux1 = new AuxiliarBoard(scene, new AuxiliarBoardData(200,"red", new MyPoint(1.2,0,-9)));
    this.boardAux2 = new AuxiliarBoard(scene, new AuxiliarBoardData(300,"blue",new MyPoint(-12,0,-9)));

    //inicializacao da sequencia
    this.gameSequence = new GameSequence();

    //criacao dos jogadores ainda sem informacoes
    this.player1 = new Player(1);
    this.player2 = new Player(2);
	
    this.turn = this.player1;	//default

    //para a interface
    switch (mode) {
        case 1: modeName = 'Player VS Player'; break;
        case 2: modeName = 'Player VS AI'; break;
        case 3: modeName = 'AI VS AI'; break;
        default: modeName = 'Player VS AI'; break;
    }
    switch (difficulty) {
        case 1: difficultyName = 'Easy'; break;
        case 2: difficultyName = 'Hard'; break;
        default: difficultyName = 'Easy'; break;
    }

    this.initInfo = [modeName, difficultyName];
    this.changingInfo = ["Red","Init"]
    this.finalInfo = [null, 0, 0];
	
	//TEMPORARIO
    this.init(2,1,1);
	//this.init(2,difficulty + 1,mode + 1);
}

/**
 * Metodo chamado no incio de cada turno
 */
Game.prototype.getTurnInformation = async function()
{
    //muda a turn na interface
    if(this.turn.getTeam() == 1)
        this.changingInfo[0] = "Red";
    else
        this.changingInfo[0] = "Blue";

    //verifica se existe algum ship no tabuleiro auxiliar. Se tiver, coloca-o na homebase
    this.moveShipToHB();
    this.gameSequence.addMove(new GameMove());  //nova jogada

    //verificacao das jogadas possiveis
	this.prolog.makeRequest("possibleMoves(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() + ")",4);
	await sleep(500);
	possibleMoves = this.prolog.getServerResponse();
}

Game.prototype.moveShipToHB = function()
{
    var homeBase = this.board.cellInPos(this.turn.homeBase);
    var ship = homeBase.getShip();

    if(ship == null)
    {
        var auxBoard;
        if(this.turn == this.player1)
            auxBoard = this.boardAux1;
        else
            auxBoard = this.boardAux2;

        for(var i = 1; i < 5;i++){
            var cell = auxBoard.cellInPos([5,i]);
            ship = cell.getShip();

            if(ship != null){
                //faz o movimento entre a coordenada auxiliar e a hb
                var move = new GameMove();
                move.addShip(ship); //ship a mover
                move.addTile(homeBase); //destino
                move.makeShipMove();
                break;
            }
        }
    }
}

Game.prototype.getPossibleMovesByShip = function(shipPos)
{
    //recebe o array de ships
    var info = this.prolog.parsePlayer(this.turn.getPrologRepresentation());
    var myShips = info[4];
    var hasShip = false;

    console.log("ships : ",info);

    //ve qual e o que tem as mesmas coordenadas
    for(var i = 0; i < myShips.length; i++)
    {
        if(myShips[i][0] == shipPos[0] && myShips[i][1] == shipPos[1]){
            return possibleMoves[i];
        }
    }

    return [];
}

Game.prototype.validMovement = function(shipPos,cellPos){

    console.log("recebe : ",shipPos,cellPos);

    var myCells = this.getPossibleMovesByShip(shipPos);

    if(myCells != [])
    {
        //ve se alguma das coordenadas e igual a cellPos
        console.log("possiveis",myCells);

        for(var j = 0; j < myCells.length; j++)
        {
            var shipI = myCells[j][0];
            var shipJ = myCells[j][1];

            if(myCells[j][0] == cellPos[0] && myCells[j][1] == cellPos[1])
                return true;
        }
    }
    return false;
}

Game.prototype.makeMove = async function(cellI,cellF,structure){
	var moveRequest;
	
	/*
	IR BUSCAR ESTAS INFORMAÇÕES A CELLI E CELLF !!!!!!!
	Structure = "'C'" ou "'T'"
	*/
	var rowI = cellI[0];
	var columnI = cellI[1];
	var rowF = cellF[0];
	var columnF = cellF[1];

	if(this.turn.getType() == "Human")
		moveRequest = "moveHuman(" + this.board.getPrologRepresentation() + "," + this.player1.getPrologRepresentation() +
            "," + rowI + "," + colI + "," + rowf + "," + colf + "," + structure + ")";

	//else(this.turn().getType() == "Computer") ...
	
	this.prolog.makeRequest(moveRequest,2);
	
	await sleep(500);
	var validMove = this.prolog.getServerResponse();

    return validMove;
	
	/*
	Também se pode retornar este valor caso não seja para meter aqui a atualização dos estados de jogo

	if(validMove == 1){
		this.addMove(this.turn().CellI,CellF);
	}*/
}

/*
Game.prototype.addMove = function(Team,CellI,CellF){
	var move = new GameMove(this.turn(),CellI,CellF,this.player1.getPrologRepresentation(),this.player2.getPrologRepresentation(),this.board.getPrologRepresentation());
	this.allMoves.push(move);
	

}
*/
/*
States
*/

Game.prototype.changeState = function () {

    switch(this.state){
        case 'INIT':
            this.getTurnInformation();

            if(this.turn.type == "Human")
            {
                this.changingInfo[1] = "Select Ship";
                this.state = 'SEL_SHIP';
            }
            else
            {
                this.changingInfo[1] = "AI turn";
                this.state = 'BOT';
                //chama uma funcao qql que escolhe a jogada do bot
            }
            break;
        case 'SEL_SHIP':
            this.changingInfo[1] = "Select cell";
            this.state = 'SEL_TILE';
            break;
        case 'SEL_TILE':
            this.changingInfo[1] = "Animation";
            this.state = 'ANIM1';
            break;
        case 'ANIM1':
            if(this.turn.type == "Human")
            {
                this.changingInfo[1] = "Select Piece";
                this.state = 'SEL_PIECE';
            }
            else
            {
                this.changingInfo[1] = "Animation";
                this.state = 'ANIM2';
            }
            break;
        case 'SEL_PIECE':
            this.changingInfo[1] = "Animation";
            this.state = 'ANIM2';
            break;
        case 'ANIM2':
            this.changingInfo[1] = "Next Turn";
            this.state = 'NEXT_TURN';
            this.changeState();
            break;
        case 'NEXT_TURN':
            //faz o movimento, se sucedido continua, se -1 termina o jogo
            var posI = this.gameSequence.currMove().getPieceCell().getPos();
            var posF = this.gameSequence.currMove().getTile().getPos();
            var piece = this.gameSequence.currMove().getPiece();
            var structure;
            if(piece instanceof Colony)
                structure = "C";
            else
                structure = "T";

            var hasPossibleMoves = this.makeMove(posI,posF,structure);

            if(hasPossibleMoves)
            {
                this.changeTurn();  //muda o turno e recomeca
                this.changingInfo[1] = "Init";
                this.state = 'INIT';
                this.changeState();
            }
            else
            {
                this.changingInfo[1] = "Game Over";
                this.state = 'END';
            }
            break;
        case 'BOT':
            this.changingInfo[1] = "AI TURN";
            this.state = 'NEXT_TURN';
            this.changeState();
            break;
        case 'END':
            this.gameOver();
            break;
        default:
            this.state = 'END';
    }

}

/*
GameInterations
*/

Game.prototype.picking = async function (obj,id) {

    var currMove = this.gameSequence.currMove();

    if(obj instanceof Piece)
    {
        var team = obj.getTeam();
        var board = obj.getCell().getBoard().getId();

        console.log(board,this.state,team,this.turn.getTeam());

        //o objeto selecionado tem de ser da equipa correspondente
        //e se for trade ou colony tem de ser dum board auxiliar
        //se for ship tem de ser no board principal
        //o seu estado tem de corresponder ao objeto
        if((team == this.turn.getTeam()) &&
            ((this.state == 'SEL_SHIP' && obj instanceof Ship && board == 100) ||
             (this.state == 'SEL_PIECE' && !(obj instanceof Ship) && board != 100)))
        {
            var cell = obj.getCell();   //descobrir qual e a sua celula
            cell.setSelected(true);     //marcar essa celula como selecionada (depois ele marca a peca correspondente)

           /* var lastPiece, lastCell;
            if(this.state == 'SEL_SHIP')
            {
                lastPiece = currMove.getShip();
                if(lastPiece != null)
                    lastCell = currMove.getShipCell();
            }
            else if(this.state == 'SEL_PIECE')
            {
                lastPiece = currMove.getPiece();
                if(lastPiece != null)
                    lastCell = currMove.getPieceCell();
            }

            if (lastPiece != null && lastPiece != obj)  //ja foi uma peca selecionada
            {
                lastCell.setSelected(false);
            }*/

            //adiciona a peca ao movimento
            if(this.state == 'SEL_SHIP'){
                currMove.addShip(obj);
                this.shaderOnShipPossibleMoves(currMove.getShipCell(),1);
            }
            else if(this.state == 'SEL_PIECE')
                currMove.addPiece(obj);

            this.changeState(); //já escolheu a peca, pode mudar de estado
        }
    }
    else if(obj instanceof Cell && this.state == 'SEL_TILE')
    {
        var idBoard = obj.getBoard().getId();

        if(idBoard == 100)   //so posso selcionar celulas do board principal
        {
            //verificar se a posicao encontra-se na lista de posicoes validas para este ship
            var valid = this.validMovement(currMove.getShipCell().getPos(),obj.getPos());

            console.log(valid);
            if(valid)
            {
                this.shaderOnShipPossibleMoves(currMove.getShipCell(),0);
                currMove.addTile(obj);
                obj.setSelected(true);

                this.changeState(); //já escolheu a celula, pode mudar de estado
            }
        }
    }

    if(this.state == 'ANIM1'){
        currMove.makeShipMove();
        await sleep(2000);
        this.changeState(); //Acabou o movimento, mudo de estado
    }

    if(this.state == 'ANIM2') {
        currMove.makePieceMove();
        await sleep(2000);
        this.changeState(); //Acabou o movimento, mudo de estado
    }
}

Game.prototype.gameOver = function (){
    this.finalInfo = [this.player1.team, 0, 0];  //atualiza esta informacao

    this.scene.interface.addFinalGameInfo();
    this.scene.interface.removeSomeInfo();
}

Game.prototype.undo = function (){

}

/*
Shaders
*/
/*
Game.prototype.applyShaderOnValidShips = function() {

     Shader em todas as células com os ships
     usar this.turn().obter a lista dos ships

}
*/

Game.prototype.shaderOnShipPossibleMoves = function(cellShip,bool){

    var posShip = cellShip.getPos();
    var cellPos = this.getPossibleMovesByShip(posShip);

    //descobrir as celulas do mainBoard que tem estas posicooes, e marca-las com "canMoveTo"
    for(var i = 0; i < cellPos.length; i++){
        var cell = this.board.cellInPos(cellPos[i]);
        console.log('aqui');
        cell.setCanMove(bool);
    }
}

/*
INITS
*/

Game.prototype.init = async function(BoardSize,Nivel,Mode){
    this.state = 'INIT';
    this.prolog.makeRequest("initGame(" + BoardSize + "," + Nivel + "," + Mode + ")",1);
    await sleep(500);

    console.log(this.player1.getPrologRepresentation());
    console.log(this.player2.getPrologRepresentation());
    console.log("First Player - ", this.turn);

    //TEMPORARIO
    this.changeState();
}

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

/**
 * OTHERS
 */
Game.prototype.changeTurn = function(){
    if(this.turn == this.player1)
        this.turn = this.player2;
    else
        this.turn = this.player1;
}

Game.prototype.display = function() {

    this.scene.interface.updateMatchInfo();

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