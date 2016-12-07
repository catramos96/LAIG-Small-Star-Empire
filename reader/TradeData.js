/**
 * Data Struct of MyVehicleData
 * Descendent of MyPrimitive
 */
function TradeData(id) {
    this.id = id;
}

TradeData.prototype = new MyPrimitive(this.id);
TradeData.prototype.constructor = TradeData;

/*
 GETS
 */
TradeData.prototype.getId = function(){
    return this.id;
}
