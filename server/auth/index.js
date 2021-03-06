const router = require("express").Router();
const { User, TemplateCharacter, SpriteSheet, PlayerCharacter } = require("../db");
const { requireTokenMiddleware } = require("../auth-middleware");
const cookieParser = require("cookie-parser");
const { userSignupSchema } = require("../api/validationSchemas");
const { Sequelize } = require("sequelize");
const cookieSecret = process.env.cookieSecret;
router.use(cookieParser(cookieSecret));

router.post("/signup", async (req, res, next) => {
  try {
    await userSignupSchema.validate(req.body);
    const { email, password, firstName } = req.body;
    const user = await User.create({
      email,
      password,
      firstName,
      lastSeen: Sequelize.literal("CURRENT_TIMESTAMP")
    });
    //Need to move lines 15 - 17 to after character creation REACT COMPONENT
    // const playerCharacter = await user.createPlayerCharacter({ name: "Hero", health: 100 });
    // console.log("playerCharacter", playerCharacter.__proto__);
    // playerCharacter.createLocation({ xPos: 300, yPos: 500, facingDirection: "left", sceneId: 1 });
    const token = await user.generateToken();
    res.cookie("token", token, {
      sameSite: "strict",
      httpOnly: true,
      signed: true
    });
    res.send({
      loggedIn: true,
      firstName: user.firstName
    });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(401).send("User already exists");
    } else {
      next(err);
    }
  }
});

//authenticates that the user is who they say they are
router.get("/whoAmI", requireTokenMiddleware, async (req, res, next) => {
  try {
    await req.user.flagLoggedIn();
    res.send({
      loggedIn: true,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      isAdmin: req.user.isAdmin
    });
  } catch (ex) {
    res.sendStatus(404);
    console.log(ex);
    // next(ex);
  }
});

//get info of user
router.get("/info", requireTokenMiddleware, async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.user;
    res.send({ user: { firstName, lastName, email } });
  } catch (ex) {
    next(ex);
  }
});

//change info (first name, last name, email) of user
router.put("/update", requireTokenMiddleware, async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;
    await req.user.update({ firstName, lastName, email });
    res.send({ user: { firstName, lastName, email } });
  } catch (ex) {
    next(ex);
  }
});

//log the user in, generate a token and set it as a cookie
router.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    const playerCharacter = await PlayerCharacter.getMainCharacterFromUser(user.id);
    if (user.loggedIn && playerCharacter) {
      //throw some type of error and stop
      res.status(401).send("already loggedIn!!");
    } else {
      const { user, token } = await User.authenticate(req.body);
      await user.flagLoggedIn();

      res.cookie("token", token, {
        sameSite: "strict",
        httpOnly: true,
        signed: true
      });
      res.json({
        loggedIn: true,
        firstName: user.firstName,
        isAdmin: user.isAdmin,
        hasPlayerCharacter: playerCharacter !== null
      });
    }
  } catch (err) {
    console.log(err);
    res.status(401).send("Failed to authenticate");
  }
});

//see if current password is correct
router.post("/change", requireTokenMiddleware, async (req, res, next) => {
  try {
    if (await req.user.correctPassword(req.body.currentPassword)) {
      await req.user.update({ password: req.body.newPassword });
      res.sendStatus(200);
    } else {
      res.sendStatus(204);
    }
  } catch (err) {
    next(err);
  }
});

router.put("/logout", requireTokenMiddleware, async (req, res, next) => {
  console.log("LOGGED OUT USER", req.user);
  try {
    await User.update(
      { loggedIn: false },
      {
        where: {
          id: req.user.id
        }
      }
    );
    res.clearCookie("token", {
      sameSite: "strict",
      httpOnly: true,
      signed: true
    });
    res.json({
      loggedIn: false
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
