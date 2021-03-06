import EasyStar from "easystarjs";

/**
 *
 * @param {Phaser.Tilemaps.Tilemap} map
 * @param {Phaser.Tilemaps.TilemapLayer[]} layers
 */
export const createPathFinder = (map, layers) => {
  const pathFinder = new EasyStar.js();
  // pathFinder.enableDiagonals();
  pathFinder.disableDiagonals();
  pathFinder.disableCornerCutting();
  // pathFinder.disableSync();

  const grid = [];
  const acceptableTiles = new Set();
  for (let col = 0; col < map.height; col++) {
    grid[col] = [];
    for (let row = 0; row < map.width; row++) {
      let finalTile;
      let collisionTile;
      for (let i = 0; i < layers.length; i++) {
        const proposedTile = map.getTileAt(row, col, true, layers[i]);
        if (proposedTile.index !== -1) {
          finalTile = proposedTile;
          if (proposedTile.collides || proposedTile.properties.collides) {
            collisionTile = finalTile;
          }
        }
      }
      if (!collisionTile) acceptableTiles.add(finalTile.index);
      grid[col][row] = collisionTile ? collisionTile.index : finalTile.index;
    }
  }
  pathFinder.setGrid(grid);
  pathFinder.setAcceptableTiles(Array.from(acceptableTiles));
  return pathFinder;
};
