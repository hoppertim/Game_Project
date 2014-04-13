//todo: purchase screen
//todo: finish packaging all the information in a game state object

$(document).ready(function(){
	//variable to store the id of the client
	var clientId;

	//Load the images that will be used in the game
	var playerImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()], //0: east, 1: west, 2: north, 3: south
	rollerImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(),
	new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()], //0,1: east, 2,3: west, 4,5: north, 6,7: south
	gridBugImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()], //0,1: southwest/northeast, 2,3: northwest/southeast
	audio = [new Audio(), new Audio(), new Audio(), new Audio(), new Audio(), new Audio()],	//MODIFIED BY OH
	wallHorizontal = new Image(),
	wallVertical = new Image(),
	backgroundPattern = new Image();

	playerImg[0].src = 'static/SPRITES/player/p1_stand_N.png';//KEEP IMAGE ORDERS for now.
	playerImg[1].src = 'static/SPRITES/player/p1_stand_W.png';
	playerImg[2].src = 'static/SPRITES/player/p1_stand_E.png';
	playerImg[3].src = 'static/SPRITES/player/p1_stand_S.png';
	playerImg[4].src = 'static/SPRITES/PLAYER/p1_stand_hit_N.png';
	playerImg[5].src = 'static/SPRITES/PLAYER/p1_stand_hit_W.png';
	playerImg[6].src = 'static/SPRITES/PLAYER/p1_stand_hit_E.png';
	playerImg[7].src = 'static/SPRITES/PLAYER/p1_stand_hit_S.png';
	rollerImg[0].src = 'static/SPRITES/roller/roller_E1.png';
	rollerImg[1].src = 'static/SPRITES/roller/roller_E2.png';
	rollerImg[2].src = 'static/SPRITES/roller/roller_W1.png';
	rollerImg[3].src = 'static/SPRITES/roller/roller_W2.png';
	rollerImg[4].src = 'static/SPRITES/roller/roller_N1.png';
	rollerImg[5].src = 'static/SPRITES/roller/roller_N2.png';
	rollerImg[6].src = 'static/SPRITES/roller/roller_S1.png';
	rollerImg[7].src = 'static/SPRITES/roller/roller_S2.png';
	rollerImg[8].src = 'static/SPRITES/roller/roller_E1_hit.png';
	rollerImg[9].src = 'static/SPRITES/roller/roller_E2_hit.png';
	rollerImg[10].src = 'static/SPRITES/roller/roller_W1_hit.png';
	rollerImg[11].src = 'static/SPRITES/roller/roller_W2_hit.png';
	rollerImg[12].src = 'static/SPRITES/roller/roller_N1_hit.png';
	rollerImg[13].src = 'static/SPRITES/roller/roller_N2_hit.png';
	rollerImg[14].src = 'static/SPRITES/roller/roller_S1_hit.png';
	rollerImg[15].src = 'static/SPRITES/roller/roller_S2_hit.png';
	gridBugImg[0].src = 'static/SPRITES/GRIDBUG/gridbug_E1.png';
	gridBugImg[1].src = 'static/SPRITES/GRIDBUG/gridbug_E2.png';
	gridBugImg[2].src = 'static/SPRITES/GRIDBUG/gridbug_W1.png';
	gridBugImg[3].src = 'static/SPRITES/GRIDBUG/gridbug_W2.png';
	gridBugImg[4].src = 'static/SPRITES/GRIDBUG/gridbug_E1_hit.png';
	gridBugImg[5].src = 'static/SPRITES/GRIDBUG/gridbug_E2_hit.png';
	gridBugImg[6].src = 'static/SPRITES/GRIDBUG/gridbug_W1_hit.png';
	gridBugImg[7].src = 'static/SPRITES/GRIDBUG/gridbug_W2_hit.png';
	wallHorizontal.src = 'static/IMG/wall_horizontal.png';
	wallVertical.src = 'static/IMG/wall_vertical.png';
	backgroundPattern.src = 'static/IMG/backgroundPattern.png';
	audio[0].src = 'static/AUDIO/dusty_beats.mp3';  //background music
	audio[1].src = '';  //pistol shoot
	audio[2].src = '';  //player hit
	audio[3].src = '';  //enemy hit
	audio[4].src = 'static/AUDIO/game_over.wav';
	audio[0].autoplay = true;
	audio[0].loop = true;

	var ws = new WebSocket('ws://' + document.location.host + '/game');

	ws.onerror = function(){
		console.log('unable to open connection');
	}

		ws.onopen = function(){
		//Styling the display based on the screen size of the user
		var sizeFactor = window.innerWidth / 1366,
		width = 1300 * sizeFactor,
		height = 600 * sizeFactor;
		$('#game').css({
			'height': height + 'px',
			'width': width + 'px'
		});
		/*
		$('#left_panel').css({
		'top': (10 * sizeFactor) + 'px',
		'left': (10 * sizeFactor) + 'px',
		'width': (138 * sizeFactor) + 'px',
		'height': (580 * sizeFactor) + 'px'
		});
		*/
		$('#right_panel').css({
			'top': (10 * sizeFactor) + 'px',
			'left': (1014 * sizeFactor) + 'px',	//MODIFIED BY OH
			'width': (282 * sizeFactor) + 'px',	//MODIFIED BY OH
			'height': (580 * sizeFactor) + 'px'
		}).hide();
		$('#play_area').css({
			'top': '0px',
			//'left': (150 * sizeFactor) + 'px',
			'width': (1000 * sizeFactor) + 'px',
			'height': height + 'px',
			'backgroundImage': 'url("static/IMG/background_neonbit.png")',
			'backgroundSize' : (1000 * sizeFactor) + 'px ' + (600 * sizeFactor) + 'px',
			'backgroundRepeat': 'no-repeat'
		});
		$('#controls').css({				//ADDED BY OH
			'top': (200 * sizeFactor) + 'px',
			'left': (35 * sizeFactor) + 'px'
		});

		displayTitle();
	}

	//function to displays the title page
	function displayTitle(){
		$('title').text('Main Menu');
		$('#play_area').css({
			'backgroundImage': 'url("static/IMG/background_neonbit.png")'
		});
		var sizeFactor =  window.innerWidth / 1366;

		//creates the stage to hold the title
		var stage = new Kinetic.Stage({
			container: 'play_area',
			width: 1000 * sizeFactor,
			height: 600 * sizeFactor
		});

		//creates the layer to hold the title information
		var foreground = new Kinetic.Layer();

		//single player button
		var singlePlayer = new Kinetic.Rect({
			x: 340 * sizeFactor,
			y: 396 * sizeFactor,
			width: 150 * sizeFactor,
			height: 48 * sizeFactor,
			stroke: '#FFFFFF',
			strokeWidth: 4 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowColor: '#000000',
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		//single player text
		var singlePlayerText = new Kinetic.Text({
			x: 344 * sizeFactor,
			y: 411 * sizeFactor,
			width: 142 * sizeFactor,
			height: 44 * sizeFactor,
			align: 'center',
			fontFamily: 'Calibri',
			fontSize: 16 * sizeFactor,
			text: 'Single Player Game',
			fill: 'white',
			opacity: .6,
			shadowColor: '#000000',
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		//two player button
		var twoPlayer = new Kinetic.Rect({
			x: 510 * sizeFactor,
			y: 396 * sizeFactor,
			width: 150 * sizeFactor,
			height: 48 * sizeFactor,
			stroke: 'white',
			strokeWidth: 4 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowColor: '#000000',
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var twoPlayerText = new Kinetic.Text({
			x: 514 * sizeFactor,
			y: 411 * sizeFactor,
			width: 142 * sizeFactor,
			height: 44 * sizeFactor,
			align: 'center',
			fontFamily: 'Calibri',
			fontSize: 16 * sizeFactor,
			text: 'Two Player Game',
			fill: 'white',
			opacity: .6,
			shadowColor: '#000000',
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var howToPlay = new Kinetic.Rect({
			x: 450 * sizeFactor,
			y: 456 * sizeFactor,
			width: 100 * sizeFactor,
			height: 42 * sizeFactor,
			stroke: 'white',
			strokeWidth: 4 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowColor: '#000000',
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var howToPlayText = new Kinetic.Text({
			x: 454 * sizeFactor,
			y: 468 * sizeFactor,
			width: 92 * sizeFactor,
			height: 38 * sizeFactor,
			align: 'center',
			fontFamily: 'Calibri',
			fontSize: 16 * sizeFactor,
			text: 'How To Play',
			fill: 'white',
			opacity: .6,
			shadowColor: '#000000',
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var title = new Kinetic.Text({
			x: 300 * sizeFactor,
			y: 60 * sizeFactor,
			width: 400 * sizeFactor,
			align: 'center',
			fontFamily: 'Monaco',		//not sure if this font is available...
			fontSize: 64 * sizeFactor,
			text: 'Title Name',
			fill: 'red',
			fontStyle: 'bold',
			shadowOpacity: .4,
			shadowOffset: {
				x: 3 * sizeFactor,
				y: 3 * sizeFactor
			}
		});

		var waitingScreen = new Kinetic.Group({
			x: 300 * sizeFactor,
			y: 100 * sizeFactor,
			height: 400 * sizeFactor,
			width: 400 * sizeFactor
		});

		var waitingScreenBackgrond = new Kinetic.Rect({
			x: 0, 
			y: 0,
			height: 400 * sizeFactor,
			width: 400 * sizeFactor,
			fill: 'black' //todo: choose color
		});

		var waitingScreenText = new Kinetic.Text({
			x: 0,
			y: 0,
			height: 300 * sizeFactor,
			width: 400 * sizeFactor,
			align: 'center',
			fontFamily: 'Monaco',
			fontSize: 4 * sizeFactor,
			text: 'WAITING FOR OTHER PLAYER',
			fill: ' red',
			fontStyle: 'bold',
			shadowOpacity: .4,
			shadowOffset: {
				x: 3 * sizeFactor,
				y: 3 * sizeFactor
			}
		})

		/*
		* Add the Kinetic objects to the layer and stages
		*/
		waitingScreen.add(waitingScreenBackgrond)
			.add(waitingScreenText);
		foreground.add(singlePlayerText)
			.add(singlePlayer)
			.add(twoPlayerText)
			.add(twoPlayer)
			.add(howToPlayText)
			.add(howToPlay)
			.add(title)
			.add(waitingScreen);
		stage.add(foreground);
		waitingScreen.hide();

		/*
		* add events to the buttons here
		*/

		singlePlayer.on('mouseenter', function(){
			singlePlayer.opacity(1);
			singlePlayer.shadowOpacity(1);
			singlePlayerText.opacity(1);
			singlePlayerText.shadowOpacity(1);
			foreground.batchDraw();
		});

		singlePlayer.on('mouseleave', function(){
			singlePlayer.opacity(.6);
			singlePlayer.shadowOpacity(.4);
			singlePlayerText.opacity(.6);
			singlePlayerText.shadowOpacity(.4);
			singlePlayer.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			singlePlayer.x(340 * sizeFactor);
			singlePlayer.y(396 * sizeFactor);
			singlePlayer.width(150 * sizeFactor);
			singlePlayer.height(48 * sizeFactor);

			singlePlayerText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			singlePlayerText.x(340 * sizeFactor);
			singlePlayerText.y(411 * sizeFactor);
			singlePlayerText.width(150 * sizeFactor);
			singlePlayerText.height(44 * sizeFactor);
			foreground.batchDraw();
		});

		twoPlayer.on('mouseenter', function(){
			twoPlayer.opacity(1);
			twoPlayer.shadowOpacity(1);
			twoPlayerText.opacity(1);
			twoPlayerText.shadowOpacity(1);
			foreground.batchDraw();
		});

		twoPlayer.on('mouseleave', function(){
			twoPlayer.opacity(.6);
			twoPlayer.shadowOpacity(.4);
			twoPlayerText.opacity(.6);
			twoPlayerText.shadowOpacity(.4);
			twoPlayer.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			twoPlayer.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			twoPlayer.x(510 * sizeFactor);
			twoPlayer.y(396 * sizeFactor);
			twoPlayer.width(150 * sizeFactor);
			twoPlayer.height(48 * sizeFactor);

			twoPlayerText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			twoPlayerText.x(514 * sizeFactor);
			twoPlayerText.y(411 * sizeFactor);
			twoPlayerText.width(142 * sizeFactor);
			twoPlayerText.height(44 * sizeFactor);
			foreground.batchDraw();
		});

		howToPlay.on('mouseenter', function(){
			howToPlay.opacity(1);
			howToPlay.shadowOpacity(1);
			howToPlayText.opacity(1);
			howToPlayText.shadowOpacity(1);
			foreground.batchDraw();
		});

		howToPlay.on('mouseleave', function(){
			howToPlay.opacity(.6);
			howToPlay.shadowOpacity(.4);
			howToPlayText.opacity(.6);
			howToPlayText.shadowOpacity(.4);
			howToPlay.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			howToPlay.x(450 * sizeFactor);
			howToPlay.y(456 * sizeFactor);
			howToPlay.width(100 * sizeFactor);
			howToPlay.height(42 * sizeFactor);

			howToPlayText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			howToPlayText.x(454 * sizeFactor);
			howToPlayText.y(468 * sizeFactor);
			howToPlayText.width(92 * sizeFactor);
			howToPlayText.height(38 * sizeFactor);
			foreground.batchDraw();
		});

			singlePlayer.on('mousedown', function(){
			singlePlayer.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			singlePlayer.x(344 * sizeFactor);
			singlePlayer.y(398 * sizeFactor);
			singlePlayer.width(147 * sizeFactor);
			singlePlayer.height(45 * sizeFactor);

			singlePlayerText.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			singlePlayerText.x(344 * sizeFactor);
			singlePlayerText.y(413 * sizeFactor);
			singlePlayerText.width(147 * sizeFactor);
			singlePlayerText.height(41 * sizeFactor);
			foreground.batchDraw();
		});

			singlePlayer.on('mouseup', function(){
			singlePlayer.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			singlePlayer.x(340 * sizeFactor);
			singlePlayer.y(396 * sizeFactor);
			singlePlayer.width(150 * sizeFactor);
			singlePlayer.height(48 * sizeFactor);

			singlePlayerText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			singlePlayerText.x(340 * sizeFactor);
			singlePlayerText.y(411 * sizeFactor);
			singlePlayerText.width(150 * sizeFactor);
			singlePlayerText.height(44 * sizeFactor);
			foreground.batchDraw();
		});

		twoPlayer.on('mousedown', function(){
			twoPlayer.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			twoPlayer.x(514 * sizeFactor);
			twoPlayer.y(398 * sizeFactor);
			twoPlayer.width(147 * sizeFactor);
			twoPlayer.height(45 * sizeFactor);

			twoPlayerText.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			twoPlayerText.x(518 * sizeFactor);
			twoPlayerText.y(413 * sizeFactor);
			twoPlayerText.width(139 * sizeFactor);
			twoPlayerText.height(41 * sizeFactor);
			foreground.batchDraw();
		});

			twoPlayer.on('mouseup', function(){
			twoPlayer.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			twoPlayer.x(510 * sizeFactor);
			twoPlayer.y(396 * sizeFactor);
			twoPlayer.width(150 * sizeFactor);
			twoPlayer.height(48 * sizeFactor);

			twoPlayerText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			twoPlayerText.x(514 * sizeFactor);
			twoPlayerText.y(411 * sizeFactor);
			twoPlayerText.width(142 * sizeFactor);
			twoPlayerText.height(44 * sizeFactor);
			foreground.batchDraw();
		});


		howToPlay.on('mousedown', function(){
			howToPlay.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			howToPlay.x(454 * sizeFactor);
			howToPlay.y(458 * sizeFactor);
			howToPlay.width(97 * sizeFactor);
			howToPlay.height(39 * sizeFactor);

			howToPlayText.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			howToPlayText.x(458 * sizeFactor);
			howToPlayText.y(470 * sizeFactor);
			howToPlayText.width(89 * sizeFactor);
			howToPlayText.height(35 * sizeFactor);
			foreground.batchDraw();
		});

		howToPlay.on('mouseup', function(){
			howToPlay.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			howToPlay.x(450 * sizeFactor);
			howToPlay.y(456 * sizeFactor);
			howToPlay.width(100 * sizeFactor);
			howToPlay.height(42 * sizeFactor);

			howToPlayText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			howToPlayText.x(454 * sizeFactor);
			howToPlayText.y(468 * sizeFactor);
			howToPlayText.width(92 * sizeFactor);
			howToPlayText.height(38 * sizeFactor);
			foreground.batchDraw();
		});

		ws.onmessage = function(msg){
			var data = JSON.parse(msg.data);
			//console.log(data);
			if(data.clientID){
				console.log("Client id: " + data.clientID);
				clientId = data.clientID;
			}
			if(data.message){
				var message = data.message;
				if(message == 'singlePlayerGame'){
					console.log('single player game');
					var gameState = data.gameState,
					numPlayers = 1;
					//console.log(gameState);
					playGame(numPlayers, gameState, ws);
				}else if(message == 'twoPlayerGame'){
					var gameState = data.gameState,
					numPlayers = 2;
					playGame(numPlayers, gameState, ws);
				}
			}
		};

		singlePlayer.on('click', function(){
			var data = JSON.stringify({
				'clientID': clientId,
				'message': 'singlePlayerGame'
			});
			setTimeout(function(){
				ws.send(data);
			}, 75);
			console.log(data);
		});

		twoPlayer.on('click', function(){
			waitingScreen.show();
			var data = JSON.stringify({
				'clientID': clientId,
				'message': 'twoPlayerGame'
			});
			setTimeout(function(){
				ws.send(data);
			}, 75);
			console.log(data);
		});

		howToPlay.on('click', function(){
			setTimeout(displayHowToPlay, 75);
		});
	};

	function displayHowToPlay(){
		$('title').text('How to Play');
		$('#play_area').css({
			'backgroundImage': 'url("static/IMG/background_neonbit.png")'
		});

		var sizeFactor = window.innerWidth / 1366;

		//creates the stage to hold the how to play screen
		var stage = new Kinetic.Stage({
			container: 'play_area',
			width: 1000 * sizeFactor,
			height: 600 * sizeFactor
		});

		var foreground = new Kinetic.Layer();

		var textBackground = new Kinetic.Group({
			x: 250 * sizeFactor,
			y: 150 * sizeFactor,
			width: 600 * sizeFactor,
			height: 408 * sizeFactor
		});

		var textButtons = new Kinetic.Group({
			x: 120 * sizeFactor,
			y: 150 * sizeFactor,
			width: 200 * sizeFactor,
			height: 408 * sizeFactor
		});

		var title = new Kinetic.Text({
			x: 300 * sizeFactor,
			y: 60 * sizeFactor,
			text: 'How to Play',
			width: 400 * sizeFactor,
			align: 'center',
			fill: 'red',
			fontSize: 64 * sizeFactor,
			shadowOffset: {
				x: 3 * sizeFactor,
				y: 3 * sizeFactor
			},
			shadowOpacity: .4,
			fontFamily: 'Monaco',		//MODIFIED BY OH
			fontStyle: 'bold'
		});

		var textBorder = new Kinetic.Rect({
			width: 600 * sizeFactor,
			height: 408 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 10
		});

		var textFill = new Kinetic.Rect({
			width: 600 * sizeFactor,
			height: 408 * sizeFactor,
			fill: '#000000',			//MODIFIED by OH	//possibly 2B263D
			opacity: .7 * sizeFactor,	//MODIFIED by OH
			cornerRadius: 10
		});

		var textInfo = new Kinetic.Text({
			x: 10 * sizeFactor,
			y: 10 * sizeFactor,
			width: 580 * sizeFactor,
			height: 388 * sizeFactor,
			text: '',
			fill: 'white',
			fontSize: 18 * sizeFactor,	//MODIFIED BY OH
			fontFamily: 'Monaco'			//MODIFIED BY OH
		});

		var objectiveBorder = new Kinetic.Rect({
			y: 4 * sizeFactor,
			width: 110 * sizeFactor,
			height: 60 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 2 * sizeFactor,
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var objectiveText = new Kinetic.Text({
			x: 3 * sizeFactor,
			y: 24 * sizeFactor,
			width: 104 * sizeFactor,
			text: 'Objective',
			fill: 'white',
			fontSize: 20 * sizeFactor,
			fontFamily: 'Calibri',
			align: 'center',
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		objectiveBorder.on('mouseenter', function(){
			objectiveBorder.opacity(1);
			objectiveBorder.shadowOpacity(1);
			objectiveText.opacity(1);
			objectiveText.shadowOpacity(1);
			foreground.batchDraw();
		});

		objectiveBorder.on('mouseleave', function(){
			if(objectiveBorder.shadowOffsetX() != 4 * sizeFactor){
				objectiveBorder.opacity(.6);
				objectiveBorder.shadowOpacity(.4);
				objectiveText.opacity(.6);
				objectiveText.shadowOpacity(.4);
				foreground.batchDraw();  
			}
		});

		objectiveBorder.on('mousedown', function(){
			if(objectiveBorder.shadowOffsetX() != 4 * sizeFactor){
				resetButtons();
				objectiveBorder.opacity(1);
				objectiveBorder.shadowOpacity(1);
				objectiveText.opacity(1);
				objectiveText.shadowOpacity(1);
				objectiveBorder.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				objectiveBorder.x(4 * sizeFactor);
				objectiveBorder.y(6 * sizeFactor);
				objectiveBorder.width(107 * sizeFactor);
				objectiveBorder.height(57 * sizeFactor);

				objectiveText.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				objectiveText.x(7 * sizeFactor);
				objectiveText.y(26 * sizeFactor);
				objectiveText.width(101 * sizeFactor);
				textInfo.text('    Survive as long as you can against waves of enemies that only want you deleted. Gain money by clearing rounds to purchase armor and weapon upgrades. Fend off the hordes yourself, or play co-op with a friend. \n\n<insert flavor text>');
				foreground.batchDraw();
			}
		});

		var controlsBorder = new Kinetic.Rect({
			y: 72 * sizeFactor,
			width: 110 * sizeFactor,
			height: 60 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var controlsText = new Kinetic.Text({
			x: 3 * sizeFactor,
			y: 92 * sizeFactor,
			width: 104 * sizeFactor,
			text: 'Controls',
			fill: 'white',
			fontSize: 20 * sizeFactor,
			fontFamily: 'Calibri',
			align: 'center',
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		controlsBorder.on('mouseenter', function(){
			controlsBorder.opacity(1);
			controlsBorder.shadowOpacity(1);
			controlsText.opacity(1);
			controlsText.shadowOpacity(1);
			foreground.batchDraw();
		});

		controlsBorder.on('mouseleave', function(){
			if(controlsBorder.shadowOffsetX() != 4 * sizeFactor){
				controlsBorder.opacity(.6);
				controlsBorder.shadowOpacity(.4);
				controlsText.opacity(.6);
				controlsText.shadowOpacity(.4);
				foreground.batchDraw();  
			}
		});

			controlsBorder.on('mousedown', function(){
			if(controlsBorder.shadowOffsetX() != 4 * sizeFactor){
				resetButtons();
				controlsBorder.opacity(1);
				controlsBorder.shadowOpacity(1);
				controlsText.opacity(1);
				controlsText.shadowOpacity(1);
				controlsBorder.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				controlsBorder.x(4 * sizeFactor);
				controlsBorder.y(74 * sizeFactor);
				controlsBorder.width(107 * sizeFactor);
				controlsBorder.height(57 * sizeFactor);

				controlsText.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				controlsText.x(7 * sizeFactor);
				controlsText.y(94 * sizeFactor);
				controlsText.width(101 * sizeFactor);
				textInfo.text('\n  w        move up\n\n  a        move left\n\n  s        move down\n\n  d        move right\n\n  e        change weapon\n\n  space    sprint (cannot shoot while sprinting)\n\n  mouse    aim weapon, click to shoot');
				foreground.batchDraw();
			}
		});

		var gunsBorder = new Kinetic.Rect({
			y: 140 * sizeFactor,
			width: 110 * sizeFactor,
			height: 60 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var gunsText = new Kinetic.Text({
			x: 3 * sizeFactor,
			y: 160 * sizeFactor,
			width: 104 * sizeFactor,
			text: 'Weapons',					//MODIFIED BY OH
			fill: 'white',
			fontSize: 20 * sizeFactor,
			fontFamily: 'Calibri',
			align: 'center',
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		gunsBorder.on('mouseenter', function(){
			gunsBorder.opacity(1);
			gunsBorder.shadowOpacity(1);
			gunsText.opacity(1);
			gunsText.shadowOpacity(1);
			foreground.batchDraw();
		});

		gunsBorder.on('mouseleave', function(){
			if(gunsBorder.shadowOffsetX() != 4 * sizeFactor){
				gunsBorder.opacity(.6);
				gunsBorder.shadowOpacity(.4);
				gunsText.opacity(.6);
				gunsText.shadowOpacity(.4);
				foreground.batchDraw();  
			}
		});

		gunsBorder.on('mousedown', function(){
			if(gunsBorder.shadowOffsetX() != 4 * sizeFactor){
				resetButtons();
				gunsBorder.opacity(1);
				gunsBorder.shadowOpacity(1);
				gunsText.opacity(1);
				gunsText.shadowOpacity(1);
				gunsBorder.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				gunsBorder.x(4 * sizeFactor);
				gunsBorder.y(142 * sizeFactor);
				gunsBorder.width(107 * sizeFactor);
				gunsBorder.height(57 * sizeFactor);

				gunsText.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				gunsText.x(7 * sizeFactor);
				gunsText.y(162 * sizeFactor);
				gunsText.width(101 * sizeFactor);
				textInfo.text('\n  pistol         your standard weapon. decent damage,\n                 unlimited ammo.\n\n\n  (rest still not implemented)\n\n\n\n  machine gun    continuous rate of fire, low damage,\n                 (un)limited ammo.\n\n  shotgun\n\n  grenade launcher\n\n  gatling gun');
				foreground.batchDraw();
			}
		});

		var armorBorder = new Kinetic.Rect({
			y: 208 * sizeFactor,
			width: 110 * sizeFactor,
			height: 60 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var armorText = new Kinetic.Text({
			x: 3 * sizeFactor,
			y: 228 * sizeFactor,
			width: 104 * sizeFactor,
			text: 'Armor',
			fill: 'white',
			fontSize: 20 * sizeFactor,
			fontFamily: 'Calibri',
			align: 'center',
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		armorBorder.on('mouseenter', function(){
			armorBorder.opacity(1);
			armorBorder.shadowOpacity(1);
			armorText.opacity(1);
			armorText.shadowOpacity(1);
			foreground.batchDraw();
		});

		armorBorder.on('mouseleave', function(){
			if(armorBorder.shadowOffsetX() != 4 * sizeFactor){
				armorBorder.opacity(.6);
				armorBorder.shadowOpacity(.4);
				armorText.opacity(.6);
				armorText.shadowOpacity(.4);
				foreground.batchDraw();  
			}
		});

		armorBorder.on('mousedown', function(){
			if(armorBorder.shadowOffsetX() != 4 * sizeFactor){
				resetButtons();
				armorBorder.opacity(1);
				armorBorder.shadowOpacity(1);
				armorText.opacity(1);
				armorText.shadowOpacity(1);
				armorBorder.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				armorBorder.x(4 * sizeFactor);
				armorBorder.y(210 * sizeFactor);
				armorBorder.width(107 * sizeFactor);
				armorBorder.height(57 * sizeFactor);

				armorText.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				armorText.x(7 * sizeFactor);
				armorText.y(230 * sizeFactor);
				armorText.width(101 * sizeFactor);
				textInfo.text('\n  (still not implemented)\n\n  basic\n\n  invisibility\n\n  poison\n\n  hyper');
				foreground.batchDraw();
			}
		});

		var turretsBorder = new Kinetic.Rect({
			y: 276 * sizeFactor,
			width: 110 * sizeFactor,
			height: 60 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var turretsText = new Kinetic.Text({
			x: 3 * sizeFactor,
			y: 296 * sizeFactor,
			width: 104 * sizeFactor,
			text: 'Turrets',
			fill: 'white',
			fontSize: 20 * sizeFactor,
			fontFamily: 'Calibri',
			align: 'center',
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		turretsBorder.on('mouseenter', function(){
			turretsBorder.opacity(1);
			turretsBorder.shadowOpacity(1);
			turretsText.opacity(1);
			turretsText.shadowOpacity(1);
			foreground.batchDraw();
		});

		turretsBorder.on('mouseleave', function(){
			if(turretsBorder.shadowOffsetX() != 4 * sizeFactor){
				turretsBorder.opacity(.6);
				turretsBorder.shadowOpacity(.4);
				turretsText.opacity(.6);
				turretsText.shadowOpacity(.4);
				foreground.batchDraw();  
			}
		});

		turretsBorder.on('mousedown', function(){
			if(turretsBorder.shadowOffsetX() != 4 * sizeFactor){
				resetButtons();
				turretsBorder.opacity(1);
				turretsBorder.shadowOpacity(1);
				turretsText.opacity(1);
				turretsText.shadowOpacity(1);
				turretsBorder.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				turretsBorder.x(4 * sizeFactor);
				turretsBorder.y(278 * sizeFactor);
				turretsBorder.width(107 * sizeFactor);
				turretsBorder.height(57 * sizeFactor);

				turretsText.shadowOffset({
					x: 4 * sizeFactor,
					y: 2 * sizeFactor
				});
				turretsText.x(7 * sizeFactor);
				turretsText.y(298 * sizeFactor);
				turretsText.width(101 * sizeFactor);
				textInfo.text('\n  (still not implemented)\n\n  basic\n\n  stunner\n\n  rapid\n\n  bomb');
				foreground.batchDraw();
			}
		});

		var returnBorder = new Kinetic.Rect({
			y: 344 * sizeFactor,
			width: 110 * sizeFactor,
			height: 60 * sizeFactor,
			stroke: 'white',
			strokeWidth: 3 * sizeFactor,
			cornerRadius: 2,
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		var returnText = new Kinetic.Text({
			x: 3 * sizeFactor,
			y: 364 * sizeFactor,
			width: 104 * sizeFactor,
			text: 'Main Menu',
			fill: 'white',
			fontSize: 20 * sizeFactor,
			fontFamily: 'Calibri',
			align: 'center',
			opacity: .6,
			shadowOpacity: .4,
			shadowOffset: {
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			}
		});

		returnBorder.on('mouseenter', function(){
			returnBorder.opacity(1);
			returnBorder.shadowOpacity(1);
			returnText.opacity(1);
			returnText.shadowOpacity(1);
			foreground.batchDraw();
		});

		returnBorder.on('mouseleave', function(){
			returnBorder.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			returnBorder.x(0 * sizeFactor);
			returnBorder.y(344 * sizeFactor);
			returnBorder.width(110 * sizeFactor);
			returnBorder.height(60 * sizeFactor);

			returnText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			returnText.x(3 * sizeFactor);
			returnText.y(364 * sizeFactor);
			returnText.width(104 * sizeFactor);
			returnBorder.opacity(.6);
			returnBorder.shadowOpacity(.4);
			returnText.opacity(.6);
			returnText.shadowOpacity(.4);
			foreground.batchDraw();  
		});

		returnBorder.on('mousedown', function(){
			returnBorder.opacity(1);
			returnBorder.shadowOpacity(1);
			returnText.opacity(1);
			returnText.shadowOpacity(1);
			returnBorder.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			returnBorder.x(4 * sizeFactor);
			returnBorder.y(346 * sizeFactor);
			returnBorder.width(107 * sizeFactor);
			returnBorder.height(57 * sizeFactor);

			returnText.shadowOffset({
				x: 4 * sizeFactor,
				y: 2 * sizeFactor
			});
			returnText.x(7 * sizeFactor);
			returnText.y(366 * sizeFactor);
			returnText.width(101 * sizeFactor);
			foreground.batchDraw();
		});

		returnBorder.on('mouseup', function(){
			returnBorder.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			returnBorder.x(0 * sizeFactor);
			returnBorder.y(344 * sizeFactor);
			returnBorder.width(110 * sizeFactor);
			returnBorder.height(60 * sizeFactor);

			returnText.shadowOffset({
				x: 8 * sizeFactor,
				y: 8 * sizeFactor
			});
			returnText.x(3 * sizeFactor);
			returnText.y(364) * sizeFactor;
			returnText.width(104 * sizeFactor);
		});

		returnBorder.on('click', function(){
			setTimeout(displayTitle, 60);
		})

		function resetButtons(){
			if(objectiveBorder.shadowOffsetX() == 4 * sizeFactor){
				objectiveBorder.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				objectiveBorder.x(0 * sizeFactor);
				objectiveBorder.y(4 * sizeFactor);
				objectiveBorder.width(110 * sizeFactor);
				objectiveBorder.height(60 * sizeFactor);

				objectiveText.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				objectiveText.x(3 * sizeFactor);
				objectiveText.y(24 * sizeFactor);
				objectiveText.width(104 * sizeFactor);
				objectiveBorder.opacity(.6);
				objectiveBorder.shadowOpacity(.4);
				objectiveText.opacity(.6);
				objectiveText.shadowOpacity(.4);
				return;
			}
			if(controlsBorder.shadowOffsetX() == 4 * sizeFactor){
				controlsBorder.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				controlsBorder.x(0 * sizeFactor);
				controlsBorder.y(72 * sizeFactor);
				controlsBorder.width(110 * sizeFactor);
				controlsBorder.height(60 * sizeFactor);

				controlsText.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				controlsText.x(3 * sizeFactor);
				controlsText.y(92 * sizeFactor);
				controlsText.width(104 * sizeFactor);
				controlsBorder.opacity(.6);
				controlsBorder.shadowOpacity(.4);
				controlsText.opacity(.6);
				controlsText.shadowOpacity(.4);
				return;
			}
			if(gunsBorder.shadowOffsetX() == 4 * sizeFactor){
				gunsBorder.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				gunsBorder.x(0 * sizeFactor);
				gunsBorder.y(140 * sizeFactor);
				gunsBorder.width(110 * sizeFactor);
				gunsBorder.height(60 * sizeFactor);

				gunsText.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				gunsText.x(3 * sizeFactor);
				gunsText.y(160 * sizeFactor);
				gunsText.width(104 * sizeFactor);
				gunsBorder.opacity(.6);
				gunsBorder.shadowOpacity(.4);
				gunsText.opacity(.6);
				gunsText.shadowOpacity(.4);
				return;
			}
			if(armorBorder.shadowOffsetX() == 4 * sizeFactor){
				armorBorder.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				armorBorder.x(0 * sizeFactor);
				armorBorder.y(208 * sizeFactor);
				armorBorder.width(110 * sizeFactor);
				armorBorder.height(60 * sizeFactor);

				armorText.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				armorText.x(3 * sizeFactor);
				armorText.y(228 * sizeFactor);
				armorText.width(104 * sizeFactor);
				armorBorder.opacity(.6);
				armorBorder.shadowOpacity(.4);
				armorText.opacity(.6);
				armorText.shadowOpacity(.4);
				return;
			}
			if(turretsBorder.shadowOffsetX() == 4 * sizeFactor){
				turretsBorder.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				turretsBorder.x(0 * sizeFactor);
				turretsBorder.y(276 * sizeFactor);
				turretsBorder.width(110 * sizeFactor);
				turretsBorder.height(60 * sizeFactor);

				turretsText.shadowOffset({
					x: 8 * sizeFactor,
					y: 8 * sizeFactor
				});
				turretsText.x(3 * sizeFactor);
				turretsText.y(296 * sizeFactor);
				turretsText.width(104 * sizeFactor);
				turretsBorder.opacity(.6);
				turretsBorder.shadowOpacity(.4);
				turretsText.opacity(.6);
				turretsText.shadowOpacity(.4);
				return;
			}
		};

		textButtons.add(objectiveText)
			.add(objectiveBorder)
			.add(controlsText)
			.add(controlsBorder)
			.add(gunsText)
			.add(gunsBorder)
			.add(armorText)
			.add(armorBorder)
			.add(turretsText)
			.add(turretsBorder)
			.add(returnText)
			.add(returnBorder);
		textBackground.add(textFill)
			.add(textBorder)
			.add(textInfo);
		foreground.add(title)
			.add(textBackground)
			.add(textButtons);
		stage.add(foreground);
	};


	/*
	* Single player game function that controls running the game
	*/
	function playGame(numPlayers, gameState){
		console.log('playing a game');
		if(numPlayers == 1){
			$('title').text('Single Player Game');
		}else{
			$('title').text('Two Player Game');
		}

		//variables used to control the sizing of the game display
		var sizeFactor = window.innerWidth / 1366,
		width = 1000 * sizeFactor,
		height = 600 * sizeFactor,
		imageSize = 64,
		playAreaOffset = $('#play_area').offset(),
		playAreaWidth = 1200, //1500
		playAreaHeight = 800; //960

		//commented out, because i'm not sure if this has been implemented yet.
		//wait... this may be for game computation. probably don't need it for clientside.
		/*
		//variables used to hold information about the level
		var lvlComplete = false,
		lvlNumber = 1;
		if(gameState.lvlNumber != undefined){
		lvlNumber = gameState.lvlNumber;
		}
		*/

		//variables used to control the fog that the player can see
		var fogSize = 400,
		fog = [];

		//variables used to store the positions of the walls
		var walls = [],
		verticalWalls = [],
		horizontalWalls = [];
		if(gameState.verticalWalls){
			verticalWalls = gameState.verticalWalls;
		}
		if(gameState.horizontalWalls){
			horizontalWalls = gameState.horizontalWalls;
		}

		//varibales used to store the enemy objects
		var enemies = [];

		//varibbles to store the bullet objects
		var bullets = [];

		//styling used to hide the background image from the title screen
		$('#play_area').css({
			'backgroundImage': 'none',
			'width': width,
			'heigth': height
			//'cursor': 'url(../IMG/gunsight.png), crosshair'
		});
		$('#play_area').animate({
			'left': (12 * sizeFactor) + 'px'
		}, 300, 'swing', function(){
			$('#right_panel').slideDown(300);
			playAreaOffset = $('#play_area').offset();
		});

		//creates the stage to hold the how to play screen
		var stage = new Kinetic.Stage({container: 'play_area', width: 1000 * sizeFactor, height: 600 * sizeFactor});

		/*
		* creates the layers for the game
		*/

		//foreground layer used to hold the player, bullets, and enemies
		var foreground = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: width, height: height}});
		var bulletGroup = new Kinetic.Group({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight});
		var enemyGroup = new Kinetic.Group({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight});
		foreground.add(bulletGroup).add(enemyGroup);

		//background layer used to hold the walls and background tiling
		var background = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: width, height: height}});

		//layer used to hold the fog
		var fogLayer = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: width, height:height}, opacity: .9});

		/*
		//layer used to hold hp bar...
		var infoLayer = new Kinetic.Layer({x: 0, y: 0, width: width, height: height, opacity: .8});
		*/

		/*
		* Self invoking anonymouse function used to populate the layers with the player, walls, and fog
		*/
		(function(){
			//constructs the fog layer (composed of 8 different rectangles)
			fog[0] = new Kinetic.Rect({x: 0, y: 0, height: playAreaHeight, fill: '#62403A'});
			fog[1] = new Kinetic.Rect({y: 0, height: playAreaHeight, fill: '#62403A'});
			fog[2] = new Kinetic.Rect({y: 0, fill: '#62403A'});
			fog[3] = new Kinetic.Rect({fill: '#62403A'});
			fogLayer.add(fog[0]).add(fog[1]).add(fog[2]).add(fog[3]);
			if(numPlayers == 2){
				fog[4] = new Kinetic.Rect({fill: '#62403A'});
				fog[5] = new Kinetic.Rect({fill: '#62403A'});
				fog[6] = new Kinetic.Rect({fill: '#62403A'});
				fog[7] = new Kinetic.Rect({fill: '#62403A'});
				fog[8] = new Kinetic.Rect({fill: '#62403A'});
				fog[9] = new Kinetic.Rect({fill: '#62403A'});
				fog[10] = new Kinetic.Rect({fill: '#62403A'});
				fogLayer.add(fog[4]).add(fog[5]).add(fog[6]).add(fog[7]).add(fog[8]).add(fog[9]).add(fog[10]);
			}

			//adds the background color and border
			var backGroundFill = new Kinetic.Rect({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, fillPatternImage: backgroundPattern, fillPatternRepeat: 'repeat' });
			var backGroundBorder = new Kinetic.Rect({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, stroke: 'white', strokeWidth: 10});
			background.add(backGroundFill);
			background.add(backGroundBorder);

			//adds the horizontal walls to the background
			for(var i = 0; i < horizontalWalls.length; ++i){
				walls.push(new createWall(horizontalWalls[i][0] * 50, horizontalWalls[i][1] * 32, 'horizontal'));
				background.add(walls[walls.length - 1].obj);
			}

			//adds the vertical walls to the background
			for(var i = 0; i < verticalWalls.length; ++i){
				walls.push(new createWall(verticalWalls[i][0] * 50 + 12, verticalWalls[i][1] * 32, 'vertical'));
				background.add(walls[walls.length - 1].obj);
			}

			//creates the player and adds him to the foreground
			player = new createPlayer(gameState.player.x, gameState.player.y);
			foreground.add(player.obj);

			/*
			//add info stuff to info layer
			infoLayer.add(gameState.player.healthBar);
			infoLayer.add(gameState.player.healthBarBorder);
			*/

			//creates the other player if it is a two player game
			if(numPlayers == 2){
				otherPlayer = new createPlayer(gameState.otherPlayer.x, gameState.otherPlayer.y);
				foreground.add(otherPlayer.obj);
			}

			//add the layers to the stage
			stage.add(background).add(foreground).add(fogLayer);
			redraw();
		})();

		//constructor functions to create a Player
		function createPlayer(x, y){
			this.obj = new Kinetic.Image({
			x: 500 * sizeFactor - imageSize / 2,
			y: 300 * sizeFactor - imageSize / 2,
			width: imageSize,
			height: imageSize,
			image: playerImg[0]
			});
			this.direction = 'up';
			/*
			this.healthBarBorder = new Kinetic.Rect({
			x: (width - 200) * sizeFactor - 2,
			y: (height - 50) * sizeFactor - 2,
			width: 150 + 4,
			height: 20 + 4,
			strokeWidth: 4,
			stroke: 'black'
			});
			this.healthBar = new Kinetic.Rect({
			x: (width - 200) * sizeFactor,
			y: (height - 50) * sizeFactor,
			width: 150,
			height: 20,
			fill: 'red'
			});
			*/
		};

		function createWall(x, y, type){
			if(type == 'vertical'){
				this.obj = new Kinetic.Image({x: x, y: y, width: 26, height: 64, image: wallVertical});
			}else if(type == 'horizontal'){
				this.obj = new Kinetic.Image({x: x, y: y, width: 50, height: 32, image: wallHorizontal});
			}
			this.type = 'wall';
		};

		//constructor function to create the bullets
		function createBullet(xpos, ypos){
			this.obj = new Kinetic.Circle({radius: 2, x: xpos, y: ypos, fill: '#7FFF00'});
		};

		//constructor function to create enemies
		function createEnemy(x, y, type, imgNum){
			switch(type){
			case 'gridBug':
			this.obj = new Kinetic.Image({
				x: x,
				y: y,
				width: imageSize,
				height: imageSize,
				image: gridBugImg[imgNum]
			});
			break;
			case 'roller':
			this.obj = new Kinetic.Image({
				x: x,
				y: y,
				width: imageSize,
				height: imageSize,
				image: rollerImg[imgNum]
			});
			break;
			case 'heavy':
			this.obj = new Kinetic.Image({
				x: x,
				y: y,
				width: imageSize,
				height: imageSize,
				image: image3
			});
			break;
			}
		}

		/*
		* Functions for objects in game
		*/

		//increments the player's position based on the players current position, change of position, and timestep amount
		//also updates the position/clip of the foreground/background
		function updatePlayer(playerData, player){
			var xpos = playerData.x,
			originalX = width/2 - imageSize/2,
			clipX,
			posX;
			if(playAreaWidth <= width || xpos <= (originalX)){
				clipX = 0,
				posX = 0;
			}
			else if(xpos >= (playAreaWidth - originalX - imageSize)){
				clipX = playAreaWidth - width;
				posX = width - playAreaWidth;
			}
			else{
				clipX = xpos - originalX;
				posX = originalX - xpos;
			}
			player.obj.x(xpos);
			fogLayer.x(posX);
			fogLayer.clipX(clipX);
			foreground.x(posX);
			foreground.clipX(clipX);
			background.x(posX);
			background.clipX(clipX);
			var ypos = playerData.y,
			originalY = height/2 - imageSize/2,
			clipY,
			posY;
			if(playAreaHeight <= height || ypos <= (originalY)){
				clipY = 0,
				posY = 0;
			}
			else if(ypos >= (playAreaHeight - originalY - imageSize)){
				clipY = playAreaHeight - height;
				posY = height - playAreaHeight;
			}
			else{
				clipY = ypos - originalY;
				posY = originalY - ypos;
			}
			player.obj.y(ypos);
			fogLayer.y(posY);
			fogLayer.clipY(clipY);
			foreground.y(posY);
			foreground.clipY(clipY);
			background.y(posY);
			background.clipY(clipY);
			player.obj.image(playerImg[playerData.imgNum]);
		};

		//function used to update the appearance of the fog based on the player's position
		function updateFog(playerData, otherPlayerData){
			var halfFog = fogSize/2,
			halfWidth = width/2,
			halfHeight = height/2,
			left1,
			right1,
			top1,
			bottom1,
			left2,
			right2,
			top2,
			bottom2;
			if(!otherPlayerData){
				left1 = playerData.x + imageSize/2 - halfFog;
				right1 = playerData.x + imageSize/2 + halfFog;
				top1 = playerData.y + imageSize/2 - halfFog;
				bottom1 = playerData.y + imageSize/2 + halfFog;
				fog[0].width(left1);
				fog[1].x(right1).width(playAreaWidth - right1);
				fog[2].x(left1).height(top1).width(right1 - left1);
				fog[3].x(left1).y(bottom1).height(playAreaHeight - bottom1).width(right1 - left1);
			}else{
				var left1 = playerData.x+ imageSize/2 - halfFog,
				right1 = playerData.x+ imageSize/2 + halfFog,
				top1 = playerData.y + imageSize/2 - halfFog,
				bottom1 = playerData.y + imageSize/2 + halfFog,
				left2 = otherPlayerData.x + imageSize/2 - halfFog,
				right2 = otherPlayerData.x + imageSize/2 + halfFog,
				top2 = otherPlayerData.y + imageSize/2 - halfFog,
				bottom2 = otherPlayerData.y + imageSize/2 + halfFog,
				vertical = [],
				horizontal = [],
				verticalOverlap = false,
				horizontalOverlap = false;
				if(left1 < left2){
					horizontal[0] = left1;
					horizontal[3] = right2;
					if(right1 < left2){
						horizontal[1] = right1;
						horizontal[2] = left2;
					}else{
						horizontal[1] = left2;
						horizontal[2] = right1;
						horizontalOverlap = true;
					}
				}else{
					horizontal[0] = left2;
					horizontal[3] = right1;
					if(right2 < left1){
						horizontal[1] = right2;
						horizontal[2] = left1;
					}else{
						horizontal[1] = left1;
						horizontal[2] = right2;
						horizontalOverlap = true;
					}
				}
				if(top1 < top2){
					vertical[0] = top1;
					vertical[3] = bottom2;
					if(bottom1 < top2){
						vertical[1] = bottom1;
						vertical[2] = top2;
					}else{
						vertical[1] = top2;
						vertical[2] = bottom1;
						verticalOverlap = true;
					}
				}else{
					vertical[0] = top2;
					vertical[3] = bottom1;
					if(bottom2 < top1){
						vertical[1] = bottom2;
						vertical[2] = top1;
					}else{
						vertical[1] = top1;
						vertical[2] = bottom2;
						verticalOverlap = true;
					}
				}
				fog[0].width(horizontal[0]);
				fog[1].x(horizontal[3]).width(playAreaWidth - horizontal[3]);
				fog[2].x(horizontal[0]).height(vertical[0]).width(horizontal[3] - horizontal[0]);
				fog[3].x(horizontal[0]).y(vertical[3]).height(playAreaHeight - vertical[3]).width(horizontal[3] - horizontal[0])
				if(!verticalOverlap || !horizontalOverlap){
					fog[6].x(horizontal[1]).width(horizontal[2] - horizontal[1]).y(vertical[1]).height(vertical[2] - vertical[1]).show();
				}else{
					fog[6].hide();
				}
				if(!verticalOverlap){
					fog[5].x(horizontal[0]).width(horizontal[1] - horizontal[0]).y(vertical[1]).height(vertical[2] - vertical[1]).show();
					fog[7].x(horizontal[2]).width(horizontal[3] - horizontal[2]).y(vertical[1]).height(vertical[2] - vertical[1]).show();
				}else{
					fog[5].hide();
					fog[7].hide();
				}
				if(!horizontalOverlap){
					fog[4].x(horizontal[1]).width(horizontal[2] - horizontal[1]).y(vertical[0]).height(vertical[1] - vertical[0]).show();
					fog[8].x(horizontal[1]).width(horizontal[2] - horizontal[1]).y(vertical[2]).height(vertical[3] - vertical[2]).show();
				}else{
					fog[4].hide();
					fog[8].hide();
				}
				if(left1 < left2 && top1 < top2 || left2 < left1 && top2 < top1){
					fog[9].x(horizontal[0]).width(horizontal[1] - horizontal[0]).y(vertical[2]).height(vertical[3] - vertical[2]);
					fog[10].x(horizontal[2]).width(horizontal[3] - horizontal[2]).y(vertical[0]).height(vertical[1] - vertical[0]);
				}else{
					fog[9].x(horizontal[2]).width(horizontal[3] - horizontal[2]).y(vertical[2]).height(vertical[3] - vertical[2]);
					fog[10].x(horizontal[0]).width(horizontal[1] - horizontal[0]).y(vertical[0]).height(vertical[1] - vertical[0]);
				}
			}
		};

		/*
		* Event controllers for the game
		*/

		//mouse down event is used to fire a bullet
		$('#play_area').on('mousedown', function(evt){
			var data = JSON.stringify({
				'clientID': clientId,
				'message': 'mousedown',
				'x': evt.pageX - playAreaOffset.left + background.clipX(),
				'y': evt.pageY - playAreaOffset.top + background.clipY()
			});
			ws.send(data);
		});

		//mouse up event is used to stop rapid fire
		$('#play_area').on('mouseup', function(){
			var data = JSON.stringify({
				'clientID': clientId,
				'message': 'mouseup'
			});
			ws.send(data);
		})

		//mouse move event is used to aim the gun (updates player model to show which direction the player is aiming)
		$('#play_area').on('mousemove', function(evt){
			var x = evt.pageX - playAreaOffset.left + background.clipX(),
			y = evt.pageY - playAreaOffset.top + background.clipY(),
			diffX = x - player.obj.x(),
			diffY = y - player.obj.y();

			var data  = {
				'clientID': clientId,
				'message': 'mousemove',
				'direction' : 'none'
			};

			if(Math.abs(diffX) > Math.abs(diffY)){
				if(diffX > 0){
					if(player.direction != 'east'){
						player.direction = 'east';
						data.direction = 'east';
						ws.send(JSON.stringify(data));
					}
				}else{
					if(player.direction != 'west'){
						player.direction = 'west';
						data.direction = 'west';
						ws.send(JSON.stringify(data));
					}
				}
			}else{
				if(diffY > 0){
					if(player.direction != 'south'){
						player.direction = 'south';
						data.direction = 'south';
						ws.send(JSON.stringify(data));
					}
					}else{
					if(player.direction != 'north'){
						player.direction = 'north';
						data.direction = 'north';
						ws.send(JSON.stringify(data));
					}
				}
			}
		})

		//keydown event is used to increment the player movement, toggle the weapons
		$(document).keydown( function(evt){
			var data = JSON.stringify({
				'clientID': clientId,
				'message': 'keydown',
				'keycode': evt.keyCode
			});
			ws.send(data);
		});

		//keyup event is used to decrement the player movement
		//$(document).on('keyup', function(evt){
		$(document).keyup( function(evt){
			var data = JSON.stringify({
				'clientID': clientId,
				'message': 'keyup',
				'keycode': evt.keyCode
			});
			ws.send(data);
		});

		/*
		* Functions used to increment the state of the game and redraw the display to show the new state
		*/

		//redraw function that redraws the foreground to show the current positions
		function redraw(){
			background.batchDraw();
			foreground.batchDraw();
			fogLayer.batchDraw();
		}

		ws.onmessage = function(msg){
			var data = JSON.parse(msg.data);
			//console.log(data);
			if(data.message == 'updateState'){
				var gameState = data.gameState,
				enemyData = gameState.enemyData,
				bulletData = gameState.bulletData,
				playerData = gameState.playerData,
				otherPlayerData;
				updatePlayer(playerData, player);
				if(numPlayers == 2){
					otherPlayerData = gameState.otherPlayerData;
					updatePlayer(otherPlayerData, otherPlayer);
				}
				updateFog(playerData, otherPlayerData);
				bulletGroup.destroyChildren();
				enemyGroup.destroyChildren();
				for(var i = 0; i < enemyData.length; ++i){
					var enemy = new createEnemy(enemyData[i].x, enemyData[i].y, enemyData[i].type, enemyData[i].imgNum);
					enemyGroup.add(enemy.obj);
				}
				for(var i = 0; i < bulletData.length; ++i){
					var bullet = new Kinetic.Circle({
						radius: 2,
						x: bulletData[i].x,
						y: bulletData[i].y,
						fill: '#7FFF00'
					});
					bulletGroup.add(bullet);
				}
				redraw();
			}
			if(data.message == 'gameLost'){
				$('#play_area').fadeOut();
				audio[0].pause();
				audio[4].play();
			}
		};
	};

	/*
	* Purchase screen function that takes in the state of the game as the argument
	*/
	function purchaseScreen(gameState){

	};
});