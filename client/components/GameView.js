import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Game } from "../../src/Game";
import { logout } from "../store";
import Chat from "./Chat";
import Grid from "@material-ui/core/Grid";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { eventEmitter } from "../../src/event/EventEmitter";
import { fetchCharacterData, fetchNearbyPlayers, updateHealth } from "../store/player";
import io from "socket.io-client";
import { addNewMessage } from "../store/chat";
import Inventory from "./Inventory";

const useStyles = makeStyles((theme) => ({
  chatContainer: {
    display: "flex",
    justifyContent: "center"
  }
}));

export const GameView = () => {
  const dispatch = useDispatch();
  const muiClasses = useStyles(); //this is used to override material ui styles
  const [phaserLoaded, setPhaserLoaded] = useState();
  const [socket, setSocket] = useState(null);
  const playerState = useSelector((state) => state.player);

  useEffect(() => {
    //loads the game
    window.game = new Game();
    console.log('USE EFFECT*******************');

    /****************
     * Socket.io *
     ***************/
    //sets up a socket for 2 way persistent communication via socket.io
    const newSocket = io(`http://${window.location.hostname}:1338/gameSync`, {
      withCredentials: true
    });
    setSocket(newSocket); //save the socket into the component state

    //listens for other players loading in
    newSocket.on("otherPlayerLoad", (data) => {
      eventEmitter.emit("otherPlayerLoad", data);
    });

    //this is where the server lets us know that others players have moved, once we receive this signal we
    //tell phaser to move those characters on the screen
    newSocket.on("otherPlayerPositionChanged", (position) => {
      //this is how we tell phaser that another player has moved
      eventEmitter.emit("otherPlayerPositionChanged", position);
    });

    /****************
     * EventEmitter *
     ***************/
    //Subscribes to an event which lets us know when phaser has fully loaded
    eventEmitter.subscribe("phaserLoad", async (data) => {
      //not sure if this characterId is anything at the moment
      const characterId = await dispatch(fetchCharacterData()); //load the players data into redux
      console.log('CHARACTER ID', characterId)
      if (characterId) {
        dispatch(fetchNearbyPlayers(characterId)); //load any players which are in the same scene as the player
      }
    });

    //phaser will report player position movements in this event
    eventEmitter.subscribe("playerPositionChanged", (position) => {
      //send a message using socket.io to let the server know that the player changed position
      newSocket.emit("playerPositionChanged", position);
    });

    return () => newSocket.close();
  }, []);

  return (
    <div className="layout">
      <div className="left">
        <div id="phaser"></div>
        <div className="worldChat">
          <Chat />
        </div>
      </div>
      <div className="inventory">
        <div>
          <Inventory />
        </div>

        <div>
          <Link to="/select">
            <button id="characterButton">CHARACTERS</button>
          </Link>
          <Link to="/">
            <button onClick={() => dispatch(logout())} id="logoutButton">
              QUIT
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

{
  /* <Grid container >
      <Grid item xs={12}>
        <Link to='/'>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </Link>
      </Grid>
      <Grid item xs={12} >
        <div id='phaser'></div>
      </Grid>
      <Grid item xs={12} className={muiClasses.chatContainer}>
        <Chat/>
      </Grid>
    </Grid> */
}
