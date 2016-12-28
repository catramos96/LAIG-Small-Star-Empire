/*
Class GameMove
*/ 
function GameMove(Turn,CellI,CellF,Player1Rep,player2Rep,BoardRep) {
	this.turn = Turn;
	this.cellI = CellI;
	this.cellF = CellF;
	this.player1 = Player1Rep;		//String - Representation in prolog
	this.player2 = Player2Rep;		//String - Representation in prolog
	this.board = BoardRep;			//String - Representation in prolog
}

GameMove.prototype.constructor=GameMove;