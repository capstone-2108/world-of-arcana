import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { NewChatEntry } from "./NewChatEntry";
import { useDispatch, useSelector } from "react-redux";
import { addNewMessage } from "../store/chat";
import ChatHistory from "./ChatHistory";
import Grid from "@material-ui/core/Grid";

const Chat = (props) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const chatSocket = io(`http://${window.location.hostname}:1337/worldChat`, {
      withCredentials: true
    });
    setSocket(chatSocket);
    chatSocket.on("newMessage", (message) => {
      dispatch(addNewMessage(message));
    });
    return () => chatSocket.close();
  }, []);

  return (
    <div className="chat-container">
      {socket ? (
        <Grid container className="chatbox">
          <Grid item className="real-chatbox">
            <ChatHistory />
            <NewChatEntry socket={socket} />
          </Grid>
        </Grid>
      ) : (
        <div>Not Connected</div>
      )}
    </div>
  );
};

export default Chat;
