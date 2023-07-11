import React, { useEffect, useState } from "react";
import "./SidebarChat.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";
import { Link } from "react-router-dom";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";

function SidebarChat({ addNewChat, id, name }) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, [id]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const deleteRoom = () => {
    db.collection("rooms")
      .doc(id)
      .delete()
      .then(function () {
        window.location = "/";
      })
      .catch(function (error) {
        console.error("Error removing document: ", error);
      });
  };

  const createChat = () => {
    const roomName = prompt("Please enter name for chat");

    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };

  return !addNewChat ? (
    <div className="sidebarChat">
      <Link to={`/rooms/${id}`}>
        <div className="sidebarChat__wrapper">
          <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
          <div className="sidebarChat__info">
            <h2>{name}</h2>
            <p>{messages[0]?.message}</p>
          </div>
          <div className="sidebarChat__delete" onClick={deleteRoom}>
            <DeleteForeverIcon />
          </div>
        </div>
      </Link>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add new Chat Room</h2>
    </div>
  );
}

export default SidebarChat;
