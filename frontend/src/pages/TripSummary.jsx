import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Star, Heart, Camera, MessageSquare,
  ChevronRight, Share2, Download, Sparkles, Plane,
  CheckCircle, ArrowLeft, ThumbsUp, Send, Map, Globe,
  Shield, Eye, Clock, Users
} from 'lucide-react';
import { summaryAPI, tripAPI } from '../services/api';

export default function TripSummary() {
  const { tripId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [memories, setMemories] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    highlights: [],
    improvements: '',
    would_recommend: true,
  });
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const loadTripData = async () => {
    try {
      setIsLoading(true);
      const id = Number(tripId);
      
      // Load trip data
      const tripRes = await tripAPI.getTrip(id);
      if (tripRes.data.success) {
        setTrip(tripRes.data.data);
      }
      
      // Try to load summary data for completed trips
      try {
        const summaryRes = await summaryAPI.getFullSummary(id);
        if (summaryRes.data.success) {
          setMemories(summaryRes.data.data.memories || []);
          setFeedback(summaryRes.data.data.feedback);
        }
      } catch (e) {}
    } catch (error) {
      console.error('Failed to load trip data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateAISummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await summaryAPI.generateSummary(Number(tripId));
      if (response.data.success) {
        setAiSummary(response.data.data);
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
      // Demo AI summary
      setAiSummary({
        summary_title: `Your Magical Adventure in ${trip?.destination}`,
        highlights: [
          'Explored iconic landmarks',
          'Discovered hidden gems',
          'Enjoyed authentic local cuisine'
        ],
        places_visited: ['Main Attractions', 'Local Markets', 'Cultural Sites'],
        stats: { days: tripDuration, activities: 15, memories: memories.length },
        personal_message: 'What an incredible journey! You made the most of every moment.',
        future_suggestions: [
          { destination: 'Related Destination', reason: 'Based on your travel style' },
        ]
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const submitFeedback = async () => {
    try {
      const response = await summaryAPI.submitFeedback({
        trip_id: Number(tripId),
        ...feedbackData
      });
      if (response.data.success) {
        setFeedback(response.data.data);
        setShowFeedbackForm(false);
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    }
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate trip phase
  const getTripPhase = () => {
    if (!trip?.start_date || !trip?.end_date) return 'planning';
    const now = new Date();
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    if (now < start) return 'upcoming';
    if (now >= start && now <= end) return 'ongoing';
    return 'completed';
  };

  const tripPhase = getTripPhase();
  const daysUntil = trip?.start_date ? Math.ceil((new Date(trip.start_date) - new Date()) / (1000 * 60 * 60 * 24)) : 0;
  const tripDuration = trip?.start_date && trip?.end_date ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Trip not found</h2>
          <Link to="/dashboard" className="text-orange-600 hover:underline">Go back to dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1000')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="relative z-10 p-8 md:p-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              {tripPhase === 'upcoming' && daysUntil > 0 && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-full mb-4">
                  <Clock size={14} />
                  {daysUntil} days to go
                </span>
              )}
              {tripPhase === 'ongoing' && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-sm font-bold rounded-full mb-4">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  Currently There
                </span>
              )}
              {tripPhase === 'completed' && (
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-600 text-white text-sm font-bold rounded-full mb-4">
                  <CheckCircle size={14} />
                  Trip Completed
                </span>
              )}
              
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{trip.destination}</h1>
              <div className="flex flex-wrap items-center gap-4 text-slate-300">
                <span className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(trip.start_date)} - {formatDate(trip.end_date)}
                </span>
                <span className="flex items-center gap-2">
                  <Plane size={16} />
                  {tripDuration} days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickActionCard 
          to={`/trip/${tripId}/itinerary`}
          icon={Map}
          label="Itinerary"
          description="Day-by-day plan"
          color="orange"
        />
        <QuickActionCard 
          to={`/trip/${tripId}/assistant`}
          icon={MessageSquare}
          label="AI Assistant"
          description="Ask anything"
          color="blue"
        />
        <QuickActionCard 
          to={`/trip/${tripId}/local-guide`}
          icon={Globe}
          label="Local Guide"
          description="Tips & insights"
          color="green"
        />
        <QuickActionCard 
          to={`/trip/${tripId}/emergency`}
          icon={Shield}
          label="Emergency"
          description="SOS & contacts"
          color="red"
        />
      </div>

      {/* Additional Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* VR Preview */}
        <Link 
          to={`/vr-preview?destination=${trip.destination}`}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white flex items-center gap-4 hover:from-purple-600 hover:to-purple-700 transition-all group"
        >
          <div className="p-4 bg-white/20 rounded-2xl">
            <Eye size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">VR Preview</h3>
            <p className="text-purple-100 text-sm">Explore destination in 360°</p>
          </div>
          <ChevronRight size={24} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>

        {/* Travel Readiness */}
        <Link 
          to={`/trip/${tripId}/readiness`}
          className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 text-white flex items-center gap-4 hover:from-amber-600 hover:to-orange-600 transition-all group"
        >
          <div className="p-4 bg-white/20 rounded-2xl">
            <CheckCircle size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Travel Readiness</h3>
            <p className="text-amber-100 text-sm">Packing list & checklist</p>
          </div>
          <ChevronRight size={24} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Trip Completed - Show Summary Section */}
      {tripPhase === 'completed' && (
        <>
          {/* AI Summary Section */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">AI Trip Summary</h3>
                    <p className="text-sm text-slate-500">Personalized memories and insights</p>
                  </div>
                </div>
                {!aiSummary && (
                  <button
                    onClick={generateAISummary}
                    disabled={isGeneratingSummary}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 disabled:opacity-50"
                  >
                    {isGeneratingSummary ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> Generate Summary
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {aiSummary && (
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">{aiSummary.summary_title}</h4>
                  <p className="text-slate-600 leading-relaxed">{aiSummary.personal_message}</p>
                </div>

                {aiSummary.stats && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">{aiSummary.stats.days}</p>
                      <p className="text-sm text-gray-500">Days</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">{aiSummary.stats.activities}</p>
                      <p className="text-sm text-gray-500">Activities</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-orange-500">{aiSummary.stats.memories}</p>
                      <p className="text-sm text-gray-500">Memories</p>
                    </div>
                  </div>
                )}

                {aiSummary.highlights?.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" /> Trip Highlights
                    </h5>
                    <ul className="space-y-2">
                      {aiSummary.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-600">
                          <CheckCircle className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Memories */}
          {memories.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Camera className="w-5 h-5 text-orange-500" /> Your Memories
              </h3>
              <div className="space-y-4">
                {memories.map((memory, idx) => (
                  <div key={memory.id || idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {memory.type === 'photo' ? (
                        <Camera className="w-6 h-6 text-orange-600" />
                      ) : memory.type === 'place_visited' ? (
                        <MapPin className="w-6 h-6 text-orange-600" />
                      ) : (
                        <MessageSquare className="w-6 h-6 text-orange-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{memory.title}</p>
                      {memory.description && (
                        <p className="text-sm text-gray-600 mt-1">{memory.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Section */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" /> Rate Your Trip
              </h3>
              {feedback && !showFeedbackForm && (
                <span className="text-sm text-orange-500 font-medium">Thanks for your feedback!</span>
              )}
            </div>

            {feedback && !showFeedbackForm ? (
              <div className="bg-yellow-50 rounded-xl p-4">
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <p className="text-sm text-gray-600">{feedback.improvements || 'No additional comments'}</p>
              </div>
            ) : showFeedbackForm ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How was your trip?</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackData(p => ({ ...p, rating: star }))}
                        className="p-1"
                      >
                        <Star className={`w-8 h-8 ${star <= feedbackData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Any suggestions for improvement?</label>
                  <textarea
                    value={feedbackData.improvements}
                    onChange={(e) => setFeedbackData(p => ({ ...p, improvements: e.target.value }))}
                    placeholder="Share your thoughts..."
                    className="w-full p-3 border border-gray-200 rounded-xl resize-none h-24 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={submitFeedback}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" /> Submit Feedback
                  </button>
                  <button
                    onClick={() => setShowFeedbackForm(false)}
                    className="text-gray-600 hover:text-gray-800 px-4 py-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowFeedbackForm(true)}
                className="w-full p-4 border-2 border-dashed border-gray-200 rounded-xl text-gray-600 hover:border-orange-300 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
              >
                <ThumbsUp className="w-5 h-5" /> Share your experience
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" /> Share Trip
            </button>
            <button className="flex-1 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <Download className="w-5 h-5" /> Download Summary
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// Quick Action Card Component
function QuickActionCard({ to, icon: Icon, label, description, color }) {
  const colorClasses = {
    orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
    red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
  };

  const iconBgClasses = {
    orange: 'bg-orange-100',
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    red: 'bg-red-100',
  };

  return (
    <Link 
      to={to}
      className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all ${colorClasses[color]}`}
    >
      <div className={`p-4 rounded-2xl ${iconBgClasses[color]} mb-3`}>
        <Icon size={28} />
      </div>
      <h3 className="font-bold text-slate-800">{label}</h3>
      <p className="text-sm text-slate-500 text-center">{description}</p>
    </Link>
  );
}
