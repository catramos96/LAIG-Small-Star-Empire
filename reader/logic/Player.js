/*
Class Player to keep the player's information
*/ 
function Player(team) {

    this.team = team;      /*Blue or Red*/
    this.type = "Human";   		/*Human or Computer*/
    this.homeBase;         /*Home Base Position*/
    this.colonies = [];    /*List of colonies positions*/
    this.trades = [];      /*List of trades positions*/
    this.validShips = [];  /*Valid Ships*/
    this.score = 0;

}

Player.prototype.constructor=Player;

/* SETS */

Player.prototype.setHomeBase = function(base){

    this.homeBase = base;    

}

Player.prototype.setType = function(type){
	if(type == "H")
		this.type = "Human";
	else
		this.type = "Computer";

}

Player.prototype.setScore = function(score){

    this.score = score;    

}

Player.prototype.setShips = function(ships){

    this.validShips = ships;  

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