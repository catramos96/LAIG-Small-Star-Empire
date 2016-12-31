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
	
	this.winner = 0;
	
    this.turn = this.player1;	//default

    this.changingInfo = ["Red","Init"];
    this.finalInfo = [null, 0, 0];

	this.init(2,mode,difficulty);
}

/**
 * Metodo chamado no incio de cada turno
 */
Game.prototype.getTurnInformation = async function()
{
    //muda a turn na interface
    this.changingInfo[0] = this.turn.getTeamName();

    //verifica se existe algum ship no tabuleiro auxiliar. Se tiver, coloca-o na homebase
    if(this.moveShipToHB())
        await sleep(1500);  //tempo de mover o ship

    //verificacao das jogadas possiveis (apenas jogador humano)

    if(this.turn.getType() == "Human"){
        this.prolog.makeRequest("possibleMoves(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() + ")",4);

        while(this.prolog.getServerResponse() == null)
            await sleep(500);

        possibleMoves = this.prolog.getServerResponse();

        this.prolog.setServerResponse(null);
    }
	
    this.changeState();
}

Game.prototype.moveShipToHB = function()
{
    var homeBase = this.board.cellInPos(this.turn.homeBase);
    var ship = homeBase.getShip();

    if(ship == null)
    {
        var auxBoard = this.turn.getAuxBoard();

        for(var i = 1; i < 5;i++){
            var cell = auxBoard.cellInPos([5,i]);
            ship = cell.getShip();

            if(ship != null){
                //faz o movimento entre a coordenada auxiliar e a hb
                this.gameSequence.addMove(new GameMove('ship'));
                var move = this.gameSequence.currMove();
                move.addShip(ship); //ship a mover
                move.addTile(homeBase); //destino
                move.makeShipMove(false);
                return true;
            }
        }
    }
    return false;
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

Game.prototype.makeMove = async function(){

    var moveRequest = "";

    if(this.turn.getType() == "Human")
    {
        var posI = this.gameSequence.currMove().getShipCell().getPos();
        var posF = this.gameSequence.currMove().getTile().getPos();
        var piece = this.gameSequence.currMove().getPiece();

        var structure;
        if(piece instanceof Colony)
            structure = "C";
        else
            structure = "T";

        var rowI = posI[0];
        var columnI = posI[1];
        var rowF = posF[0];
        var columnF = posF[1];

        moveRequest = "moveHuman(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() +
            "," + rowI + "," + columnI + "," + rowF + "," + columnF + ",'" + structure + "')";
        this.prolog.makeRequest(moveRequest,2);
    }
	else if(this.turn.getType() == "Computer")
	{
		moveRequest = "moveComputer(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() + "," + this.difficulty + ")";
		this.prolog.makeRequest(moveRequest,3);
	}
	else
		console.log("ERROR on move request - the turn player is not a Computer or Human :o");

	while(this.prolog.getServerResponse() == null)
		await sleep(500);

	var info = this.prolog.getServerResponse();
    this.prolog.setServerResponse(null);    //reset

	var validMove = info[0];

    if(validMove)
    {
		if(this.turn.getType() == "Computer")
		{
			var cellI = info[1];
			var cellF = info[2];
			var structure = info[3];
            var currMove = this.gameSequence.currMove();

            console.log(info,"vai de "+cellI+" para "+cellF+" com a structure "+structure);

            //ship que se vai mover
            var shipCell = this.board.cellInPos(cellI);
            currMove.addShip(shipCell.getShip());

            //destino
            var destCell = this.board.cellInPos(cellF);
            currMove.addTile(destCell);

            //movimento
            currMove.makeShipMove(false);
            await sleep(2000);

            //escolhe uma peca das do board auxiliar que corresponda a structure
            var auxBoard = this.turn.getAuxBoard();
            var type;
            if(structure == "T")
                type = Trade;
            else
                type = Colony;
            var pieceCell = auxBoard.getFirstPiece(type);
            currMove.addPiece(pieceCell.getPiece());

            currMove.makePieceMove(false);
            await sleep(2000);

			this.changeState(); //muda para NEXT_TURN
		}
        this.changeTurn();  //muda o turno e recomeca

        this.changingInfo[1] = "Init";
        this.setState('INIT');
        this.getTurnInformation();  //enquanto está no init recebe as informacoes do turn
    }
    else
    {
        this.changingInfo[1] = "Game Over";
        this.setState("END");
        this.changeState();
    }
}

Game.prototype.executeAnimation = async function(){

    if(this.state == 'ANIM1'){
        this.gameSequence.currMove().makeShipMove(false);
    }
    if(this.state == 'ANIM2') {
        this.gameSequence.currMove().makePieceMove(false);
    }
    await sleep(2000);
    this.changeState(); //Acabou o movimento, mudo de estado
}

/*
States
*/

Game.prototype.changeState = function () {

    switch(this.state){
        case 'INIT':
            if(this.turn.getType() == "Human")
            {
                this.changingInfo[1] = "Select Ship";
                this.state = 'SEL_SHIP';
                this.gameSequence.addMove(new GameMove('normal'));  //nova jogada
            }
            else
            {
                this.changingInfo[1] = "AI turn";
                this.state = 'BOT';
                this.gameSequence.addMove(new GameMove('bot'));  //nova jogada
                this.makeMove();    //executo a sua jogada
            }
            break;
        case 'SEL_SHIP':
            this.changingInfo[1] = "Select cell";
            this.state = 'SEL_TILE';
            break;
        case 'SEL_TILE':
            this.changingInfo[1] = "Animation";
            this.state = 'ANIM1';
            this.executeAnimation();
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
                this.executeAnimation();
            }
            break;
        case 'SEL_PIECE':
            this.changingInfo[1] = "Animation";
            this.state = 'ANIM2';
            this.executeAnimation();
            break;
        case 'ANIM2':
            this.changingInfo[1] = "Next Turn";
            this.state = 'NEXT_TURN';
            this.changeState();
            break;
        case 'NEXT_TURN':
            if(this.turn.getType() == "Human")
                this.makeMove(); //faz o movimento, se sucedido continua, se -1 termina o jogo
            break;
        case 'BOT':
            this.changingInfo[1] = "AI TURN";
            this.state = 'NEXT_TURN';
            this.changeState();
            break;
        case 'UNDO':
            this.changingInfo[1] = "Init";
            this.state = 'INIT';
            this.getTurnInformation();  //recomeca as jogadas
            break;
        case 'END':
            this.gameOver();
            break;
        default:
            console.log('CHANGE STATE DEFAULT');
            this.state = 'END';
    }

}

/*
GameInterations
*/

Game.prototype.picking = function (obj,id) {

    var currMove = this.gameSequence.currMove();

    if(this.state == 'SEL_TILE' && obj instanceof Ship && this.gameSequence.currMove().getShip() != null)   //escolher outra ship
    {
        this.setState("SEL_SHIP");
        this.shaderOnShipPossibleMoves(currMove.getShipCell(),0);
        currMove.getShipCell().setSelected(false);
    }

    if(obj instanceof Piece)
    {
        var team = obj.getTeam();
        var board = obj.getCell().getBoard().getId();

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

            //adiciona a peca ao movimento
            if(this.state == 'SEL_SHIP'){
                currMove.addShip(obj);
                this.shaderOnShipPossibleMoves(currMove.getShipCell(),1);
            }
            else if(this.state == 'SEL_PIECE')
                currMove.addPiece(obj);

            this.changeState(); //já escolheu a peca, pode mudar de estado (fazer a animacao 1)
        }
    }
    else if(obj instanceof Cell && this.state == 'SEL_TILE')
    {
        var idBoard = obj.getBoard().getId();

        if(idBoard == 100)   //so posso selcionar celulas do board principal
        {
            //verificar se a posicao encontra-se na lista de posicoes validas para este ship
            var valid = this.validMovement(currMove.getShipCell().getPos(),obj.getPos());

            if(valid)
            {
                this.shaderOnShipPossibleMoves(currMove.getShipCell(),0);
                currMove.addTile(obj);
                obj.setSelected(true);

                this.changeState(); //já escolheu a celula, pode mudar de estado (fazer a animacao 2)
            }
        }
    }
}

Game.prototype.gameOver = async function (){

	this.prolog.makeRequest("getWinner(" + this.board.getPrologRepresentation() + "," + this.player1.getPrologRepresentation() + "," + this.player2.getPrologRepresentation() + ")",5);
	
	while(this.prolog.getServerResponse() == null)
		await sleep(500);
	
	this.winner = this.prolog.getServerResponse();

    this.finalInfo = [this.winner[0],this.winner[1],this.winner[2]];  //atualiza esta informacao
	
	var msg = "";
	
	if(this.winner[0] == 0)
		msg = "DRAW";
	else if(this.winner[0] == 1)
		msg = this.player1.getTeamName() + " WON!";
	else if(this.winner[0] == 2)
		msg = this.player2.getTeamName() + " WON!";
			
	this.changingInfo[1] = msg;
	
    this.scene.interface.addFinalGameInfo();
}

Game.prototype.undo = async function ()
{
    var currMove = this.gameSequence.currMove();
    var oldState = this.state;
    this.setState("UNDO");

    if(oldState != 'INIT' && oldState != 'ANIM1' && oldState != 'ANIM2' && oldState != 'BOT' && oldState != 'END')   //nao podemos mexer
    {
        if(oldState == 'SEL_SHIP' || oldState == 'SEL_TILE')    //undo da jogada anterior (implica mudar de turno)
        {
            if(this.gameSequence.undo())    //eliminar a propria jogada que ainda nao foi preenchida
                await sleep(2000);          //se true, temos de esperar que o ship faca undo

            currMove = this.gameSequence.currMove();

            if(currMove != null)    //ainda ha jogadas para fazer
            {
                this.changeTurn(); //passo para o jogador anterior

                if(currMove.getType() == 'bot') //elimino a jogada do bot, caso o jogador anterior seja o bot
                {
                    currMove.makePieceMove(true);
                    await sleep(2000);
                    currMove.makeShipMove(true);
                    await sleep(2000);
                    if(this.gameSequence.undo())
                        await sleep(2000);      //se true, temos de esperar que o ship faca undo

                    currMove = this.gameSequence.currMove();
                    this.changeTurn(); //passo para o jogador anterior*/
                }

                //elimino a minha jogada
                currMove.makePieceMove(true);
                await sleep(2000);
                currMove.makeShipMove(true);
                await sleep(2000);
                if(this.gameSequence.undo())
                    await sleep(2000);      //se true, temos de esperar que o ship faca undo
            }
        }
        else    //undo da propria jogada
        {
            if(oldState == 'NEXT_TURN')
            {
                currMove.makePieceMove(true);
                await sleep(2000);
            }
            currMove.makeShipMove(true);
            await sleep(2000);
            if(this.gameSequence.undo())
                await sleep(2000);      //se true, temos de esperar que o ship faca undo
        }

        this.changeState();
    }
    else
    {
        this.setState(oldState);
    }
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
        cell.setCanMove(bool);
    }
}

/*
INITS
*/

Game.prototype.init = async function(boardSize,mode,difficulty){
    this.state = 'INIT';
    this.prolog.makeRequest("initGame(" + boardSize + "," + difficulty + "," + mode + ")",1);
    await sleep(500);

    console.log(this.player1.getPrologRepresentation());
    console.log(this.player2.getPrologRepresentation());
    console.log("First Player - ", this.turn);

    this.getTurnInformation();  //enquanto está no init recebe as informacoes do turn
}

Game.prototype.createPlayer = function(team,type,ships,representation){
	if(team == 1){
		this.player1.setType(type);
		this.player1.setShips(ships);
		this.player1.setHomeBase(ships[0]);
		this.player1.setRepresentation(representation);
		this.player1.setAuxBoard(this.boardAux1);
	}
	else if(team == 2){
		this.player2.setType(type);
		this.player2.setShips(ships);
		this.player2.setHomeBase(ships[0]);
		this.player2.setRepresentation(representation);
        this.player2.setAuxBoard(this.boardAux2);
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
}

/*
GETS
*/

Game.prototype.getTurn = function(){
    return this.turn;
}

Game.prototype.getPlayer = function(number){
	if(number == 1)
		return this.player1;
	else if(number == 2)
		return this.player2;
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

Game.prototype.movie = function() {
    this.gameSequence.movie();
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