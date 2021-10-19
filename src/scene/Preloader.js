import "phaser";
import { eventEmitter } from "../event/EventEmitter";

export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.path = "/assets/";
    /**How to load an atlas (basically a sprite sheet with a .json file that tells phaser how to find certain animations**/
    this.load.atlas("fox", "spritesheets/heroes/fox/fox.png", "spritesheets/heroes/fox/fox.json");
    this.load.atlas(
      "sorcerer",
      "spritesheets/heroes/sorcerer/sorcerer.png",
      "spritesheets/heroes/sorcerer/sorcerer.json"
    );
    this.load.atlas(
      "beastmaster",
      "spritesheets/heroes/beastmaster/beastmaster.png",
      "spritesheets/heroes/beastmaster/beastmaster.json"
    );
    this.load.atlas(
      "swashbuckler",
      "spritesheets/heroes/swashbuckler/swashbuckler.png",
      "spritesheets/heroes/swashbuckler/swashbuckler.json"
    );

    this.load.atlas(
      "ogre",
      "spritesheets/monsters/ogre/ogre.png",
      "spritesheets/monsters/ogre/ogre.json"
    );

    this.load.atlas(
      "orc",
      "spritesheets/monsters/orc/orc.png",
      "spritesheets/monsters/orc/orc.json"
    );

    //How to load a map, this is a .json file which tells phaser how to layout a map, you can generate this in the Tiled application
    this.load.tilemapTiledJSON("start-scene", "/maps/start-scene.json");
    this.load.tilemapTiledJSON("second-scene", "/maps/second-scene.json");
    this.load.tilemapTiledJSON("forest-path", "/maps/forest-path.json")
    this.load.tilemapTiledJSON("middle-town", "/maps/middle-town.json")

    /**How to load a tile set**/
    this.load.image("town", "tilesets/tileset/RPG tileset (full) v1.5 - 200_.png");
    this.load.image("town2", "tilesets/tileset/RPG tileset (full) v1.5.png");
    this.load.image("grass", "tilesets/forest/grass.png");
    this.load.image("plant", "tilesets/forest/plant.png");
    this.load.image("props", "tilesets/forest/props.png");
    this.load.image("stone", "tilesets/forest/stone.png");
    this.load.image("structure", "tilesets/forest/structure.png");
    this.load.image("wall", "tilesets/forest/wall.png");
  }

  create() {
    eventEmitter.emit("phaserLoad"); //tell react that phaser has loaded

    //listen for an event from react to let us know when the player data is available
    eventEmitter.subscribe("playerLoad", (data) => {
      this.scene.launch(data.sceneName);
    });
  }
}
