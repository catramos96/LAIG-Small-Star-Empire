/**
 * Data Struct of MyChessBoardData
 * Descendent of MyPrimitive
 */
 function NewChessBoardData(id,dX,dY,dU,dV,texture,sU,sV,c1,c2,c3) {
     this.id = id;
     this.dU = dU;            //u dimensions
     this.dV = dV;            //v dimensions
     this.texture = texture;  
     this.sU = sU;            //position in u
     this.sV = sV;            //position in v
     this.c1 = c1;            //primary color
     this.c2 = c2;            //secondary color
     this.c3 = c3;            //set color

    this.dX = dX;
    this.dY = dY;
 }

NewChessBoardData.prototype = new MyPrimitive(this.id);
NewChessBoardData.prototype.constructor = NewChessBoardData;

 /**
  * GETS
  */

 NewChessBoardData.prototype.getId = function(){
     return this.id;
 }

NewChessBoardData.prototype.getDU = function(){
     return this.dU;
 }

NewChessBoardData.prototype.getDV = function(){
     return this.dV;
 }

NewChessBoardData.prototype.getDX = function(){
    return this.dX;
}

NewChessBoardData.prototype.getDY = function(){
    return this.dY;
}

NewChessBoardData.prototype.getTexture = function(){
     return this.texture;
 }

NewChessBoardData.prototype.getSU = function(){
     return this.sU;
 }

NewChessBoardData.prototype.getSV = function(){
     return this.sV;
 }
NewChessBoardData.prototype.getC1 = function(){
     return this.c1;
 }

NewChessBoardData.prototype.getC2 = function(){
     return this.c2;
 }
NewChessBoardData.prototype.getC3 = function(){
     return this.c3;
 }