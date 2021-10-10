import {mapToScreen} from '../util/conversion';
import {TILE_HEIGHT, TILE_HEIGHT_HALF, TILE_WIDTH, TILE_WIDTH_HALF} from '../constants/constants';
import {Node} from './node';

export class PathGrid {
  constructor(scene, size) {
    this.grid = [];
    this.scene = scene;
    this.size = size;
    for (let row = 0; row < size; row++) {
      this.grid[row] = [];
      for (let col = 0; col < size; col++) {
        let [screenX, screenY] = mapToScreen(col, row);
        let isWalkable = true;
        //@todo: check the collides property on the tile for setting walkable
        this.grid[row][col] = new Node(col, row, true, this.makeSquare(screenX, screenY));
      }
    }
  }

  makeSquare(xPos, yPos, color = 0xFF00FF, width = 4, height = 4) {
    // return this.scene.add.rectangle(xPos + TILE_WIDTH_HALF - width/2, yPos + TILE_HEIGHT_HALF - height/2, width, height, color)
    return this.scene.add.rectangle(xPos, yPos, width, height)
  }

  getAdjacentNodes(node) {
    const adjNodes = [];
    const directions = {
      north: {distance: 10, coords: [0, -1]},
      northeast: {distance: 14, coords: [1, -1]},
      east: {distance: 10, coords: [1, 0]},
      southeast: {distance: 14, coords: [1, 1]},
      south: {distance: 10, coords: [0, 1]},
      southwest: {distance: 14, coords: [-1, 1]},
      west: {distance: 10, coords: [-1, 0]},
      northwest: {distance: 14, coords: [-1, -1]},
    }

    for (let [direction, {distance, coords}] of Object.entries(directions)) {
      const [nextX, nextY] = [node.x + coords[0], node.y + coords[1]];
      const nextNode = this.canIMove(nextX, nextY, this.size, this.size)
      if (nextNode) {
        adjNodes.push({distance, nextNode});
      }
    }
    return adjNodes;
  }

  /**
   *
   * @param nextX
   * @param nextY
   * @param boundX
   * @param boundY
   * @returns {boolean}
   */
  canIMove(nextX, nextY, boundX, boundY) {
    let node = false;
    if (nextX >= 0 && nextX < boundX && nextY >= 0 && nextY < boundY) {
      node = this.getNode(nextX, nextY);
      if (!node.isWalkable) {
        return false;
      }
    }
    return node;
  }

  resetGrid(size = this.size) {
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        this.grid[col][row].distanceFromStart = Infinity;
        this.grid[col][row].estimatedDistanceToEnd = Infinity;
        this.grid[col][row].cameFrom = null;
      }
    }
  }

  getNode(x,y) {
    return this.grid[y][x];
  }
}

