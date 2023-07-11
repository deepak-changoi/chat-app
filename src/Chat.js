import React, { useEffect, useState } from "react";
import "./Chat.css";
import { Link, useParams } from "react-router-dom";
import { Avatar, IconButton } from "@material-ui/core";
import { AttachFile, Message, SearchOutlined } from "@material-ui/icons";
import MoreVert from "@material-ui/icons/MoreVert";
import InsertEmotionIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import db from "./firebase";
import firebase from "firebase/compat/app";
import { useStateValue } from "./StateProvider";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import useSound from "use-sound";
                   
function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();
  const [emoji, setEmoji] = useState(false);

  const [issendChecked, setIssendChecked] = useState(false);

  const [playOn] = useSound(`${process.env.PUBLIC_URL}/send.mp3`, {
    volume: 0.5,
  });
  const [playOff] = useSound(`${process.env.PUBLIC_URL}/send.mp3`, {
    volume: 0.5,
  });

  useEffect(() => {
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => setRoomName(snapshot.data().name));

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [roomId]);

  function getTimeZone() {
    var offset = new Date().getTimezoneOffset(),
      o = Math.abs(offset);
    return (
      (offset < 0 ? "+" : "-") +
      ("00" + Math.floor(o / 60)).slice(-2) +
      ":" +
      ("00" + (o % 60)).slice(-2)
    );
  }

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(input);

    db.collection("rooms").doc(roomId).collection("messages").add({
      message: input,
      name: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setIssendChecked(!issendChecked);
    issendChecked ? playOff() : playOn();
    setInput("");
  };

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          <p>
            last Seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toString().slice(0 , 24)}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>

          <IconButton>
            <AttachFile />
          </IconButton>

          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__reciever"
            }`}
          >
            <span className="chat__name">
              {message.name.length > 10
                ? message.name.substr(0, message.name.indexOf(" "))
                : message.name}{" "}
            </span>

            {message.message}

            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toString().slice(0 , 24)}
            </span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <IconButton>
          <InsertEmotionIcon
            className="yellow"
            onClick={() => setEmoji(!emoji)}
          />

          {emoji ? <Picker onSelect={addEmoji} /> : null}
        </IconButton>

        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <IconButton>
          <MicIcon />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
