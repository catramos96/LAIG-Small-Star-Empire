/*
Class Player to keep the player's information
*/ 
function Player(team,type) {

    this.team = team;      /*Blue or Red*/
    this.type = type;      /*Human or Computer*/
    this.homeBase;         /*Home Base Position*/
    this.colonies = [];    /*List of colonies positions*/
    this.trades = [];      /*List of trades positions*/
    this.validShips = [];  /*Valid Ships*/
    this.score = 0;

}

Player.prototype.constructor=Player;

/* SETS */

Player.prototype.setHomeBase = function(x,y){

    this.homeBase = [x,y];    

}

Player.prototype.setScore = function(score){

    this.score = score;    

}

/* ADD */

Player.prototype.addColony = function(x,y){

    this.colonies.push([x,y]);

}

Player.prototype.addTrade = function(x,y){

    this.trades.push([x,y]);
    
}

/* GETS */

Player.prototype.getTeam = function(){

    return this.team;
    
}

Player.prototype.getType = function(){

    this.type;
    
}

Player.prototype.getScore = function(){

    this.score;
    
}