/**
 * Data Struct of MyChessBoardData
 * Descendent of MyPrimitive
 */
 function AuxiliarBoardData(id,color) {
    this.id = id;
    this.color = color;
 }

AuxiliarBoardData.prototype = new MyPrimitive(this.id);
AuxiliarBoardData.prototype.constructor = AuxiliarBoardData;

 AuxiliarBoardData.prototype.getColor = function() {
    return this.color;
}
