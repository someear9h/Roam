import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, RefreshCw, ChevronRight, ChevronDown, Clock, Sparkles,
  Calendar, Sun, Moon, Sunrise, Coffee, Utensils, Camera, 
  ShoppingBag, Landmark, TreePine, Car, MapPinned, Star, 
  CheckCircle, Plus, Edit3, Loader2, ArrowRight
} from 'lucide-react';
import { aiAPI, tripAPI, preferencesAPI } from '../services/api';

const ACTIVITY_ICONS = {
  sightseeing: Landmark,
  food: Utensils,
  transport: Car,
  rest: Coffee,
  shopping: ShoppingBag,
  nature: TreePine,
  photography: Camera,
  morning: Sunrise,
  default: MapPin
};

const TIME_ICONS = {
  morning: { icon: Sunrise, color: 'text-orange-500', bg: 'bg-orange-50' },
  afternoon: { icon: Sun, color: 'text-yellow-500', bg: 'bg-yellow-50' },
  evening: { icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' }
};

// Format a direct date string like '2026-02-28' into 'Sat, Feb 28'
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export default function Itinerary() {
  const { tripId } = useParams();
  const [activeDay, setActiveDay] = useState(1);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [currentTrip, setCurrentTrip] = useState(null);
  const [preferences, setPreferences] = useState(null);

  // Safely parse and normalize ai_itinerary into { days: [...] }
  const parseAndNormalizeItinerary = (raw) => {
    if (!raw) return null;
    let parsed = raw;
    if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw);
      } catch (err) {
        console.error('Failed to parse ai_itinerary JSON:', err);
        return null;
      }
    }

    // If parsed is already in expected shape with days, normalize activities
    const normalizeDaysArray = (daysArr) => {
      if (!Array.isArray(daysArr)) return [];
      return daysArr.map(d => {
        const activitiesRaw = Array.isArray(d.activities) ? d.activities : [];
        const activities = activitiesRaw.map(a => {
          if (!a && a !== 0) return { name: '' };
          if (typeof a === 'string') return { name: a };
          if (typeof a === 'object') {
            // prefer existing `name`, but fall back to `activity` or other keys
            const name = a.name || a.activity || a.title || '';
            return { ...a, name };
          }
          return { name: String(a) };
        });

        return {
          day: d.day,
          date: d.date,
          theme: d.theme,
          activities
        };
      });
    };

    // If parsed directly contains days array
    if (parsed.days && Array.isArray(parsed.days)) {
      return { days: normalizeDaysArray(parsed.days) };
    }

    // If parsed contains `itinerary` key (old backend format)
    if (parsed.itinerary && Array.isArray(parsed.itinerary)) {
      return { days: normalizeDaysArray(parsed.itinerary) };
    }

    // If parsed is an array of day objects
    if (Array.isArray(parsed)) {
      return { days: normalizeDaysArray(parsed) };
    }

    // Unknown shape - try to be tolerant: return as-is if it has activities shaped already
    return parsed;
  };

  useEffect(() => {
    loadData();
  }, [tripId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load specific trip by ID from URL params
      if (tripId) {
        const tripRes = await tripAPI.getTrip(tripId);
        if (tripRes.data.success && tripRes.data.data) {
          const trip = tripRes.data.data;
          setCurrentTrip(trip);
          
          if (trip.ai_itinerary) {
            const normalized = parseAndNormalizeItinerary(trip.ai_itinerary);
            if (normalized) setItinerary(normalized);
          }

          try {
            const prefsRes = await preferencesAPI.getPreferences();
            if (prefsRes.data.success) {
              setPreferences(prefsRes.data.data);
            }
          } catch (e) {}
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateItinerary = async () => {
    if (!currentTrip) return;
    
    setIsGenerating(true);
    try {
      const response = await aiAPI.generateItinerary(currentTrip.id);

      if (response.data.success) {
        const updatedTrip = await tripAPI.getTrip(currentTrip.id);

        if (updatedTrip.data.success) {
          const trip = updatedTrip.data.data;
          setCurrentTrip(trip);

          const normalized = parseAndNormalizeItinerary(trip.ai_itinerary);
          if (normalized) setItinerary(normalized);
          setExpandedDays({ 1: true });
        }
      }
    } catch (error) {
      console.error('Failed to generate itinerary:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleDay = (dayNum) => {
    setExpandedDays(prev => ({ ...prev, [dayNum]: !prev[dayNum] }));
    setActiveDay(dayNum);
  };

  // removed offset-based formatting; using top-level `formatDate(dateStr)` instead

  const tripDays = currentTrip?.start_date && currentTrip?.end_date
    ? Math.ceil((new Date(currentTrip.end_date) - new Date(currentTrip.start_date)) / (1000 * 60 * 60 * 24)) + 1
    : 7;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-coral-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Trip Selected</h2>
          <p className="text-gray-500 mb-6">Create a trip first to generate your personalized itinerary.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors">
            Go to Dashboard <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link to="/dashboard" className="hover:text-coral-500">Dashboard</Link>
            <ChevronRight size={14} />
            <Link to={`/trip/${tripId}`} className="hover:text-coral-500">{currentTrip.destination}</Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-800">Itinerary</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Smart Itinerary</h1>
          <p className="text-gray-500 mt-1">AI-powered day-by-day travel plan</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
            <Calendar className="w-4 h-4 text-coral-500" />
            {formatDate(currentTrip.start_date)} - {formatDate(currentTrip.end_date)}
          </div>
          <button
            onClick={generateItinerary}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-semibold rounded-xl hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-50 shadow-lg shadow-coral-500/25"
          >
            {isGenerating ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={18} />
                {itinerary ? 'Regenerate' : 'Generate'} Itinerary
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: DAY SELECTOR */}
        <aside className="lg:col-span-3 space-y-4">
          {/* Trip Overview Card */}
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-coral-500/20 rounded-xl flex items-center justify-center">
                <MapPinned className="text-coral-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold">{currentTrip.destination}</h3>
                <p className="text-sm text-gray-400">{tripDays} days trip</p>
              </div>
            </div>
            {itinerary && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{itinerary?.days?.length || tripDays}</p>
                  <p className="text-xs text-slate-400">Days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">
                    {itinerary?.days?.reduce((sum, day) => sum + (day.activities?.length || 0), 0) || 0}
                  </p>
                  <p className="text-xs text-slate-400">Activities</p>
                </div>
              </div>
            )}
          </div>

          {/* Day Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3 px-2">Days Overview</h3>
            {Array.from({ length: tripDays }, (_, i) => i + 1).map(day => (
              <button
                key={day}
                onClick={() => toggleDay(day)}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  activeDay === day 
                    ? 'bg-coral-50 border border-coral-200 text-coral-700' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    activeDay === day ? 'bg-coral-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {day}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Day {day}</p>
                    <p className="text-xs text-slate-500">{formatDate(itinerary?.days?.[day - 1]?.date || currentTrip.start_date)}</p>
                  </div>
                </div>
                {itinerary?.days?.[day - 1]?.activities && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {itinerary?.days?.[day - 1]?.activities?.length || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* RIGHT: ITINERARY CONTENT */}
        <main className="lg:col-span-9">
          {!itinerary ? (
            <EmptyItinerary onGenerate={generateItinerary} isGenerating={isGenerating} destination={currentTrip.destination} />
          ) : (
            <div className="space-y-6">
              {itinerary?.days?.map((day, dayIndex) => (
                <DayCard 
                  key={dayIndex}
                  day={day}
                  dayNumber={dayIndex + 1}
                  date={day.date}
                  isExpanded={expandedDays[dayIndex + 1]}
                  onToggle={() => toggleDay(dayIndex + 1)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

function EmptyItinerary({ onGenerate, isGenerating, destination }) {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl border-2 border-dashed border-gray-200 p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-coral-100 to-coral-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="text-coral-600" size={40} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Generate Your AI Itinerary</h2>
      <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
        Let our AI create a personalized day-by-day plan for your trip to {destination}, 
        tailored to your preferences and travel style.
      </p>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-coral-500 to-coral-600 text-white font-bold text-lg rounded-2xl hover:from-coral-600 hover:to-coral-700 transition-all disabled:opacity-50 shadow-xl shadow-coral-500/30"
      >
        {isGenerating ? (
          <>
            <Loader2 size={24} className="animate-spin" />
            Generating Magic...
          </>
        ) : (
          <>
            <Sparkles size={24} />
            Generate Smart Itinerary
          </>
        )}
      </button>
      <p className="text-sm text-slate-400 mt-6">Based on your travel preferences and local insights</p>
    </div>
  );
}

function DayCard({ day, dayNumber, date, isExpanded, onToggle }) {
  const getTimeOfDay = (time) => {
    if (!time) return 'morning';
    const hour = parseInt(time.split(':')[0]);
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Day Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-coral-500 to-coral-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-coral-500/25">
            {dayNumber}
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800">Day {dayNumber}</h3>
            <p className="text-gray-500">{formatDate(date)} • {day.theme || `Exploring the city`}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
            {day.activities?.length || 0} activities
          </span>
          <ChevronDown size={24} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {/* Activities */}
      {isExpanded && day.activities && (
        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
          <div className="space-y-4">
            {day.activities.map((activity, idx) => {
              const timeOfDay = getTimeOfDay(activity.time);
              const TimeIcon = TIME_ICONS[timeOfDay]?.icon || Sun;
              const ActivityIcon = ACTIVITY_ICONS[activity.type?.toLowerCase()] || ACTIVITY_ICONS.default;
              
              return (
                <div key={idx} className="flex gap-4 items-start">
                  {/* Time Column */}
                  <div className="w-20 shrink-0 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${TIME_ICONS[timeOfDay]?.bg || 'bg-slate-100'}`}>
                      <TimeIcon size={18} className={TIME_ICONS[timeOfDay]?.color || 'text-slate-500'} />
                    </div>
                    <p className="text-sm font-medium text-slate-600 mt-1">{activity.time || '—'}</p>
                  </div>

                  {/* Activity Card */}
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:border-coral-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-coral-50 rounded-lg">
                          <ActivityIcon size={20} className="text-coral-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-800">{activity.name || activity.activity}</h4>
                          {activity.location && (
                            <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                              <MapPin size={12} />
                              {activity.location}
                            </p>
                          )}
                          {activity.description && (
                            <p className="text-sm text-slate-600 mt-2">{activity.description}</p>
                          )}
                          {activity.tips && (
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                              <p className="text-sm text-amber-800">💡 {activity.tips}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      {activity.duration && (
                        <span className="text-xs text-slate-500 flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                          <Clock size={12} />
                          {activity.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
