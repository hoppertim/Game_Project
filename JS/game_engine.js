
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
  var playerImg = [new Image(), new Image(), new Image(), new Image()], //0: up, 1: left, 2: right, 3: down
      rollerImg = [new Image(), new Image()], //0: left, 1: right
      wallHorizontal = new Image(),
      wallVertical = new Image(),
      backgroundPattern = new Image();

  playerImg[0].src = '../IMG/p1_stand_N.png';
  playerImg[1].src = '../IMG/p1_stand_W.png';
  playerImg[2].src = '../IMG/p1_stand_E.png';
  playerImg[3].src = '../IMG/p1_stand_S.png';
  rollerImg[0].src = 'roller_L1.png'
  rollerImg[1].src = 'roller_R1.png'
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
      setTimeout(singlePlayerGame, 75);
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
  function singlePlayerGame(player, level){
    //variables used to control the sizing of the game display
    var sizeFactor = window.innerWidth / 1366,
        width = 1000 * sizeFactor,
        height = 600 * sizeFactor,
        playAreaOffset = $('#play_area').offset(),
        playAreaWidth = 1500,
        playAreaHeight = 960;

    //variables used to hold information about the level
    var lvlComplete = false,
        lvlNumber = 1;
    if(level != undefined){
      lvlNumber = level;
    }
    
    //variables used to control the fog that the player can see
    var fogSize = 400,
        fog = [];
    
    //array used to hold the bullets
    var bullets = [];

    //array used to hold the enemies
    var enemies = [];
        
    //arrays used for the position of the walls
    var verticalWalls = [[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [5, 5], [5, 6], [5, 7], [5, 8]],
        horizontalWalls = [[2, 5], [3, 5], [4, 5], [5, 5]];

    //styling used to hide the background image from the title screen
    $('#play_area').css({
      'backgroundImage': 'none',
      'width': width,
      'heigth': height
      //'cursor': 'url(../IMG/gunsight.png), crosshair'
    });

    //creates the stage to hold the how to play screen
    var stage = new Kinetic.Stage({container: 'play_area', width: 1000 * sizeFactor, height: 600 * sizeFactor});

    /*
     * creates the layers for the game
     */

    //foreground layer used to hold the player, bullets, and enemies
    var foreground = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: 1000 * sizeFactor, height: 600 * sizeFactor}});

    //background layer used to hold the walls and background tiling
    var background = new Kinetic.Layer({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, clip: {x: 0, y: 0, width: 1000 * sizeFactor, height: 600 * sizeFactor}});

    //layer used to hold the fog
    var fogLayer = new Kinetic.Layer({x: 0, y: 0, width: 1000 * sizeFactor, height: 600 * sizeFactor, opacity: .9});

    /*
     * Self invoking anonymouse function used to populate the layers with the player, walls, and fog
     */
    (function(){
      //constructs the fog layer (composed of 8 different rectangles)
      fog[0] = new Kinetic.Rect({x: 0, y: 0, height: (600 * sizeFactor - fogSize) / 2, width: (1000 * sizeFactor - fogSize) / 2, fill: '#62403A'});
      fog[1] = new Kinetic.Rect({x: (1000 * sizeFactor - fogSize) / 2, y: 0, height: (600 * sizeFactor - fogSize) / 2, width: fogSize, fill: '#62403A'});
      fog[2] = new Kinetic.Rect({x: (1000 * sizeFactor + fogSize) / 2, y: 0, height: (600 * sizeFactor - fogSize) / 2, width: (1000 * sizeFactor - fogSize) / 2, fill: '#62403A'});
      fog[3] = new Kinetic.Rect({x: 0, y: (600 * sizeFactor - fogSize) / 2, height: fogSize, width: (1000 * sizeFactor - fogSize) / 2, fill: '#62403A'});
      fog[4] = new Kinetic.Rect({x: (1000 * sizeFactor + fogSize) / 2, y: (600 * sizeFactor - fogSize) / 2, height: fogSize, width: (1000 * sizeFactor - fogSize) / 2, fill: '#62403A'});
      fog[5] = new Kinetic.Rect({x: 0, y: (600 * sizeFactor + fogSize) / 2, height: (600 * sizeFactor - fogSize) / 2, width: (1000 * sizeFactor - fogSize) / 2, fill: '#62403A'});
      fog[6] = new Kinetic.Rect({x: (1000 * sizeFactor - fogSize) / 2, y: (600 * sizeFactor + fogSize) / 2, height: (600 * sizeFactor - fogSize) / 2, width: fogSize, fill: '#62403A'});
      fog[7] = new Kinetic.Rect({x: (1000 * sizeFactor + fogSize) / 2, y: (600 * sizeFactor + fogSize) / 2, height: (600 * sizeFactor - fogSize) / 2, width: (1000 * sizeFactor - fogSize) / 2, fill: '#62403A'});
      fogLayer.add(fog[0]).add(fog[1]).add(fog[2]).add(fog[3]).add(fog[4]).add(fog[5]).add(fog[6]).add(fog[7]);

      //adds the background color and border
      var backGroundFill = new Kinetic.Rect({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, fillPatternImage: backgroundPattern, fillPatternRepeat: 'repeat' });
      var backGroundBorder = new Kinetic.Rect({x: 0, y: 0, width: playAreaWidth, height: playAreaHeight, stroke: 'white', strokeWidth: 10});
      background.add(backGroundFill);
      background.add(backGroundBorder);

      //adds the horizontal walls to the background
      for(var i = 0; i < horizontalWalls.length; ++i){
        var wallBlock = new Kinetic.Image({x: horizontalWalls[i][0] * 50, y: horizontalWalls[i][1] * 32, width: 50, height: 32, image: wallHorizontal});
        background.add(wallBlock);
      }

      //adds the vertical walls to the background
      for(var i = 0; i < verticalWalls.length; ++i){
        var wallBlock = new Kinetic.Image({x: verticalWalls[i][0] * 50 + 12, y: verticalWalls[i][1] * 32, width: 26, height: 64, image: wallVertical});
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
        background.add(wallBlock);
      }

      //creates the player if it wasnt passed in as the argument
      if(!player) player = new createPlayer();

      //add the player to the foreground
      foreground.add(player.obj);

      //add the layers to the stage
      stage.add(background).add(foreground).add(fogLayer);
    })();
    
    //constructor functions to create a Player
    function createPlayer(){
      this.obj = new Kinetic.Image({
        x: 500 * sizeFactor - 13,
        y: 300 * sizeFactor - 16,
        width: 26,
        height: 32,
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
      this.direction = 'left';
      this.dx = 0;
      this.dy = 0;
      this.ready = true;
      this.fireInterval;
      this.pistolEquipped = true;

      this.pistol = {
        fireRate: -1,
        speed: 1,
        damage: 1,
        spread: 1,
        ammo: -1,
        rapidFire: false
      };
      
      this.gun = {  //ultra gun
        fireRate: 50,
        speed: 1.5,
        damage: 2,
        spread: 9,
        ammo: 200,
        rapidFire: true,
      }
      
      /*
      this.gun = {  //machine gun
        fireRate: 15,
        speed: 1.5,
        damage: 2,
        spread: 1,
        ammo: 200,
        rapidFire: true,
      }

      this.gun = {  //shotgun
        fireRate: 2,
        speed: .5,
        damage: 2,
        spread: 5,
        ammo: 200,
        rapidFire: false,
      }
      */
    };

    //constructor function to create the bullets
    function createBullet(xpos, ypos, dx, dy, damage){
      this.obj = new Kinetic.Circle({
        radius: 2,
        x: xpos,
        y: ypos,
        fill: '#7FFF00'
      });
      this.dx = dx;
      this.dy = dy;
      this.damage = damage;
    }

    //constructor function to create enemies
    function createEnemy(type, x, y, hpMultiplier){
      switch(type){
      case 'normal':
        this.obj = new Kinetic.Image({
          x: x,
          y: y,
          width: 20,
          height: 20,
          image: image1
        });
        this.speed = 1;
        this.hp = 10 * hpMultiplier;
        break;
      case 'roller':
        this.obj = new Kinetic.Image({
          x: x,
          y: y,
          width: 20,
          height: 20,
          image: rollerImg[0]
        });
        this.speed = 2;
        this.hp = 6 * hpMultiplier;
        break;
      case 'type3':
        this.obj = new Kinetic.Image({
          x: x,
          y: y,
          width: 20,
          height: 20,
          image: image3
        });
        this.speed = .5;
        this.hp = 30 * hpMultiplier;
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
        break;
      }
      this.dx = 0;
      this.dy = 0;
      this.direction = 'up';
      this.hit = false;
      this.imgNum = 0;
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
        foreground.x(posX);
        foreground.clipX(clipX);
        background.x(posX);
        background.clipX(clipX);
      }
      if(player.obj.y() <= (playAreaHeight - 5 - playerHeight - player.dy) && playerY >= (5 - player.dy)){
        var diffY = player.dy * timeDiff / 20,
            ypos = playerY + diffY,
            originalY = height/2 - 16,
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
        foreground.y(posY);
        foreground.clipY(clipY);
        background.y(posY);
        background.clipY(clipY);
        updateFog();
      }
    };

    //function used to update the appearance of the fog based on the player's position
    function updateFog(){
      var halfFog = fogSize/2,
          halfWidth = width/2,
          halfHeight = height/2,
          left = player.obj.x() + player.obj.width()/2 - halfFog,
          right = player.obj.x() + player.obj.width()/2 + halfFog,
          top = player.obj.y() + player.obj.height()/2 - halfFog,
          bottom = player.obj.y() + player.obj.height()/2 + halfFog;
      
      if(left < 0){
        left = 0;
      }else if(left >= halfWidth - halfFog && left <= playAreaWidth - halfWidth - halfFog){
        left = halfWidth - halfFog;
      }else if(left >= playAreaWidth - halfWidth - halfFog){
        left -= playAreaWidth - width;
      }

      if(right > playAreaWidth){
        right = width;
      }else if(right >= halfWidth + halfFog && right <= playAreaWidth - halfWidth + halfFog){
        right = halfWidth + halfFog;
      }else if(right >= playAreaWidth - halfWidth + halfFog){
        right -= playAreaWidth - width;
      }

      if(top < 0){
        top = 0;
      }else if(top >= halfHeight - halfFog && top <= playAreaHeight - halfHeight - halfFog){
        top = halfHeight - halfFog;
      }else if(top >= playAreaHeight - halfHeight - halfFog){
        top -= playAreaHeight - height;
      }

      if(bottom > playAreaHeight){
        bottom = height;
      }else if(bottom >= halfHeight + halfFog && bottom <= playAreaHeight - halfHeight + halfFog){
        bottom = halfHeight + halfFog;
      }else if(bottom >= playAreaHeight - halfHeight + halfFog){
        bottom -= playAreaHeight - height;
      }

      fog[0].width(left).height(top);
      fog[1].x(left).height(top).width(right - left);
      fog[2].x(right).height(top).width(width - right);
      fog[3].y(top).width(left).height(bottom - top);
      fog[4].y(top).x(right).width(width - right).height(bottom - top);
      fog[5].y(bottom).width(left).height(height - bottom);
      fog[6].x(left).y(bottom).width(right - left).height(height - bottom);
      fog[7].x(right).y(bottom).width(width - right).height(height - bottom);
    };

    //function used to change the players aim based on the position of the mouse
    function aim(player, evt){
      player.aim.x = evt.pageX - playAreaOffset.left + background.clipX();
      player.aim.y = evt.pageY - playAreaOffset.top + background.clipY();
      var diffX = player.aim.x - player.obj.x() - player.obj.width()/2,
          diffY = player.aim.y - player.obj.y() - player.obj.height()/2,
          angle = Math.atan(-diffY / diffX) / Math.PI * 180;
      if(diffX < 0){
        angle += 180;
      }
      else if(diffY > 0){
        angle += 360;
      }
      if(angle > 45 && angle <= 135){
        player.obj.image(playerImg[0]);
        player.direction = 'up';
      }else if(angle > 135 && angle <= 225){
        player.obj.image(playerImg[1]);
        player.direction = 'left';
      }else if(angle > 225 && angle <= 315){
        player.obj.image(playerImg[3]);
        player.direction = 'down';
      }else{
        player.obj.image(playerImg[2]);
        player.direction = 'right';
      }
    };

    //has the player shoot their equipped weapon
    function shoot(player){
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
          dx = 10 * sizeFactor * diffX / speed,
          dy = 10 * sizeFactor * diffY / speed,
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
      for(var i = 1; i <= (gun.spread - 1)/2; ++i){
        var skew = Math.pow((1 - .01 * i), i);
        bullet = new createBullet(playerX, playerY, (skew * dx + (1-skew) * dy) * gun.speed, (skew * dy - (1-skew) * dx) * gun.speed, gun.damage);
        bullets.push(bullet)
        foreground.add(bullet.obj);
        bullet = new createBullet(playerX, playerY, (skew * dx - (1-skew) * dy) * gun.speed, (skew * dy + (1-skew) * dx) * gun.speed, gun.damage);
        bullets.push(bullet)
        foreground.add(bullet.obj);
      }
    };

    //function that toggles the equipped weapon of the player
    function toggleWeapon(player){
      player.pistolEquipped = !player.pistolEquipped;
      clearInterval(player.fireInterval);
    }

    //function that updates the position of the bullets based on their current position, change of position, and timestep amount
    function moveBullet(bullet, timeDiff){
      bullet.obj.x(bullet.obj.x() + bullet.dx * timeDiff / 20);
      bullet.obj.y(bullet.obj.y() + bullet.dy * timeDiff / 20);
      if(bullet.obj.x() > (background.width() + 2) || bullet.obj.x() < (-2) || bullet.obj.y() > (background.height() + 2) || bullet.obj.y() < (-2)){
        bullet.obj.destroy();
        delete bullet;
        return false;
      }
      return true;
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
      movePlayer(player, timeDiff);
      for(var i = 0; i < bullets.length; ++i){
        if(!moveBullet(bullets[i], timeDiff)){
          arrayRemove(bullets, i);
          --i;
        }
      }
    }

    //setting rate at which the update function and redraw functions are called
    var time = new Date().getTime(),
        dt = 1000/100, //second number is the framerate
        accumulator = 0;
    setInterval(function(){
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

    /*
     * Event controllers for the game
     */
    
    //mouse down event is used to fire a bullet
    $('#play_area').on('mousedown', function(){
      var fireRate = player.pistolEquipped ? player.pistol.fireRate : player.gun.fireRate,
          rapidFire = player.pistolEquipped ? player.pistol.rapidFire : player.gun.rapidFire;
      if(fireRate == -1){
        shoot(player);
        return;
      }
      if(player.ready){
        shoot(player);
        player.ready = false;
        setTimeout(function(){
          player.ready = true;
        }, 1000 / fireRate);
      }
      if(rapidFire){
        player.fireInterval = setInterval(function(){
          shoot(player);
        }, 1000 / fireRate);
      }
    });

    //mouse up event is used to stop rapid fire
    $('#play_area').on('mouseup', function(){
      clearInterval(player.fireInterval);
    })

    //mouse move event is used to aim the gun (updates player model to show which direction the player is aiming)
    $('#play_area').on('mousemove', function(evt){
      aim(player, evt);
    })

    //keydown event is used to increment the player movement, toggle the weapons
    $(document).keydown( function(evt){
      switch(evt.keyCode){
      case 87: //w
        player.up = true;
        updateMovement(player);
        break;
      case 65: //a
        player.left = true;
        updateMovement(player);
        break;
      case 83: //s
        player.down = true;
        updateMovement(player);
        break;
      case 68: //d
        player.right = true;
        updateMovement(player);
        break;
      case 69:
        toggleWeapon(player);
        break;
      }
    });

    //keyup event is used to decrement the player movement
    $(document).on('keyup', function(evt){
      switch(evt.keyCode){
      case 87: //w
        player.up = false;
        updateMovement(player);
        break;
      case 65: //a
        player.left = false;
        updateMovement(player);
        break;
      case 83: //s
        player.down = false;
        updateMovement(player);
        break;
      case 68: //d
        player.right = false;
        updateMovement(player);
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
  }
});