/*
@brief Class Player to keep the player's information
@team - 1 (Red) or 2 (Blue)
*/ 
function Player(team) {

    this.team = team;      /*1 or 2*/

    if(this.team == 1)
        this.teamName = "Red";     
    else
        this.teamName = "Blue";

    this.type = "Human";   	/*Human or Computer*/
    this.auxBoard = null;	/*Aux board with the players pieces*/
    this.homeBase;         	/*Home Base Position*/
    this.colonies = [];		/*List of pointers to all player's colonies*/
    this.trades = [];    	/*List of pointers to all player's trades*/	
    this.ships = [];  		/*List of pointers to all player's ships*/
    this.score = 0;
	this.prologRepresentation = "[" + team + ",'H',[],[],[]]";	/*Prolog Information String - to be passed as prolog param*/
}

Player.prototype.constructor=Player;

/* SETS */

/*
@brief Function that sets the player's prolog representation
@param representation
*/
Player.prototype.setRepresentation = function(representation){
	this.prologRepresentation = representation;
}

/*
@brief Function that sets the player's home base
@param base
*/
Player.prototype.setHomeBase = function(base){
    this.homeBase = base;
}

/*
@brief Function that sets the player's type
@param type
*/
Player.prototype.setType = function(type){

	if(type == 'H')
		this.type = "Human";
	else
		this.type = "Computer";
}

/*
@brief Function that sets the player's score
@param score
*/
Player.prototype.setScore = function(score){
    this.score = score;
}

/*
@brief Function that sets the player's ships
@param ships
*/
Player.prototype.setShips = function(ships){
    this.validShips = ships;
}

/*
@brief Function that sets the player's auxiliary board
@param auxBoard
*/
Player.prototype.setAuxBoard = function(auxBoard){
    this.auxBoard = auxBoard;
}

/* ADD */

/*
@brief Function that adds a colony to the players colonies
@param x - x coordenate of the colony
@param y - y coordenate of the colony
*/
Player.prototype.addColony = function(x,y){
    this.colonies.push([x,y]);
}

/*
@brief Function that adds a trade to the players trades
@param x - x coordenate of the trade
@param y - y coordenate of the trade
*/
Player.prototype.addTrade = function(x,y){
    this.trades.push([x,y]);
}

/* GETS */

/*
@brief Function that gets the player's auxiliary board
@returns auxBoard
*/
Player.prototype.getAuxBoard = function(){
    return this.auxBoard;
}

/*
@brief Function that gets the player's prolog representation
@returns prologRepresentation
*/
Player.prototype.getPrologRepresentation = function(){
	return this.prologRepresentation;
}

/*
@brief Function that gets the player's team
@returns team
*/
Player.prototype.getTeam = function(){
    return this.team;
}

/*
@brief Function that gets the player's team name
@returns teamName
*/
Player.prototype.getTeamName = function(){
    return this.teamName;
}

/*
@brief Function that gets the player's type
@returns type
*/
Player.prototype.getType = function(){
    return this.type;
}

/*
@brief Function that gets the player's score
@returns score
*/
Player.prototype.getScore = function(){
    return this.score;
}