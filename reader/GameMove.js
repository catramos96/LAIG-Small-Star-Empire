/**
 * Game Move
 * movimento do jogo
 */
function GameMove() {
    this.ship = null;
    this.tileShip = null;
    this.tileDest = null;
    this.piece = null;
    this.tilePiece = null;
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

GameMove.prototype.makeShipMove = function(){
    var pointO = this.tileShip.getCoords();
    var pointD = this.tileDest.getCoords();

    this.ship.move(pointO,pointD);

    //retira a peca da celula de origem e a sua selecao
    this.tileShip.setSelected(false);
    this.tileShip.setShip(null);

    //coloca a peca na celula de destino e retira a selecao
    this.tileDest.setSelected(false);
    this.tileDest.setShip(this.ship);
}

GameMove.prototype.makePieceMove = function(){
    var pointO = this.tilePiece.getCoords();
    var pointD = this.tileDest.getCoords();

    //verifica se as pecas que ja estao nessa celula tem de mudar a sua posicao, e se uma delas mudar, a peca tambem muda
    var s = this.tileDest.getShip();
    var p = this.tileDest.getPiece();
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
    this.piece.move(pointO,pointD);

    //retira a peca da celula de origem e a sua selecao
    this.tilePiece.setSelected(false);
    this.tilePiece.setPiece(null);

    //coloca a peca na celula de destino e retira a selecao
    this.tileDest.setSelected(false);
    this.tileDest.setPiece(this.piece);
}