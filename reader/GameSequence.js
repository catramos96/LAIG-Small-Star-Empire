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

GameSequence.prototype.movie = function(){

}