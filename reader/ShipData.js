 /**
 * Data Struct of MyVehicleData
 * Descendent of MyPrimitive
 */
 function ShipData(id) {
     this.id = id;
 }

 ShipData.prototype = new MyPrimitive(this.id);
 ShipData.prototype.constructor = ShipData;

/*
GETS
*/
 ShipData.prototype.getId = function(){
     return this.id;
 }
