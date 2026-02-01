import React, { useState, useEffect } from 'react';
import { 
  Calendar, Plane, ArrowRight, Plus, Clock, MapPin,
  Sparkles, MessageSquare, Shield, Map, Globe, ChevronRight,
  CheckCircle, AlertCircle, X, Eye, Luggage, TrendingUp,
  Sun, Cloud, Compass, MoreHorizontal, Star, Users
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripAPI, preferencesAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const tripsRes = await tripAPI.getTrips();
      if (tripsRes.data.success) {
        setTrips(tripsRes.data.data);
        if (tripsRes.data.data.length > 0) {
          setSelectedTrip(tripsRes.data.data[0]);
        }
      }
      
      const prefRes = await preferencesAPI.checkOnboardingStatus();
      if (prefRes.data.success) {
        setPreferences(prefRes.data.data);
        if (!prefRes.data.data.completed) {
          setShowOnboardingBanner(true);
        }
      }
    } catch (err) {
      console.error('Failed to load data:', err);
      setShowOnboardingBanner(true);
    } finally {
      setIsLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDaysUntil = (date) => {
    if (!date) return null;
    const diff = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getTripPhase = (trip) => {
    const now = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  };

  const currentTrip = trips.find(t => getTripPhase(t) === 'active');
  const upcomingTrips = trips.filter(t => getTripPhase(t) === 'upcoming');
  const pastTrips = trips.filter(t => getTripPhase(t) === 'completed');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your travel hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* CREATE TRIP MODAL */}
      {showCreateModal && (
        <CreateTripModal onClose={() => setShowCreateModal(false)} onCreated={() => { setShowCreateModal(false); loadData(); }} />
      )}

      {/* ONBOARDING BANNER */}
      {showOnboardingBanner && (
        <div className="relative bg-gradient-to-r from-teal-500 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <button onClick={() => setShowOnboardingBanner(false)} className="absolute top-4 right-4 p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
            <X size={20} />
          </button>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Sparkles size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Personalize Your Experience</h3>
                <p className="text-white/80 max-w-md">
                  Set your travel preferences to unlock AI recommendations tailored just for you. Takes only 30 seconds.
                </p>
              </div>
            </div>
            <Link to="/onboarding" className="px-8 py-4 bg-white text-teal-600 rounded-2xl font-bold hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg">
              Set Preferences <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Traveler'} 👋
          </h1>
          <p className="text-slate-500 mt-2 text-lg">
            {currentTrip 
              ? `You're currently in ${currentTrip.destination}. Have an amazing trip!`
              : trips.length > 0 
                ? `You have ${upcomingTrips.length} upcoming adventure${upcomingTrips.length !== 1 ? 's' : ''}`
                : 'Ready to plan your next adventure?'}
          </p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="inline-flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-teal-500/25 group">
          <Plus size={22} /> 
          <span>New Trip</span>
          <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 -ml-2 group-hover:ml-0 transition-all" />
        </button>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <QuickActionCard to="/itinerary" icon={Map} label="View Itinerary" color="teal" description="Day-by-day plan" />
        <QuickActionCard to="/assistant" icon={MessageSquare} label="AI Assistant" color="blue" description="Ask anything" />
        <QuickActionCard to="/local-guide" icon={Compass} label="Local Guide" color="green" description="Discover nearby" />
        <QuickActionCard to="/vr-preview" icon={Eye} label="VR Preview" color="purple" description="Explore in 360°" />
        <QuickActionCard to="/emergency" icon={Shield} label="Emergency" color="red" description="Get help now" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT: TRIP CARDS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CURRENT/NEXT TRIP HIGHLIGHT */}
          {(currentTrip || upcomingTrips[0]) && (
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">
                  {currentTrip ? '🌍 Currently Traveling' : '✈️ Your Next Adventure'}
                </h2>
                {upcomingTrips.length > 1 && (
                  <span className="text-sm text-slate-500">+{upcomingTrips.length - 1} more trips</span>
                )}
              </div>
              
              <TripHighlightCard 
                trip={currentTrip || upcomingTrips[0]} 
                isActive={!!currentTrip}
              />
            </div>
          )}

          {/* ALL TRIPS LIST */}
          {trips.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800">All Trips</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                {trips.map(trip => (
                  <TripCard key={trip.id} trip={trip} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState onCreateTrip={() => setShowCreateModal(true)} />
          )}
        </div>

        {/* RIGHT: SIDEBAR */}
        <div className="space-y-6">
          
          {/* TRAVEL READINESS */}
          {selectedTrip && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Luggage size={20} className="text-teal-600" />
                  Travel Readiness
                </h3>
                <Link to={`/trip/${selectedTrip.id}/readiness`} className="text-sm text-teal-600 font-semibold hover:underline">
                  View All
                </Link>
              </div>
              <div className="space-y-3">
                <ReadinessItem label="Packing Checklist" progress={0} />
                <ReadinessItem label="Documents Ready" progress={0} />
                <ReadinessItem label="Visa & Requirements" progress={0} />
              </div>
              <Link to={`/trip/${selectedTrip.id}/readiness`} className="mt-4 w-full py-3 bg-teal-50 text-teal-600 font-semibold rounded-xl hover:bg-teal-100 transition-colors flex items-center justify-center gap-2">
                Complete Checklist <ChevronRight size={18} />
              </Link>
            </div>
          )}

          {/* AI ASSISTANT PREVIEW */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-teal-500/20 rounded-xl">
                <MessageSquare size={24} className="text-teal-400" />
              </div>
              <div>
                <h3 className="font-bold">AI Travel Assistant</h3>
                <p className="text-sm text-slate-400">Always ready to help</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Ask me anything about your trip—restaurants, directions, translations, local tips, and more.
            </p>
            <Link to="/assistant" className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              Start Chatting <ArrowRight size={18} />
            </Link>
          </div>

          {/* EMERGENCY QUICK ACCESS */}
          <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-100 rounded-xl">
                <Shield size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="font-bold text-red-800">Emergency Support</h3>
                <p className="text-sm text-red-600">24/7 assistance available</p>
              </div>
            </div>
            <Link to="/emergency" className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              Access Emergency <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== COMPONENTS =====

function QuickActionCard({ to, icon: Icon, label, color, description }) {
  const colorClasses = {
    teal: 'bg-teal-50 text-teal-600 border-teal-100 hover:bg-teal-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100',
    red: 'bg-red-50 text-red-600 border-red-100 hover:bg-red-100',
  };

  return (
    <Link to={to} className={`p-5 rounded-2xl border transition-all ${colorClasses[color]} group`}>
      <Icon size={28} className="mb-3 group-hover:scale-110 transition-transform" />
      <p className="font-bold text-slate-800">{label}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </Link>
  );
}

function TripHighlightCard({ trip, isActive }) {
  const daysUntil = Math.ceil((new Date(trip.start_date) - new Date()) / (1000 * 60 * 60 * 24));
  const tripDuration = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));
  
  const destinationImages = {
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
  };
  
  const getImage = () => {
    const city = Object.keys(destinationImages).find(key => trip.destination?.toLowerCase().includes(key.toLowerCase()));
    return destinationImages[city] || destinationImages.default;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden shadow-xl">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${getImage()})` }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      
      {/* Content */}
      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            {isActive ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full mb-4">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Currently There
              </span>
            ) : daysUntil > 0 ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 text-white text-sm font-bold rounded-full mb-4">
                <Clock size={14} />
                {daysUntil} days to go
              </span>
            ) : null}
            
            <h2 className="text-3xl font-bold text-white mb-2">{trip.destination}</h2>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span className="flex items-center gap-1">
                <Sun size={14} />
                {tripDuration} days
              </span>
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <Link to="/itinerary" className="px-5 py-3 bg-white text-slate-800 font-semibold rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2">
            <Map size={18} /> View Itinerary
          </Link>
          <Link to={`/trip/${trip.id}/readiness`} className="px-5 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 backdrop-blur-sm">
            <Luggage size={18} /> Travel Checklist
          </Link>
          <Link to="/assistant" className="px-5 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2 backdrop-blur-sm">
            <MessageSquare size={18} /> Ask AI
          </Link>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip }) {
  const phase = (() => {
    const now = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'active';
    return 'completed';
  })();

  const phaseStyles = {
    upcoming: 'bg-teal-50 text-teal-700 border-teal-200',
    active: 'bg-green-50 text-green-700 border-green-200',
    completed: 'bg-slate-50 text-slate-600 border-slate-200'
  };

  const phaseLabels = {
    upcoming: 'Upcoming',
    active: 'Active Now',
    completed: 'Completed'
  };

  return (
    <Link to={`/trip/${trip.id}/readiness`} className="block bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-teal-200 transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white">
            <Plane size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">{trip.destination}</h3>
            <p className="text-sm text-slate-500">
              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${phaseStyles[phase]}`}>
          {phaseLabels[phase]}
        </span>
      </div>
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))} days</span>
        <ChevronRight size={18} className="text-slate-400 group-hover:text-teal-500 group-hover:translate-x-1 transition-all" />
      </div>
    </Link>
  );
}

function ReadinessItem({ label, progress }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm text-slate-600">{label}</span>
        <span className="text-sm font-semibold text-slate-800">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
}

function EmptyState({ onCreateTrip }) {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
      <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Plane className="text-teal-600" size={36} />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">No trips planned yet</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Start your journey by creating your first trip. Our AI will help you plan the perfect itinerary.
      </p>
      <button onClick={onCreateTrip} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-2xl hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/25">
        <Plus size={22} /> Create Your First Trip
      </button>
    </div>
  );
}

function CreateTripModal({ onClose, onCreated }) {
  const [formData, setFormData] = useState({
    destination: '',
    start_date: '',
    end_date: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.start_date || !formData.end_date) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Convert date strings to ISO format for backend
      const payload = {
        destination: formData.destination,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
      };
      const response = await tripAPI.createTrip(payload);
      if (response.data.success) {
        onCreated();
      }
    } catch (err) {
      const errorData = err.response?.data?.error;
      // Handle Zod validation errors (object) vs simple string errors
      if (typeof errorData === 'object') {
        // Extract first error message from Zod validation
        const firstKey = Object.keys(errorData).find(k => k !== '_errors');
        if (firstKey && errorData[firstKey]?._errors?.length) {
          setError(`${firstKey}: ${errorData[firstKey]._errors[0]}`);
        } else if (errorData._errors?.length) {
          setError(errorData._errors[0]);
        } else {
          setError('Please check your input and try again');
        }
      } else {
        setError(errorData || 'Failed to create trip');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl">
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Create New Trip</h2>
              <p className="text-slate-500 mt-1">Plan your next adventure</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <X size={24} className="text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Destination</label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g., Paris, France"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-4 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold rounded-xl hover:from-teal-600 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  Create Trip <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
