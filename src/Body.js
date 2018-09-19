/** An individual body part, containing the jQuery element for DOM attachment, and position info */
class Part {
  constructor(startingPos, number) {
    this.jQueryEl = $(`<div class="body" id="b${number}"></div>`);
    this.top = startingPos.top;
    this.left = startingPos.left;
  }
}

/**
 * Linked List containing all body parts and a total count.
 */
class Body {
  constructor() {
    this.head = null;
    this.count = 0;
  }

  /**
   * @name move
   * @description Loops through all body parts and updates their position information (after the head moves). Calls reRenderBody.
   * @param {object} oldHeadPosition An object with properties "top" and "left" representing css positions of the place the head formerly was
   */
  move(oldHeadPosition) {
    if (this.count > 0) {
      let curr = this.head;
      while (curr.next) {
        curr.top = curr.next.top;
        curr.left = curr.next.left;
        curr = curr.next;
      }
      curr.top = oldHeadPosition.top;
      curr.left = oldHeadPosition.left;
      this.reRenderBody();
    }
  }

  /**
   * @name reRenderBody
   * @description Removes all body parts from the DOM, loops through the list and reattaches them (after positions updated)
   */
  reRenderBody() {
    $('.body').remove();
    let curr = this.head;
    while (curr) {
      curr.jQueryEl.css({'top': curr.top, 'left': curr.left});
      $('#board').append(curr.jQueryEl);
      curr = curr.next;
    }
  }

  /**
   * @name addPart
   * @description Inserts a new body part with position info into the linked list. Note: this does NOT manipulate the DOM. Call reRenderBody for that.
   * @param {object} startingPos An object containing a "top" and "left" property to determine where the new body part belongs
   */
  addPart(startingPos) {
    if (!this.head) this.head = new Part(startingPos, ++this.count)
    else {
      let curr = this.head;
      while (curr.next) curr = curr.next;
      curr.next = new Part(startingPos, ++this.count);
    }
    this.reRenderBody();
  }

}