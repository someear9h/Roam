import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Shield, MessageSquare, Map, Globe, Plane,
  ChevronRight, CheckCircle, ArrowRight, Play, Star,
  Compass, MapPin, Clock, Users, Award, Headphones,
  Eye, Luggage, Languages, Heart, Zap, Camera
} from 'lucide-react';

export default function Landing() {
  const [activeFeature, setActiveFeature] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      
      {/* ===== HERO SECTION ===== */}
      <div className="relative min-h-screen flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-20 flex items-center justify-between px-6 lg:px-12 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
              <Compass className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Compass</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden md:inline-flex px-5 py-2.5 text-white/80 hover:text-white font-medium transition-colors">
              Sign In
            </Link>
            <Link to="/login" className="px-6 py-2.5 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-teal-500/25">
              Get Started
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-teal-500/30">
                <Sparkles size={16} className="animate-pulse" />
                Powered by AI · Built for Travelers
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6">
                Your Journey,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400">
                  Reimagined.
                </span>
              </h1>
              
              <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                Experience travel like never before. From immersive destination previews 
                to real-time AI assistance, Compass transforms how you explore the world.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link to="/login" className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-teal-500/30 group">
                  Start Free <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl backdrop-blur-sm border border-white/20 transition-all group">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={16} fill="white" />
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-6 justify-center lg:justify-start text-slate-400 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border-2 border-slate-800" />
                    ))}
                  </div>
                  <span>10k+ Travelers</span>
                </div>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="ml-1">4.9/5</span>
                </div>
              </div>
            </div>

            {/* Right: Feature Showcase */}
            <div className="hidden lg:block relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Main Card */}
                <div className="absolute inset-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-60"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2 text-teal-400 text-sm font-medium mb-2">
                      <MapPin size={14} />
                      Paris, France
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Your AI Itinerary</h3>
                    <div className="flex gap-2">
                      <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">7 Days</span>
                      <span className="px-3 py-1 bg-white/20 text-white text-xs rounded-full">12 Activities</span>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl animate-bounce" style={{animationDuration: '3s'}}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">AI Assistant</p>
                      <p className="text-sm font-bold text-slate-800">Flight on time ✓</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 shadow-xl animate-bounce" style={{animationDuration: '3.5s', animationDelay: '0.5s'}}>
                  <div className="flex items-center gap-3 text-white">
                    <MessageSquare size={20} />
                    <div>
                      <p className="text-xs text-teal-100">Live Support</p>
                      <p className="text-sm font-bold">Always Here 24/7</p>
                    </div>
                  </div>
                </div>

                <div className="absolute top-1/4 -left-8 bg-white rounded-xl p-3 shadow-lg animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
                  <div className="flex items-center gap-2">
                    <Shield className="text-red-500" size={18} />
                    <span className="text-xs font-bold text-slate-700">Emergency Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== PROBLEM STATEMENT SECTION ===== */}
      <div className="relative z-10 py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-semibold text-sm tracking-wider uppercase">The Challenge</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Travel Should Be <span className="text-teal-400">Effortless</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-3xl mx-auto">
              Travelers face uncertainty, lack of guidance, and limited real-time assistance. 
              Compass reimagines the entire journey—from planning to destination support.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ProblemCard 
              title="Before Your Trip"
              description="Endless research, uncertainty about what to pack, visa confusion, and no personalized guidance."
              icon={Luggage}
            />
            <ProblemCard 
              title="During Your Trip"
              description="Language barriers, navigation struggles, missing hidden gems, and no real-time support when needed."
              icon={MapPin}
            />
            <ProblemCard 
              title="At Your Destination"
              description="Tourist traps, safety concerns, cultural misunderstandings, and lack of authentic local experiences."
              icon={Globe}
            />
          </div>
        </div>
      </div>

      {/* ===== COMPREHENSIVE FEATURES ===== */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-semibold text-sm tracking-wider uppercase">Complete Solution</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Everything You Need, In One App
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Eye} title="VR Destination Preview" description="Explore your destination before you arrive with immersive 360° virtual previews." color="purple" />
            <FeatureCard icon={Sparkles} title="AI Itinerary Generator" description="Get personalized day-by-day plans based on your preferences and pace." color="teal" />
            <FeatureCard icon={MessageSquare} title="24/7 AI Travel Assistant" description="Ask anything about your trip. Get instant answers and recommendations." color="blue" />
            <FeatureCard icon={Map} title="Smart Local Guide" description="Discover hidden gems, avoid tourist traps, and learn local customs." color="green" />
            <FeatureCard icon={Shield} title="Emergency Support" description="One-tap access to emergency services, embassy contacts, and live location sharing." color="red" />
            <FeatureCard icon={Luggage} title="Travel Readiness" description="AI-generated packing lists, visa requirements, currency info, and health tips." color="orange" />
            <FeatureCard icon={Languages} title="Language Support" description="Real-time translations, essential phrases, and pronunciation guides." color="indigo" />
            <FeatureCard icon={Heart} title="Accessibility Features" description="Customized recommendations for travelers with accessibility requirements." color="pink" />
            <FeatureCard icon={Zap} title="Smart Alerts" description="Real-time notifications about flight changes, weather, and local events." color="yellow" />
          </div>
        </div>
      </div>

      {/* ===== HOW IT WORKS ===== */}
      <div className="relative z-10 py-24 bg-gradient-to-b from-slate-900/50 to-slate-900">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-semibold text-sm tracking-wider uppercase">Simple Process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              Get Started in 3 Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-teal-500/50 via-teal-500 to-teal-500/50"></div>
            
            <StepCard number="1" title="Set Your Preferences" description="Tell us your travel style, food preferences, interests, and accessibility needs." icon={Users} />
            <StepCard number="2" title="Add Your Trip" description="Enter your destination and dates. Our AI instantly generates a personalized itinerary." icon={Plane} />
            <StepCard number="3" title="Travel with Confidence" description="Use your AI assistant, check your itinerary, and get help whenever you need." icon={Award} />
          </div>
        </div>
      </div>

      {/* ===== TRAVELER JOURNEY ===== */}
      <div className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-teal-400 font-semibold text-sm tracking-wider uppercase">End-to-End Experience</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">
              With You Every Step of the Way
            </h2>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            <JourneyCard phase="Pre-Trip" title="Plan & Prepare" features={['VR destination preview', 'AI itinerary generation', 'Packing checklist', 'Visa & documents']} color="blue" />
            <JourneyCard phase="Travel Day" title="Smooth Departure" features={['Flight tracking', 'Airport navigation', 'Real-time alerts', 'Document checklist']} color="teal" />
            <JourneyCard phase="At Destination" title="Explore & Discover" features={['Local guide & tips', 'AI assistant 24/7', 'Hidden gem finder', 'Translation help']} color="green" />
            <JourneyCard phase="Always" title="Stay Safe" features={['Emergency SOS', 'Embassy contacts', 'Location sharing', 'Safety alerts']} color="red" />
          </div>
        </div>
      </div>

      {/* ===== CTA SECTION ===== */}
      <div className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <div className="relative bg-gradient-to-r from-teal-600 via-teal-500 to-cyan-500 rounded-[2.5rem] p-12 md:p-16 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Travel?
              </h2>
              <p className="text-white/90 text-xl mb-10 max-w-2xl mx-auto">
                Join travelers who've discovered a smarter, safer, and more enjoyable way to explore the world.
              </p>
              <Link to="/login" className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-teal-600 font-bold text-lg rounded-2xl hover:bg-slate-100 transition-all shadow-xl group">
                Start Your Journey <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-white/70 text-sm mt-6">Free to use · No credit card required</p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="relative z-10 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Compass</span>
            </div>
            <p className="text-slate-500 text-sm">
              © 2026 Compass. Built for TBO Hackathon. Reimagining the traveler experience.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProblemCard({ title, description, icon: Icon }) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:border-red-500/30 transition-all group">
      <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
        <Icon className="text-red-400" size={28} />
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colorClasses = {
    teal: 'bg-teal-500/20 text-teal-400 hover:border-teal-500/50',
    blue: 'bg-blue-500/20 text-blue-400 hover:border-blue-500/50',
    green: 'bg-green-500/20 text-green-400 hover:border-green-500/50',
    red: 'bg-red-500/20 text-red-400 hover:border-red-500/50',
    purple: 'bg-purple-500/20 text-purple-400 hover:border-purple-500/50',
    orange: 'bg-orange-500/20 text-orange-400 hover:border-orange-500/50',
    indigo: 'bg-indigo-500/20 text-indigo-400 hover:border-indigo-500/50',
    pink: 'bg-pink-500/20 text-pink-400 hover:border-pink-500/50',
    yellow: 'bg-yellow-500/20 text-yellow-400 hover:border-yellow-500/50',
  };
  const [bg, text] = colorClasses[color].split(' ');

  return (
    <div className={`group bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all ${colorClasses[color].split(' ')[2]}`}>
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${bg} ${text}`}>
        <Icon size={26} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ number, title, description }) {
  return (
    <div className="relative text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-teal-500/30 relative z-10">
        <span className="text-3xl font-bold text-white">{number}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400">{description}</p>
    </div>
  );
}

function JourneyCard({ phase, title, features, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    teal: 'from-teal-500 to-teal-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600 transition-all">
      <div className={`bg-gradient-to-r ${colorClasses[color]} px-6 py-4`}>
        <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{phase}</span>
        <h3 className="text-lg font-bold text-white">{title}</h3>
      </div>
      <div className="p-6">
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-slate-300">
              <CheckCircle size={16} className="text-teal-400 shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
