$(document).ready(function() {

  // globals >_< --------
  head = new Head($('#board'));
  apple = new Apple($('#board'));
  body = new Body();

  // sounds --------
  const eatAppleSound = new Audio('src/assets/sound/eat_apple.wav');
  const gameOverSound = new Audio('src/assets/sound/game_over.wav');
  const hiScoreSound = new Audio('src/assets/sound/hi_score.wav');

  // initialization -----
  const speedStep = 50;
  const initialSpeed = 6 * speedStep;
  let score = 0;
  // check if high score saved
  if (!window.localStorage.getItem('hiScore')) window.localStorage.setItem('hiScore', 0);
  // initialize score panel
  $('#score-panel').html(`SCORE: ${score}<br>HIGH SCORE: ${window.localStorage.getItem('hiScore')}`);
  // initialize difficulty meter
  $('#speed-meter').html(speedString(head.SPEED, speedStep));

  // event listeners ---------------

  $(document).on('score-update', () => {
    score += (500 - head.SPEED) / 10;
    if (score > window.localStorage.getItem('hiScore')) {
      window.localStorage.setItem('hiScore', score);
      $('#score-panel').html(`SCORE: ${score}<br>HIGH SCORE: ${window.localStorage.getItem('hiScore')}`);
      hiScoreSound.play();
      // show new hi-score div for 1.5 seconds
      $('#score-notify').css({ "display" : "block" } );
      setTimeout(() => {
        $('#score-notify').css({ "display" : "none" } );
      }, 1500);
    } else { 
      $('#score-panel').html(`SCORE: ${score}<br>HIGH SCORE: ${window.localStorage.hiScore}`);
      eatAppleSound.play();
    }
  });

  $(document).on('game-over', () => {
    $('#game-over').css({ "display": "block" });
    gameOverSound.play();
  })

  // key listeners ----

  $('body').on('keydown', function(e) {
    // left
    if (e.keyCode === 37 || e.keyCode === 65) {
      if ( head.currentDirection !== "right"){
        head.currentDirection = 'left';
      }
    }
    if (e.keyCode === 38 || e.keyCode === 87) {
      if ( head.currentDirection !== "down"){
        head.currentDirection = 'up';
      }
    }
    if (e.keyCode === 39 || e.keyCode === 68) {
      if ( head.currentDirection !== "left"){
        head.currentDirection = 'right';
      }
    }
    if (e.keyCode === 40 || e.keyCode === 83) {
      if ( head.currentDirection !== "up"){
        head.currentDirection = 'down';
      }
    }
    // randomize ('R')
    if (e.keyCode === 82) {
      apple.randomizePos();
    }
    // decrease speed ('Q')
    if (e.keyCode === 81) {
      head.SPEED += speedStep;
      $('#speed-meter').html(speedString(head.SPEED, speedStep));
    }
    // increase speed ('E')
    if (e.keyCode === 69) {
      if (head.SPEED > 150 ) head.SPEED -= speedStep;
      $('#speed-meter').html(speedString(head.SPEED, speedStep));
    }
    // pause ('X')'
    if (e.keyCode === 88) {
      if (head.SPEED > 1000) head.SPEED = initialSpeed;
      else head.SPEED = 5000;
    }
    // reset high score ('Z')
    if (e.keyCode === 90) {
      window.alert('Score reset!');
      window.localStorage.setItem('hiScore', 0);
      $('#score-panel').html(`SCORE: ${score}<br>HIGH SCORE: ${window.localStorage.hiScore}`);
    }
  });
});

/**
 * @name speedString
 * @description Generates HTML content for the difficulty panel, including how many skulls to show
 * @param {number} speed The current speed (head.SPEED)
 * @param {number} speedStep How much to increase speed on each step
 */
function speedString(speed, speedStep) {
  let str = "";
  if (speed >= 500) str = "😴";
  else {
    const speedChar = "&#9760;"
    const index = Math.floor((speed - 100) / speedStep)
    for (let n = 8; n > index; n--) str += speedChar;
  }
  str = "<div id='difficulty'>DIFFICULTY: " + str + "</div><br>";
  str += "<div id='difficulty-controls'>[Q] : decrease speed<br>[E] : increase speed</div>"
  return str;
}