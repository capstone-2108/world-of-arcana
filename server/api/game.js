const { requireTokenMiddleware } = require("../auth-middleware");
const router = require("express").Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser(process.env.cookieSecret));
const { worldChat, gameSync } = require("../socket");
const { TemplateCharacter, SpriteSheet, Location, User, PlayerCharacter, Scene } = require("../db");
const { Op } = require("sequelize");

//This fetches all template characters
router.get("/templates", async (req, res, next) => {
  try {
    const result = await TemplateCharacter.findAll();
    res.json(result);
  } catch {
    next(err);
  }
});

//gets called if user is LOGGING IN (pulling their playerCharacter info)
router.get("/character", requireTokenMiddleware, async (req, res, next) => {
  // console.log('req.user', req.user)
  const playerCharacter = await PlayerCharacter.findOne({
    where: {
      userId: req.user.id
    },
    include: [
      {
        model: TemplateCharacter,
        attributes: ["id", "name"],
        include: {
          model: SpriteSheet,
          attributes: ["name", "spriteSheet_image_url", "spriteSheet_json_url"]
        }
      },
      {
        model: Location,
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: {
          model: Scene,
          attributes: ["name"]
        }
      }
    ]
  });
  const payload = {
    userId: req.user.id,
    characterId: playerCharacter.id,
    id: playerCharacter.id,
    name: playerCharacter.name,
    health: playerCharacter.health,
    templateName: playerCharacter.templateCharacter.name,
    spriteSheetImageUrl: playerCharacter.templateCharacter.spriteSheets[0].spriteSheet_image_url,
    spriteSheetJsonUrl: playerCharacter.templateCharacter.spriteSheets[0].spriteSheet_json_url,
    xPos: playerCharacter.location.xPos,
    yPos: playerCharacter.location.yPos,
    gold: playerCharacter.gold
  };
  console.log("payload", payload);
  res.json(payload);

  // Tell the world this player has joined!
  worldChat.emit("newMessage", {
    channel: "world",
    message: {
      name: "WORLD", //todo: change this to the person's character name
      message: playerCharacter.name + " has logged in!"
    }
  });

  gameSync.emit("otherPlayerLoad", payload);
});

router.post("/character", requireTokenMiddleware, async (req, res, next) => {
  try {
    //create new entry in location table for this new character
    const location = await Location.create({
      xPos: 300,
      yPos: 500,
      facingDirection: "e",
      sceneId: 1
    });
    const scene = await location.getScene();

    //create newplayer in PlayerCharacter instance
    const newPlayer = await PlayerCharacter.create({
      name: req.body.name,
      totalHealth: req.body.character.baseHealth,
      health: req.body.character.baseHealth,
      strength: req.body.character.baseStrength,
      intelligence: req.body.character.baseIntelligence,
      locationId: location.id
    });

    await newPlayer.setUser(req.user);
    await newPlayer.setTemplateCharacter(req.body.character.id);

    const templateCharacterInfo = await newPlayer.getTemplateCharacter();
    const spriteSheetInfo = await templateCharacterInfo.getSpriteSheets();

    const payload = {
      userId: req.user.id,
      characterId: newPlayer.id,
      name: newPlayer.name,
      templateName: templateCharacterInfo.name,
      health: newPlayer.health,
      totalHealth: newPlayer.totalHealth,
      gold: newPlayer.gold,
      spriteSheetImageUrl: spriteSheetInfo[0].spriteSheet_image_url,
      spriteSheetJsonUrl: spriteSheetInfo[0].spriteSheet_json_url,
      xPos: location.xPos,
      yPos: location.yPos,
      facingDirection: location.facingDirection,
      scene: scene.name
    };
    res.json(payload);
  } catch (err) {
    next(err);
  }
});

//get /api/game/character/nearby - fetches all characters nearby this character
router.get("/character/:characterId/nearby", requireTokenMiddleware, async (req, res, next) => {
  try {
    const playerCharacters = await PlayerCharacter.getNearbyPlayers(req.params.characterId);
    const payload = [];
    let i = 0;
    let len = playerCharacters.length;
    for (; i < len; i++) {
      const playerCharacter = playerCharacters[i];
      payload[i] = {
        userId: req.user.id,
        characterId: playerCharacter.id,
        name: playerCharacter.name,
        health: playerCharacter.health,
        templateName: playerCharacter.templateCharacter.name,
        spriteSheetImageUrl:
          playerCharacter.templateCharacter.spriteSheets[0].spriteSheet_image_url,
        spriteSheetJsonUrl: playerCharacter.templateCharacter.spriteSheets[0].spriteSheet_image_url,
        xPos: playerCharacter.location.xPos,
        yPos: playerCharacter.location.yPos,
        facingDirection: playerCharacter.location.facingDirection
      };
    }
    res.json(payload);
  } catch (err) {
    console.log(err);
  }
});

//get /api/game/character/:id - fetches character data by id
// router.get("/character/:id", requireTokenMiddleware, async (req, res, next) => {
//   //@todo: make sure the player can only load characters belonging to them

//   const { id } = req.params;
//   // const hasCharacter = await req.user.hasPlayerCharacter(id);
//   let playerCharacter = [];
//   // if (hasCharacter) {
//   playerCharacter = (
//     await req.user.getPlayerCharacters({
//       // where: { id },
//       // add other fields totalHealth,
//       attributes: ["id", "name", "health", "gold"],
//       include: [
//         {
//           model: TemplateCharacter,
//           attributes: ["id", "name"],
//           include: {
//             model: SpriteSheet,
//             attributes: ["name", "spriteSheet_image_url", "spriteSheet_json_url"]
//           }
//         },
//         {
//           model: Location,
//           attributes: { exclude: ["createdAt", "updatedAt"] },
//           include: {
//             model: Scene,
//             attributes: ["name"]
//           }
//         }
//       ]
//     })
//   )[0];
//   // } else {
//   //   res.sendStatus(404);
//   // }
//   const payload = {
//     userId: req.user.id,
//     characterId: playerCharacter.id,
//     id: playerCharacter.id,
//     name: playerCharacter.name,
//     health: playerCharacter.health,
//     templateName: playerCharacter.templateCharacter.name,
//     spriteSheetImageUrl: playerCharacter.templateCharacter.spriteSheets[0].spriteSheet_image_url,
//     spriteSheetJsonUrl: playerCharacter.templateCharacter.spriteSheets[0].spriteSheet_json_url,
//     xPos: playerCharacter.location.xPos,
//     yPos: playerCharacter.location.yPos,
//     gold: playerCharacter.gold
//   };

//   res.json(payload);

//   // Tell the world this player has joined!
//   worldChat.emit("newMessage", {
//     channel: "world",
//     message: {
//       name: "WORLD", //todo: change this to the person's character name
//       message: playerCharacter.name + " has logged in!"
//     }
//   });

//   gameSync.emit("otherPlayerLoad", payload);
// });

module.exports = router;
