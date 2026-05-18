import { useState, useRef, useEffect } from "react";

function App() {

  const [input, setInput] = useState("");

  const [chat, setChat] = useState([]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chat]);

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

      setChat([
        ...updatedChat,
        aiMessage,
      ]);

    } catch (error) {

      console.error(error);

      setChat([
        ...updatedChat,
        {
          sender: "HopeAI",
          text: "Error connecting to backend",
        },
      ]);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#111",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >

      <h1>HopeAI</h1>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "20px",
          paddingRight: "10px",
        }}
      >

        {chat.map((message, index) => (
          <div
            key={index}
            style={{
              marginBottom: "15px",
              lineHeight: "1.5",
            }}
          >
            <strong>{message.sender}: </strong>
            {message.text}
          </div>
        ))}

        <div ref={messagesEndRef} />

      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
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
          placeholder="Ask HopeAI..."
          style={{
            flex: 1,
            padding: "12px",
            borderRadius: "8px",
            border: "none",
            outline: "none",
            fontSize: "16px",
          }}
        />

        <button
          onClick={sendMessage}
          style={{
            padding: "12px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          Send
        </button>

      </div>

    </div>
  );
}

export default App;