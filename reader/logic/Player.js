/*
Class Player to keep the player's information

1 - vermelho
2 - azul
*/ 
function Player(team) {

    this.team = team;      /*Blue or Red*/
    this.type = "Human";   		/*Human or Computer*/
    this.homeBase;         	/*Home Base Position*/
    this.colonies = [];		/*List of pointers to all colonies*/
    this.trades = [];    	/*List of pointers to all trades*/	
    this.ships = [];  		/*List of pointers to all ships*/
    this.score = 0;
	this.prologRepresentation = "[" + team + ",'H',[],[],[]]";
}

Player.prototype.constructor=Player;

/* SETS */

Player.prototype.setRepresentation = function(representation){
	
	this.prologRepresentation = representation;
	
}

Player.prototype.setHomeBase = function(base){

    this.homeBase = base;    

}

Player.prototype.setType = function(type){
	//if(this.type == "H")
		this.type = "Human";
	//else
	//	this.type = "Computer";
}

Player.prototype.setScore = function(score){

    this.score = score;    

}

Player.prototype.setShips = function(ships){

    this.validShips = ships;  

}

/* ADD */

Player.prototype.getPrologRepresentation = function(){
	
	return this.prologRepresentation;
	
}

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