import ChatWindow from "./components/ChatWindow";

import "./App.css";

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">R</div>
          <span>RAG Chat</span>
        </div>

        <button
          className="new-chat-button"
          onClick={() => window.location.reload()}
        >
          <span>＋</span> New chat
        </button>

        <div className="sidebar-section">
          <p className="sidebar-label">WORKSPACE</p>

          <div className="sidebar-item active">
            <span>◈</span> AI Assistant
          </div>

          <div className="sidebar-item">
            <span>▤</span> Your documents
          </div>
        </div>

        <div className="sidebar-bottom">
          <div className="status-dot" />
          <span>Local RAG Engine</span>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <h2>AI Assistant</h2>
            <p>Chat with your documents</p>
          </div>

          <div className="topbar-status">
            <span className="status-dot" />
            RAG Ready
          </div>
        </header>

        <div className="workspace">
          <ChatWindow />
        </div>
      </main>
    </div>
  );
}

export default App;