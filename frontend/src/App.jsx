import { useState, useRef, useEffect } from "react";

function App() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userInput = input;

    const userMessage = {
      sender: "You",
      text: userInput,
    };

    const updatedChat = [...chat, userMessage];

    setChat(updatedChat);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://hopeai-y1zh.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userInput,
        }),
      });

      const data = await response.json();

      const aiMessage = {
        sender: "HopeAI",
        text: data.response,
      };

      setChat([...updatedChat, aiMessage]);
    } catch (error) {
      console.error(error);

      setChat([
        ...updatedChat,
        {
          sender: "HopeAI",
          text: "Unable to connect to HopeAI backend.",
        },
      ]);
    }

    setLoading(false);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
      setUploadedFile(file);

      setChat((prev) => [
        ...prev,
        {
          sender: "System",
          text: `Uploaded file: ${file.name}`,
        },
      ]);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #111827 50%, #1e1b4b 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        boxSizing: "border-box",
        overflow: "hidden",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Ambient Glow */}
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "#3b82f6",
          filter: "blur(150px)",
          opacity: 0.15,
          top: "-100px",
          left: "-100px",
          borderRadius: "50%",
          animation: "pulse 6s infinite",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: "300px",
          height: "300px",
          background: "#8b5cf6",
          filter: "blur(120px)",
          opacity: 0.15,
          bottom: "-50px",
          right: "-50px",
          borderRadius: "50%",
        }}
      />

      {/* Main Container */}
      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          height: "92vh",
          background: "rgba(17, 24, 39, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 0 40px rgba(0,0,0,0.45)",
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "22px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(10px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color: "white",
                fontSize: "30px",
                fontWeight: "700",
                letterSpacing: "0.5px",
              }}
            >
              HopeAI ✨
            </h1>

            <p
              style={{
                marginTop: "6px",
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              Cozy AI companion for your thoughts
            </p>
          </div>

          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              padding: "12px 18px",
              borderRadius: "14px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              cursor: "pointer",
              transition: "0.3s",
              fontSize: "14px",
            }}
          >
            Upload File
          </button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileUpload}
          />
        </div>

        {/* Chat Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "25px",
            display: "flex",
            flexDirection: "column",
            gap: "18px",
          }}
        >
          {chat.length === 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "140px",
                color: "#94a3b8",
              }}
            >
              <h2
                style={{
                  color: "white",
                  marginBottom: "12px",
                  fontSize: "34px",
                }}
              >
                Welcome to HopeAI
              </h2>

              <p style={{ fontSize: "17px" }}>
                Ask questions, upload files, or just talk.
              </p>
            </div>
          )}

          {chat.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.sender === "You" ? "flex-end" : "flex-start",
                animation: "fadeIn 0.4s ease",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "16px 20px",
                  borderRadius: "22px",
                  background:
                    message.sender === "You"
                      ? "linear-gradient(135deg, #2563eb, #4f46e5)"
                      : "rgba(255,255,255,0.06)",
                  color: "white",
                  lineHeight: "1.7",
                  fontSize: "15px",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
                  whiteSpace: "pre-wrap",
                }}
              >
                <div
                  style={{
                    fontSize: "12px",
                    marginBottom: "8px",
                    opacity: 0.7,
                    fontWeight: "600",
                  }}
                >
                  {message.sender}
                </div>

                {message.text}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              <div
                style={{
                  padding: "16px 20px",
                  borderRadius: "20px",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontSize: "15px",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                HopeAI is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Uploaded File Preview */}
        {uploadedFile && (
          <div
            style={{
              padding: "0 20px 10px",
              color: "#cbd5e1",
              fontSize: "13px",
            }}
          >
            Current file: {uploadedFile.name}
          </div>
        )}

        {/* Input Area */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(15,23,42,0.7)",
            backdropFilter: "blur(10px)",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder="Talk to HopeAI..."
            style={{
              flex: 1,
              padding: "16px",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.05)",
              color: "white",
              outline: "none",
              fontSize: "15px",
              backdropFilter: "blur(10px)",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "16px 24px",
              borderRadius: "18px",
              border: "none",
              background: "linear-gradient(135deg, #2563eb, #7c3aed)",
              color: "white",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "15px",
              transition: "0.3s",
              boxShadow: "0 4px 18px rgba(59,130,246,0.35)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;