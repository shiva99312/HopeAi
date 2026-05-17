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

    const userMessage = {
      sender: "You",
      text: input,
    };

    const updatedChat = [...chat, userMessage];

    setChat(updatedChat);

    setInput("");

    const response = await fetch("http://127.0.0.1:8000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
      }),
    });

    const reader = response.body.getReader();

    const decoder = new TextDecoder("utf-8");

    let aiText = "";

    setChat([
      ...updatedChat,
      {
        sender: "HopeAI",
        text: "",
      },
    ]);

    while (true) {

      const { done, value } = await reader.read();

      if (done) break;

      const chunk = decoder.decode(value);

      aiText += chunk;

      setChat([
        ...updatedChat,
        {
          sender: "HopeAI",
          text: aiText,
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