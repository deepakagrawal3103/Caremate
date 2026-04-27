import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import api from "../services/api";
import Button from "../components/Button";
import Loader from "../components/Loader";

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm Sanjeevani AI assistant. I can answer your medicine-related questions based on your health profile. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    try {
      const { data } = await api.post("/chat", { question: input });
      const botMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: data.answer,
        timestamp: new Date(),
        risk: data.riskLevel,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
      const errorMessage = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I'm having trouble connecting. Please check your internet and try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const suggestedQuestions = [
    "Can I take paracetamol with my current medicines?",
    "What are the side effects of warfarin?",
    "Is it safe to take ibuprofen?",
    "Should I avoid any food with my medicines?",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-primary selection:text-white">
      {/* Header - Improved for mobile */}
      <div className="bg-background px-4 md:px-8 py-4 md:py-6 sticky top-0 z-10 flex items-center gap-3 md:gap-4 border-b border-border/50">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-white border border-border text-gray-900 flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
        >
          <span className="font-bold text-lg md:text-xl leading-none">←</span>
        </button>
        <div>
          <h1 className="text-xl md:text-3xl font-sans text-gray-900 font-bold tracking-tight">Interaction Analysis</h1>
          <p className="text-xs md:text-base font-medium text-secondary mt-0.5">Pharmacological Insights & Safety</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[90%] md:max-w-[70%] rounded-2xl p-4 md:p-5 ${
                  msg.type === "user"
                    ? "bg-primary text-white rounded-br-none shadow-sm"
                    : "bg-white text-gray-900 rounded-bl-none shadow-lg border border-gray-100"
                }`}
              >
                <p className="text-base md:text-lg leading-relaxed font-medium">{msg.content}</p>
                {msg.risk && (
                  <div className={`mt-3 md:mt-4 text-[0.7rem] md:text-base font-bold tracking-widest uppercase px-3 md:px-4 py-1 md:py-1.5 rounded-sm inline-block ${
                    msg.risk === "danger" ? "bg-red-50 text-red-500" : 
                    msg.risk === "warning" ? "bg-[#fff3e0] text-[#d97706]" : "bg-[#e6eff6] text-gray-900"
                  }`}>
                    {msg.risk === "danger" ? "High Risk Detected" : msg.risk === "warning" ? "Caution Required" : "Safe Interaction"}
                  </div>
                )}
                <p className={`text-[0.65rem] md:text-base font-bold mt-2 ${msg.type === "user" ? "text-white/60" : "text-gray-400"}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl p-5 shadow-lg ">
              <Loader fullScreen={false} size="sm" text="" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions - Improved horizontal scroll for mobile */}
      {messages.length <= 2 && (
        <div className="px-4 md:px-8 pb-4">
          <p className="text-[0.7rem] md:text-base font-bold uppercase tracking-widest text-gray-400 mb-3">Suggested Inquiries:</p>
          <div className="flex flex-nowrap md:flex-wrap gap-2 md:gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => setInput(q)}
                className="text-[0.85rem] md:text-base bg-white text-gray-900 font-bold shadow-sm rounded-2xl px-4 py-2 hover:bg-gray-50 border border-border transition-colors whitespace-nowrap md:whitespace-normal"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area - Responsive for mobile */}
      <div className="p-4 md:p-6 bg-white border-t border-[#eaeaeb]">
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-stretch md:items-end max-w-4xl mx-auto w-full">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about interactions..."
            className="flex-1 bg-white border border-border text-gray-900 font-medium rounded-2xl p-4 resize-none focus:outline-none focus:ring-1 focus:ring-primary min-h-[50px] md:min-h-[56px] max-h-32 text-base md:text-lg placeholder:text-gray-400"
            rows={1}
            disabled={loading}
          />
          <Button
            variant="primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-8 h-[50px] md:h-[56px] w-full md:w-auto"
            mobileFullWidth={true}
          >
            Send Inquiry
          </Button>
        </div>
        <p className="text-[0.65rem] md:text-base uppercase font-bold tracking-widest text-gray-400 mt-4 text-center">
          Not a substitute for professional clinical advice.
        </p>
      </div>
    </div>
  );
}