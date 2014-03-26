//todo: purchase screen
//todo: finish packaging all the information in a game state object

$(document).ready(function(){
  //Styling the display based on the screen size of the user
  var sizeFactor = window.innerWidth / 1366,
      width = 1300 * sizeFactor,
      height = 600 * sizeFactor;
  $('#game').css({
    'height': height + 'px',
    'width': width + 'px'
  });
  $('#left_panel').css({
    'top': (10 * sizeFactor) + 'px',
    'left': (10 * sizeFactor) + 'px',
    'width': (138 * sizeFactor) + 'px',
    'height': (580 * sizeFactor) + 'px'
  });
  $('#right_panel').css({
    'top': (10 * sizeFactor) + 'px',
    'left': (1152 * sizeFactor) + 'px',
    'width': (138 * sizeFactor) + 'px',
    'height': (580 * sizeFactor) + 'px'
  });
  $('#play_area').css({
    'top': '0px',
    'left': (150 * sizeFactor) + 'px',
    'width': (1000 * sizeFactor) + 'px',
    'height': height + 'px',
    'backgroundImage': 'url("../IMG/background.jpg")',
    'backgroundSize' : (1000 * sizeFactor) + 'px ' + (600 * sizeFactor) + 'px',
    'backgroundRepeat': 'no-repeat'
  });

  //Load the images that will be used in the game
  var playerImg = [new Image(), new Image(), new Image(), new Image()], //0: east, 1: west, 2: north, 3: south
      rollerImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(),
                    new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()], //0,1: east, 2,3: west, 4,5: north, 6,7: south
      gridBugImg = [new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image(), new Image()], //0,1: southwest/northeast, 2,3: northwest/southeast
      wallHorizontal = new Image(),
      wallVertical = new Image(),
      backgroundPattern = new Image();

  playerImg[0].src = '../SPRITES/PLAYER/p1_stand_N.png';
  playerImg[1].src = '../SPRITES/PLAYER/p1_stand_W.png';
  playerImg[2].src = '../SPRITES/PLAYER/p1_stand_E.png';
  playerImg[3].src = '../SPRITES/PLAYER/p1_stand_S.png';
  rollerImg[0].src = '../SPRITES/ROLLER/roller_E1.png';
  rollerImg[1].src = '../SPRITES/ROLLER/roller_E2.png';
  rollerImg[2].src = '../SPRITES/ROLLER/roller_W1.png';
  rollerImg[3].src = '../SPRITES/ROLLER/roller_W2.png';
  rollerImg[4].src = '../SPRITES/ROLLER/roller_N1.png';
  rollerImg[5].src = '../SPRITES/ROLLER/roller_N2.png';
  rollerImg[6].src = '../SPRITES/ROLLER/roller_S1.png';
  rollerImg[7].src = '../SPRITES/ROLLER/roller_S2.png';
  rollerImg[8].src = '../SPRITES/ROLLER/roller_E1_hit.png';
  rollerImg[9].src = '../SPRITES/ROLLER/roller_E2_hit.png';
  rollerImg[10].src = '../SPRITES/ROLLER/roller_W1_hit.png';
  rollerImg[11].src = '../SPRITES/ROLLER/roller_W2_hit.png';
  rollerImg[12].src = '../SPRITES/ROLLER/roller_N1_hit.png';
  rollerImg[13].src = '../SPRITES/ROLLER/roller_N2_hit.png';
  rollerImg[14].src = '../SPRITES/ROLLER/roller_S1_hit.png';
  rollerImg[15].src = '../SPRITES/ROLLER/roller_S2_hit.png';
  gridBugImg[0].src = '../SPRITES/GRIDBUG/gridbug_E1.png';
  gridBugImg[1].src = '../SPRITES/GRIDBUG/gridbug_E2.png';
  gridBugImg[2].src = '../SPRITES/GRIDBUG/gridbug_W1.png';
  gridBugImg[3].src = '../SPRITES/GRIDBUG/gridbug_W2.png';
  gridBugImg[4].src = '../SPRITES/GRIDBUG/gridbug_E1_hit.png';
  gridBugImg[5].src = '../SPRITES/GRIDBUG/gridbug_E2_hit.png';
  gridBugImg[6].src = '../SPRITES/GRIDBUG/gridbug_W1_hit.png';
  gridBugImg[7].src = '../SPRITES/GRIDBUG/gridbug_W2_hit.png';
  wallHorizontal.src = '../IMG/wall_horizontal.png';
  wallVertical.src = '../IMG/wall_vertical.png';
  backgroundPattern.src = '../IMG/backgroundPattern.png';

  //called to start the game
  displayTitle();

  //function to displays the title page
  function displayTitle() {
    $('#play_area').css({
      'backgroundImage': 'url("../IMG/background.jpg")'
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
      fontFamily: 'Calibri',
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

    /*
     * Add the Kinetic objects to the layer and stages
     */
    foreground.add(singlePlayerText)
              .add(singlePlayer)
              .add(twoPlayerText)
              .add(twoPlayer)
              .add(howToPlayText)
              .add(howToPlay)
              .add(title);
    stage.add(foreground);

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

    singlePlayer.on('click', function(){
      setTimeout(function(){
        playGame(1, undefined);
      }, 75);
    });

    twoPlayer.on('click', function(){
      console.log('two player clicked');
    });

    howToPlay.on('click', function(){
      setTimeout(displayHowToPlay, 75);
    });
  }

  function displayHowToPlay(){
    $('#play_area').css({
      'backgroundImage': 'url("../IMG/background.jpg")'
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
      fontFamily: 'Calibri',
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
      fill: '#DBD2CB',
      opacity: .3 * sizeFactor,
      cornerRadius: 10
    });

    var textInfo = new Kinetic.Text({
      x: 10 * sizeFactor,
      y: 10 * sizeFactor,
      width: 580 * sizeFactor,
      height: 388 * sizeFactor,
      text: '',
      fill: 'white',
      fontSize: 22 * sizeFactor,
      fontFamily: 'Calibri'
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
        textInfo.text('Info about the objective of the game');
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
        textInfo.text('Info about the controls of the game');
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
      text: 'Guns',
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
        textInfo.text('Info about the guns of the game');
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
        textInfo.text('Info about the armor in the game');
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
        textInfo.text('Info about the turrets in the game');
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
  }


  /*
   * Single player game function that controls running the game
   */
  function playGame(numPlayers, gameState){
    /*
    var gamestate = {
      lvlNumber, player, otherPlayer, turrets[], varticalWalls[[], []], horizontalWalls[[], []], cornerWalls[[], []]
    }
    */
    if(!gameState){
      gameState = {};
    }

    //variables used to control the sizing of the game display
    var sizeFactor = window.innerWidth / 1366,
        width = 1000 * sizeFactor,
        height = 600 * sizeFactor,
        imageSize = 64,
        playAreaOffset = $('#play_area').offset(),
        playAreaWidth = 1200, //1500
        playAreaHeight = 800; //960

    //variables used to hold information about the level
    var lvlComplete = false,
        lvlNumber = 1;
    if(gameState.lvlNumber != undefined){
      lvlNumber = gameState.lvlNumber;
    }
    
    //variables used to control the fog that the player can see
    var fogSize = 400,
        fog = [];
    
    //array used to hold the bullets
    var bullets = [];

    //array used to hold the enemies
    var enemies = [];
        
    //arrays used for the position of the walls
    var verticalWalls, horizontalWalls, corners, walls = [];
    if(!gameState.verticalWalls){
      gameState.verticalWalls = [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [5, 5], [5, 6], [5, 7], [5, 8]];
    }else{
      gameState.verticalWalls = gameState.verticalWalls;
    }
    if(!gameState.horizontalWalls){
      gameState.horizontalWalls = [[2, 5], [3, 5], [4, 5], [5, 5]];
    }else{
      gameState.horizontalWalls = gameState.horizontalWalls;
    }   

    //styling used to hide the background image from the title screen
    $('#play_area').css({
      'backgroundImage': 'none',
      'width': width,
      'heigth': height
      //'cursor': 'url(../IMG/gunsight.png), crosshair'
    });
    /*
    $('#right_panel').slideUp(1000);
    $('#play_area').animate({
      'top': '0px',
      'left': (200 * sizeFactor) + 'px',
      'width': (1000 * sizeFactor) + 'px',
      'height': (600 * sizeFactor) + 'px'
    },{
      'duration': 1000,
      'queue': true
    });
    $('#left_panel').animate({
      'top': (10 * sizeFactor) + 'px',
      'left': (10 * sizeFactor) + 'px',
      'width': (188 * sizeFactor) + 'px',
      'height': (580 * sizeFactor) + 'px'
    },{
      'duration': 1000,
      'queue': true
    });
    */

    //creates the stage to hold the how to play screen
    var stage = new Kinetic.Stage({container: 'play_area', width: 1000 * sizeFactor, height: 600 * sizeFactor});

    /*
     * creates the layers for the game
     */

    //foreground layer used to hold the player, bullets, and enemies
    var foreground = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: width, height: height}});

    //background layer used to hold the walls and background tiling
    var background = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: width, height: height}});

    //layer used to hold the fog
    var fogLayer = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: width, height:height}, opacity: .9});

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

      //adds the background color and border
      var backGroundFill = new Kinetic.Rect({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, fillPatternImage: backgroundPattern, fillPatternRepeat: 'repeat' });
      var backGroundBorder = new Kinetic.Rect({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, stroke: 'white', strokeWidth: 10});
      background.add(backGroundFill);
      background.add(backGroundBorder);

      //adds the horizontal walls to the background
      for(var i = 0; i < gameState.horizontalWalls.length; ++i){
        walls.push(new createWall(gameState.horizontalWalls[i][0] * 50, gameState.horizontalWalls[i][1] * 32, 'horizontal'));
        background.add(walls[walls.length - 1].obj);
      }

      //adds the vertical walls to the background
      for(var i = 0; i < gameState.verticalWalls.length; ++i){
        walls.push(new createWall(gameState.verticalWalls[i][0] * 50 + 12, gameState.verticalWalls[i][1] * 32, 'vertical'));
        background.add(walls[walls.length - 1].obj);
        
        /*
        wallBlock.on('mouseenter', function(){
          $('#play_area').css({
            'cursor': 'crosshair'
          });
        });
        wallBlock.on('mouseleave', function(){
          $('#play_area').css({
            'cursor': 'url(../IMG/gunsight.png), auto'
          });
        });
        */
      }

      //creates the player if it wasnt passed in as the argument
      if(!gameState.player){
        gameState.player = new createPlayer();
      }

      //add the player to the foreground
      foreground.add(gameState.player.obj);

      //creates the other player if it is a two player game
      if(numPlayers == 2){
        if(!gameState.otherPlayer){
          gameState.otherPlayer = new createPlayer();
        }
        foreground.add(gameState.otherPlayer.obj);
      }

      //add the layers to the stage
      stage.add(background).add(foreground).add(fogLayer);

      //populate the enemies array
      populateEnemies();

      //spawn indicated amount of enemies every x milliseconds
      spawnEnemies(15, 5000);
    })();
    
    //constructor functions to create a Player
    function createPlayer(){
      this.type = 'player';
      this.obj = new Kinetic.Image({
        x: 500 * sizeFactor - imageSize / 2,
        y: 300 * sizeFactor - imageSize / 2,
        width: imageSize,
        height: imageSize,
        image: playerImg[0]
      });
      this.aim = {
        x: 0,
        y: 0
      };
      this.money = 0;
      this.up = false;
      this.left = false;
      this.right = false;
      this.down = false;
      this.sprint = false;
      this.direction = 'north';
      this.dx = 0;
      this.dy = 0;
      this.leftBound = function(){
        return this.obj.x() + 26;
      };
      this.rightBound = function(){
        return this.obj.x() + 36;
      };
      this.topBound = function(){
        return this.obj.y() + 26;
      };
      this.bottomBound = function(){
        return this.obj.y() + 36
      };
      this.ready = true;
      this.fireInterval;
      this.pistolEquipped = true;

      this.pistol = {
        fireRate: -1,
        speed: 10,
        damage: 1,
        spread: 1,
        ammo: -1,
        rapidFire: false
      };
      
      this.gun = {  //machine gun
        fireRate: 10,
        speed: 15,
        damage: 2,
        spread: 1,
        ammo: 200,
        rapidFire: true
      }
      
      /*
      ultragun = {  //ultra gun
        fireRate: 50,
        speed: 15,
        damage: 2,
        spread: 9,
        ammo: 200,
        rapidFire: true
      }

      machinegun = {
        fireRate: 10,
        speed: 15,
        damage: 2,
        spread: 1,
        ammo: 200,
        rapidFire: true
      }
      
      shotgun = {  //shotgun
        fireRate: 3,
        speed: 8,
        damage: 2,
        spread: 9,
        ammo: 200,
        rapidFire: false
      }
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
    function createBullet(xpos, ypos, dx, dy, damage){
      this.type = 'bullet';
      this.obj = new Kinetic.Circle({
        radius: 2,
        x: xpos,
        y: ypos,
        fill: '#7FFF00'
      });
      this.dx = dx;
      this.dy = dy;
      this.damage = damage;
      this.leftBound = function(){
        return this.obj.x() - 2;
      };
      this.rightBound = function(){
        return this.obj.x() + 2;
      };
      this.topBound = function(){
        return this.obj.y() - 2;
      };
      this.bottomBound = function(){
        return this.obj.y() + 2;
      };
    };

    //constructor function to create enemies
    function createEnemy(type, x, y, hpMultiplier){
      switch(type){
      case 'gridBug':
        this.obj = new Kinetic.Image({
          x: x,
          y: y,
          width: imageSize,
          height: imageSize,
          image: gridBugImg[0]
        });
        this.speed = .7 + Math.random() * .5;
        this.distanceInterval = 10;
        this.hp = 10 * hpMultiplier;
        this.leftBound = function(){
          return this.obj.x() + 23;
        };
        this.rightBound = function(){
          return this.obj.x() + 39;
        };
        this.topBound = function(){
          return this.obj.y() + 26;
        };
        this.bottomBound = function(){
          return this.obj.y() + 37;
        };
        break;
      case 'roller':
        this.obj = new Kinetic.Image({
          x: x,
          y: y,
          width: imageSize,
          height: imageSize,
          image: rollerImg[0]
        });
        this.speed = 1.7 + Math.random() * .6;
        this.distanceInterval = 15;
        this.hp = 6 * hpMultiplier;
        this.leftBound = function(){
          if(this.direction == 'north' || this.direction == 'south'){
            return this.obj.x() + 25;
          }else{
            return this.obj.x() + 19;
          }
        };
        this.rightBound = function(){
          if(this.direction == 'north' || this.direction == 'south'){
            return this.obj.x() + 38;
          }else{
            return this.obj.x() + 44;
          }
        };
        this.topBound = function(){
          if(this.direction == 'north' || this.direction == 'south'){
            return this.obj.y() + 24;
          }else{
            return this.obj.y() + 25;
          }
        };
        this.bottomBound = function(){
          if(this.direction == 'north' || this.direction == 'south'){
            return this.obj.y() + 38;
          }else{
            return this.obj.y() + 36;
          }
        };
        break;
      case 'heavy':
        this.obj = new Kinetic.Image({
          x: x,
          y: y,
          width: imageSize,
          height: imageSize,
          image: image3
        });
        this.speed = .2 * Math.random() * .5;
        this.hp = 40 * hpMultiplier;
        this.boundX = 0;
        this.boundY = 0;
        this.boundWidth = 0;
        this.boundHeight = 0;
        break;
      default:
        this.obj = new Kinetic.Rect({
          x: x,
          y: y,
          width: 20,
          height: 20,
          fill: 'black'
        });
        this.speed = 1;
        this.hp = 10 * hpMultiplier;
        this.boundX = 0;
        this.boundY = 0;
        this.boundWidth = 0;
        this.boundHeight = 0;
        break;
      }
      this.type = type;
      this.dx = 0;
      this.dy = 0;
      this.direction = 'north';
      this.hit = false;
      this.imgNum = 0;
      this.distance = 0;
    }

    /*
     * Functions for objects in game
     */
    
    //function used to update the movement of the player based on keypresses
    function updateMovement(player){
      player.dx = 0;
      player.dy = 0;
      if(player.up && !player.down){
        player.dy = -2;
      }
      if(player.left && !player.right){
        player.dx = -2;
      }
      if(player.down && !player.up){
        player.dy = 2;
      }
      if(player.right && !player.left){
        player.dx = 2;
      }
      if(player.dx && player.dy){
        player.dx *= Math.sqrt(2)/2;
        player.dy *= Math.sqrt(2)/2;
      }
      if(player.sprint){
        player.dx *= 1.7;
        player.dy *= 1.7;
      }
    };

    //increments the player's position based on the players current position, change of position, and timestep amount
    //also updates the position/clip of the foreground/background
    function movePlayer(player, timeDiff){
      var playerWidth = player.obj.width(),
          playerHeight = player.obj.height(),
          playerX = player.obj.x(),
          playerY = player.obj.y();
      if(playerX <= (playAreaWidth - 5 - playerWidth - player.dx) && playerX >= (5 - player.dx)){
        var diffX = player.dx * timeDiff / 20,
            xpos = playerX + diffX,
            originalX = width/2 - playerWidth/2,
            clipX,
            posX;
        if(playAreaWidth <= width || xpos <= (originalX)){
          clipX = 0,
          posX = 0;
        }
        else if(xpos >= (playAreaWidth - originalX - playerWidth)){
          clipX = playAreaWidth - width;
          posX = width - playAreaWidth;
        }
        else{
          clipX = xpos - originalX;
          posX = originalX - xpos;
          player.aim.x += diffX;
        }
        player.obj.x(xpos);
        fogLayer.x(posX);
        fogLayer.clipX(clipX);
        foreground.x(posX);
        foreground.clipX(clipX);
        background.x(posX);
        background.clipX(clipX);
      }
      if(player.obj.y() <= (playAreaHeight - 5 - playerHeight - player.dy) && playerY >= (5 - player.dy)){
        var diffY = player.dy * timeDiff / 20,
            ypos = playerY + diffY,
            originalY = height/2 - playerHeight/2,
            clipY,
            posY;
        if(playAreaHeight <= height || ypos <= (originalY)){
          clipY = 0,
          posY = 0;
        }
        else if(ypos >= (playAreaHeight - originalY - playerHeight)){
          clipY = playAreaHeight - height;
          posY = height - playAreaHeight;
        }
        else{
          clipY = ypos - originalY;
          posY = originalY - ypos;
          player.aim.y += diffY;
        }
        player.obj.y(ypos);
        fogLayer.y(posY);
        fogLayer.clipY(clipY);
        foreground.y(posY);
        foreground.clipY(clipY);
        background.y(posY);
        background.clipY(clipY);
        updateFog();
      }
    };

    //function that updates the position of the bullets based on their current position, change of position, and timestep amount
    function moveBullet(bullet, timeDiff){
      var startX = bullet.obj.x(),
          startY = bullet.obj.y(),
          diffX = bullet.dx * timeDiff / 20,
          diffY = bullet.dy * timeDiff / 20,
          endX = startX + diffX,
          endY = startY + diffY;
      //while(diffX)
      bullet.obj.x(endX);
      bullet.obj.y(endY);
      if(bullet.obj.x() > (background.width() + 2) || bullet.obj.x() < (-2) || bullet.obj.y() > (background.height() + 2) || bullet.obj.y() < (-2)){
        bullet.obj.destroy();
        return false;
      }
      for(var i = 0; i < enemies.length; ++i){
        if(checkCollision(bullet, enemies[i])){
          bullet.obj.destroy();
          if(enemies[i].hp <= 0){
            enemies[i].obj.destroy();
            arrayRemove(enemies, i);
          }
          return false;
        }
      }
      //for enemies, for walls: checkCollisions (return true)
      //based
      return true;
    };

    //function used to update the appearance of the fog based on the player's position
    function updateFog(){
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
      if(numPlayers == 1){
        left1 = gameState.player.obj.x() + gameState.player.obj.width()/2 - halfFog;
        right1 = gameState.player.obj.x() + gameState.player.obj.width()/2 + halfFog;
        top1 = gameState.player.obj.y() + gameState.player.obj.height()/2 - halfFog;
        bottom1 = gameState.player.obj.y() + gameState.player.obj.height()/2 + halfFog;
        fog[0].width(left1);
        fog[1].x(right1).width(playAreaWidth - right1);
        fog[2].x(left1).height(top1).width(right1 - left1);
        fog[3].x(left1).y(bottom1).height(playAreaHeight - bottom1).width(right1 - left1);
      }else if(numPlayers == 2){
        left1 = gameState.player.obj.x() + gameState.player.obj.width()/2 - halfFog;
        right1 = gameState.player.obj.x() + gameState.player.obj.width()/2 + halfFog;
        top1 = gameState.player.obj.y() + gameState.player.obj.height()/2 - halfFog;
        bottom1 = gameState.player.obj.y() + gameState.player.obj.height()/2 + halfFog;
        left2 = gameState.otherPlayer.obj.x() + gameState.otherPlayer.obj.width()/2 - halfFog;
        right2 = gameState.otherPlayer.obj.x() + gameState.otherPlayer.obj.width()/2 + halfFog;
        top2 = gameState.otherPlayer.obj.y() + gameState.otherPlayer.obj.height()/2 - halfFog;
        bottom2 = gameState.otherPlayer.obj.y() + gameState.otherPlayer.obj.height()/2 + halfFog;
        if(left1 > left2){
          var temp = left1;
          left1 = left2;
          left2 = temp;
        }else{
          var temp = right1;
          right1 = right2;
          right2 = temp;
        }
        if(top1 > top2){
          var temp = top1;
          top1 = top2;
          top2 = temp;
        }else{
          var temp = bottom1;
          bottom1 = bottom2;
          bottom2 = temp;
        }
        if(right2 < left2){
          fog[4].x(right2).width(left2 - right2).y(top1).height(bottom2 - top1).show();
        }else{
          fog[4].hide();
        }
        if(bottom2 < top2){
          fog[5].x(left1).width(right2 - left1).y(bottom2).height(top2 - bottom2).show();
        }else{
          //todo: fog[5].hide().
        }
      }
      
    };

    //function used to change the players aim based on the position of the mouse
    function aim(player, evt){
      player.aim.x = evt.pageX - playAreaOffset.left + background.clipX();
      player.aim.y = evt.pageY - playAreaOffset.top + background.clipY();
      var diffX = player.aim.x - player.obj.x() - player.obj.width()/2,
          diffY = player.aim.y - player.obj.y() - player.obj.height()/2;
      if(Math.abs(diffX) > Math.abs(diffY)){
        if(diffX > 0){
          player.direction = 'east';
          player.obj.image(playerImg[2]);
        }else{
          player.direction = 'west';
          player.obj.image(playerImg[1]);
        }
      }else{
        if(diffY < 0){
          player.direction = 'north';
          player.obj.image(playerImg[0]);
        }else{
          player.direction = 'south';
          player.obj.image(playerImg[3]);
        }
      }
    };

    //has the player shoot their equipped weapon
    function shoot(player){
      if(player.sprint){
        return;
      }
      if(!player.ready && !player.pistolEquipped){
        return;
      }
      var playerX = player.obj.x() + player.obj.width()/2,
          playerY = player.obj.y() + player.obj.height()/2;
      switch(player.direction){
      case 'up':
        playerY -= 18;
        playerX += 1;
        break;
      case 'left':
        playerX -= 9;
        playerY -= 5;
        break;
      case 'right':
        playerX += 10;
        playerY -= 5;
        break;
      }
      var diffX = player.aim.x - playerX,
          diffY = player.aim.y - playerY,
          speed = Math.sqrt(diffX * diffX + diffY * diffY),
          dx = sizeFactor * diffX / speed,
          dy = sizeFactor * diffY / speed,
          gun;
      if(player.pistolEquipped){
        gun = player.pistol;
      }
      else{
        gun = player.gun;
      }
      bullet = new createBullet(playerX, playerY, dx * gun.speed, dy * gun.speed, gun.damage);
      bullets.push(bullet);
      foreground.add(bullet.obj);
      for(var i = 1; i <= gun.spread - 1; ++i){
        bullet = new createBullet(playerX, playerY, (dx * (1 - Math.random() * .2) + dy * (-.2 + Math.random() * .4)) * gun.speed, (dy * (1 - Math.random() * .2) + dx * (-.2 + Math.random() * .4)) * gun.speed, gun.damage);
        bullets.push(bullet)
        foreground.add(bullet.obj);
      }
    };

    //function that toggles the equipped weapon of the player
    function toggleWeapon(player){
      player.pistolEquipped = !player.pistolEquipped;
      clearInterval(player.fireInterval);
    };

    //populates the enemy array based on the wave(int)
    function populateEnemies(){
      var hpMultiplier = 1; //todo: make enemies have more hp based on the level
      for(var i = 0; i < 50 * lvlNumber; ++i){
        var num = Math.random() * 2,
            type;
        if(num <= 1){
          type = 'gridBug';
        }else if(num <= 1.5){
          type = 'roller';
        }else{
          type = 'gridBug'; //todo: implement heavy enemy
        }
        enemies.push(new createEnemy(type, -1, 0, hpMultiplier)); //-1 as the x position is used to indicate
      }
    };

    //spawns the given amount of enemies every time interval
    function spawnEnemies(amount, timeInterval, index){
      if(index == undefined){
        index = 0;
      }
      if(index + amount >= enemies.length){
        amount = enemies.length - index;
      }
      for(var i = 0; i < amount; ++i){
        var startingX, startingY;
        if(Math.random() <= .5){
          if(Math.random() <= .5){
            startingX = Math.random() * 25;
            startingY = Math.random() * playAreaHeight;
          }else{
            startingX = playAreaWidth - imageSize - Math.random() * 25;
            startingY = Math.random() * playAreaHeight;
          }
        }else{
          if(Math.random() <= .5){
            startingY = Math.random() * 25;
            startingX = Math.random() * playAreaWidth;
          }else{
            startingY = playAreaHeight - imageSize - Math.random() * 25;
            startingX = Math.random() * playAreaWidth;
          }
        }

        var enemy = enemies[index++];
        enemy.obj.x(startingX).y(startingY);
        foreground.add(enemy.obj);
      }
      if(index < enemies.length - 1){
        setTimeout(function(){
          spawnEnemies(amount, timeInterval, index);
        }, timeInterval);
      }
    };

    //calculates the location of the closest player for the indicated enemy and updates their movement
    function closestPlayer(enemy){
      var obj = enemy.obj,
          x = obj.x(),
          y = obj.y(),
          closest = gameState.player;
      if(numPlayers == 2 && Math.pow(gameState.otherPlayer.obj.x() - x, 2) + Math.pow(gameState.otherPlayer.obj.y() - y, 2) < Math.pow(gameState.player.obj.x() - x, 2) + Math.pow(gameState.player.obj.y() - y, 2)){
        closest = gameState.otherPlayer;
      }
      var diffX = closest.obj.x() - x,
          diffY = closest.obj.y() - y,
          distance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
      if(diffX <= (fogSize + imageSize / 2) / 2 && diffX >= -(fogSize + imageSize / 2) / 2 && diffY <= (fogSize + imageSize / 2) / 2 && diffY >= -(fogSize + imageSize / 2) / 2){
        enemy.obj.show();
      }else{
        enemy.obj.hide();
      }
      enemy.dx = diffX / distance * enemy.speed;
      enemy.dy = diffY / distance * enemy.speed;
      switch(enemy.type){
      case 'gridBug':
        if(enemy.dy * enemy.dx > 0){
          enemy.direction = 'east';
        }else{
          enemy.direction = 'west';
        }
        break;
      case 'roller':
        if(Math.abs(enemy.dx) > Math.abs(enemy.dy)){
          if(enemy.dx > 0){
            enemy.direction = 'east';
          }else{
            enemy.direction = 'west';
          }
        }else{
          if(enemy.dy > 0){
            enemy.direction = 'north';
          }else{
            enemy.direction = 'south';
          }
        }
        break;
      case 'heavy':
      }
    };

    //moves the enemy based on the enemies current position, change of position, and time step amount
    function moveEnemy(enemy, timeDiff){
      enemy.obj.x(enemy.obj.x() + enemy.dx * timeDiff / 20);
      enemy.obj.y(enemy.obj.y() + enemy.dy * timeDiff / 20);
      enemy.distance += enemy.speed * timeDiff / 20;
      if(enemy.distance > enemy.distanceInterval){
        enemy.distance -= enemy.distanceInterval;

        enemy.imgNum = (enemy.imgNum + 1) % 2;
        updateEnemyImg(enemy);
      }
    };

    function updateEnemyImg(enemy){
      var imgNum = enemy.imgNum;
      switch(enemy.direction){
      case 'east':
        imgNum += 0;
        break;
      case 'west':
        imgNum += 2;
        break;
      case 'north':
        imgNum += 4;
        break;
      case 'south':
        imgNum += 6;
        break;
      }
      if(enemy.hit == true){
        if(enemy.type == 'gridBug'){
          imgNum += 4;
        }else if(enemy.type == 'roller'){
          imgNum += 8;
        }
      }
      switch(enemy.type){
      case 'gridBug':
        enemy.obj.image(gridBugImg[imgNum]);
        break;
      case 'roller':
        enemy.obj.image(rollerImg[imgNum]);
        break;
      case 'heavy':
      }
    };

    function checkCollision(obj1, obj2) {
      if(obj1.leftBound() < obj2.rightBound()  && obj1.rightBound() > obj2.leftBound() && obj1.topBound() < obj2.bottomBound() && obj1.bottomBound() > obj2.topBound()) {
        collideProcess(obj1, obj2);
        return true;
      }else {
        return false;
      }
    };
      
    function collideProcess(obj1, obj2) {
      var type1 = obj1.type;
      var type2 = obj2.type;
      if(type1 == 'gridBug' || type1 == 'roller' || type1 == 'heavy'){
        type1 = 'enemy';
      }
      if(type2 == 'gridBug' || type2 == 'roller' || type2 == 'heavy'){
        type2 = 'enemy';
      }
      if(type1 == "player" && type2 == "enemy"){
        --obj1.hp;
      }else if(type1 == "enemy" && type2 == "player"){
        --obj2.hp;
      }else if(type1 == "bullet" && type2 == "enemy"){
        obj2.hp -= obj1.damage;
        obj2.hit = true;
      }else if(type1 == "enemy" && type2 == "bullet"){
        obj1.hp -= obj2.damage;
        obj1.hit = true;
      }else if(type1 == "wall" && (type2 == "player" || type2 == "enemy" || type2 == "bullet")){
        //do nothing
      }else if((type1 == "player" || type1 == "enemy" || type1 == "bullet") && type2 == "wall"){
        //do nothing
      }
    };
    

    /*
     * Event controllers for the game
     */
    
    //mouse down event is used to fire a bullet
    $('#play_area').on('mousedown', function(){
      var fireRate = gameState.player.pistolEquipped ? gameState.player.pistol.fireRate : gameState.player.gun.fireRate,
          rapidFire = gameState.player.pistolEquipped ? gameState.player.pistol.rapidFire : gameState.player.gun.rapidFire;
      if(fireRate == -1){
        shoot(gameState.player);
        return;
      }
      if(gameState.player.ready){
        shoot(gameState.player);
        gameState.player.ready = false;
        setTimeout(function(){
          gameState.player.ready = true;
        }, 1000 / fireRate);
      }
      if(rapidFire){
        gameState.player.fireInterval = setInterval(function(){
          shoot(gameState.player);
        }, 1000 / fireRate);
      }
    });

    //mouse up event is used to stop rapid fire
    $('#play_area').on('mouseup', function(){
      clearInterval(gameState.player.fireInterval);
    })

    //mouse move event is used to aim the gun (updates player model to show which direction the player is aiming)
    $('#play_area').on('mousemove', function(evt){
      aim(gameState.player, evt);
    })

    //keydown event is used to increment the player movement, toggle the weapons
    $(document).keydown( function(evt){
      switch(evt.keyCode){
      case 87: //w
        gameState.player.up = true;
        updateMovement(gameState.player);
        break;
      case 65: //a
        gameState.player.left = true;
        updateMovement(gameState.player);
        break;
      case 83: //s
        gameState.player.down = true;
        updateMovement(gameState.player);
        break;
      case 68: //d
        gameState.player.right = true;
        updateMovement(gameState.player);
        break;
      case 69:
        toggleWeapon(gameState.player);
        break;
      case 32:
        gameState.player.sprint = true;
        updateMovement(gameState.player);
        break;
      }

    });

    //keyup event is used to decrement the player movement
    $(document).on('keyup', function(evt){
      switch(evt.keyCode){
      case 87: //w
        gameState.player.up = false;
        updateMovement(gameState.player);
        break;
      case 65: //a
        gameState.player.left = false;
        updateMovement(gameState.player);
        break;
      case 83: //s
        gameState.player.down = false;
        updateMovement(gameState.player);
        break;
      case 68: //d
        gameState.player.right = false;
        updateMovement(gameState.player);
        break;
      case 32:
        gameState.player.sprint = false;
        updateMovement(gameState.player);
        break;
      }
    });

    /*
     * Helper functions
     */

    //function used to make removing from an array more efficient
    function arrayRemove(arr, index){
      var len = arr.length;
      if(!len){
        return;
      }
      while(index<len){ 
        arr[index] = arr[index+1];
        index++;
      }
      arr.length--;
    };

    /*
     * Functions used to increment the state of the game and redraw the display to show the new state
     */

    //redraw function that redraws the foreground to show the current positions
    function redraw(){
      background.batchDraw();
      foreground.batchDraw();
      fogLayer.batchDraw();
    }

    //update function that updates the state of the game
    function update(timeDiff){
      movePlayer(gameState.player, timeDiff);
      for(var i = 0; i < bullets.length; ++i){
        if(!moveBullet(bullets[i], timeDiff)){
          arrayRemove(bullets, i);
          --i;
        }
      }
      if(enemies.length){
        
      }
      for(var i = 0; i < enemies.length; ++i){
        if(enemies[i]){
          closestPlayer(enemies[i]);
          moveEnemy(enemies[i], timeDiff);
        }
      }
    }

    //setting rate at which the update function and redraw functions are called
    var time = new Date().getTime(),
        dt = 1000/100, //second number is the fps
        accumulator = 0;
    /*
    setTimeout(function(){
      lvlComplete = true;
    }, 10000);
    */
    var gameInterval = setInterval(function(){
      if(lvlComplete){
        clearInterval(gameInterval);
        console.log('level complete');
        //call the purchase screen function to display the purchase screen
      }
      var newTime = new Date().getTime(),
          timeDiff = newTime - time;
      time = newTime;
      accumulator += timeDiff;
      while(accumulator > dt){
        update(dt);
        accumulator -= dt;
      }
      redraw();
    }, dt);
  };

  /*
   * Purchase screen function that takes in the state of the game as the argument
   */
  function purchaseScreen(gameState){

  };
});