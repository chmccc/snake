class Apple {

  constructor($el) {
    this.node = $('<img class="apple" id="apple"></img>');
    this.node.attr('src', 'src/assets/shroom.png');
    $el.append(this.node);
    this.startPosTop = getRandomInt();
    this.startPosLeft = getRandomInt();
    this.node.css({ top: this.startPosTop, left: this.startPosLeft });
  }

  /**
   * @name getPosition
   * @returns {object} An object with properties "top" and "left" representing the css position of the element
   */
  getPosition () {
    return { top: parseInt(this.node.css("top")) , left: parseInt(this.node.css("left"))};
  }

  /**
   * @name checkApplePos
   * @description Checks whether the apple is currently at a position that is not the same as any body part or as the head
   * @returns {boolean} True if position is OK, false otherwise
   */
  checkApplePos() {
    let applePos = this.getPosition();
    let headPos = head.getPosition();
    let curr = body.head;
    while (curr) {
      if ((
        (applePos.top > curr.top - 10 && applePos.top < curr.top + 10)
        && (applePos.left > curr.left - 10 && applePos.left < curr.left + 10)
      ) || (
        (applePos.top > headPos.top - 10 && applePos.top < headPos.top + 10)
        && (applePos.left > headPos.left - 10 && applePos.left < headPos.left + 10)) 
      ) { return false; }
      curr = curr.next;
    }
    return true;
  }
  
  /**
   * @name randomizePos
   * @description Removes the apple jQuery element from the board, assigns it a new position, and then re-attaches it to the DOM
   */
  randomizePos () {
    $('#apple').remove();
    const posTop = getRandomInt();
    const posLeft = getRandomInt();
    this.node.css({ top: posTop, left: posLeft });
    if (!this.checkApplePos()) this.randomizePos();
    // console.log('randomized apple position! top: ', posTop, 'left: ', posLeft, '\n this.node: ', this.node);
    $('#board').append(this.node);
  }

  /**
   * @name checkEaten
   * @description Compares the apple's position with the head's position. If they match, returns true and flashes the success message and triggers the 'score-update' event.
   * @returns {boolean} True if the apple was eaten by the head, false otherwise
   */
  checkEaten() {
    const headPos = head.getPosition();
    const applePos = this.getPosition();
    if ( 
      (headPos.left > applePos.left - 10 && headPos.left < applePos.left + 10)
      && (headPos.top > applePos.top - 10 && headPos.top < applePos.top + 10 ) 
    ) {
        // flash the 'NICE' window
        $('#nice').css({ "display": "block"});
        setTimeout(() => {
          $('#nice').css({ "display": "none"});
        }, 1300)
        // update the score panel
        $('#score-panel').trigger('score-update');
        return true;
    }
    return false;
  }
}

/**
 * @returns {number} A random integer between 0 and 650.
 */
function getRandomInt () {
  return Math.floor(Math.random() * 14) * 50;
}
