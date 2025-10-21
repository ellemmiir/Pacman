class Ghost {
  constructor(
    x,
    y,
    width,
    height,
    speed,
    imageX,
    imageY,
    imageWidth,
    imageHeight,
    range
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.direction = DIRECTION_RIGHT;
    this.imageX = imageX;
    this.imageY = imageY;
    this.imageHeight = imageHeight;
    this.imageWidth = imageWidth;
    this.range = range;
    this.randomTargetIndex = parseInt(Math.random() * 4);
    this.target = randomTargetsForGhosts[this.randomTargetIndex];

    this.aiInterval = setInterval(() => {
      this.changeRandomDirection();
    }, 10000);
  }

  stopAI() {
    clearInterval(this.aiInterval);
  }

  isInRange() {
    let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
    let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
    return Math.sqrt(xDistance ** 2 + yDistance ** 2) <= this.range;
  }

  changeRandomDirection() {
    this.randomTargetIndex = (this.randomTargetIndex + 1) % 4;
  }

  moveProcess() {
    this.target = this.isInRange()
      ? pacman
      : randomTargetsForGhosts[this.randomTargetIndex];
    this.changeDirectionIfPossible();
    this.moveForwards();
    if (this.checkCollisions()) this.moveBackwards();
  }

  moveBackwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x -= this.speed;
        break;
      case DIRECTION_UP:
        this.y += this.speed;
        break;
      case DIRECTION_LEFT:
        this.x += this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y -= this.speed;
        break;
    }
  }

  moveForwards() {
    switch (this.direction) {
      case DIRECTION_RIGHT:
        this.x += this.speed;
        break;
      case DIRECTION_UP:
        this.y -= this.speed;
        break;
      case DIRECTION_LEFT:
        this.x -= this.speed;
        break;
      case DIRECTION_BOTTOM:
        this.y += this.speed;
        break;
    }
  }

  checkCollisions() {
    return (
      map[parseInt(this.y / oneBlockSize)][parseInt(this.x / oneBlockSize)] ==
        1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
        parseInt(this.x / oneBlockSize)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize)][
        parseInt(this.x / oneBlockSize + 0.9999)
      ] == 1 ||
      map[parseInt(this.y / oneBlockSize + 0.9999)][
        parseInt(this.x / oneBlockSize + 0.9999)
      ] == 1
    );
  }

  changeDirectionIfPossible() {
    let tempDirection = this.direction;
    this.direction = this.calculateNewDirection(
      map,
      parseInt(this.target.x / oneBlockSize),
      parseInt(this.target.y / oneBlockSize)
    );
    if (typeof this.direction === "undefined") this.direction = tempDirection;

    this.moveForwards();
    if (this.checkCollisions()) {
      this.moveBackwards();
      this.direction = tempDirection;
    } else {
      this.moveBackwards();
    }
  }

  calculateNewDirection(map, destX, destY) {
    let mp = map.map((row) => row.slice());
    let queue = [{ x: this.getMapX(), y: this.getMapY(), moves: [] }];

    while (queue.length) {
      let poped = queue.shift();
      if (poped.x === destX && poped.y === destY) return poped.moves[0];
      mp[poped.y][poped.x] = 1;
      queue.push(...this.addNeighbors(poped, mp));
    }
    return undefined;
  }

  addNeighbors(poped, mp) {
    let queue = [];
    let rows = mp.length,
      cols = mp[0].length;

    if (poped.x - 1 >= 0 && mp[poped.y][poped.x - 1] != 1) {
      queue.push({
        x: poped.x - 1,
        y: poped.y,
        moves: [...poped.moves, DIRECTION_LEFT],
      });
    }
    if (poped.x + 1 < cols && mp[poped.y][poped.x + 1] != 1) {
      queue.push({
        x: poped.x + 1,
        y: poped.y,
        moves: [...poped.moves, DIRECTION_RIGHT],
      });
    }
    if (poped.y - 1 >= 0 && mp[poped.y - 1][poped.x] != 1) {
      queue.push({
        x: poped.x,
        y: poped.y - 1,
        moves: [...poped.moves, DIRECTION_UP],
      });
    }
    if (poped.y + 1 < rows && mp[poped.y + 1][poped.x] != 1) {
      queue.push({
        x: poped.x,
        y: poped.y + 1,
        moves: [...poped.moves, DIRECTION_BOTTOM],
      });
    }

    return queue;
  }

  getMapX() {
    return parseInt(this.x / oneBlockSize);
  }
  getMapY() {
    return parseInt(this.y / oneBlockSize);
  }
  getMapXRightSide() {
    return parseInt((this.x + this.width - 1) / oneBlockSize);
  }
  getMapYRightSide() {
    return parseInt((this.y + this.height - 1) / oneBlockSize);
  }

  draw() {
    canvasContext.drawImage(
      ghostFrames,
      this.imageX,
      this.imageY,
      this.imageWidth,
      this.imageHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
    // canvasContext.restore();
    // canvasContext.beginPath();
    // canvasContext.strokeStyle = "red";
    // canvasContext.arc(
    //     this.x + oneBlockSize / 2,
    //     this.y + oneBlockSize / 2,
    //     this.range * oneBlockSize,
    //     0,
    //     2 * Math.PI
    // );
    // canvasContext.stroke();
  }
}

let updateGhosts = () => ghosts.forEach((g) => g.moveProcess());
let drawGhosts = () => ghosts.forEach((g) => g.draw());

function resetGhosts() {
  ghosts.forEach((g) => g.stopAI()); 
  ghosts = []; 
}


