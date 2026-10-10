import { useRef, useState } from "react";
import "./ChatInput.css";

function ChatInput({ onSend }) {
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const isPDF =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      setFile(null);
      setUploadStatus({
        type: "error",
        text: "Please select a PDF file.",
      });
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
    setUploadStatus(null);
  };

  const handleUpload = async () => {
    if (!file || uploading) return;

    const formData = new FormData();
    formData.append("document", file);

    setUploading(true);
    setUploadStatus({
      type: "info",
      text: "Processing your PDF...",
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/documents/upload",
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload PDF.");
      }

      setUploadStatus({
        type: "success",
        text: `Processed ${data.filename} successfully (${data.chunksCreated} chunks).`,
      });

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      setUploadStatus({
        type: "error",
        text: error.message || "Something went wrong.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!input.trim()) return;

    onSend(input.trim());
    setInput("");
  };

  return (
    <div className="composer">
      {file && (
        <div className="selected-file">
          <div className="file-details">
            <span className="file-icon">PDF</span>

            <div className="file-info">
              <span className="file-name" title={file.name}>
                {file.name}
              </span>
              <span className="file-label">Ready to upload</span>
            </div>
          </div>

          <div className="file-actions">
            <button
              type="button"
              className="upload-file-button"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Processing..." : "Upload"}
            </button>

            <button
              type="button"
              className="remove-file-button"
              onClick={() => {
                setFile(null);
                setUploadStatus(null);

                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              disabled={uploading}
              aria-label="Remove selected file"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {uploadStatus && (
        <p className={`upload-status ${uploadStatus.type}`} role="status">
          {uploadStatus.text}
        </p>
      )}

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          ref={fileInputRef}
          className="file-input-hidden"
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleFileChange}
          aria-label="Choose a PDF document"
        />

        <button
          type="button"
          className="attach-button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          aria-label="Attach a PDF"
          title="Attach PDF"
        >
          +
        </button>

        <input
          className="message-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask anything about your documents..."
          aria-label="Write your message"
        />

        <button type="submit" className="send-button" disabled={!input.trim()}>
          <span>Send</span>
          <span aria-hidden="true">↑</span>
        </button>
      </form>

      <p className="composer-hint">
        Attach a PDF to add its content to your knowledge base.
      </p>
    </div>
  );
}

export default ChatInput;
