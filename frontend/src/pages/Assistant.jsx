import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Bot, Send, User, Sparkles, Map, Utensils, Languages, 
  MapPin, Hotel, Camera, Shield, Clock, ThumbsUp, ThumbsDown,
  Mic, MicOff, Volume2, Loader2, ChevronRight, RotateCcw,
  MessageSquare, Image as ImageIcon, X
} from 'lucide-react';
import { aiAPI, tripAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import TranslationTab from '../components/TranslationTab';
import MarkdownRenderer from '../components/MarkdownRenderer';

const QUICK_PROMPTS = [
  { icon: Utensils, label: 'Best restaurants nearby', prompt: 'What are the best local restaurants near me? I want authentic food, not tourist traps.' },
  { icon: Languages, label: 'Useful phrases', prompt: 'Teach me 5 essential phrases in the local language with pronunciation.' },
  { icon: Map, label: 'Hidden gems', prompt: 'What are some hidden gems and off-the-beaten-path places to visit?' },
  { icon: Camera, label: 'Photo spots', prompt: 'Where are the best spots for photography and Instagram-worthy photos?' },
  { icon: Shield, label: 'Safety tips', prompt: 'What safety tips should I know about this area? Any scams to avoid?' },
  { icon: MapPin, label: 'Transport help', prompt: 'What\'s the best way to get around the city? Public transport tips?' },
];

export default function Assistant() {
  const { tripId: urlTripId } = useParams();
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tripId, setTripId] = useState(urlTripId || null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' or 'translate'
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
  }, [urlTripId]);

  const loadTrip = async () => {
    try {
      if (urlTripId) {
        const res = await tripAPI.getTrip(urlTripId);
        if (res.data.success && res.data.data) {
          setTripId(res.data.data.id);
          setCurrentTrip(res.data.data);
          
          // Load chat history
          await loadChatHistory(res.data.data.id);
        }
      }
    } catch (e) {
      console.error('Failed to load trip');
    }
  };

  const loadChatHistory = async (tripIdToLoad) => {
    try {
      const res = await aiAPI.getChatHistory(tripIdToLoad);
      if (res.data.success && res.data.data && res.data.data.length > 0) {
        const historicalMessages = res.data.data.flatMap((msg, idx) => {
          const msgs = [];
          if (msg.user) {
            msgs.push({
              id: `hist-user-${idx}`,
              type: 'user',
              text: msg.user,
              time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
          if (msg.ai) {
            msgs.push({
              id: `hist-ai-${idx}`,
              type: 'ai',
              text: msg.ai,
              time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            });
          }
          return msgs;
        });
        
        if (historicalMessages.length > 0) {
          setMessages([
            {
              id: 0,
              type: 'ai',
              text: "Welcome back! 👋 Here's our previous conversation. Feel free to continue asking questions!",
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            },
            ...historicalMessages
          ]);
        }
      }
    } catch (e) {
      console.error('Failed to load chat history');
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
      const response = await aiAPI.chat(tripId || 1, { message: messageText });
      
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
    
    // Also clear on backend if we have a tripId
    if (tripId) {
      aiAPI.clearChatHistory(tripId).catch(console.error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] md:h-[calc(100vh-140px)] flex flex-col bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
      
      {/* HEADER */}
      <header className="flex-none bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-coral-500/25">
                <Bot size={24} />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">AI Travel Assistant</h2>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-sm text-gray-500">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Online
                </span>
                {currentTrip && (
                  <>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-coral-500 font-medium">{currentTrip.destination}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={clearChat}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Clear chat"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'chat'
                ? 'bg-coral-500 text-white shadow-lg shadow-coral-500/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <MessageSquare size={16} />
            Chat
          </button>
          <button
            onClick={() => setActiveTab('translate')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'translate'
                ? 'bg-coral-500 text-white shadow-lg shadow-coral-500/25'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Languages size={16} />
            Photo Translate
          </button>
        </div>
      </header>

      {/* TRANSLATION TAB */}
      {activeTab === 'translate' ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <TranslationTab onClose={() => setActiveTab('chat')} />
        </div>
      ) : (
        <>
          {/* MESSAGES */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Date Divider */}
            <div className="flex justify-center">
              <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full">
                Today
              </span>
            </div>

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} userName={user?.name} />
        ))}

        {/* Typing Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-coral-400 to-coral-600 flex items-center justify-center text-white shrink-0">
              <Bot size={18} />
            </div>
            <div className="px-5 py-4 rounded-2xl rounded-tl-none bg-white border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                  <span className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                  <span className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                </div>
                <span className="text-sm text-gray-500">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </main>

      {/* QUICK PROMPTS */}
      {messages.length <= 2 && (
        <div className="flex-none px-4 pb-4">
          <p className="text-sm text-gray-500 mb-3 font-medium">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt.prompt)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-coral-300 hover:text-coral-600 hover:bg-coral-50 transition-all"
              >
                <prompt.icon size={16} />
                {prompt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* INPUT */}
      <div className="flex-none bg-white border-t border-gray-200 p-4">
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
              className="w-full px-5 py-4 pr-12 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent resize-none text-gray-700 placeholder-gray-400 transition-all"
              style={{ minHeight: '56px', maxHeight: '120px' }}
            />
          </div>
          <button 
            onClick={() => handleSend()}
            disabled={isLoading || !inputText.trim()}
            className="p-4 bg-gradient-to-r from-coral-500 to-coral-600 text-white rounded-2xl hover:from-coral-600 hover:to-coral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-coral-500/25"
          >
            {isLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : (
              <Send size={22} />
            )}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
      </>
      )}
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
          ? 'bg-gray-700 text-white' 
          : 'bg-gradient-to-br from-coral-400 to-coral-600 text-white shadow-lg shadow-coral-500/25'
      }`}>
        {isUser ? <User size={18} /> : <Bot size={18} />}
      </div>

      {/* Content */}
      <div className={`flex flex-col gap-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <span className="text-xs text-gray-400 px-1">
          {isUser ? (userName || 'You') : 'AI Assistant'}
        </span>
        <div className={`px-5 py-4 rounded-2xl text-sm leading-relaxed ${
          isUser 
            ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-tr-none' 
            : message.isError
              ? 'bg-red-50 text-red-700 border border-red-100 rounded-tl-none'
              : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.text}</div>
          ) : (
            <MarkdownRenderer content={message.text} />
          )}
        </div>
        <span className="text-[10px] text-slate-400 px-1">{message.time}</span>
      </div>
    </div>
  );
}
