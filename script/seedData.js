const userData = [
  {
    user: {
      email: "fox@mmo.com",
      password: "123",
      firstName: "fox",
      lastName: "cute",
      isAdmin: true,
      loggedIn: false
    },
    playerCharacter: {
      name: "fox_player",
      health: 100,
      totalHealth: 100,
      strength: 55,
      intelligence: 70,
      templateCharacterId: 1,
      active: false,
      gold: 15,
      experience: 70,
      level: 3
    },
    location: {
      xPos: 300,
      yPos: 700,
      facingDirection: "w",
      sceneId: 1
    },
    templateCharacter: "fox"
  },
  {
    user: {
      email: "arcana@mmo.com",
      password: "123",
      firstName: "arcana",
      lastName: "",
      isAdmin: true,
      loggedIn: false
    },
    playerCharacter: {
      name: "Arcana",
      health: 100,
      totalHealth: 100,
      strength: 75,
      intelligence: 100,
      templateCharacterId: 2,
      active: false,
      gold: 30,
      experience: 50,
      level: 5
    },
    location: {
      xPos: 350,
      yPos: 500,
      facingDirection: "w",
      sceneId: 1
    },
    templateCharacter: "sorcerer"
  }
];

const templateCharacterData = [
  {
    name: "fox",
    baseStrength: 11,
    baseIntelligence: 8,
    constitution: 11,
    baseHealth: 70,
    isPlayable: true,
    portrait: "/assets/characters/character-protrait-emotes-2/Fox_frame.png",
    description: "Increased health and melee damage. No ranged attacks"
  },
  {
    name: "sorcerer",
    baseStrength: 5,
    baseIntelligence: 11,
    constitution: 4,
    baseHealth: 30,
    isPlayable: true,
    portrait: "/assets/characters/character-protrait-emotes-2/Sorcerer_frame.png",
    description: "High damage, low health and movement speed"
  },
  {
    name: "beastmaster",
    baseStrength: 9,
    baseIntelligence: 7,
    constitution: 9,
    baseHealth: 60,
    isPlayable: true,
    portrait: "/assets/characters/character-protrait-emotes-2/Beastmaster_frame.png",
    description: "High strength, but not the brightest"
  },
  {
    name: "swashbuckler",
    baseStrength: 10,
    baseIntelligence: 6,
    constitution: 9,
    baseHealth: 60,
    isPlayable: true,
    portrait: "/assets/characters/character-protrait-emotes-2/Swashbuckler_frame.png",
    description: "Average strength and intelligence"
  },
  {
    name: "orc",
    baseStrength: 12,
    baseIntelligence: 2,
    constitution: 10,
    baseHealth: 65,
    isPlayable: false,
    portrait: "/assets/characters/character-protrait-emotes-2/Swashbuckler_frame.png",
    description: "Strong, but slow and not adept at magic"
  }
];

const spriteSheetData = [
  {
    name: "fox",
    spriteSheet_image_url: "../spritesheets/heroes/fox/fox.png",
    spriteSheet_json_url: "../spritesheets/heroes/fox/fox.json"
  },
  {
    name: "sorcerer",
    spriteSheet_image_url: "../spritesheets/heroes/sorcerer/sorcerer.png",
    spriteSheet_json_url: "../spritesheets/heroes/sorcerer/sorcerer.json"
  },
  {
    name: "beastmaster",
    spriteSheet_image_url: "../spritesheets/heroes/beastmaster/beastmaster.png",
    spriteSheet_json_url: "../spritesheets/heroes/beastmaster/beastmaster.json"
  },
  {
    name: "swashbuckler",
    spriteSheet_image_url: "../spritesheets/heroes/swashbuckler/swashbuckler.png",
    spriteSheet_json_url: "../spritesheets/heroes/swashbuckler/swashbuckler.json"
  },
  {
    name: "orc",
    spriteSheet_image_url: "../spritesheets/monsters/orc/orc.png",
    spriteSheet_json_url: "../spritesheets/monsters/orc/orc.json"
  }
];

const sceneData = [
  {
    id: 1,
    name: "StarterTown",
    mapId: 1
  },
  {
    id: 2,
    name: "ForestScene",
    mapId: 1
  },
  {
    id: 3,
    name: "ForestPath",
    mapId: 1
  },
  {
    id: 4,
    name: "MiddleTown",
    mapId: 1
  },
  {
    id: 5,
    name: "Dungeon",
    mapId: 1
  }
];

const mapData = [
  {
    name: "firstMap"
  }
];

const npcData = [
  {
    npc: {
      name: "Orc",
      health: 900,
      totalHealth: 1000
    },
    location: {
      xPos: 250,
      yPos: 400,
      facingDirection: "w",
      sceneId: 1
    },
    templateCharacter: "orc"
  }
];

module.exports = {
  userData,
  templateCharacterData,
  spriteSheetData,
  sceneData,
  mapData,
  npcData
};
