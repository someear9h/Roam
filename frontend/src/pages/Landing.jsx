import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Calendar, Users, Star, Heart,
  ChevronRight, ArrowRight, Globe, Sparkles, Shield,
  MessageSquare, Eye, Map, Play, CheckCircle, Plane,
  Coffee, Camera, Mountain, Building, TreePine, Waves,
  Menu, X
} from 'lucide-react';

// Airbnb-style category icons
const CATEGORIES = [
  { id: 'trending', label: 'Trending', icon: Sparkles },
  { id: 'beach', label: 'Beach', icon: Waves },
  { id: 'mountain', label: 'Mountains', icon: Mountain },
  { id: 'city', label: 'Cities', icon: Building },
  { id: 'countryside', label: 'Countryside', icon: TreePine },
  { id: 'unique', label: 'Unique stays', icon: Camera },
];

// Featured destinations with stock images
const FEATURED_DESTINATIONS = [
  {
    id: 1,
    name: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
    rating: 4.96,
    reviews: 2847,
    price: 'from $120/night',
    superhost: true,
    category: 'city',
    vrAvailable: true,
  },
  {
    id: 2,
    name: 'Santorini, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
    rating: 4.92,
    reviews: 1923,
    price: 'from $180/night',
    superhost: true,
    category: 'beach',
    vrAvailable: true,
  },
  {
    id: 3,
    name: 'Tokyo, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
    rating: 4.89,
    reviews: 3421,
    price: 'from $95/night',
    superhost: false,
    category: 'city',
    vrAvailable: true,
  },
  {
    id: 4,
    name: 'Swiss Alps',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    rating: 4.98,
    reviews: 892,
    price: 'from $250/night',
    superhost: true,
    category: 'mountain',
    vrAvailable: true,
  },
  {
    id: 5,
    name: 'Bali, Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
    rating: 4.94,
    reviews: 2156,
    price: 'from $85/night',
    superhost: true,
    category: 'beach',
    vrAvailable: true,
  },
  {
    id: 6,
    name: 'New York, USA',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
    rating: 4.87,
    reviews: 4521,
    price: 'from $200/night',
    superhost: false,
    category: 'city',
    vrAvailable: true,
  },
  {
    id: 7,
    name: 'Machu Picchu, Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=800&q=80',
    rating: 4.99,
    reviews: 1287,
    price: 'from $150/night',
    superhost: true,
    category: 'mountain',
    vrAvailable: true,
  },
  {
    id: 8,
    name: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
    rating: 4.97,
    reviews: 678,
    price: 'from $450/night',
    superhost: true,
    category: 'beach',
    vrAvailable: true,
  },
];

export default function Landing() {
  const [activeCategory, setActiveCategory] = useState('trending');
  const [favorites, setFavorites] = useState([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredDestinations = activeCategory === 'trending' 
    ? FEATURED_DESTINATIONS 
    : FEATURED_DESTINATIONS.filter(d => d.category === activeCategory);

  const toggleFavorite = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* NAVBAR - Airbnb Style */}
      <nav className="fixed top-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Roam" className="h-8 w-auto" onError={(e) => {
                e.target.style.display = 'none';
              }} />
              <span className="text-2xl font-bold text-rose-500">Roam</span>
            </Link>

            {/* Center Search Bar - Desktop */}
            <div className="hidden md:flex items-center">
              <div className={`flex items-center border rounded-full shadow-sm hover:shadow-md transition-shadow ${searchFocused ? 'shadow-md' : ''}`}>
                <button className="px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full">
                  Anywhere
                </button>
                <span className="h-6 w-px bg-gray-300"></span>
                <button className="px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full">
                  Any week
                </button>
                <span className="h-6 w-px bg-gray-300"></span>
                <button className="px-4 py-3 text-sm text-gray-500 hover:bg-gray-100 rounded-full flex items-center gap-2">
                  Add guests
                  <div className="p-2 bg-rose-500 rounded-full">
                    <Search size={14} className="text-white" />
                  </div>
                </button>
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden md:block px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                Become a Host
              </Link>
              <button className="hidden md:block p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Globe size={18} className="text-gray-600" />
              </button>
              <Link to="/login" className="flex items-center gap-2 border border-gray-300 rounded-full p-1.5 pl-3 hover:shadow-md transition-shadow">
                <Menu size={16} className="text-gray-600" />
                <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-white" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20">
        <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80" 
              alt="Travel" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
          </div>
          
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 w-full">
              <div className="max-w-2xl">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                  Find your next
                  <span className="block text-rose-400">adventure</span>
                </h1>
                <p className="text-xl text-white/90 mb-8 leading-relaxed">
                  Explore destinations in virtual reality before you book. 
                  AI-powered travel planning for unforgettable experiences.
                </p>
                
                {/* Hero Search Box */}
                <div className="bg-white rounded-2xl p-2 shadow-xl max-w-xl">
                  <div className="flex flex-col md:flex-row gap-2">
                    <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200">
                      <label className="block text-xs font-bold text-gray-800 mb-1">Where</label>
                      <input 
                        type="text" 
                        placeholder="Search destinations" 
                        className="w-full text-sm text-gray-600 placeholder-gray-400 outline-none"
                      />
                    </div>
                    <div className="flex-1 p-3 border-b md:border-b-0 md:border-r border-gray-200">
                      <label className="block text-xs font-bold text-gray-800 mb-1">When</label>
                      <input 
                        type="text" 
                        placeholder="Add dates" 
                        className="w-full text-sm text-gray-600 placeholder-gray-400 outline-none"
                      />
                    </div>
                    <Link 
                      to="/login" 
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold px-6 py-3 rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all"
                    >
                      <Search size={18} />
                      <span>Explore</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY PILLS */}
      <section className="sticky top-20 bg-white border-b border-gray-200 z-40">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="flex items-center gap-8 py-4 overflow-x-auto scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex flex-col items-center gap-2 pb-2 border-b-2 transition-all whitespace-nowrap ${
                  activeCategory === cat.id 
                    ? 'border-gray-800 text-gray-800' 
                    : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
                }`}
              >
                <cat.icon size={24} strokeWidth={1.5} />
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DESTINATIONS - Airbnb Grid */}
      <section className="py-8">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDestinations.map((dest) => (
              <Link 
                key={dest.id} 
                to="/login"
                className="group cursor-pointer"
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button 
                    onClick={(e) => toggleFavorite(dest.id, e)}
                    className="absolute top-3 right-3 p-2"
                  >
                    <Heart 
                      size={24} 
                      className={`${favorites.includes(dest.id) ? 'fill-rose-500 text-rose-500' : 'fill-black/50 text-white'} drop-shadow-md hover:scale-110 transition-transform`}
                    />
                  </button>
                  {dest.vrAvailable && (
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-800 shadow-sm">
                      <Eye size={14} className="text-rose-500" />
                      VR Preview
                    </div>
                  )}
                  {dest.superhost && (
                    <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-md text-xs font-semibold text-gray-800 shadow-sm">
                      Superhost
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">{dest.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-gray-800 text-gray-800" />
                      <span className="text-sm font-medium">{dest.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">{dest.reviews.toLocaleString()} reviews</p>
                  <p className="font-semibold text-gray-900">{dest.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VR EXPERIENCE SECTION */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-rose-500 font-semibold text-sm mb-4">
                <Eye size={18} />
                NEW FEATURE
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Experience destinations
                <span className="block text-rose-500">before you book</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Take a virtual tour of your accommodation. Walk through living rooms, 
                bedrooms, kitchens, and outdoor spaces in immersive 360° VR. 
                Know exactly what you're getting before you arrive.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <FeaturePill icon={Eye} text="360° Virtual Tours" />
                <FeaturePill icon={Camera} text="HD Quality" />
                <FeaturePill icon={Sparkles} text="AI Recommendations" />
              </div>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-3 bg-gray-900 text-white font-semibold px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors group"
              >
                Try VR Preview
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80" 
                  alt="VR Preview" 
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                    <Play size={32} className="text-rose-500 ml-1" fill="currentColor" />
                  </button>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <RoomButton label="Living Room" active />
                  <RoomButton label="Bedroom" />
                  <RoomButton label="Kitchen" />
                  <RoomButton label="Terrace" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-20">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Travel smarter with Roam
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need for the perfect trip, powered by AI
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Eye}
              title="VR Destination Preview"
              description="Explore accommodations in 360° VR before booking. Walk through rooms and see exactly what you're getting."
              color="rose"
            />
            <FeatureCard 
              icon={Sparkles}
              title="AI Trip Planning"
              description="Get personalized itineraries based on your preferences. Our AI creates perfect day-by-day plans."
              color="violet"
            />
            <FeatureCard 
              icon={MessageSquare}
              title="24/7 AI Assistant"
              description="Ask anything about your trip. Get instant answers, translations, and local recommendations."
              color="blue"
            />
            <FeatureCard 
              icon={Map}
              title="Local Guide"
              description="Discover hidden gems, learn local customs, and avoid tourist traps with AI-powered insights."
              color="green"
            />
            <FeatureCard 
              icon={Shield}
              title="Emergency Support"
              description="One-tap access to emergency services, embassy contacts, and location sharing when you need help."
              color="orange"
            />
            <FeatureCard 
              icon={Globe}
              title="Language Support"
              description="Real-time translations, essential phrases, and pronunciation guides in 50+ languages."
              color="teal"
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 bg-gradient-to-r from-rose-500 to-rose-600">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to explore?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of travelers who've discovered a smarter way to plan their adventures.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-3 bg-white text-rose-600 font-bold px-10 py-5 rounded-xl hover:bg-gray-100 transition-colors group text-lg"
          >
            Get Started — It's Free
            <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-[1760px] mx-auto px-6 md:px-10 lg:px-20 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#" className="hover:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline">Safety information</a></li>
                <li><a href="#" className="hover:underline">Cancellation options</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Community</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#" className="hover:underline">Blog</a></li>
                <li><a href="#" className="hover:underline">Travel guides</a></li>
                <li><a href="#" className="hover:underline">Ambassador program</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Hosting</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#" className="hover:underline">Host your home</a></li>
                <li><a href="#" className="hover:underline">Host an experience</a></li>
                <li><a href="#" className="hover:underline">Resources</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Roam</h4>
              <ul className="space-y-3 text-gray-600 text-sm">
                <li><a href="#" className="hover:underline">About us</a></li>
                <li><a href="#" className="hover:underline">Careers</a></li>
                <li><a href="#" className="hover:underline">Press</a></li>
              </ul>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-300">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img src="/logo.png" alt="Roam" className="h-6 w-auto" onError={(e) => e.target.style.display = 'none'} />
              <span className="text-xl font-bold text-rose-500">Roam</span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 Roam. Built for TBO Hackathon. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function FeaturePill({ icon: Icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-full text-sm font-medium text-gray-700 shadow-sm">
      <Icon size={16} className="text-rose-500" />
      {text}
    </div>
  );
}

function RoomButton({ label, active }) {
  return (
    <button className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
      active 
        ? 'bg-white text-gray-900 shadow-md' 
        : 'bg-black/40 text-white backdrop-blur-sm hover:bg-black/60'
    }`}>
      {label}
    </button>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colorClasses = {
    rose: 'bg-rose-50 text-rose-600',
    violet: 'bg-violet-50 text-violet-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    orange: 'bg-orange-50 text-orange-600',
    teal: 'bg-teal-50 text-teal-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600',
    pink: 'bg-pink-50 text-pink-600',
    yellow: 'bg-yellow-50 text-yellow-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-shadow">
      <div className={`w-14 h-14 rounded-2xl ${colorClasses[color] || colorClasses.rose} flex items-center justify-center mb-5`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description, icon: Icon }) {
  return (
    <div className="relative text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/30 relative z-10">
        <span className="text-3xl font-bold text-white">{number}</span>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
}

function JourneyCard({ phase, title, features, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-rose-500 to-rose-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
      <div className={`bg-gradient-to-r ${colorClasses[color]} px-6 py-4`}>
        <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{phase}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
              <CheckCircle size={16} className="text-rose-500 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
