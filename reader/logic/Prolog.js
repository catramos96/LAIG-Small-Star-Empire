function Prolog(game) {
	this.game = game;
};

Prolog.prototype.constructor=Prolog;

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

Prolog.prototype.makeRequest = function(requestString,type){
	var getResponse;
	switch(type){
		case 1:{
			getResponse = this.requestType1;		/*getBoard by id*/
			break;
		}
	}
	this.callRequest(requestString,getResponse);
};

Prolog.prototype.requestType1 = function (data){	

	console.log("request 1");
	
	var reply = data.target.response;
	var info =  reply.match(/(.*)\\(.*)\\(.*)\\(.*)/);
	
	if(info != null){
		var boardInfo = info[1];
		var player1Info = info[2];
		var player2Info = info[3];
		var turn = parseInt(info[4]);

		this.game.setGameBoard(this.game.prolog.parseBoard(boardInfo));
		var player1data = this.game.prolog.parsePlayer(player1Info);
		var player2data = this.game.prolog.parsePlayer(player2Info);
		this.game.createPlayer(player1data[0],player1data[1],player1data[4]);
		this.game.createPlayer(player2data[0],player2data[1],player2data[4]);
		this.game.setTurn(turn);
	}
	
};

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
		else{									//coords
			if(info[i] == ',' && open_2 == 1){
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
			else if(boardInfo[i] == '6') row.push(61);
			else if(boardInfo[i] == '7') row.push(62);
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
