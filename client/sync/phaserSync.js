import React, { useEffect, useState } from "react";
import { eventEmitter } from "../../src/event/EventEmitter";
import { fetchCharacterData, fetchNearbyPlayers } from "../store/player";
import { useDispatch } from "react-redux";
import { Game } from "../../src/Game";
import io from "socket.io-client";

//this is a fake component which handles our event subscriptions
//we're using a functional component because we need access to hooks
export const InitSubscriptionsToPhaser = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    //loads the game
    window.game = new Game();

    /****************
     * Socket.io *
     ***************/
    //sets up a socket for 2 way persistent communication via socket.io
    const newSocket = io(`http://${window.location.hostname}:1337/gameSync`, {
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
     * Event Emitter *
     ***************/
    //Subscribes to an event which lets us know when phaser has fully loaded
    eventEmitter.subscribe("phaserLoad", async (data) => {
      const characterId = await dispatch(fetchCharacterData()); //load the players data into redux
      if (characterId) {
        dispatch(fetchNearbyPlayers(characterId)); //load any players which are in the same scene as the player
      }
    });

    //phaser will send us updates via the "phaserUpdate" event
    eventEmitter.subscribe("phaserUpdate", ({ action, data }) => {
      //send a message using socket.io to let the server know that the player changed position
      newSocket.emit(action, data);
    });

    return () => newSocket.close();
  }, []);

  return <></>;
};