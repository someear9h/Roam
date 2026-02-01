import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Coffee, Utensils, AlertTriangle, Navigation, 
  Loader2, Send, Star, Clock, DollarSign, Languages, BookOpen,
  Compass, Heart, Camera, ShoppingBag, Music, TreePine, Landmark,
  Users, ThumbsUp, ExternalLink, ChevronRight, Sparkles, Globe
} from 'lucide-react';
import { aiAPI, tripAPI } from '../services/api';

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'orange' },
  { id: 'attractions', label: 'Attractions', icon: Landmark, color: 'blue' },
  { id: 'culture', label: 'Culture & Customs', icon: BookOpen, color: 'purple' },
  { id: 'phrases', label: 'Local Phrases', icon: Languages, color: 'teal' },
  { id: 'safety', label: 'Safety Tips', icon: AlertTriangle, color: 'red' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, color: 'pink' },
];

const QUICK_QUERIES = [
  { icon: Utensils, label: 'Best local food', query: 'What are the must-try local dishes and where can I find them?' },
  { icon: AlertTriangle, label: 'Tourist scams', query: 'What are common tourist scams I should watch out for?' },
  { icon: Languages, label: 'Essential phrases', query: 'Teach me 10 essential phrases in the local language' },
  { icon: Heart, label: 'Hidden gems', query: 'What are some hidden gems that tourists usually miss?' },
  { icon: DollarSign, label: 'Tipping culture', query: 'What is the tipping culture here? When and how much should I tip?' },
  { icon: Users, label: 'Local customs', query: 'What cultural customs and etiquette should I know about?' },
];

export default function LocalGuide() {
  const [activeCategory, setActiveCategory] = useState('food');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [tripId, setTripId] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null, city: 'your destination' });

  useEffect(() => {
    loadTrip();
    getLocation();
  }, []);

  const loadTrip = async () => {
    try {
      const res = await tripAPI.getTrips();
      if (res.data.success && res.data.data.length > 0) {
        setTripId(res.data.data[0].id);
        setCurrentTrip(res.data.data[0]);
      }
    } catch (e) {}
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
            );
            const data = await response.json();
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              city: data.address?.city || data.address?.town || 'your location'
            });
          } catch (e) {}
        },
        () => {}
      );
    }
  };

  const askLocalGuide = async (customQuery = null) => {
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setAiResponse(null);

    try {
      const response = await aiAPI.localGuide({
        tripId: tripId || 1,
        query: searchQuery,
        location: userLocation
      });

      if (response.data.success) {
        setAiResponse(response.data.data.response);
      }
    } catch (error) {
      console.error('Failed to get local guide response:', error);
      setAiResponse('Unable to get recommendations right now. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category.id);
    const queries = {
      food: 'What are the best local restaurants and authentic cuisine? Give me specific recommendations.',
      attractions: 'What are the top attractions and things to see? Include some lesser-known spots.',
      culture: 'Tell me about the local culture, customs, and etiquette I should know.',
      phrases: 'Teach me essential local phrases with pronunciation. Include greetings, thanks, and common needs.',
      safety: 'What safety tips should I know? Any areas to avoid or scams to watch out for?',
      shopping: 'Where are the best places to shop for local goods and souvenirs? What should I buy?',
    };
    askLocalGuide(queries[category.id]);
  };

  const destination = currentTrip?.destination || 'your destination';

  return (
    <div className="space-y-8 pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <a href="/dashboard" className="hover:text-teal-600">Dashboard</a>
            <ChevronRight size={14} />
            <span className="font-semibold text-slate-800">Local Guide</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900">Local Guide</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <MapPin size={16} className="text-teal-500" />
            {destination}
            {userLocation.lat && (
              <span className="flex items-center gap-1 text-green-600 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                GPS Active
              </span>
            )}
          </p>
        </div>
      </div>

      {/* HERO SEARCH */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-teal-400 mb-4">
            <Sparkles size={20} />
            <span className="font-semibold">AI-Powered Local Insights</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Discover {destination} Like a Local
          </h2>
          <p className="text-slate-300 mb-8">
            Ask anything about local food, customs, hidden gems, safety tips, and more. 
            Get personalized recommendations powered by AI.
          </p>
          
          {/* Search Box */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askLocalGuide()}
                placeholder="Ask anything... e.g., 'Best street food spots?'"
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 placeholder-slate-400"
              />
            </div>
            <button 
              onClick={() => askLocalGuide()}
              disabled={isLoading || !query.trim()}
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl hover:from-teal-600 hover:to-teal-700 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/25"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              <span className="hidden md:inline">Ask</span>
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => {
          const colorClasses = {
            orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
            blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
            purple: 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100',
            teal: 'bg-teal-50 text-teal-600 border-teal-200 hover:bg-teal-100',
            red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
            pink: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
          };
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`p-4 rounded-2xl border-2 transition-all ${
                isActive 
                  ? `${colorClasses[cat.color]} border-current` 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <cat.icon size={24} className="mx-auto mb-2" />
              <p className="text-sm font-semibold">{cat.label}</p>
            </button>
          );
        })}
      </div>

      {/* AI RESPONSE */}
      {aiResponse && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Compass size={24} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Local Guide</h3>
              <p className="text-sm text-teal-100">Personalized recommendations for {destination}</p>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{aiResponse}</p>
            </div>
          </div>
        </div>
      )}

      {/* QUICK QUERIES */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Popular Questions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_QUERIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => askLocalGuide(item.query)}
              className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all text-left group"
            >
              <div className="p-3 bg-teal-50 rounded-xl text-teal-600 group-hover:bg-teal-100 transition-colors">
                <item.icon size={22} />
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors">
                  {item.label}
                </h4>
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.query}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CULTURAL INSIGHTS CARDS */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Essential Knowledge</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <InsightCard 
            title="Language Basics"
            icon={Languages}
            color="teal"
            items={['Hello - Bonjour (bon-ZHOOR)', 'Thank you - Merci (mehr-SEE)', 'Please - S\'il vous plaît', 'Excuse me - Pardon']}
            onAsk={() => askLocalGuide('Teach me essential local phrases with pronunciation')}
          />
          <InsightCard 
            title="Tipping Guide"
            icon={DollarSign}
            color="green"
            items={['Restaurants: 5-10% (service included)', 'Taxis: Round up to nearest euro', 'Hotels: €1-2 per bag', 'Cafes: Leave small change']}
            onAsk={() => askLocalGuide('Explain the tipping culture in detail')}
          />
          <InsightCard 
            title="Cultural Tips"
            icon={Heart}
            color="red"
            items={['Greet with \"Bonjour\" when entering shops', 'Dress modestly for religious sites', 'Lunch is 12-2pm, dinner after 7pm', 'Keep voice low on public transport']}
            onAsk={() => askLocalGuide('What cultural etiquette should I follow?')}
          />
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 font-medium">Getting local insights...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ title, icon: Icon, color, items, onAsk }) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600 border-teal-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    red: 'bg-red-50 text-red-600 border-red-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`px-6 py-4 border-b ${colorClasses[color]}`}>
        <div className="flex items-center gap-3">
          <Icon size={24} />
          <h4 className="font-bold">{title}</h4>
        </div>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-slate-600 flex items-start gap-2">
              <span className="text-teal-500 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
        <button 
          onClick={onAsk}
          className="mt-4 w-full py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50 rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          Learn more <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
