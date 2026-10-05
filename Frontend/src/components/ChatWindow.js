import { useState } from "react";

import Message from "./Message";
import ChatInput from "./ChatInput";

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (message) => {
    const userMessage = {
      id: Date.now(),
      sender: "User",
      message: message,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const aiMessage = {
        id: Date.now() + 1,
        sender: "AI",
        message: data.reply,
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error("Chat Error:", error);

      const errorMessage = {
        id: Date.now() + 1,
        sender: "AI",
        message: "Sorry, something went wrong. Please try again.",
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div>
          <h1>Chat bot</h1>
          <span>● Online</span>
        </div>
      </header>

      <main className="messages-container">
        {messages.length === 0 && (
          <div className="welcome-message">
            <img
              src="/Image/chatbot photo.jpg"
              alt="Chatbot"
              className="welcome-image"
            />
            <h2>Hello! How can I help you?</h2>
            <p>What do you think, Today!</p>
          </div>
        )}

        {messages.map((msg) => (
          <Message key={msg.id} sender={msg.sender} message={msg.message} />
        ))}

        {isLoading && (
          <div className="message-row ai-row">
            <div className="message ai-message">
              <span className="message-sender">AI</span>
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </main>

      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default ChatWindow;
