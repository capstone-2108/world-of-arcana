// const Phaser = require('phaser');
import 'phaser';
import {PathGrid} from './PathGrid';
import {aStar} from './a-star';
import {Player} from '../entity/Player';

export class PathFinder {
  /**
   *
   * @param {Phaser.Scene} scene
   * @param {Player} character
   * @param {PathGrid} grid
   *
   */
  constructor(scene, character, grid) {
    this.scene = scene;
    this.grid = grid;
  }

  /**
   *
   * @param start
   * @param end
   * @returns {Node[]|[]}
   */
  aStarPath(start, end) {
    this.grid.resetGrid();
    const startNode = this.grid.getNode(start[0], start[1]);
    this.character.moveToTile(startNode.x, startNode.y);
    return aStar(start[0], start[1], end[0], end[1], this.grid);
  }

  highlightPath(path, clear = false) {
    if(path) {
      for (let i = 0; i < path.length; i++) {
        const node = path[i];
        const graphics = node.worldPos.graphics;
        const worldPos = node.worldPos;
        graphics.lineStyle(2, !clear ? 0x0000FF : worldPos.originalColor);
        graphics.moveTo(worldPos.points[0].x, worldPos.points[0].y);
        for (let i = 1; i < worldPos.points.length; i++) {
          graphics.lineTo(worldPos.points[i].x, worldPos.points[i].y);
        }
        graphics.closePath();
        graphics.strokePath();
      }
    }
  }


  testPath(player, path) {
    let i = 0;
    if(path.length) {
      const interval = window.setInterval(() => {
        if(i < path.length) {
          let node = path[i];
          player.moveToCoordinate(node.worldPos._x, node.worldPos._y);
        }
        else {
          console.log('ending interval');
          window.clearInterval(interval);
        }
        i++
      }, 150);
    }
  }


}






