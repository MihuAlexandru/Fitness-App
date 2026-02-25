import { useState, useEffect } from "react";
import "./Messages.css";

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = () => {
      try {
        const savedMessages = JSON.parse(
          localStorage.getItem("messages") || "[]",
        );
        setMessages(savedMessages.reverse());
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  const deleteMessage = (id) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    const reversedMessages = updatedMessages.reverse();
    localStorage.setItem("messages", JSON.stringify(reversedMessages));
    setMessages(updatedMessages);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1 className="page-title">Messages</h1>
        <p>Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="page-container messages-page">
      <h1 className="page-title">Contact Messages</h1>

      {messages.length === 0 ? (
        <p className="messages__empty">No messages yet.</p>
      ) : (
        <div className="messages__list">
          {messages.map((msg) => (
            <div key={msg.id} className="messages__card">
              <div className="messages__header">
                <div className="messages__info">
                  <h3 className="messages__name">{msg.name}</h3>
                  <p className="messages__email">{msg.email}</p>
                </div>
                <p className="messages__timestamp">
                  {new Date(msg.timestamp).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <p className="messages__content">{msg.message}</p>
              <div className="messages__footer">
                <button
                  className="btn btn-danger messages__delete"
                  onClick={() => deleteMessage(msg.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
