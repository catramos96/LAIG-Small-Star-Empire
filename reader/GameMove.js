/**
 * Game Move
 * movimento do jogo
 */
function GameMove(type) {
    this.type = type;

    this.ship = null;
    this.tileShip = null;   //origem do ship
    this.tileDest = null;
    this.piece = null;
    this.tilePiece = null;  //origem da peca
}

GameMove.prototype.getType = function(){
    return this.type;
}

GameMove.prototype.addTile = function(tile){
    this.tileDest = tile;
}

GameMove.prototype.addShip = function(ship){
    this.ship = ship;
    this.tileShip = ship.getCell();
}

GameMove.prototype.addPiece = function(piece){
    this.piece = piece;
    this.tilePiece = piece.getCell();
}

GameMove.prototype.getTile = function(){
    return this.tileDest;
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