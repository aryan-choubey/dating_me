import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  getMatch,
  getOldMessages,
  markMessagesAsRead,
} from "../api/allapi";

import { socket } from "../socket/Socket";

import "./Messages.css";

const SERVER_URL = "http://localhost:5000";

const Messages = () => {
  const navigate = useNavigate();
  const { userId } = useParams();

  // =========================================
  // STATE
  // =========================================

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // =========================================
  // GET MATCHED USERS
  // LEFT SIDE
  // =========================================

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoadingUsers(true);

        const response = await getMatch();

        console.log(
          "Match API response:",
          response.data
        );

        const matchedUsers =
          response.data.matches || [];

        const users = matchedUsers.map(
          (match) => match.user
        );

        console.log(
          "Chat users:",
          users
        );

        setUsers(users);

      } catch (error) {
        console.error(
          "Error loading users:",
          error.response?.data ||
            error.message
        );
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, []);

  // =========================================
  // SELECT USER FROM URL
  // =========================================

  useEffect(() => {
    if (
      !userId ||
      users.length === 0
    ) {
      return;
    }

    const user = users.find(
      (item) => item._id === userId
    );

    if (user) {
      setSelectedUser(user);
    }

  }, [userId, users]);

  // =========================================
  // LOAD OLD MESSAGES
  // =========================================

  useEffect(() => {
    if (!selectedUser?._id) {
      return;
    }

    const loadOldMessages = async () => {
      try {
        setLoadingMessages(true);

        const response =
          await getOldMessages(
            selectedUser._id
          );

        console.log(
          "Old messages:",
          response.data
        );

        setMessages(
          response.data.messages || []
        );

        // Mark messages as read
        await markMessagesAsRead(
          selectedUser._id
        );

      } catch (error) {
        console.error(
          "Error loading messages:",
          error.response?.data ||
            error.message
        );
      } finally {
        setLoadingMessages(false);
      }
    };

    loadOldMessages();

  }, [selectedUser]);

  // =========================================
  // SOCKET CONNECTION
  // =========================================

  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  // =========================================
  // RECEIVE MESSAGE
  // FROM OTHER USER
  // =========================================

  useEffect(() => {

    const handleReceiveMessage = (
      newMessage
    ) => {

      console.log(
        "Received message:",
        newMessage
      );

      // Backend populates sender:
      // sender = { _id, name, photos }

      const senderId =
        newMessage.sender?._id ||
        newMessage.sender ||
        newMessage.senderId;

      // Only add message if it belongs
      // to currently opened chat

      if (senderId === userId) {

        setMessages(
          (previousMessages) => [
            ...previousMessages,
            newMessage,
          ]
        );
      }
    };

    socket.on(
      "receiveMessage",
      handleReceiveMessage
    );

    return () => {

      socket.off(
        "receiveMessage",
        handleReceiveMessage
      );

    };

  }, [userId]);

  // =========================================
  // MESSAGE SENT BY ME
  // =========================================

  useEffect(() => {

    const handleMessageSent = (
      newMessage
    ) => {

      console.log(
        "My message received:",
        newMessage
      );

      setMessages(
        (previousMessages) => [
          ...previousMessages,
          newMessage,
        ]
      );
    };

    socket.on(
      "messageSent",
      handleMessageSent
    );

    return () => {

      socket.off(
        "messageSent",
        handleMessageSent
      );

    };

  }, []);

  // =========================================
  // CLICK USER
  // =========================================

  const handleSelectUser = (user) => {

    setSelectedUser(user);

    setMessages([]);

    navigate(
      `/messages/${user._id}`
    );
  };

  // =========================================
  // SEND MESSAGE
  // =========================================

  const handleSendMessage = () => {

    if (!message.trim()) {
      return;
    }

    if (!selectedUser?._id) {
      return;
    }

    const messageData = {
      receiverId: selectedUser._id,
      message: message.trim(),
    };

    console.log(
      "Sending:",
      messageData
    );

    // Send through Socket.IO
    socket.emit(
      "sendMessage",
      messageData
    );

    // Clear input
    setMessage("");
  };

  // =========================================
  // ENTER TO SEND
  // =========================================

  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      handleSendMessage();
    }
  };

  // =========================================
  // IMAGE
  // =========================================

  const getProfileImage = (user) => {

    if (
      !user?.photos ||
      user.photos.length === 0
    ) {
      return null;
    }

    const image = user.photos[0];

    if (image.startsWith("http")) {
      return image;
    }

    return `${SERVER_URL}${image}`;
  };

  // =========================================
  // RENDER
  // =========================================

  return (
    <div className="message-page">

      {/* =====================================
          LEFT SIDE
      ====================================== */}

      <aside className="message-sidebar">

        <div className="message-sidebar-header">

          <h2>
            Messages
          </h2>

          <p>
            Your conversations
          </p>

        </div>

        <div className="message-user-list">

          {loadingUsers ? (

            <div className="message-sidebar-loading">
              Loading...
            </div>

          ) : users.length === 0 ? (

            <div className="no-message-users">
              No matches yet
            </div>

          ) : (

            users.map((user) => (

              <div
                key={user._id}
                className={`message-user-card ${
                  selectedUser?._id === user._id
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  handleSelectUser(user)
                }
              >

                <div className="message-user-image">

                  {getProfileImage(user) ? (

                    <img
                      src={getProfileImage(user)}
                      alt={user.name}
                    />

                  ) : (

                    <div className="default-user-image">

                      {user.name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}

                    </div>

                  )}

                </div>

                <div className="message-user-info">

                  <h3>
                    {user.name ||
                      "Unknown User"}
                  </h3>

                  <p>
                    Start a conversation
                  </p>

                </div>

              </div>

            ))

          )}

        </div>

      </aside>

      {/* =====================================
          RIGHT SIDE
      ====================================== */}

      <main className="message-chat">

        {!selectedUser ? (

          <div className="message-empty">

            <div className="message-empty-icon">
              💬
            </div>

            <h2>
              Select a conversation
            </h2>

            <p>
              Choose someone from the left
              to start chatting.
            </p>

          </div>

        ) : (

          <>

            {/* =================================
                CHAT HEADER
            ================================== */}

            <div className="chat-header">

              <div className="chat-header-image">

                {getProfileImage(
                  selectedUser
                ) ? (

                  <img
                    src={getProfileImage(
                      selectedUser
                    )}
                    alt={selectedUser.name}
                  />

                ) : (

                  <div className="default-user-image">

                    {selectedUser.name
                      ?.charAt(0)
                      ?.toUpperCase()}

                  </div>

                )}

              </div>

              <div className="chat-header-info">

                <h2>
                  {selectedUser.name}
                </h2>

                <span>
                  Matched with you
                </span>

              </div>

            </div>

            {/* =================================
                MESSAGES
            ================================== */}

            <div className="chat-messages">

              {loadingMessages ? (

                <div className="chat-loading">
                  Loading messages...
                </div>

              ) : messages.length === 0 ? (

                <div className="no-messages">

                  <div className="no-messages-icon">
                    ❤️
                  </div>

                  <h3>
                    Start your conversation
                  </h3>

                  <p>
                    Say hello to{" "}
                    {selectedUser.name}.
                  </p>

                </div>

              ) : (

                messages.map(
                  (item, index) => {

                    const senderId =
                      item.sender?._id ||
                      item.sender ||
                      item.senderId;

                    /*
                      selectedUser is the other person.

                      If sender is NOT selectedUser,
                      message was sent by me.
                    */

                    const isMine =
                      senderId !==
                      selectedUser._id;

                    return (

                      <div
                        key={
                          item._id ||
                          index
                        }
                        className={`chat-message ${
                          isMine
                            ? "sent"
                            : "received"
                        }`}
                      >

                        <div className="message-bubble">

                          <p>
                            {item.message ||
                              item.content}
                          </p>

                          {item.createdAt && (

                            <span>

                              {new Date(
                                item.createdAt
                              ).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute:
                                    "2-digit",
                                }
                              )}

                            </span>

                          )}

                        </div>

                      </div>

                    );
                  }
                )

              )}

            </div>

            {/* =================================
                MESSAGE INPUT
            ================================== */}

            <div className="chat-input">

              <input
                type="text"
                value={message}
                placeholder={`Message ${selectedUser.name}...`}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                onKeyDown={handleKeyDown}
              />

              <button
                onClick={
                  handleSendMessage
                }
                disabled={
                  !message.trim()
                }
              >
                ➤
              </button>

            </div>

          </>

        )}

      </main>

    </div>
  );
};

export default Messages;