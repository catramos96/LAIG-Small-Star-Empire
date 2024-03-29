:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                        Server                                                   %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% To run, enter 'server.' on sicstus command line after consulting this file.
% You can test requests to this server by going to http://localhost:8081/<request>.
% Go to http://localhost:8081/quit to close server.

% Made by Luis Reis (ei12085@fe.up.pt) for LAIG course at FEUP.

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here

:- include('SmallStarEmpire.pl').

/*parse_input(pred, res)*/

%parse_input(quit, goodbye).

parse_input(chooseBoard(Id),Board) :-	board(Id,Board).

parse_input(initGame(BoardId,Nivel,Mode),Res) 	:-	board(BoardId,Board),
													loadPlayers(Board,Mode,Player1,Player2), !,
													random(1,3,FirstPlayer),
													Res = (Board\Player1\Player2\FirstPlayer).

parse_input(possibleMoves(BoardI,PlayerI),AllMoves)	:- 	updateValidShips(BoardI,PlayerI,PlayerT2), !,
														getPossibleMoves(BoardI,PlayerT2,AllMoves).
													
parse_input(moveHuman(BoardI,PlayerI,Ri,Ci,Rf,Cf,Structure),Res)	:-	updateValidShips(BoardI,PlayerI,PlayerT2), !,
																		getPossibleMoves(BoardI,PlayerT2,AllMoves), !,
																		
																		moveShipValid(AllMoves,PlayerT2,Ri,Ci,Rf,Cf,Valid),	/*valid move*/
																		
																		isGameOver(PlayerT2,GameOver),
																		(
																			(Valid = 1 , GameOver = 0,
																				playerGetTeam(PlayerT2,Team),
																				setDominion(BoardI,Team,Rf,Cf,Structure,BoardT2), !,		/*Estrutura no board*/
																				playerAddControl(PlayerT2,Structure,[Rf|[Cf|[]]],PlayerT3),	/*Estrutura no player*/
																				setShip(BoardT2,Rf,Cf,1,BoardT3), !,						/*Ship de [Ri,Ci]*/
																				setShip(BoardT3,Ri,Ci,-1,BoardF), !,						/*Para [Rf,Cf] no board*/
																				playerSetShip(PlayerT3,[Ri|[Ci|[]]],[Rf|[Cf|[]]],PlayerF),	/*Update do Ship*/
																				Res = (Valid\BoardF\PlayerF)
																			) ;
																			(Valid = 0, GameOver = 0,
																				Res = (Valid\BoardI\PlayerI)
																			) ;
																			(GameOver = 1,
																				Res = (-1\BoardI\PlayerI)
																			)
																		).
														
parse_input(moveComputer(BoardI,PlayerI,Nivel),Res) :-	updateValidShips(BoardI,PlayerI,PlayerT2), !,
														getPossibleMoves(BoardI,PlayerT2,AllMoves), !,
														
														isGameOver(PlayerT2,GameOver), !,
														checkMoveComputer(GameOver,AllMoves,Nivel,BoardI,PlayerT2,Res).
														
												
parse_input(getWinner(Board,Player1,Player2),Res) :-	playerGetPoints(Board,Player1,ListLength1,Points1),	
														playerGetPoints(Board,Player2,ListLength2,Points2),
														biggestTerritoryPoints(ListLength1, Points1, NewPoints1, ListLength2, Points2, NewPoints2), 
														Res = (NewPoints1\NewPoints2).
																	
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Adicional PROLOG                                         %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

checkMoveComputer(0,AllMoves,Nivel,BoardI,PlayerI,Res) :- 	playerGetColonies(PlayerI,Colonies),
															length(Colonies,CL),
															playerGetTrades(PlayerI,Trades),
															length(Trades,TL),
															makeMoveComputer(BoardI,PlayerI,Nivel,RowI,ColumnI,RowF,ColumnF,AllMoves,BoardT2,PlayerT2),
															(
																(
																CL = 16, TL < 4,
																playerGetTeam(PlayerT2,Team),
																setDominion(BoardT2,Team,RowF,ColumnF,'T',BoardF), !,
																playerAddControl(PlayerT2,'T',[RowF|[ColumnF|[]]],PlayerF),
																Res = (1\RowI\ColumnI\RowF\ColumnF\'T'\BoardF\PlayerF)
																) ;
																(
																CL < 16, TL = 4,
																playerGetTeam(PlayerT2,Team),
																setDominion(BoardT2,Team,RowF,ColumnF,'C',BoardF), !,
																playerAddControl(PlayerT2,'C',[RowF|[ColumnF|[]]],PlayerF),
																Res = (1\RowI\ColumnI\RowF\ColumnF\'C'\BoardF\PlayerF)
																) ;
																(
																CL < 16, TL < 4,
																addControlComputer(Nivel,BoardT2,PlayerT2,RowF,ColumnF,Type,BoardF,PlayerF),
																Res = (1\RowI\ColumnI\RowF\ColumnF\Type\BoardF\PlayerF)
																)
															).
																							
checkMoveComputer(0,_,_,BoardI,PlayerI,Res)	:-	Res = (0\'-1'\'-1'\'-1'\'-1'\'-1'\BoardI\PlayerI).

checkMoveComputer(1,_,_,BoardI,PlayerI,Res) :-	Res = (-1\'-1'\'-1'\'-1'\'-1'\'-1'\BoardI\PlayerI).

makeMoveComputer(BoardI,PlayerI,Nivel,RowI,ColumnI,RowF,ColumnF,AllMoves,BoardF,PlayerF) :-	movement(Nivel,BoardI,PlayerI,AllMoves,RowI,ColumnI,RowF,ColumnF),
																							setShip(BoardI,RowF,ColumnF,1,BoardT2), !,						
																							setShip(BoardT2,RowI,ColumnI,-1,BoardF), !,						
																							playerSetShip(PlayerI,[RowI|[ColumnI|[]]],[RowF|[ColumnF|[]]],PlayerF).
																						
makeMoveComputer(BoardI,PlayerI,Nivel,Type,RowI,ColumnI,RowF,ColumnF,AllMoves,BoardF,PlayerF) :- makeMoveComputer(BoardI,PlayerI,Nivel,Type,RowI,ColumnI,RowF,ColumnF,AllMoves,BoardF,PlayerF).

moveShipValid(AllMoves,Player,Ri,Ci,Rf,Cf,1)	:- 	validMove(AllMoves,Player,Ri,Ci,Rf,Cf),
													isGameOver(Player,0).
moveShipValid(_,_,_,_,_,_,0).

isGameOver(Player,1) :-		playerGetShips(Player,Ships),
							length(Ships,SL),
							playerGetColonies(Player,Colonies),
							length(Colonies,CL),
							playerGetTrades(Player,Trades),
							length(Trades,TL),
							write(SL - CL - TL),
							(SL = 0; (CL = 16, TL = 4)).
isGameOver(Player,0).

addControlComputer(Nivel,BoardI,PlayerI,Row,Column,Type,BoardF,PlayerF) :- 	addControlAux(Nivel,PlayerI,BoardI,Row,Column,Type), !,
																			playerGetTeam(PlayerI,Team),
																			setDominion(BoardI,Team,Row,Column,Type,BoardF), !,
																			playerAddControl(PlayerI,Type,[Row|[Column|[]]],PlayerF).

addControlComputer(Nivel,BoardI,PlayerI,Row,Column,Type,BoardF,PlayerF) :- error(2), addControl(Nivel,BoardI,PlayerI,Row,Column,BoardF,PlayerF).