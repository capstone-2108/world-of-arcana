const {requireTokenMiddleware} = require('../auth-middleware');
const router = require("express").Router();
const cookieParser = require("cookie-parser");
router.use(cookieParser(process.env.cookieSecret));

//POST /api/chat/world - posts a new message to be emitted to the world
router.post('/world', requireTokenMiddleware, async (req, res, next) => {
  /**
   * HERE - MOVE THE SOCKET STUFF INTO IT'S OWN FILE, THEN BROAD CAST FROM HERE AND CHECK REDUX STORE
   */
  res.send({
    channel: 'world',
    message: {
      name: req.user.firstName, //todo: change this to the person's character name
      message: req.body.message
    }
  });
});

module.exports = router;