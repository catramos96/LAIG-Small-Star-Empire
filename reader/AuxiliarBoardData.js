/**
 * Data Struct of MyChessBoardData
 * Descendent of MyPrimitive
 */
 function AuxiliarBoardData(id) {

     this.id = id;
     this.dU = 8;            //u dimensions
     this.dV = 3;            //v dimensions
     this.dX = 8;
     this.dY = 3;
     this.c1 = new MyColor(0.3,0.3,0.3,0);           //primary color
     this.c2 = new MyColor(0.8,0.8,0.8,0);           //secondary color
 }

AuxiliarBoardData.prototype = new MyPrimitive(this.id);
AuxiliarBoardData.prototype.constructor = AuxiliarBoardData;

 /**
  * GETS
  */

 AuxiliarBoardData.prototype.getId = function(){
     return this.id;
 }

AuxiliarBoardData.prototype.getDU = function(){
     return this.dU;
 }

AuxiliarBoardData.prototype.getDV = function(){
     return this.dV;
 }

AuxiliarBoardData.prototype.getDX = function(){
    return this.dX;
}

AuxiliarBoardData.prototype.getDY = function(){
    return this.dY;
}

AuxiliarBoardData.prototype.getC1 = function(){
     return this.c1;
 }

AuxiliarBoardData.prototype.getC2 = function(){
     return this.c2;
 }
