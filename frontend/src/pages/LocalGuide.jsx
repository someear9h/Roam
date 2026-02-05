import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, MapPin, Coffee, Utensils, AlertTriangle, Navigation, 
  Loader2, Send, Star, Clock, DollarSign, Languages, BookOpen,
  Compass, Heart, Camera, ShoppingBag, Music, TreePine, Landmark,
  Users, ThumbsUp, ExternalLink, ChevronRight, Sparkles, Globe,
  ArrowLeft
} from 'lucide-react';
import { aiAPI, tripAPI } from '../services/api';
import MarkdownRenderer from '../components/MarkdownRenderer';

const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: Utensils, color: 'rose' },
  { id: 'attractions', label: 'Attractions', icon: Landmark, color: 'blue' },
  { id: 'culture', label: 'Culture', icon: BookOpen, color: 'violet' },
  { id: 'phrases', label: 'Phrases', icon: Languages, color: 'cyan' },
  { id: 'safety', label: 'Safety', icon: AlertTriangle, color: 'amber' },
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
  const { tripId: urlTripId } = useParams();
  const [activeCategory, setActiveCategory] = useState('food');
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [tripId, setTripId] = useState(urlTripId || null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [userLocation, setUserLocation] = useState({ lat: null, lng: null, city: 'your destination' });

  useEffect(() => {
    loadTrip();
    getLocation();
  }, [urlTripId]);

  const loadTrip = async () => {
    try {
      if (urlTripId) {
        const res = await tripAPI.getTrip(urlTripId);
        if (res.data.success && res.data.data) {
          setTripId(res.data.data.id);
          setCurrentTrip(res.data.data);
        }
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
        tripId: Number(tripId) || 1,
        query: searchQuery,
        location: userLocation
      });

      if (response.data.success) {
        setAiResponse(response.data.data.response);
      } else {
        setAiResponse('Unable to get recommendations right now. Please try again.');
      }
    } catch (error) {
      console.error('Failed to get local guide response:', error);
      const errorData = error.response?.data?.error;
      const errorMessage = typeof errorData === 'string' 
        ? errorData 
        : 'Unable to get recommendations right now. Please try again.';
      setAiResponse(errorMessage);
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
    <div className="space-y-6 pb-24">
      {/* HEADER - Airbnb Style */}
      <div className="flex items-center gap-4 mb-2">
        <Link to={urlTripId ? `/trip/${urlTripId}` : '/dashboard'} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Local Guide</h1>
          <p className="text-gray-500 mt-0.5 flex items-center gap-2 text-sm">
            <MapPin size={14} className="text-coral-500" />
            {destination}
            {userLocation.lat && (
              <span className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                GPS Active
              </span>
            )}
          </p>
        </div>
      </div>

      {/* HERO SEARCH - Airbnb Style */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 md:p-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-coral-400 mb-3">
            <Sparkles size={18} />
            <span className="font-semibold text-sm">AI-Powered Insights</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Discover {destination}
          </h2>
          <p className="text-gray-300 mb-6 text-sm md:text-base">
            Ask anything about local food, customs, hidden gems, and more.
          </p>
          
          {/* Search Box */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askLocalGuide()}
                placeholder="Ask anything... e.g., 'Best street food spots?'"
                className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-coral-500 text-gray-700 placeholder-gray-400"
              />
            </div>
            <button 
              onClick={() => askLocalGuide()}
              disabled={isLoading || !query.trim()}
              className="px-6 py-4 bg-coral-500 text-white font-bold rounded-xl hover:bg-coral-600 disabled:opacity-50 transition-all flex items-center gap-2 shadow-lg"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
              <span className="hidden md:inline">Ask</span>
            </button>
          </div>
        </div>
      </div>

      {/* CATEGORIES - Airbnb Style Pills */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const colorClasses = {
            rose: 'bg-coral-50 text-coral-600 border-coral-200 hover:bg-coral-100',
            blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
            violet: 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-100',
            cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200 hover:bg-cyan-100',
            amber: 'bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100',
            pink: 'bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100',
          };
          const isActive = activeCategory === cat.id;
          
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all whitespace-nowrap ${
                isActive 
                  ? `${colorClasses[cat.color]} border-current font-semibold` 
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <cat.icon size={18} />
              <span className="text-sm">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* AI RESPONSE - Clean Card */}
      {aiResponse && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-coral-500 px-6 py-4 flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Compass size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">AI Local Guide</h3>
              <p className="text-sm text-coral-100">Recommendations for {destination}</p>
            </div>
          </div>
          <div className="p-6">
            <MarkdownRenderer content={aiResponse} className="text-gray-700" />
          </div>
        </div>
      )}

      {/* QUICK QUERIES - Airbnb Style Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Popular Questions</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_QUERIES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => askLocalGuide(item.query)}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-coral-300 hover:shadow-md transition-all text-left group"
            >
              <div className="p-3 bg-coral-50 rounded-xl text-coral-500 group-hover:bg-coral-100 transition-colors">
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 group-hover:text-coral-600 transition-colors">
                  {item.label}
                </h4>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.query}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CULTURAL INSIGHTS - Clean Cards */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Essential Knowledge</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <InsightCard 
            title="Language Basics"
            icon={Languages}
            color="cyan"
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
            color="rose"
            items={['Greet with \"Bonjour\" when entering shops', 'Dress modestly for religious sites', 'Lunch is 12-2pm, dinner after 7pm', 'Keep voice low on public transport']}
            onAsk={() => askLocalGuide('What cultural etiquette should I follow?')}
          />
        </div>
      </div>

      {/* LOADING OVERLAY */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Getting local insights...</p>
          </div>
        </div>
      )}
    </div>
  );
}

function InsightCard({ title, icon: Icon, color, items, onAsk }) {
  const colorClasses = {
    cyan: 'bg-cyan-50 text-cyan-600 border-cyan-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    rose: 'bg-coral-50 text-coral-600 border-coral-200',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className={`px-5 py-3 border-b ${colorClasses[color]}`}>
        <div className="flex items-center gap-2">
          <Icon size={20} />
          <h4 className="font-bold text-sm">{title}</h4>
        </div>
      </div>
      <div className="p-5">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-coral-400 mt-1">•</span>
              {item}
            </li>
          ))}
        </ul>
        <button 
          onClick={onAsk}
          className="mt-4 w-full py-2 text-sm font-semibold text-coral-600 hover:bg-coral-50 rounded-lg transition-colors flex items-center justify-center gap-1"
        >
          Learn more <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
