/**
 * MyCircle
 * Constroi um circulo com numero de slices decidido pelo utilizador
 * @constructor
 */
function MyCircleData(id, slices) {
    this.slices = slices;
    this.id = id;
}
;

MyCircleData.prototype = new MyPrimitive(this.id);        // Here's where the inheritance occurs
MyCircleData.prototype.constructor = MyCircleData;

MyCircleData.prototype.getSlices = function(){
    return this.slices;
}
