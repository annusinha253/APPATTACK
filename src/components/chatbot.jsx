import React, { useState, useRef } from "react";

const systemPrompt = `You are a helpful assistant. You can answer any question the user asks, with a focus on food, recipes, health, and ingredient alternatives, but you can also answer general questions. Be friendly, clear, and concise.`;

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! Ask me anything—about food, recipes, health, or anything else!" }
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const handleSend = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            ...newMessages.map(m => ({ role: m.role, content: m.content }))
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });
      const data = await response.json();
      const botReply = data.choices?.[0]?.message?.content || "Sorry, I couldn't process that.";
      setMessages([...newMessages, { role: "assistant", content: botReply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, there was an error connecting to the AI. Please check your internet connection or API key." }]);
    }
    setLoading(false);
    setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        className="chatbot-fab"
        onClick={() => setOpen(o => !o)}
        aria-label="Open chatbot"
      >
        💬
      </button>

      {/* Chatbot Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <span>BHUKKAR Chatbot</span>
            <button className="chatbot-close" onClick={() => setOpen(false)} aria-label="Close chatbot">✕</button>
          </div>
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-msg chatbot-msg-${msg.role}`}>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="chatbot-msg chatbot-msg-assistant chatbot-loading">
                <span className="dot">.</span><span className="dot">.</span><span className="dot">.</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="chatbot-input-row">
            <textarea
              className="chatbot-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={2}
              disabled={loading}
            />
            <button className="chatbot-send" onClick={handleSend} disabled={loading || !input.trim()}>
              {loading ? <span className="spinner"></span> : "Send"}
            </button>
          </div>
        </div>
      )}

      {/* Chatbot Styles - brown/cream/white palette */}
      <style>{`
        .chatbot-fab {
          position: fixed;
          bottom: 32px;
          right: 32px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #b48a5a 0%, #7c4a03 100%);
          color: #fffbe9;
          font-size: 2rem;
          border: none;
          box-shadow: 0 4px 24px #b48a5a44;
          cursor: pointer;
          z-index: 1001;
          transition: background 0.2s;
        }
        .chatbot-fab:hover {
          background: linear-gradient(135deg, #7c4a03 0%, #b48a5a 100%);
        }
        .chatbot-window {
          position: fixed;
          bottom: 110px;
          right: 32px;
          width: 350px;
          max-width: 95vw;
          height: 480px;
          background: #fffbe9;
          border-radius: 18px;
          box-shadow: 0 8px 32px #b48a5a33;
          display: flex;
          flex-direction: column;
          z-index: 1002;
          overflow: hidden;
          border: 2px solid #b48a5a;
        }
        .chatbot-header {
          background: linear-gradient(90deg, #b48a5a 0%, #7c4a03 100%);
          color: #fffbe9;
          padding: 16px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .chatbot-close {
          background: none;
          border: none;
          color: #fffbe9;
          font-size: 1.2rem;
          cursor: pointer;
        }
        .chatbot-messages {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          background: #fdf6ee;
        }
        .chatbot-msg {
          margin-bottom: 12px;
          padding: 10px 14px;
          border-radius: 12px;
          max-width: 90%;
          word-break: break-word;
          font-size: 1rem;
        }
        .chatbot-msg-user {
          background: #e7d7c1;
          align-self: flex-end;
          margin-left: auto;
          color: #7c4a03;
        }
        .chatbot-msg-assistant {
          background: #fff;
          border: 1.5px solid #b48a5a;
          align-self: flex-start;
          margin-right: auto;
          color: #7c4a03;
        }
        .chatbot-loading {
          font-size: 2rem;
          color: #b48a5a;
          background: none;
          border: none;
          box-shadow: none;
        }
        .chatbot-input-row {
          display: flex;
          padding: 12px;
          background: #f5e7d4;
          border-top: 1.5px solid #b48a5a;
        }
        .chatbot-input {
          flex: 1;
          border-radius: 8px;
          border: 1.5px solid #b48a5a;
          padding: 8px 12px;
          font-size: 1rem;
          resize: none;
          color: #7c4a03;
          background: #fffbe9;
        }
        .chatbot-send {
          margin-left: 8px;
          background: #b48a5a;
          color: #fffbe9;
          border: none;
          border-radius: 8px;
          padding: 0 18px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .chatbot-send:disabled {
          background: #e7d7c1;
          color: #b48a5a;
          cursor: not-allowed;
        }
        .spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 3px solid #b48a5a;
          border-top: 3px solid #fffbe9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .dot {
          animation: blink 1.4s infinite both;
          font-size: 2rem;
        }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
        @media (max-width: 500px) {
          .chatbot-window {
            right: 8px;
            width: 98vw;
            height: 70vh;
            bottom: 80px;
          }
          .chatbot-fab {
            right: 8px;
            bottom: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default Chatbot;
