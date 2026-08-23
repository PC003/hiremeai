import React from "react";
import { createRoot } from "react-dom/client";
import { ArrowUp, Bot, BriefcaseBusiness, Loader2, MessageSquareText, Plus, UserRound } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./styles.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? "/api" : "http://localhost:8000");

const starterQuestions = [
  "Tell me about this candidate.",
  "What technical skills does the candidate have?",
  "Summarize their work experience.",
  "Why should we hire this candidate?",
];

function normalizeMarkdown(content) {
  return content.replace(/<br\s*\/?>/gi, "\n");
}

function App() {
  const [messages, setMessages] = React.useState([
    {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Hi, I am HireMeAI. Ask me anything about the candidate's resume and I will answer like the candidate is in an HR interview.",
    },
  ]);
  const [question, setQuestion] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function sendQuestion(nextQuestion = question) {
    const trimmedQuestion = nextQuestion.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmedQuestion,
    };

    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      if (!response.ok) {
        throw new Error("The backend could not answer right now.");
      }

      const data = await response.json();
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.answer || "I don't have enough information to answer that.",
        },
      ]);
    } catch (error) {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "I could not reach the HireMeAI backend. Please make sure FastAPI is running on http://localhost:8000.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendQuestion();
  }

  function startNewChat() {
    setMessages([
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "New chat started. What would you like to know about the candidate?",
      },
    ]);
    setQuestion("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="new-chat-button" type="button" onClick={startNewChat}>
          <Plus size={18} />
          New chat
        </button>

        <div className="candidate-panel">
          <div className="candidate-icon">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <p className="candidate-label">HireMeAI</p>
            <h1>Candidate Interview Assistant</h1>
          </div>
        </div>

        <nav className="sidebar-links" aria-label="Example questions">
          {starterQuestions.map((starterQuestion) => (
            <button
              key={starterQuestion}
              type="button"
              onClick={() => sendQuestion(starterQuestion)}
              disabled={isLoading}
            >
              <MessageSquareText size={16} />
              <span>{starterQuestion}</span>
            </button>
          ))}
        </nav>
      </aside>

      <section className="chat-area" aria-label="HireMeAI chat">
        <header className="chat-header">
          <div className="brand-mark">
            <Bot size={22} />
          </div>
          <div>
            <p>HireMeAI</p>
            <span>Ask resume-based HR questions</span>
          </div>
        </header>

        <div className="messages">
          {messages.map((message) => (
            <article className={`message-row ${message.role}`} key={message.id}>
              <div className="avatar" aria-hidden="true">
                {message.role === "assistant" ? <Bot size={19} /> : <UserRound size={19} />}
              </div>
              <div className="message-bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {normalizeMarkdown(message.content)}
                </ReactMarkdown>
              </div>
            </article>
          ))}

          {isLoading && (
            <article className="message-row assistant">
              <div className="avatar" aria-hidden="true">
                <Bot size={19} />
              </div>
              <div className="message-bubble loading">
                <Loader2 size={18} />
                <p>Reading the resume and preparing an answer...</p>
              </div>
            </article>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="composer" onSubmit={handleSubmit}>
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendQuestion();
              }
            }}
            placeholder="Ask anything about the candidate..."
            rows="1"
          />
          <button
            className={isLoading ? "is-loading" : ""}
            type="submit"
            disabled={!question.trim() || isLoading}
            aria-label="Send message"
          >
            {isLoading ? <Loader2 size={19} /> : <ArrowUp size={20} />}
          </button>
        </form>
      </section>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
