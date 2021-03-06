require("dotenv").config();
const { db } = require("./db");
const seed = require("../script/seed");
const PORT = process.env.PORT || 1337;
const server = require("./app");
const { initSocketServer, initHeartbeat, initLazarusPit} = require("./socket");
const {Npc} = require('./db/models/Npc');
const {User} = require('./db/models/User');

const init = async () => {
  try {
    if (process.env.SEED === "true") {
      await seed();
    } else {
      await db.sync();
    }
    // start listening (and create a 'server' object representing our server)
    // app.listen(PORT, () => console.log(`Super Awesome MMO running on ${PORT}`));
    initSocketServer();
    server.listen(PORT, () => console.log(`Super Awesome MMO running on ${PORT}`));
    initHeartbeat();
    initLazarusPit();
    Npc.clearAllAggro()
  } catch (ex) {
    console.log(ex);
  }
};
init();
