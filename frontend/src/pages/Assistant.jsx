import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, PlusCircle, LifeBuoy, Plane, Navigation, 
  Hotel, Luggage, User, MoreHorizontal, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Assistant() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [tripId, setTripId] = useState(1); // Assume user's first trip

  // --- INITIAL CHAT HISTORY ---
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm your Roam travel assistant. How can I help you with your trip today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Sending Message
  const handleSend = async () => {
    if (!inputText.trim()) return;

    // 1. Add User Message
    const newUserMsg = {
      id: Date.now(),
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    const userMessage = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      // 2. Send to AI API
      const response = await aiAPI.chat({ tripId, message: userMessage });
      
      if (response.data.success) {
        setIsLoading(false);
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          type: 'ai',
          text: response.data.data.response,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      setIsLoading(false);
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        type: 'ai',
        text: "Sorry, I encountered an error processing your message. Please try again.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-[calc(100vh-100px)] bg-slate-50">
      
      {/* --- 1. CHAT HEADER --- */}
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-brand-primary/10 rounded-full flex items-center justify-center text-brand-primary">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800 leading-tight">Live Travel Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-500">Online</span>
            </div>
          </div>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-bold">
          <LifeBuoy size={18} />
          <span className="hidden sm:inline">Escalate to Human</span>
        </button>
      </header>

      {/* --- 2. MESSAGE AREA --- */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Date Divider */}
        <div className="flex justify-center">
          <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-end gap-3 ${msg.type === 'user' ? 'justify-end' : ''}`}>
            
            {/* AI Avatar */}
            {msg.type === 'ai' && (
              <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 border border-brand-primary/20">
                <Bot size={16} />
              </div>
            )}

            {/* Bubble */}
            <div className={`flex flex-col gap-1 max-w-[85%] ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <span className="text-xs text-slate-400 ml-1">
                {msg.type === 'ai' ? 'TBO Assistant' : 'You'}
              </span>
              <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.type === 'user' 
                  ? 'bg-brand-primary text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
              <span className="text-[10px] text-slate-400 opacity-70 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 border border-brand-primary/20">
              <Bot size={16} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white border border-slate-100 shadow-sm flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        
        {/* Invisible div to scroll to */}
        <div ref={messagesEndRef} />
      </main>

      {/* --- 3. FOOTER & INPUT --- */}
      <footer className="flex-none bg-white border-t border-slate-200 p-4 pb-24 md:pb-6">
        <div className="max-w-3xl mx-auto space-y-3">
          
          {/* Quick Action Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
             <QuickChip active icon={Plane} label="Flight Delay" />
             <QuickChip icon={Navigation} label="Navigation Help" />
             <QuickChip icon={Hotel} label="Hotel Issue" />
             <QuickChip icon={Luggage} label="Baggage Claim" />
          </div>

          {/* Input Bar */}
          <div className="relative flex items-center">
            <button className="absolute left-3 text-slate-400 hover:text-brand-primary transition-colors">
              <PlusCircle size={24} />
            </button>
            
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type your message..." 
              className="w-full h-14 pl-12 pr-14 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary transition-all shadow-sm text-slate-800 placeholder-slate-400"
            />
            
            <button 
              onClick={handleSend}
              className="absolute right-2 w-10 h-10 bg-brand-primary text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputText.trim() || isLoading}
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>

          <p className="text-center text-xs text-slate-400">
            TBO Assistant can make mistakes. Please check important travel info.
          </p>
        </div>
      </footer>
    </div>
  );
}

// --- SUB-COMPONENT ---
function QuickChip({ icon: Icon, label, active }) {
  return (
    <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap border ${
      active 
        ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' 
        : 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100'
    }`}>
      <Icon size={16} />
      {label}
    </button>
  );
}