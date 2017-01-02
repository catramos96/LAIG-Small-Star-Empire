/*
 Class Game
 */
possibleMoves = [];

/**
 * Executes the game
 * @param scene
 * @param mode
 * @param difficulty
 * @constructor
 */
function Game(scene,mode,difficulty) {
    this.scene = scene;
    this.mode = mode;
    this.difficulty = difficulty;

	this.prolog = new Prolog(this); //initialize the server

    //criacao de um board e dois boards auxiliares
    this.board = new GameBoard(this.scene,100,[[]],new MyPoint(-7.2,0,0));
	
    //os tabuleiros auxiliares ja sao criados com as suas pecas
    this.boardAux1 = new AuxiliarBoard(scene, 200,"red", new MyPoint(-12,0,-9));
    this.boardAux2 = new AuxiliarBoard(scene, 300,"blue",new MyPoint(1.2,0,-9));

    //inicializacao da sequencia
    this.gameSequence = new GameSequence();

    //criacao dos jogadores ainda sem informacoes
    this.player1 = new Player(1);
    this.player2 = new Player(2);

    //valores default
    this.turn = this.player1;
    this.changingInfo = ["Red","Init",0];
    this.finalInfo = [null, 0, 0];
    this.timePlayers = [10, 10];

    //times
    this.initTime = 0;
    this.initPlayerTime = 0;
    this.startCounting = false;

	this.init(2,mode,difficulty);   //2 - tamanho medio do board
}

/*
 INITS
 */

/**
 * Init the game
 * @param boardSize
 * @param mode
 * @param difficulty
 */
Game.prototype.init = async function(boardSize,mode,difficulty){
    this.state = 'INIT';    //first state
    this.initTime = this.scene.getCurrTime();   //first time

    //init with prolog
    this.prolog.makeRequest("initGame(" + boardSize + "," + difficulty + "," + mode + ")",1);
    await sleep(500);

  /*  console.log(this.player1.getPrologRepresentation());
    console.log(this.player2.getPrologRepresentation());
    console.log("First Player - ", this.turn);*/

    //aponta a camara para o player que esta em jogo
    this.scene.setCamera(this.getTeamTurn());

    this.initTurn();  //inicializa o turno
}

/**
 * Initializes each turn
 */
Game.prototype.initTurn = async function()
{
    this.changingInfo[0] = this.turn.getTeamName(); //muda o turno na interface

    //verifica se existe algum ship no tabuleiro auxiliar. Se tiver, coloca-o na homebase
    if(this.moveShipToHB())
        await sleep(1500);  //tempo de mover o ship

    //verificacao das jogadas possiveis (apenas jogador humano)
    if(this.turn.getType() == "Human")
    {
        this.prolog.makeRequest("possibleMoves(" + this.board.getPrologRepresentation() + "," + this.turn.getPrologRepresentation() + ")",4);

        while(this.prolog.getServerResponse() == null)  //compasso de espera por prolog
            await sleep(100);

        possibleMoves = this.prolog.getServerResponse();    //jogadas possiveis para cada ship

        this.prolog.setServerResponse(null);
    }
	
    this.changeState(); //muda de estado
}

/**
 * Create a player with Prolog
 * @param team
 * @param type
 * @param ships
 * @param representation
 */
Game.prototype.createPlayer = function(team,type,ships,representation){
    if(team == 1)
    {
        this.player1.setType(type);
        this.player1.setShips(ships);
        this.player1.setHomeBase(ships[0]);
        this.player1.setRepresentation(representation);
        this.player1.setAuxBoard(this.boardAux1);
    }
    else if(team == 2)
    {
        this.player2.setType(type);
        this.player2.setShips(ships);
        this.player2.setHomeBase(ships[0]);
        this.player2.setRepresentation(representation);
        this.player2.setAuxBoard(this.boardAux2);
    }
}

/*
STATE MACHINE
 */

/**
 * Change state executing critical methods
 */
Game.prototype.changeState = function () {

    switch(this.state){
        case 'INIT':
            if(this.turn.getType() == "Human")
            {
                this.changingInfo[1] = "Select Ship";
                this.state = 'SEL_SHIP';
                this.gameSequence.addMove(new GameMove('normal'));  //nova jogada
                this.initPlayTime();
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
            this.startCounting = false;     //ja pode parar o contador de limite de tempo da jogada
            this.changingInfo[1] = "Animation";
            this.state = 'ANIM1';
            this.executeAnimation();
            break;
        case 'ANIM1':
            if(this.turn.type == "Human")
            {
                this.changingInfo[1] = "Select Piece";
                this.state = 'SEL_PIECE';
                this.initPlayTime();  //recomeca a contagem para o segundo movimento
            }
            else
            {
                this.changingInfo[1] = "Animation";
                this.state = 'ANIM2';
                this.executeAnimation();
            }
            break;
        case 'SEL_PIECE':
            this.startCounting = false;     //ja pode parar o contador de limite de tempo da jogada
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
            this.initTurn();  //recomeca as jogadas
            break;
        case 'END':
            this.gameOver();
            break;
        case 'LOSE':
            this.playerLose();
            break;
        default:
            console.log('CHANGE STATE DEFAULT');
            this.state = 'END';
    }
}

/*
GAME FLOW
 */

/**
 * Handles object picking
 * @param obj
 * @param id
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

/**
 * Makes moves in prolog
 * If human -> just execute our move in prolog
 * if computer -> receive the move in prolog and execute it
 */
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

    var info;

    while((info = this.prolog.getServerResponse()) == null) //compasso de espera
        await sleep(100);

    this.prolog.setServerResponse(null);    //reset

    var validMove = info[0];
    console.log(validMove);

    if(validMove == 1)  //se o movimento e valido (quer em modo humano, quer para o computador) continua
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
            await sleep(1500);

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
            await sleep(1800);

            this.changeState(); //muda para NEXT_TURN
        }
        this.changeTurn();  //muda o turno e recomeca

        this.changingInfo[1] = "Init";
        this.setState('INIT');
        this.initTurn();  //enquanto está no init recebe as informacoes do turn
    }
    else if(validMove == -1)    //se for -1 significa que nao ha mais jogadas possiveis e o jogo termina
    {
        this.changingInfo[1] = "Game Over";
        this.setState("END");
        this.changeState();
    }
}

/**
 * Execute animations depending on state machine and waits
 */
Game.prototype.executeAnimation = async function(){

    if(this.state == 'ANIM1'){
        this.gameSequence.currMove().makeShipMove(false);
    }
    else if(this.state == 'ANIM2') {
        this.gameSequence.currMove().makePieceMove(false);
    }
    await sleep(1500);
    this.changeState(); //Acabou o movimento, mudo de estado
}

/*
AUXILIAR FUNCTIONS TO GAME FLOW
 */

/**
 * CountDown to player move
 */
Game.prototype.initPlayTime = function() {
    this.initPlayerTime = this.scene.getCurrTime();
    this.startCounting = true;
}

/**
 * Change turn
 */
Game.prototype.changeTurn = function(){
    if(this.turn == this.player1)
        this.turn = this.player2;
    else
        this.turn = this.player1;

    if(!this.freeCam)
        this.scene.updateCamera();
}

/**
 * Verifies if there is one ship at the homeBase of the player.
 * If the homeBase has no ship, but there are ships at the auxiliar board, we move one ship from the auxiliar board to the homebase
 * @returns {boolean}
 */
Game.prototype.moveShipToHB = function()
{
    var homeBase = this.board.cellInPos(this.turn.homeBase);
    var ship = homeBase.getShip();

    if(ship == null)    //nao ha ship na home base
    {
        var auxBoard = this.turn.getAuxBoard();

        for(var i = 1; i < 5;i++)   //procura nas 4 posicoes dos ships no auxiliar board
        {
            var cell = auxBoard.cellInPos([5,i]);
            ship = cell.getShip();

            if(ship != null)
            {
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


/**
 * Gets possibles moves of one ship
 * @param shipPos Position of the ship in coords i,j
 * @returns {*}
 */
Game.prototype.getPossibleMovesByShip = function(shipPos)
{
    //recebe o array de ships do player
    var info = this.prolog.parsePlayer(this.turn.getPrologRepresentation());
    var myShips = info[4];

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

/**
 * Verifies if the ship movement is valid. Receives the ship position and the destination cell position
 * @param shipPos Coords i,j
 * @param cellPos Coords i,j
 * @returns {boolean} True if it's possible, false otherwise
 */
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

/**
 * Applies shader on possible moves for one ship (human only)
 * @param cellShip Coords i,j of the ship
 * @param bool True if the shaders will be applied, false if it'll be removed
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
GAME FUNCIONALITIES
 */

/**
 * Undo move
 */
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
                await sleep(1500);          //se true, temos de esperar que o ship faca undo

            currMove = this.gameSequence.currMove();

            if(currMove != null)    //ainda ha jogadas para fazer
            {
                this.changeTurn(); //passo para o jogador anterior

                if(currMove.getType() == 'bot') //elimino a jogada do bot, caso o jogador anterior seja o bot
                {
                    currMove.makePieceMove(true);
                    await sleep(1500);
                    currMove.makeShipMove(true);
                    await sleep(1500);
                    if(this.gameSequence.undo())
                        await sleep(1500);      //se true, temos de esperar que o ship faca undo

                    currMove = this.gameSequence.currMove();
                    this.changeTurn(); //passo para o jogador anterior*/
                }

                //elimino a minha jogada
                currMove.makePieceMove(true);
                await sleep(1500);
                currMove.makeShipMove(true);
                await sleep(1500);
                if(this.gameSequence.undo())
                    await sleep(1500);      //se true, temos de esperar que o ship faca undo
            }
        }
        else    //undo da propria jogada
        {
            if(oldState == 'NEXT_TURN')
            {
                currMove.makePieceMove(true);
                await sleep(1500);
            }
            currMove.makeShipMove(true);
            await sleep(1500);
            if(this.gameSequence.undo())
                await sleep(1500);      //se true, temos de esperar que o ship faca undo
        }

        this.changeState();
    }
    else
    {
        this.setState(oldState);
    }
}

/**
 * Movie of the game
 */
Game.prototype.movie = function() {
    this.gameSequence.movie();
}

/*
END GAME METHODS
 */

/**
 * Player lose when times up
 */
Game.prototype.playerLose = function (){
    this.scene.setCamera("up");

    this.scene.wins[this.finalInfo[0]-1]++;

    this.scene.interface.addFinalGameInfo();
}

/**
 * End of the game
 */
Game.prototype.gameOver = async function (){
    this.scene.setCamera("up");

    //winner in prolog
    this.prolog.makeRequest("getWinner(" + this.board.getPrologRepresentation() + "," + this.player1.getPrologRepresentation() + "," + this.player2.getPrologRepresentation() + ")",5);

    while(this.prolog.getServerResponse() == null)
        await sleep(100);

    var winner = this.prolog.getServerResponse();

    //updates state label
    var msg = "";
    if(winner[0] == 0)
        msg = "DRAW";
    else if(winner[0] == 1)
        msg = this.player1.getTeamName() + " WON!";
    else if(winner[0] == 2)
        msg = this.player2.getTeamName() + " WON!";

    this.finalInfo = [msg,winner[1],winner[2]];  //atualiza esta informacao

    if(winner[0] != 0)
        this.scene.wins[winner[0]]++;   //atualiza o numero de vitoria da equipa

    this.scene.interface.addFinalGameInfo();
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

Game.prototype.getTeamTurn = function(){
    return this.turn.getTeamName();
}

/*
OBJECT
 */

/**
 * Update
 * @param currTime
 */
Game.prototype.update = function(currTime) {

    if(this.state != 'END' && this.state != 'LOSE' )
    {
        //contagem do tempo
        var time = currTime-this.initTime;
        var sec = parseInt(time % 60);
        var min = parseInt(time/60);
        this.changingInfo[2] = min+" : "+sec;
    }

    if(this.startCounting)  //countdown to player move
    {
        var time = 10 - (currTime - this.initPlayerTime);
        this.timePlayers[this.turn.getTeam()-1] = parseInt(time);

        if(this.timePlayers[this.turn.getTeam()-1] < 0)
        {
            this.startCounting = false;
            if(this.turn === this.player1)
                this.finalInfo[0] = this.player2.getTeam();
            else
                this.finalInfo[0] = this.player1.getTeam();
            this.changingInfo[1] = "Game Over";
            this.setState("LOSE");
            this.changeState();
        }
    }
    
    if(!this.startCounting) //restart
    {
        this.timePlayers = [10,10];
    }

    this.scene.interface.updateMatchInfo();
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

/*
OTHERS
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}