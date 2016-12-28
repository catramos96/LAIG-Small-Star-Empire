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
    return this.sequence[this.sequence.length-1];
}

GameSequence.prototype.undo = function(){

}

GameSequence.prototype.movie = function(){

}