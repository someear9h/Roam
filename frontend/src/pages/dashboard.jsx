import React, { useState, useEffect } from 'react';
import { 
  Calendar, ArrowRight, Plus, Clock, MapPin,
  Sparkles, MessageSquare, Shield, Map, Globe, ChevronRight,
  CheckCircle, AlertCircle, X, Eye, Luggage, ChevronDown,
  Sun, Compass, Star, Users, Search, Bell, Settings,
  Utensils, Building, Info, Camera
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tripAPI, preferencesAPI } from '../services/api';
import CreateTripModal from '../components/CreateTripModal';

// Location Data
const LOCATIONS = {
  'France': {
    cities: ['Paris', 'Nice', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg']
  },
  'Japan': {
    cities: ['Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara', 'Sapporo']
  },
  'Italy': {
    cities: ['Rome', 'Venice', 'Florence', 'Milan', 'Naples', 'Amalfi']
  },
  'United States': {
    cities: ['New York', 'Los Angeles', 'San Francisco', 'Miami', 'Las Vegas', 'Chicago']
  },
  'Thailand': {
    cities: ['Bangkok', 'Phuket', 'Chiang Mai', 'Pattaya', 'Krabi']
  },
  'Spain': {
    cities: ['Barcelona', 'Madrid', 'Seville', 'Valencia', 'Granada']
  },
  'United Kingdom': {
    cities: ['London', 'Edinburgh', 'Manchester', 'Oxford', 'Cambridge']
  },
  'Australia': {
    cities: ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast']
  },
  'India': {
    cities: ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Kerala']
  },
  'Greece': {
    cities: ['Athens', 'Santorini', 'Mykonos', 'Crete', 'Rhodes']
  },
  'UAE': {
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah']
  },
  'Singapore': {
    cities: ['Singapore City']
  },
  'Maldives': {
    cities: ['Malé', 'Maafushi', 'Hulhumalé']
  },
  'Switzerland': {
    cities: ['Zurich', 'Geneva', 'Lucerne', 'Interlaken', 'Bern']
  },
  'Indonesia': {
    cities: ['Bali', 'Jakarta', 'Yogyakarta', 'Lombok']
  }
};

const TRAVEL_SERVICES = [
  { icon: Info, label: 'Travel Information', description: 'Local tips & guides', link: '/local-guide', slug: 'local-guide' },
  { icon: Building, label: 'Accommodation', description: 'Hotel bookings', link: '/dashboard', slug: 'hotels' },
  { icon: Map, label: 'Transport', description: 'Getting around', link: '/local-guide', slug: 'local-guide' },
  { icon: Camera, label: 'VR Preview', description: 'Virtual tours', link: '/explore-vr', slug: 'vr-preview' },
  { icon: Shield, label: 'Emergency', description: '24/7 support', link: '/emergency', slug: 'emergency' },
];

export default function Dashboard() {
  const { user, setSelectedTrip: setAuthSelectedTrip } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOnboardingBanner, setShowOnboardingBanner] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const tripsRes = await tripAPI.getTrips();
      if (tripsRes.data.success) {
        setTrips(tripsRes.data.data || []);
        if (tripsRes.data.data?.length > 0) {
          setSelectedTrip(tripsRes.data.data[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load trips:', error);
    }
    
    try {
      const prefsRes = await preferencesAPI.checkOnboardingStatus();
      if (prefsRes.data.success) {
        const completed = prefsRes.data?.data?.completed ?? prefsRes.data?.data?.onboarding_complete;
        if (!completed) setShowOnboardingBanner(true);
      } else {
        setShowOnboardingBanner(true);
      }
    } catch (e) {
      setShowOnboardingBanner(true);
    }
    
    setIsLoading(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const currentTrip = trips.find(t => t.status === 'ongoing');
  const upcomingTrips = trips.filter(t => t.status === 'upcoming');

  const computeReadiness = (trip) => {
    if (!trip) return 75;
    try {
      const data = trip.travel_readiness;
      if (!data) return 75; // keep previous default when no data
      // If stored as JSON string, parse
      const obj = typeof data === 'string' ? JSON.parse(data) : data;
      if (typeof obj === 'object' && obj !== null) {
        const keys = Object.keys(obj);
        if (keys.length === 0) return 75;
        const truthy = keys.filter(k => !!obj[k]).length;
        return Math.round((truthy / keys.length) * 100);
      }
      return 75;
    } catch (e) {
      return 75;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 pb-24">
      
      {/* HEADER WITH SEARCH */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'Traveler'} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {currentTrip 
              ? `Currently exploring ${currentTrip.destination}`
              : 'Where would you like to go next?'}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl w-64 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
          </div>
          <button className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors relative">
            <Bell size={20} className="text-slate-600" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/30 to-amber-500/20" />
        
        <div className="relative z-10 p-8 md:p-12">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-full mb-4">
              ✨ AI-Powered Travel
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Explore the Wonders<br />of the World
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-lg">
              Plan your perfect trip with AI-powered recommendations, VR previews, and 24/7 travel support.
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg"
            >
              <Plus size={22} /> Plan New Trip
            </button>
          </div>
        </div>

        {/* Floating destination cards (visual only - non-interactive) */}
        <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none z-0">
          <div className="space-y-4">
            <DestinationCard 
              image="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300"
              name="Paris"
              country="France"
              rating={4.9}
            />
            <DestinationCard 
              image="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300"
              name="Tokyo"
              country="Japan"
              rating={4.8}
              className="ml-8"
            />
          </div>
        </div>
      </div>

      {/* TRAVEL SERVICES */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">Travel Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {TRAVEL_SERVICES.map((service, idx) => (
            <Link 
              key={idx}
              to={selectedTrip ? `/trip/${selectedTrip.id}/${service.slug}` : service.link}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-orange-200 transition-all group text-center"
            >
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-100 transition-colors">
                <service.icon size={24} className="text-orange-600" />
              </div>
              <p className="font-semibold text-slate-800 text-sm">{service.label}</p>
              <p className="text-xs text-slate-500 mt-1">{service.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* LEFT: TRIPS */}
        <div className="lg:col-span-2 space-y-6 min-w-0 relative z-10">
          
         {trips.length > 0 && (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-slate-800">
      Your Trips
    </h3>

    {trips.map(trip => (
      <TripCard key={trip.id} trip={trip} />
    ))}
  </div>
)}
<div className="py-6 text-slate-500">
  Featured destinations coming soon.
</div>

</div> {/* closes LEFT column */}

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {selectedTrip ? (
                <>
                  <QuickAction to={`/trip/${selectedTrip.id}/assistant`} icon={MessageSquare} label="AI Assistant" color="blue" />
                  <QuickAction to={`/trip/${selectedTrip.id}/local-guide`} icon={Compass} label="Local Guide" color="green" />
                  <QuickAction to={`/trip/${selectedTrip.id}/vr-preview`} icon={Eye} label="VR Preview" color="purple" />
                  <QuickAction to={`/trip/${selectedTrip.id}/emergency`} icon={Shield} label="Emergency SOS" color="red" />
                </>
                  ) : (
                <>
                  <QuickAction to="/explore-vr" icon={Eye} label="Explore VR" color="purple" />
                  <QuickAction to="/emergency" icon={Shield} label="Emergency SOS" color="red" />
                </>
              )}
            </div>
          </div>

          {/* Travel Readiness */}
          {selectedTrip && (
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                      <Luggage size={20} className="text-orange-600" />
                      Travel Readiness
                    </h3>
                    <span className="text-2xl font-bold text-orange-600">{computeReadiness(selectedTrip)}%</span>
                  </div>

                  <div className="h-3 bg-white rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full" style={{ width: `${computeReadiness(selectedTrip)}%` }}></div>
                  </div>

              <div className="space-y-2 mb-4">
                <ReadinessItem label="Packing List" done={true} />
                <ReadinessItem label="Documents" done={true} />
                <ReadinessItem label="Bookings" done={false} />
                <ReadinessItem label="Travel Insurance" done={false} />
              </div>

              <Link 
                to={`/trip/${selectedTrip.id}/readiness`}
                className="block text-center py-3 bg-white border border-orange-200 text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
              >
                View Checklist
              </Link>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <EventCard 
                title="Cherry Blossom Festival"
                location="Tokyo, Japan"
                date="Mar 20 - Apr 10"
                image="https://images.unsplash.com/photo-1522383225653-ed111181a951?w=200"
              />
              <EventCard 
                title="Carnival"
                location="Rio de Janeiro"
                date="Feb 25 - Mar 5"
                image="https://images.unsplash.com/photo-1518173835702-963eb6e9cfb6?w=200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* CREATE TRIP MODAL */}
          <CreateTripModal 
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            onTripCreated={(trip) => {
              setShowCreateModal(false);
              try { setAuthSelectedTrip(trip); } catch (e) {}
              loadData();
              // If the created trip is already completed (past end_date),
              // navigate to the trip overview; otherwise go to assistant.
              if (trip?.id) {
                try {
                  const now = new Date();
                  const endDate = trip.end_date ? new Date(trip.end_date) : null;
                  if (endDate && endDate < now) {
                    navigate(`/trip/${trip.id}`);
                  } else {
                    navigate(`/trip/${trip.id}/assistant`);
                  }
                } catch (e) {
                  navigate(`/trip/${trip.id}/assistant`);
                }
              }
            }}
          />
    </div>
  );
}

// COMPONENTS

function DestinationCard({ image, name, country, rating, className = '' }) {
  return (
    <div className={`bg-white/95 backdrop-blur-sm rounded-2xl p-3 shadow-xl flex items-center gap-3 ${className}`}>
      <div className="w-16 h-16 rounded-xl overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="font-bold text-slate-800">{name}</p>
        <p className="text-sm text-slate-500">{country}</p>
        <div className="flex items-center gap-1 mt-1">
          <Star size={12} className="text-amber-400 fill-amber-400" />
          <span className="text-xs font-medium text-slate-600">{rating}</span>
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, label, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
  };

  return (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${colors[color]}`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
      <ChevronRight size={16} className="ml-auto opacity-50" />
    </Link>
  );
}

function ReadinessItem({ label, done }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle size={18} className="text-green-500" />
      ) : (
        <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300" />
      )}
      <span className={`text-sm ${done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{label}</span>
    </div>
  );
}

function EventCard({ title, location, date, image }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 truncate">{title}</p>
        <p className="text-sm text-slate-500 truncate">{location}</p>
        <p className="text-xs text-orange-600 font-medium mt-1">{date}</p>
      </div>
    </div>
  );
}

function TripHighlightCard({ trip, isActive }) {
  const daysUntil = Math.ceil((new Date(trip.start_date) - new Date()) / (1000 * 60 * 60 * 24));
  const tripDuration = Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24));
  
  const images = {
    'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=800',
    'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=800',
    'default': 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800'
  };
  
  const getImage = () => {
    const city = Object.keys(images).find(key => trip.destination?.toLowerCase().includes(key.toLowerCase()));
    return images[city] || images.default;
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center opacity-40" style={{ backgroundImage: `url(${getImage()})` }}></div>
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      
      <div className="relative z-10 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            {isActive ? (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full mb-4">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Currently There
              </span>
            ) : daysUntil > 0 && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full mb-4">
                <Clock size={14} />
                {daysUntil} days to go
              </span>
            )}
            
            <h2 className="text-3xl font-bold text-white mb-2">{trip.destination}</h2>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span>{tripDuration} days</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to={`/trip/${trip.id}/itinerary`} className="flex-1 py-3 bg-white text-slate-800 font-semibold rounded-xl text-center hover:bg-slate-100 transition-colors">
            View Itinerary
          </Link>
          <Link to={`/trip/${trip.id}/vr-preview`} className="px-4 py-3 bg-white/20 text-white font-semibold rounded-xl hover:bg-white/30 transition-colors flex items-center gap-2">
            <Eye size={18} /> VR Preview
          </Link>
        </div>
      </div>
    </div>
  );
}

function TripCard({ trip }) {
  const phase = trip.status || 'upcoming';
  const navigate = useNavigate();
  const phaseStyles = {
    upcoming: 'bg-blue-50 text-blue-600 border-blue-200',
    ongoing: 'bg-green-50 text-green-600 border-green-200',
    completed: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  const getImage = () => {
    const srcMap = {
      Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      Tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      Dubai: 'https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=1200&q=80',
      'New York': 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1200&q=80'
    };
    const key = Object.keys(srcMap).find(k => trip.destination?.toLowerCase().includes(k.toLowerCase()));
    return key ? srcMap[key] : 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80';
  };

  const tripDuration = Math.max(1, Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)));

  return (
    <div className="min-w-0">
      <Link to={`/trip/${trip.id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transform hover:-translate-y-1 hover:scale-[1.01] transition-all duration-200">
        <div className="h-40 sm:h-44 md:h-48 w-full bg-slate-200">
          <img src={getImage()} alt={trip.destination} className="w-full h-full object-cover" />
        </div>
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-lg font-bold text-slate-900 truncate">{trip.destination}</h4>
              <p className="text-sm text-slate-500 mt-1 truncate">{new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {tripDuration} days</p>
            </div>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${phaseStyles[phase]}`}>{phase}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate(`/trip/${trip.id}/vr-preview`)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              <Eye size={16} /> VR Preview
            </button>
            <ChevronRight size={18} className="text-slate-400" />
          </div>
        </div>
      </Link>
    </div>
  );
}

function EmptyState({ onCreateTrip }) {
  return (
    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-3xl border-2 border-dashed border-orange-200 p-12 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <MapPin className="text-orange-600" size={36} />
      </div>
      <h3 className="text-2xl font-bold text-slate-800 mb-3">No trips planned yet</h3>
      <p className="text-slate-500 mb-8 max-w-md mx-auto">
        Start your journey by creating your first trip. Our AI will help you plan the perfect itinerary.
      </p>
      <button onClick={onCreateTrip} className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-2xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg">
        <Plus size={22} /> Create Your First Trip
      </button>
    </div>
  );
}
