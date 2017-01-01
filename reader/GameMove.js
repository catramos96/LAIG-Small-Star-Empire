/**
 * Object that handles one move of the game
 * @param type ship, normal or bot.
 * @constructor
 */
function GameMove(type) {
    this.type = type;

    this.ship = null;
    this.tileShip = null;   //origem do ship
    this.tileDest = null;
    this.piece = null;
    this.tilePiece = null;  //origem da peca
}

/*
ADITIONS
 */

/**
 * Adds the tile of the destination to the move
 * @param tile
 */
GameMove.prototype.addTile = function(tile){
    this.tileDest = tile;
}

/**
 * Adds the ship that will be moved to the move.
 * @param ship
 */
GameMove.prototype.addShip = function(ship){
    this.ship = ship;
    this.tileShip = ship.getCell();
}

/**
 * Adds the piece that will be moved to the move.
 * @param piece
 */
GameMove.prototype.addPiece = function(piece){
    this.piece = piece;
    this.tilePiece = piece.getCell();
}

/*
GETS
*/

GameMove.prototype.getTile = function(){
    return this.tileDest;
}

GameMove.prototype.getType = function(){
    return this.type;
}

GameMove.prototype.getShip = function(){
    return this.ship;
}

GameMove.prototype.getPiece = function(){
    return this.piece;
}

GameMove.prototype.getShipCell = function(){
    return this.tileShip;
}

GameMove.prototype.getPieceCell = function(){
    return this.tilePiece;
}

/*
MOVES
 */
/**
 * make the movement of the ship between 2 cells.
 * @param isUndo true : switches the origin with de destination
 */
GameMove.prototype.makeShipMove = function(isUndo){
    var origin;
    var dest;

    if(isUndo)
    {
        origin = this.tileDest;
        dest = this.tileShip;
    }
    else
    {
        origin = this.tileShip;
        dest = this.tileDest;
    }

    this.ship.move(origin.getCoords(),dest.getCoords());

    //retira a peca da celula de origem e a sua selecao
    origin.setSelected(false);
    origin.setShip(null);

    //coloca a peca na celula de destino e retira a selecao
    dest.setSelected(false);
    dest.setShip(this.ship);
}

/**
 * make the movement of the piece between 2 cells.
 * @param isUndo true : switches the origin with de destination
 */
GameMove.prototype.makePieceMove = function(isUndo){
    var origin;
    var dest;

    if(isUndo)
    {
        origin = this.tileDest;
        dest = this.tilePiece;
    }
    else
    {
        origin = this.tilePiece;
        dest = this.tileDest;
    }

    //verifica se as pecas que ja estao nessa celula tem de mudar a sua posicao, e se uma delas mudar, a peca tambem muda
    var s = dest.getShip();
    var p = dest.getPiece();
    var hasToChange = false;
    if(s != null){
        hasToChange = true;
        s.updateTransformation();
    }
    if(p != null) {
        hasToChange = true;
        p.updateTransformation();
    }
    if(hasToChange)
        this.piece.updateTransformation();

    //movimento
    this.piece.move(origin.getCoords(),dest.getCoords());

    //retira a peca da celula de origem e a sua selecao
    origin.setSelected(false);
    origin.setPiece(null);

    //coloca a peca na celula de destino e retira a selecao
    dest.setSelected(false);
    dest.setPiece(this.piece);
}