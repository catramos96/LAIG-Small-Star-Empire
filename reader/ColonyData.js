/**
 * Data Struct of MyVehicleData
 * Descendent of MyPrimitive
 */
function ColonyData(id) {
    this.id = id;
}

ColonyData.prototype = new MyPrimitive(this.id);
ColonyData.prototype.constructor = ColonyData;

/*
 GETS
 */
ColonyData.prototype.getId = function(){
    return this.id;
}
