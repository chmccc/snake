class Head {

  constructor($el) {
    this.node = $('<img id="head"></img>');
    this.node.attr('src', 'src/assets/head.png');
    this.currentDirection = 'right';
    this.SPEED = 300;
    this.node.css({ top: '0px', left: '0px' });
    $el.append(this.node);
    setTimeout(this.move.bind(this), this.SPEED);
  }

  /**
   * @name getPosition
   * @returns {object} An object with properties "top" and "left" representing the css position of the element
   */
  getPosition() {
    return { top: parseInt(this.node.css("top")) , left: parseInt(this.node.css("left"))}
  }

  /**
   * @name checkCollision
   * @description Checks for a collision between the head and any body parts in the chain
   */
  checkCollision() {
    let headPos = this.getPosition();
    if (body.count > 3) {
      let curr = body.head;
      while (curr) {
        if (
          (headPos.top > curr.top - 10 && headPos.top < curr.top + 10)
          && (headPos.left > curr.left - 10 && headPos.left < curr.left + 10)
        ) { return true };
        curr = curr.next;
      }
    }
    return false;
  }

  /**
   * @name checkOOB
   * @description Checks to see if the head is outside the board space
   * @returns {boolean} True if OOB, false otherwise
   */
  checkOOB() {
    const position = this.getPosition();
    if (position.top >= 700 || position.left >= 700 || position.left < 0 || position.top < 0) {
      return true;
    }
    return false;
  }

  gameOver() {
    $(document).trigger('game-over');
    return;
  }

  // same as Head.prototype.move = function() {...}
  /**
   * @name move
   * @description Contains most game logic. Triggered every n ms as determined by the timeout in the constructor.
   * In order, it:
   * 1. Moves the head
   * 2. Moves the body (if any body parts exist)
   * 3. Checks for head out-of-bounds
   * 4. Checks for collision between head and body parts
   * 5. Checks for collision with apple (apple eaten)
   * 6. Calls itself again with another timeout.
   */
  move() {
    let direction = this.currentDirection;
    let position = this.getPosition();
    let oldHeadPosition = { ...position }; // we save the former head position to shift the body later

    // move the head
    if (direction === 'right') position.left += 50;
    if (direction === 'left') position.left -= 50;
    if (direction === 'up') position.top -= 50;
    if (direction === 'down') position.top += 50;
    this.node.css({ 'top' : position.top, 'left' : position.left });

    body.move(oldHeadPosition);
    if (this.checkOOB()) return this.gameOver();
    if (this.checkCollision()) return this.gameOver();
    if (apple.checkEaten()) {
      apple.randomizePos();
      body.addPart(oldHeadPosition);
    }
    setTimeout(this.move.bind(this), this.SPEED);
  }
}
