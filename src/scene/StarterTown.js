import MMOScene from "./MMOScene";
import { createPathFinder } from "../pathfinding/pathfinding";

export default class StarterTown extends MMOScene {
  constructor() {
    super("StarterTown");
  }
  preload() {
    super.preload();
  }

  create() {
    this.music = this.sound.add("scene1Audio");
    this.music.loop = true;
    this.music.play();

    this.map = this.make.tilemap({ key: "start-scene" }); //the key: should match what you specified in this.load.tilemapTiledJSON

    //tileSetName has to match the name of the tileset in Tiled, and the key is the image key we used for this tile set
    const town = this.map.addTilesetImage("town", "town", 16, 16, 1, 2); //loads the tileset used to make up this map

    this.groundLayer = this.map.createLayer("ground", town, 0, 0);
    this.worldLayer = this.map.createLayer("world", town, 0, 0);
    this.belowCharLayer = this.map.createLayer("belowChar", town, 0, 0);

    this.layers = [this.groundLayer, this.worldLayer, this.belowCharLayer];

    this.tileSize = 16;

    // collision
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.belowCharLayer.setCollisionByProperty({ collides: true });

    this.pathfinder = createPathFinder(this.map, this.layers);

    this.transitionToForestSceneFromStarterTown = this.add.rectangle(3200, 625, 100, 100, 0xffffff, 0);

    // use this for development (close to monster)
    // this.transitionToForestSceneFromStarterTown = this.add.rectangle(500, 500, 100, 100, 0xffffff, 0.5).setDepth(1);

    this.physics.add.existing(this.transitionToForestSceneFromStarterTown);
    this.transitionToForestSceneFromStarterTown.body.enable = true;
    this.physics.world.add(this.transitionToForestSceneFromStarterTown.body);
    this.transitionZones.push({
      sceneName: 'ForestScene',
      sceneDisplayName: 'Darkwood',
      sceneId: 2,
      xPos: 140,
      yPos: 675,
      transitionPoint: this.transitionToForestSceneFromStarterTown
    });

    super.create();
  }

  update(time, delta) {
    super.update(time, delta);
  }
}
