import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, MapPin, Calendar, ChevronRight, ArrowRight, 
  Info, CreditCard, FileText, Bus, Globe, Building,
  Eye, ChevronLeft, Play, Star, Clock, Menu, X
} from 'lucide-react';

// Travel Services - like the Taiwan tourism site
const TRAVEL_SERVICES = [
  { id: 'arrival', label: 'Arrival & Departure', icon: MapPin, link: '/assistant' },
  { id: 'info', label: 'Travel Information', icon: Info, link: '/local-guide' },
  { id: 'visa', label: 'Visa Info', icon: FileText, link: '/assistant' },
  { id: 'transport', label: 'Transport', icon: Bus, link: '/local-guide' },
  { id: 'tourism', label: 'Tourism Offices', icon: Globe, link: '/assistant' },
  { id: 'accommodation', label: 'Accommodation', icon: Building, link: '/assistant' },
];

// Featured Destinations with VR
const FEATURED_DESTINATIONS = [
  {
    id: 1,
    name: 'Yangmingshan National Park',
    location: 'Taipei City',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
    vrAvailable: true,
  },
  {
    id: 2,
    name: 'Tamsui Old Street',
    location: 'New Taipei City',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80',
    vrAvailable: true,
  },
  {
    id: 3,
    name: 'Sun Moon Lake',
    location: 'Nantou County',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    vrAvailable: true,
  },
  {
    id: 4,
    name: 'Jiufen Village',
    location: 'New Taipei City',
    image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=600&q=80',
    vrAvailable: true,
  },
];

// Upcoming Events
const UPCOMING_EVENTS = [
  {
    id: 1,
    name: 'Keelung Mid-Summer Ghost Festival',
    date: 'Aug 18 - Sep 12',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&q=80',
  },
  {
    id: 2,
    name: 'Taiwan East Coast Land Arts Festival',
    date: 'Jun 21 - Sep 20',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentDestIndex, setCurrentDestIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/login');
    }
  };

  const nextDestination = () => {
    setCurrentDestIndex((prev) => (prev + 1) % FEATURED_DESTINATIONS.length);
  };

  const prevDestination = () => {
    setCurrentDestIndex((prev) => (prev - 1 + FEATURED_DESTINATIONS.length) % FEATURED_DESTINATIONS.length);
  };

  const handleVRPreview = (destinationId) => {
    navigate('/dashboard'); // VR previews now available per-trip
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER / NAVBAR */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Roam" className="h-12 w-auto" />
              <span className="hidden sm:block text-xs text-slate-400 border-l border-slate-200 pl-2 ml-1">
                TRAVEL COMPANION
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <NavLink href="#destinations">Destinations</NavLink>
              <NavLink href="#services">Travel Services</NavLink>
              <NavLink href="#events">Events</NavLink>
              <NavLink href="#guide">Travel Guide</NavLink>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link 
                to="/login" 
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/login" 
                className="px-5 py-2.5 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-full transition-colors"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4">
            <nav className="flex flex-col gap-4">
              <a href="#destinations" className="text-slate-600 hover:text-coral-500 font-medium">Destinations</a>
              <a href="#services" className="text-slate-600 hover:text-coral-500 font-medium">Travel Services</a>
              <a href="#events" className="text-slate-600 hover:text-coral-500 font-medium">Events</a>
              <a href="#guide" className="text-slate-600 hover:text-coral-500 font-medium">Travel Guide</a>
              <hr className="border-slate-100" />
              <Link to="/login" className="text-slate-600 font-medium">Sign In</Link>
              <Link to="/login" className="px-5 py-2.5 bg-coral-500 text-white font-semibold rounded-full text-center">
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* MAIN CONTENT */}
      <main>
        {/* HERO SECTION */}
        <section className="relative">
          <div className="grid lg:grid-cols-3">
            {/* Hero Image & Content */}
            <div className="lg:col-span-2 relative min-h-[500px] lg:min-h-[600px]">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80')` 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/50 to-transparent" />
              </div>

              {/* Hero Content */}
              <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-16 py-16">
                <p className="text-white/80 text-lg mb-2">Explore the wonders of</p>
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                  YOUR WORLD
                </h1>
                <p className="text-white/70 text-lg mb-8 max-w-md">
                  AI-Powered Travel Companion for Seamless Adventures
                </p>

                {/* Search Box */}
                <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 max-w-lg shadow-xl">
                  <div className="flex items-center">
                    <div className="flex-1 flex items-center gap-3 px-4">
                      <Search className="text-slate-400" size={20} />
                      <input
                        type="text"
                        placeholder="Where do you want to go?"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-3 outline-none text-slate-800 placeholder-slate-400"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-coral-500 hover:bg-coral-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
                    >
                      Explore <ArrowRight size={18} />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Sidebar - Featured Destinations */}
            <div className="hidden lg:block bg-slate-50 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Featured Destinations</h3>
              
              {/* Destination Cards Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {FEATURED_DESTINATIONS.slice(0, 4).map((dest, idx) => (
                  <div 
                    key={dest.id}
                    className="relative group cursor-pointer rounded-xl overflow-hidden"
                    onClick={() => handleVRPreview(dest.id)}
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-[10px] text-coral-300">{dest.location}</p>
                      <p className="text-xs font-semibold text-white truncate">{dest.name}</p>
                    </div>
                    {dest.vrAvailable && (
                      <div className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={12} className="text-coral-500" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Carousel Controls */}
              <div className="flex items-center justify-center gap-2 mb-6">
                <button 
                  onClick={prevDestination}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors"
                >
                  <ChevronLeft size={16} className="text-slate-600" />
                </button>
                <div className="flex gap-1">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentDestIndex ? 'bg-coral-500' : 'bg-slate-300'
                      }`}
                    />
                  ))}
                </div>
                <button 
                  onClick={nextDestination}
                  className="p-2 border border-slate-200 rounded-lg hover:bg-white transition-colors"
                >
                  <ChevronRight size={16} className="text-slate-600" />
                </button>
              </div>

              {/* Upcoming Events */}
              <h3 className="text-lg font-bold text-slate-800 mb-4">Upcoming Events</h3>
              <div className="space-y-3">
                {UPCOMING_EVENTS.map((event) => (
                  <div key={event.id} className="group cursor-pointer">
                    <div className="relative rounded-xl overflow-hidden mb-2">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-xs text-coral-500 font-medium">{event.date}</p>
                    <p className="text-sm font-semibold text-slate-800 group-hover:text-coral-500 transition-colors">
                      {event.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TRAVEL SERVICES SECTION */}
        <section id="services" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-800 mb-8">Travel Services</h2>
          
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-8">
            {TRAVEL_SERVICES.map((service) => (
              <Link 
                key={service.id}
                to={service.link}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-coral-50 group-hover:border-coral-200 transition-colors">
                  <service.icon size={28} className="text-slate-600 group-hover:text-coral-500 transition-colors" />
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-600 group-hover:text-coral-500 transition-colors">
                  {service.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* VR PREVIEW DESTINATIONS */}
        <section id="destinations" className="py-12 bg-slate-50">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Explore in 360° VR</h2>
                <p className="text-slate-500 mt-1">Preview destinations before you travel</p>
              </div>
              <Link 
                to="/vr-preview"
                className="hidden md:flex items-center gap-2 text-coral-500 hover:text-coral-600 font-semibold"
              >
                View All <ChevronRight size={18} />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURED_DESTINATIONS.map((dest) => (
                <div 
                  key={dest.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group cursor-pointer"
                  onClick={() => handleVRPreview(dest.id)}
                >
                  <div className="relative">
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <Play size={24} className="text-coral-500 ml-1" />
                      </div>
                    </div>
                    {dest.vrAvailable && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-coral-500 text-white text-xs font-semibold rounded-full flex items-center gap-1">
                        <Eye size={12} /> 360° VR
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-coral-500 font-medium">{dest.location}</p>
                    <h3 className="font-bold text-slate-800 mt-1">{dest.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVRPreview(dest.id);
                      }}
                      className="mt-3 w-full py-2 bg-slate-100 hover:bg-coral-500 hover:text-white text-slate-600 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={16} /> Preview in VR
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link 
                to="/vr-preview"
                className="inline-flex items-center gap-2 text-coral-500 hover:text-coral-600 font-semibold"
              >
                View All Destinations <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your AI Travel Companion</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Experience seamless travel with intelligent planning, real-time assistance, and immersive previews.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Eye}
              title="360° VR Previews"
              description="Explore destinations virtually before booking. Walk through streets, see landmarks, and experience the atmosphere."
              color="coral"
            />
            <FeatureCard
              icon={MapPin}
              title="AI Itinerary Planning"
              description="Get personalized day-by-day itineraries crafted by AI based on your preferences, pace, and interests."
              color="blue"
            />
            <FeatureCard
              icon={Globe}
              title="24/7 Travel Assistant"
              description="Ask anything about your destination. Get instant answers about culture, phrases, tips, and local recommendations."
              color="green"
            />
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 bg-gradient-to-r from-coral-500 to-orange-500">
          <div className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who plan smarter with AI-powered assistance.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/login"
                className="px-8 py-4 bg-white text-coral-500 font-bold rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                Get Started Free <ArrowRight size={18} />
              </Link>
              <Link 
                to="/vr-preview"
                className="px-8 py-4 bg-white/20 text-white font-bold rounded-full hover:bg-white/30 transition-colors flex items-center gap-2 border border-white/30"
              >
                <Eye size={18} /> Try VR Preview
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">
                <span className="text-coral-400">ROAM</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your AI-powered travel companion for seamless adventures around the world.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#destinations" className="hover:text-white transition-colors">Destinations</a></li>
                <li><Link to="/vr-preview" className="hover:text-white transition-colors">VR Previews</Link></li>
                <li><a href="#events" className="hover:text-white transition-colors">Events</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">AI Planning</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Travel Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Local Guide</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Emergency</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
            © 2026 Roam Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <a 
      href={href}
      className="text-slate-600 hover:text-coral-500 font-medium transition-colors"
    >
      {children}
    </a>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colorClasses = {
    coral: 'bg-coral-50 text-coral-500',
    blue: 'bg-blue-50 text-blue-500',
    green: 'bg-green-50 text-green-500',
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-shadow">
      <div className={`w-14 h-14 ${colorClasses[color]} rounded-2xl flex items-center justify-center mb-4`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500">{description}</p>
    </div>
  );
}
