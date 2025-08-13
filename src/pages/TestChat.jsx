import React, { useState } from "react";
import axios from "../axios";

export default function TestChat() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    try {
      const res = await axios.post("/chat/", {
        name,
        email,
        message
      });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error(err);
      setResponse("Error sending message");
    }
  };

  const inputStyle = {
    width: "100%",
    marginBottom: "10px",
    padding: "10px",
    color: "#000", // 🖤 Black text while typing
    border: "1px solid #ccc",
    borderRadius: "5px"
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "50px auto" }}>
      {/* margin: 50px auto => form neeche shift */}
      <h2>Chatbot API Test</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={inputStyle}
      />

      {/* Bada message box */}
      <textarea
        placeholder="Enter your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5} // height increase
        style={inputStyle}
      />

      <button
        onClick={sendMessage}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "#ff6600",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Send Message
      </button>

      {response && (
        <pre
          style={{
            background: "#f4f4f4",
            padding: "10px",
            marginTop: "20px",
            color: "#000"
          }}
        >
          {response}
        </pre>
      )}
    </div>
  );
}
