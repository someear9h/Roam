import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, User, Sparkles, Map, Utensils, Languages, 
  Plane, Hotel, Camera, Shield, Clock, ThumbsUp, ThumbsDown,
  Mic, MicOff, Volume2, Loader2, ChevronRight, RotateCcw
} from 'lucide-react';
import { aiAPI, tripAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const QUICK_PROMPTS = [
  { icon: Utensils, label: 'Best restaurants nearby', prompt: 'What are the best local restaurants near me? I want authentic food, not tourist traps.' },
  { icon: Languages, label: 'Useful phrases', prompt: 'Teach me 5 essential phrases in the local language with pronunciation.' },
  { icon: Map, label: 'Hidden gems', prompt: 'What are some hidden gems and off-the-beaten-path places to visit?' },
  { icon: Camera, label: 'Photo spots', prompt: 'Where are the best spots for photography and Instagram-worthy photos?' },
  { icon: Shield, label: 'Safety tips', prompt: 'What safety tips should I know about this area? Any scams to avoid?' },
  { icon: Plane, label: 'Transport help', prompt: 'What\'s the best way to get around the city? Public transport tips?' },
];

export default function Assistant() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tripId, setTripId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! 👋 I'm your AI travel assistant. I'm here to help you with anything during your trip—restaurants, directions, translations, local tips, safety info, and more. What can I help you with today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    loadTrip();
  }, []);

  const loadTrip = async () => {
    try {
      const res = await tripAPI.getTrips();
      if (res.data.success && res.data.data.length > 0) {
        setTripId(res.data.data[0].id);
        setCurrentTrip(res.data.data[0]);
      }
    } catch (e) {
      console.error('Failed to load trip');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (customMessage = null) => {
    const messageText = customMessage || inputText.trim();
    if (!messageText) return;

    const newUserMsg = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await aiAPI.chat({ tripId: tripId || 1, message: messageText });
      
      if (response.data.success) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          text: response.data.data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      type: 'ai',
      text: "Chat cleared! How can I help you with your trip?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
      
      {/* HEADER */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-500/25">
              <Bot size={24} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">AI Travel Assistant</h2>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Online
              </span>
              {currentTrip && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-sm text-teal-600 font-medium">{currentTrip.destination}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Clear chat"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} userName={user?.name} />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white shrink-0">
              <Bot size={18} />
            </div>
            <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
                <span className="text-sm text-slate-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* QUICK PROMPTS */}
      {messages.length <= 2 && (
        <div className="flex-none px-4 pb-4">
          <p className="text-sm text-slate-500 mb-3 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-teal-300 hover:text-teal-600 hover:bg-teal-50 transition-all"
              >
                <prompt.icon size={16} />
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="flex-none bg-white border-t border-slate-200 p-4">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask me anything about your trip..."
              rows={1}
              className="w-full px-5 py-4 pr-12 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none text-slate-700 placeholder-slate-400 transition-all"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-500/25"
          >
            {isLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}

function MessageBubble({ message, userName }) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
        isUser 
          ? 'bg-slate-700 text-white' 
          : 'bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/25'
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-slate-400 px-1">
          {isUser ? (userName || 'You') : 'AI Assistant'}
        </span>
        <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed ${
          isUser 
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-tr-none' 
            : message.isError
              ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none'
              : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
        }`}>
          <div className="whitespace-pre-wrap">{message.text}</div>
        </div>
        <span className="text-[10px] text-slate-400 px-1">{message.time}</span>
      </div>
    </div>
  );
}
