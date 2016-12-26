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
		}
		/*others*/
	}
	this.callRequest(requestString,getResponse);
};

Prolog.prototype.requestType1 = function(data){		/*GetBoard by id*/
	var reply = data.target.response;
	var board = [];
	var row = [];
	//var elem = [];
	var open_1 = 0;		//1st [
	var open_2 = 0;		//2nd [
	var first_elem = 0;
	var i ;

	for(i = 1; i < reply.length-1; i ++){


		if(reply[i] == '0' && open_1 == 1 && open_2 == 0){
			row.push(-1);
		}
		else if(reply[i] == '['){						//open

			if(open_1 == 0){
				open_1 = 1;
				row = [];
			} 
			else if(open_2 == 0){
				open_2 = 1;
				//elem = [];
			} 

		}
		else if(reply[i] == ']'){ 						//close
			
			if(open_2 == 1){
				open_2 = 0;
				//row.push(elem);
				//console.log(elem);
				first_elem = 0;
				//elem = [];
			}
			else if(open_1 == 1){
				open_1 = 0;
				//console.log(row);
				board.push(row);
				row = [];
			}

		}
		else if(open_2 == 1 && open_1 == 1 && first_elem == 0){			//elem
			
			if(reply[i] == ',') continue;
			else if(reply[i] == '-'){
				//elem.push(parseInt(reply[i] + reply[i+1]));
				row.push(parseInt(reply[i] + reply[i+1])); //para ser como a matriz do board em js
				i++;
			}
			else if(reply[i] == '6') row.push(61);
			else if(reply[i] == '7') row.push(62);
			else{
				//elem.push(parseInt(reply[i]));
				row.push(parseInt(reply[i]));
			}
			first_elem = 1;
		}
	}
	//console.log(board);
	this.game.setGameBoard(board);
};

