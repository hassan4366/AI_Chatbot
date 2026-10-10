import { useState } from "react";

function DocumentUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    setLoading(true);
    setMessage("");
    setError("");

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

      setMessage(
        `Successfully processed ${data.filename}. Created ${data.chunksCreated} chunks.`,
      );

      setFile(null);
      event.target.reset();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="document-upload">
      <form onSubmit={handleUpload}>
        <label htmlFor="pdf-file">Upload a PDF document</label>

        <input
          id="pdf-file"
          type="file"
          accept="application/pdf,.pdf"
          onChange={(event) => {
            setFile(event.target.files[0] || null);
            setMessage("");
            setError("");
          }}
        />

        <button type="submit" disabled={loading || !file}>
          {loading ? "Processing PDF..." : "Upload PDF"}
        </button>
      </form>

      {message && <p className="upload-success">{message}</p>}
      {error && <p className="upload-error">{error}</p>}
    </div>
  );
}

export default DocumentUpload;
