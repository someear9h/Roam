import React, { useState, useEffect } from 'react';
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

export default function Itinerary() {
  const [activeDay, setActiveDay] = useState(1);
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedDays, setExpandedDays] = useState({ 1: true });
  const [currentTrip, setCurrentTrip] = useState(null);
  const [preferences, setPreferences] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const tripsRes = await tripAPI.getTrips();
      if (tripsRes.data.success && tripsRes.data.data.length > 0) {
        const trip = tripsRes.data.data[0];
        setCurrentTrip(trip);
        
        try {
          const itineraryRes = await aiAPI.getItinerary(trip.id);
          if (itineraryRes.data.success && itineraryRes.data.data) {
            setItinerary(itineraryRes.data.data);
          }
        } catch (e) {}

        try {
          const prefsRes = await preferencesAPI.getPreferences();
          if (prefsRes.data.success) {
            setPreferences(prefsRes.data.data);
          }
        } catch (e) {}
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
      const response = await aiAPI.generateItinerary({
        tripId: currentTrip.id,
        preferences: preferences || {}
      });
      
      if (response.data.success) {
        setItinerary(response.data.data.plan);
        setExpandedDays({ 1: true });
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

  const formatDate = (dateStr, dayOffset = 0) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setDate(date.getDate() + dayOffset);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const tripDays = currentTrip?.start_date && currentTrip?.end_date
    ? Math.ceil((new Date(currentTrip.end_date) - new Date(currentTrip.start_date)) / (1000 * 60 * 60 * 24)) + 1
    : 7;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="text-rose-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Trip Selected</h2>
          <p className="text-gray-500 mb-6">Create a trip first to generate your personalized itinerary.</p>
          <a href="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white font-semibold rounded-xl hover:bg-rose-600 transition-colors">
            Go to Dashboard <ArrowRight size={18} />
          </a>
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
            <a href="/dashboard" className="hover:text-rose-500">Dashboard</a>
            <ChevronRight size={14} />
            <span className="font-semibold text-gray-800">{currentTrip.destination}</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Smart Itinerary</h1>
          <p className="text-gray-500 mt-1">AI-powered day-by-day travel plan</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-white px-4 py-2 rounded-xl border border-gray-200">
            <Calendar className="w-4 h-4 text-rose-500" />
            {formatDate(currentTrip.start_date)} - {formatDate(currentTrip.end_date)}
          </div>
          <button
            onClick={generateItinerary}
            disabled={isGenerating}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-xl hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-50 shadow-lg shadow-rose-500/25"
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
              <div className="w-12 h-12 bg-rose-500/20 rounded-xl flex items-center justify-center">
                <MapPinned className="text-rose-400" size={24} />
              </div>
              <div>
                <h3 className="font-bold">{currentTrip.destination}</h3>
                <p className="text-sm text-gray-400">{tripDays} days trip</p>
              </div>
            </div>
            {itinerary && (
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">{itinerary.days?.length || tripDays}</p>
                  <p className="text-xs text-slate-400">Days</p>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold">
                    {itinerary.days?.reduce((sum, day) => sum + (day.activities?.length || 0), 0) || 0}
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
                    ? 'bg-rose-50 border border-rose-200 text-rose-700' 
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                    activeDay === day ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {day}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-sm">Day {day}</p>
                    <p className="text-xs text-slate-500">{formatDate(currentTrip.start_date, day - 1)}</p>
                  </div>
                </div>
                {itinerary?.days?.[day - 1]?.activities && (
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {itinerary.days[day - 1].activities.length}
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
              {itinerary.days?.map((day, dayIndex) => (
                <DayCard 
                  key={dayIndex}
                  day={day}
                  dayNumber={dayIndex + 1}
                  date={formatDate(currentTrip.start_date, dayIndex)}
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
      <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-6">
        <Sparkles className="text-rose-600" size={40} />
      </div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Generate Your AI Itinerary</h2>
      <p className="text-gray-500 text-lg mb-8 max-w-lg mx-auto">
        Let our AI create a personalized day-by-day plan for your trip to {destination}, 
        tailored to your preferences and travel style.
      </p>
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-lg rounded-2xl hover:from-rose-600 hover:to-rose-700 transition-all disabled:opacity-50 shadow-xl shadow-rose-500/30"
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
          <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-rose-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-rose-500/25">
            {dayNumber}
          </div>
          <div className="text-left">
            <h3 className="text-xl font-bold text-gray-800">Day {dayNumber}</h3>
            <p className="text-gray-500">{date} • {day.theme || `Exploring the city`}</p>
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
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:border-rose-200 hover:shadow-sm transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-rose-50 rounded-lg">
                          <ActivityIcon size={20} className="text-rose-600" />
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
