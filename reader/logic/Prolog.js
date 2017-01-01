/*
@brief Class Prolog
Used to comunicate with prolog files and functions
@param game
@param serverResponse
*/
function Prolog(game) {
	this.game = game;
	this.serverResponse = null;
};

Prolog.prototype.constructor=Prolog;

/*
@brief Function that returns the attribute serverResponse
*/
Prolog.prototype.getServerResponse = function(){
	return this.serverResponse;
}

/*
@brief Function that sets the value of the attribue serverResponse
*/
Prolog.prototype.setServerResponse = function(r){
	this.serverResponse = r;
}

/*
@brief Function that requests comunication with prolog
@param requestString - predicate to be invoked from prolog
@param onSuccess - in case of success this is executed
@param onError - in case of error this is executed
@port - port used to comunicate
*/
Prolog.prototype.callRequest = function(requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);

	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};
	request.game = this.game;

	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
};

/*
@brief Function that makes a request and analizes italics
@param requestString - predicate to be invoked from prolog
@param type - type of request, diferent types have diferent interpretations
*/
Prolog.prototype.makeRequest = function(requestString,type){
	var getResponse;
	switch(type){
		case 1:{
			getResponse = this.requestType1;		/*initGameInfo*/
			break;
		}
		case 2:{
			getResponse = this.requestType2;		/*makeMoveHuman*/
			break;
		}
		case 3:{
			getResponse = this.requestType3;		/*makeMoveBot*/
			break;
		}
		case 4:{
			getResponse = this.requestType4;		/*allPossibleMoves*/
			break;
		}
		case 5:{
			getResponse = this.requestType5;		/*update Scores*/
			break;
		}
	}
	this.callRequest(requestString,getResponse);
};

/*
@brief Function that recieves information from prolog (data) and analizes it
To be used for initialize the game
*/
Prolog.prototype.requestType1 = function (data){	

	console.log("request 1");
	
	var info = data.target.response;
	var info =  info.match(/(.*)\\(.*)\\(.*)\\(.*)/);
	
	if(info != null){
		var boardInfo = info[1];
		var player1Info = info[2];
		var player2Info = info[3];
		var turn = parseInt(info[4]);

		this.game.setGameBoard(this.game.prolog.parseBoard(boardInfo),boardInfo);				/*Sets the game board*/
		var player1data = this.game.prolog.parsePlayer(player1Info);							/*Sets the player1 info*/
		var player2data = this.game.prolog.parsePlayer(player2Info);							/*Sets the player2 info*/
				
		var playerPrologRep1 = this.game.prolog.parsePlayerProlog(player1Info);					/*Sets the player1 info*/
		var playerPrologRep2 = this.game.prolog.parsePlayerProlog(player2Info);					/*Sets the player2 info*/
		
		this.game.createPlayer(player1data[0],player1data[1],player1data[4],playerPrologRep1);	/*Creates player1 with info above*/
		this.game.createPlayer(player2data[0],player2data[1],player2data[4],playerPrologRep2);	/*Creates player2 with info above*/
		
		this.game.setTurn(turn);																/*Set the turn of the game*/
	}
	
};

/*
@brief Function that recieves information from prolog (data) and analizes it
To be used when a Human player makes a move
*/
Prolog.prototype.requestType2 = function (data){	
	console.log("request 2");
	
	var info = data.target.response;
	var info =  info.match(/(.*)\\(.*)\\(.*)/);
	
	if(info != null){
		var valid = info[1];
		var boardInfo = info[2];
		var playerInfo = info[3];
		
		var playerParsed = this.game.prolog.parsePlayerProlog(playerInfo);	/*Parse player information*/
		
		this.game.getTurn().setRepresentation(playerParsed);				/*Sets the new players info*/
		this.game.board.setRepresentation(boardInfo);						/*Sets the new board info*/
		
		this.game.prolog.setServerResponse([valid]);						/*Sets the serverResponse with the validation of the move
																			to be checked on the game side*/
	}
}

/*
@brief Function that recieves information from prolog (data) and analizes it
To be used when a Computer player makes a move
*/
Prolog.prototype.requestType3 = function (data){	
	console.log("request 3");
	
	var reply = data.target.response;
	var info =  reply.match(/(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)\\(.*)/);
	
	if(info != null){
		
		var valid = parseInt(info[1]);
		var rowI = parseInt(info[2]);
		var columnI = parseInt(info[3]);
		var rowF = parseInt(info[4]);
		var columnF = parseInt(info[5]);
		var structure = info[6];
		var boardInfo = info[7];
		var playerInfo = info[8];
		
		var playerParsed = this.game.prolog.parsePlayerProlog(playerInfo);	/*Parse player information*/
		
		this.game.getTurn().setRepresentation(playerParsed);				/*Sets the new players info*/
		this.game.board.setRepresentation(boardInfo);						/*Sets the new board info*/
		
		this.game.prolog.setServerResponse([valid,[rowI,columnI],[rowF,columnF],structure]);	/*Sets the serverResponse with the validation of the move,
																								the inicial and final cell, and the structure used*/
	}
}

/*
@brief Function that recieves information from prolog (data) and analizes it
To be used when its requested the matrix of valid moves
*/
Prolog.prototype.requestType4 = function (data){
	console.log("request 4");
	var info = data.target.response;
	this.game.prolog.setServerResponse(this.game.prolog.parseMatrix(info));	/*Sets the serverResponse with the parsed matrix*/
}

/*
@brief Function that recieves information from prolog (data) and analizes it
To be used when the game is over and its necessary to parse the scores and the winner
*/
Prolog.prototype.requestType5 = function (data){
	console.log("request 5");
	var reply = data.target.response;
	
	var info =  reply.match(/(.*)\\(.*)/);
	
	if(info != null){
		console.log(info);
		var points1 = info[1];
		var points2 = info[2];
		var winner = 0;
		
		this.game.getPlayer(1).setScore(points1);	/*Sets the score of the player1*/
		this.game.getPlayer(2).setScore(points2);	/*Sets the score of the player2*/
		
		if(points1 > points2)
			winner = 1;
		else if(points1 < points2)
			winner = 2;
		else if(points1 == points2)
			winner = 0;
		
		this.game.prolog.setServerResponse([winner,points1,points2]);	/*Sets the serverResponse with the winner and the points*/
	}
}

/*
@brief Function that parses the string of the players information to fix the char atribute
*/
Prolog.prototype.parsePlayerProlog = function (info){
	var i;
	var res = "";
	for(i = 0 ; i < info.length; i++){
		
		if(info[i] == "H" || info[i] == "C")
			res+="'" + info[i] + "'";
		else
			res += info[i];
	}
	
	return res;
}

/*
@brief Function that parses the string of the player information in prolog
*/
Prolog.prototype.parsePlayer = function (info){
	var data = [];
	
	data[0] = parseInt(info[1]);	//team
	data[1] = info[3];	//type
	
	var open_1 = 0;
	var open_2 = 0;
	var row = [];
	var coord = [];
	var i;
	var data_index = 2;
	var x = '0', y = '0';

	
	for(i = 5; i < info.length-1; i++){
		
		if(info[i] == '['){					//open [
			
			if(open_1 == 0){					//1st [
				open_1 = 1;
				row = [];
			}
			else if(open_2 == 0){				//2nd [
				open_2 = 1;
				coord = [];
			}
			
		}
		else if(info[i] == ']'){				//close ]
			
			if(open_2 == 1){					//2nd ]
				open_2 = 0;
				coord.push(parseInt(y));
				y = '0';
				row.push(coord);
				coord = [];
			}
			else if(open_1 == 1){				//1st ]
				open_1 = 0;
				data[data_index] = row;
				data_index++;
			}
			
		}
        else if(open_2 == 1){									//coords
            if(info[i] == ','){
                coord.push(parseInt(x));
                x = '0';
            }
            else if(coord.length == 0)	x += info[i];
            else if(coord.length == 1)	y += info[i];
        }
	}
	//console.log(data);
	return data;
};

/*
@brief Function that parses a matrix
*/
Prolog.prototype.parseMatrix = function (m){
	var matrix = [];
	var row = [];
	var coord = [];
	var num = "";
	var open_1 = 0;		//1st [
	var open_2 = 0;		//2nd [
	var i ;

	for(i = 1; i < m.length-1; i ++){

		if(m[i] == '['){						//open

			if(open_1 == 0){
				open_1 = 1;
				row = [];
			} 
			else if(open_2 == 0){
				open_2 = 1;
				coord = [];
			} 

		}
		else if(m[i] == ']'){ 						//close
			
			if(open_2 == 1){
				open_2 = 0;
				coord.push(parseInt(num));
				row.push(coord);
				coord = [];
				num = "";
			}
			else if(open_1 == 1){
				open_1 = 0;
				matrix.push(row);
				row = [];
			}

		}
		else if(open_2 == 1 && open_1 == 1){			//coord
			
			if(m[i] == ','){
				coord.push(parseInt(num));
				num = "";
			} 
			else if(open_1 == 1 && open_2 == 1){
				num += m[i];
			}
		}
	}
	return matrix;
}

/*
@brief Function that parses the board and it's codes
*/
Prolog.prototype.parseBoard = function (boardInfo){
	var board = [];
	var row = [];
	//var coord = [];
	var open_1 = 0;		//1st [
	var open_2 = 0;		//2nd [
	var first_elem = 0;
	var i ;

	for(i = 1; i < boardInfo.length-1; i ++){


		if(boardInfo[i] == '0' && open_1 == 1 && open_2 == 0){
			row.push(-1);
		}
		else if(boardInfo[i] == '['){						//open

			if(open_1 == 0){
				open_1 = 1;
				row = [];
			} 
			else if(open_2 == 0){
				open_2 = 1;
				//coord = [];
			} 

		}
		else if(boardInfo[i] == ']'){ 						//close
			
			if(open_2 == 1){
				open_2 = 0;
				//row.push(coord);
				//console.log(coord);
				first_elem = 0;
				//coord = [];
			}
			else if(open_1 == 1){
				open_1 = 0;
				//console.log(row);
				board.push(row);
				row = [];
			}

		}
		else if(open_2 == 1 && open_1 == 1 && first_elem == 0){			//coord
			
			if(boardInfo[i] == ',') continue;
			else if(boardInfo[i] == '-'){
				//coord.push(parseInt(boardInfo[i] + boardInfo[i+1]));
				row.push(parseInt(boardInfo[i] + boardInfo[i+1])); //para ser como a matriz do board em js
				i++;
			}
			else if(boardInfo[i] == '6' && boardInfo[i+2] == '0') row.push(61);
			else if(boardInfo[i] == '6' && boardInfo[i+2] == '2') row.push(62);
			else{
				//coord.push(parseInt(boardInfo[i]));
				row.push(parseInt(boardInfo[i]));
			}
			first_elem = 1;
		}
	}
	//console.log(board);
	return board;
};
