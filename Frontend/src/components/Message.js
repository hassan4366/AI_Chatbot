import ReactMarkdown from "react-markdown";
import "./message.css";

function Message({ message, sender }) {
  const isUser = sender === "User";

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className={`message ${isUser ? "user-message" : "ai-message"}`}>
        <div className="message-content">
          {isUser ? (
            <p>{message}</p>
          ) : (
            <ReactMarkdown>{message || ""}</ReactMarkdown>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;
