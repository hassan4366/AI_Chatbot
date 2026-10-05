function Message({ message, sender }) {
  const isUser = sender === "User";

  return (
    <div className={`message-row ${isUser ? "user-row" : "ai-row"}`}>
      <div className={`message ${isUser ? "user-message" : "ai-message"}`}>
        <span className="message-sender">{sender}</span>
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Message;
