/**
 * Game Sequence
 * sequence of movements
 */
function GameSequence() {
    this.sequence = [];
}

GameSequence.prototype.addMove = function(move){
    this.sequence.push(move);
}

GameSequence.prototype.currMove = function(){
    if(this.sequence.length > 0)
        return this.sequence[this.sequence.length-1];
    else
        return null;
}

/**
 * Removes the current move from the sequence
 * @returns {boolean} true if it removes the ship too, false otherwise
 */
GameSequence.prototype.undo = function(){
    this.sequence.pop();

    //verificar se no inicio da jogada houve movimento do ship (feito pelo jogo)
    if(this.currMove() != null && this.currMove().getType() == 'ship')
    {
        //if(this.currMove().getType() == 'ship')
        //{
            this.currMove().makeShipMove(true);
            this.sequence.pop();
        //}
        return true;
    }
    return false;
}

GameSequence.prototype.movie = async function(){
    //reset das posicoes no main Board -> volta as jogadas para tras e poe cada peca no seu lugar original
    for(var j = this.sequence.length-1; j > 0; j--)
    {
        var move = this.sequence[j];

        //para o destino tira a piece e o ship
        var origin;
        var ship;
        var dest = move.getTile();

        if(dest != null)
        {
            if (move.getType() == 'ship')
            {
                ship = move.getShip();
                origin = move.getShipCell();
                origin.setShip(ship);       //coloca o ship na origem (auxBoard)
            }
            else
            {
                var piece = move.getPiece();
                origin = move.getPieceCell();
                origin.setPiece(piece);
                dest.setPiece(null);

                ship = dest.getShip();
                if (ship != null) {
                    dest.setShip(null);
                }
            }
        }
    }

    //execucao do filme de jogo
    for(var i = 0; i < this.sequence.length-1; i++){
        var move = this.sequence[i];

        move.makeShipMove(false);
        await sleep(2000);

        if(move.getType() != 'ship')
        {
            move.makePieceMove(false);
            await sleep(2000);
        }
    }
}