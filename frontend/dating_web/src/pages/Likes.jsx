import React, { useEffect, useState } from "react";
import {
  getLikes,
  sentLikes,
  swipeUser,
} from "../api/allapi";

import "./Likes.css";

const SERVER_URL = "http://localhost:5000";

const Likes = () => {
  const [activeTab, setActiveTab] = useState("received");

  const [receivedLikes, setReceivedLikes] = useState([]);
  const [sentLikeList, setSentLikeList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);


  const fetchReceivedLikes = async () => {
    try {
      const response = await getLikes();

      setReceivedLikes(
        response.data.likes ||
        response.data.users ||
        []
      );
    } catch (error) {
      console.error(
        "Error fetching received likes:",
        error
      );
    }
  };


  const fetchSentLikes = async () => {
    try {
      const response = await sentLikes();

      setSentLikeList(
        response.data.likes ||
        response.data.users ||
        []
      );
    } catch (error) {
      console.error(
        "Error fetching sent likes:",
        error
      );
    }
  };


  const fetchLikes = async () => {
    try {
      setLoading(true);

      await Promise.all([
        fetchReceivedLikes(),
        fetchSentLikes(),
      ]);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLikes();
  }, []);


  const handleAccept = async (like) => {
    try {
      setActionLoading(like._id);

      const userId = like.fromUser?._id;

      if (!userId) {
        console.error("fromUser ID not found");
        return;
      }

      // Accept means:
      // I like this person back
      await swipeUser({
        toUser: userId,
        action: "like",
      });

      

      setReceivedLikes((prev) =>
        prev.filter(
          (item) => item._id !== like._id
        )
      );


      await fetchSentLikes();

    } catch (error) {
      console.error(
        "Accept like error:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };


  const handleReject = async (like) => {
    try {
      setActionLoading(like._id);

      const userId = like.fromUser?._id;

      if (!userId) {
        console.error("fromUser ID not found");
        return;
      }


      await swipeUser({
        toUser: userId,
        action: "reject",
      });

      // Remove from UI
      setReceivedLikes((prev) =>
        prev.filter(
          (item) => item._id !== like._id
        )
      );

    } catch (error) {
      console.error(
        "Reject like error:",
        error
      );
    } finally {
      setActionLoading(null);
    }
  };


  if (loading) {
    return (
      <div className="likes-page">
        <div className="likes-loading">
          Loading likes...
        </div>
      </div>
    );
  }


  const getReceivedUser = (like) => {
    return like.fromUser;
  };

  const getSentUser = (like) => {
    return like.toUser;
  };

  const getImage = (user) => {
    if (user?.photos?.[0]) {
      return `${SERVER_URL}${user.photos[0]}`;
    }

    return "/default-profile.png";
  };

  return (
    <div className="likes-page">


      <div className="likes-header">

        <h1>Likes</h1>

        <p>
          See who is interested in you
        </p>

      </div>



      <div className="likes-tabs">

        <button
          className={
            activeTab === "received"
              ? "likes-tab active"
              : "likes-tab"
          }
          onClick={() =>
            setActiveTab("received")
          }
        >
          Received Likes

          {receivedLikes.length > 0 && (
            <span className="likes-count">
              {receivedLikes.length}
            </span>
          )}

        </button>


        <button
          className={
            activeTab === "sent"
              ? "likes-tab active"
              : "likes-tab"
          }
          onClick={() =>
            setActiveTab("sent")
          }
        >
          Sent Likes

          {sentLikeList.length > 0 && (
            <span className="likes-count">
              {sentLikeList.length}
            </span>
          )}

        </button>

      </div>


      {activeTab === "received" && (

        <section className="likes-content">

          {receivedLikes.length === 0 ? (

            <div className="empty-likes">

              <div className="empty-icon">
                ♡
              </div>

              <h3>
                No received likes
              </h3>

              <p>
                When someone likes you,
                they will appear here.
              </p>

            </div>

          ) : (

            <div className="horizontal-likes">

              {receivedLikes.map((like) => {

                const user =
                  getReceivedUser(like);

                return (

                  <div
                    className="like-card"
                    key={like._id}
                  >


                    <img
                      src={getImage(user)}
                      alt={user?.name || "Profile"}
                      className="like-avatar"
                    />



                    <div className="like-user-info">

                      <h3>
                        {user?.name || "Unknown"}
                      </h3>

                      {user?.age && (
                        <span>
                          {user.age} years old
                        </span>
                      )}

                      {user?.bio && (
                        <p>
                          {user.bio}
                        </p>
                      )}

                    </div>



                    <div className="like-actions">

                      <button
                        className="accept-button"
                        disabled={
                          actionLoading === like._id
                        }
                        onClick={() =>
                          handleAccept(like)
                        }
                      >
                        {actionLoading === like._id
                          ? "..."
                          : "Accept"}
                      </button>


                      <button
                        className="reject-button"
                        disabled={
                          actionLoading === like._id
                        }
                        onClick={() =>
                          handleReject(like)
                        }
                      >
                        Reject
                      </button>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      )}

      {activeTab === "sent" && (

        <section className="likes-content">

          {sentLikeList.length === 0 ? (

            <div className="empty-likes">

              <div className="empty-icon">
                ♡
              </div>

              <h3>
                No sent likes
              </h3>

              <p>
                People you like will appear here.
              </p>

            </div>

          ) : (

            <div className="horizontal-likes">

              {sentLikeList.map((like) => {

                const user =
                  getSentUser(like);

                return (

                  <div
                    className="like-card"
                    key={like._id}
                  >


                    <img
                      src={getImage(user)}
                      alt={user?.name || "Profile"}
                      className="like-avatar"
                    />



                    <div className="like-user-info">

                      <h3>
                        {user?.name || "Unknown"}
                      </h3>

                      {user?.age && (
                        <span>
                          {user.age} years old
                        </span>
                      )}

                      {user?.bio && (
                        <p>
                          {user.bio}
                        </p>
                      )}

                    </div>



                    <div className="sent-status">
                      <span>
                        ♥
                      </span>

                      Liked by you
                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      )}

    </div>
  );
};

export default Likes;