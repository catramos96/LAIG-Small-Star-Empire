/**
 * Data Struct of MyChessBoardData
 * Descendent of MyPrimitive
 */
 function AuxiliarBoardData(id,color,initialCoord) {
    this.id = id;
    this.color = color;
    this.initialCoord = initialCoord;
 }

AuxiliarBoardData.prototype = new MyPrimitive(this.id);
AuxiliarBoardData.prototype.constructor = AuxiliarBoardData;

 AuxiliarBoardData.prototype.getColor = function() {
    return this.color;
}

AuxiliarBoardData.prototype.getInitCoord = function() {
    return this.initialCoord;
}
