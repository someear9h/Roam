import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Calendar, Star, Heart, Camera, MessageSquare,
  ChevronRight, Share2, Download, Sparkles, Plane,
  CheckCircle, ArrowLeft, ThumbsUp, Send
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
    loadTripSummary();
  }, [tripId]);

  const loadTripSummary = async () => {
    try {
      setIsLoading(true);
      const id = Number(tripId);
      
      // Load trip data
      const summaryRes = await summaryAPI.getFullSummary(id);
      if (summaryRes.data.success) {
        setTrip(summaryRes.data.data.trip);
        setMemories(summaryRes.data.data.memories || []);
        setFeedback(summaryRes.data.data.feedback);
      }
    } catch (error) {
      console.error('Failed to load trip summary:', error);
      // Demo data for display
      setTrip({
        id: 1,
        destination: 'Paris, France',
        start_date: '2026-01-20',
        end_date: '2026-01-27',
        status: 'completed'
      });
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
          'Visited the iconic Eiffel Tower at sunset',
          'Discovered hidden gems in Montmartre',
          'Enjoyed authentic French cuisine'
        ],
        places_visited: ['Eiffel Tower', 'Louvre Museum', 'Montmartre', 'Seine River Cruise'],
        stats: { days: 7, activities: 15, memories: memories.length },
        personal_message: 'What an incredible journey! You made the most of every moment, from sunrise at the Eiffel Tower to evening strolls along the Seine. Your adventurous spirit shone through!',
        future_suggestions: [
          { destination: 'Barcelona, Spain', reason: 'Based on your love for art and architecture' },
          { destination: 'Amsterdam, Netherlands', reason: 'Perfect for your relaxed travel style' },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trip Summary</h1>
          <p className="text-slate-600">Relive your memories</p>
        </div>
      </div>

      {/* Trip Overview Card */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative">
          <div className="flex items-center gap-2 text-teal-100 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Trip Completed</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">{trip?.destination}</h2>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-200" />
              <span>{formatDate(trip?.start_date)} - {formatDate(trip?.end_date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-teal-200" />
              <span>{trip?.start_date && trip?.end_date 
                ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24))
                : 0} days adventure</span>
            </div>
          </div>
        </div>
      </div>

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

            {/* Stats */}
            {aiSummary.stats && (
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-teal-600">{aiSummary.stats.days}</p>
                  <p className="text-sm text-slate-500">Days</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-teal-600">{aiSummary.stats.activities}</p>
                  <p className="text-sm text-slate-500">Activities</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-teal-600">{aiSummary.stats.memories}</p>
                  <p className="text-sm text-slate-500">Memories</p>
                </div>
              </div>
            )}

            {/* Highlights */}
            {aiSummary.highlights?.length > 0 && (
              <div>
                <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" /> Trip Highlights
                </h5>
                <ul className="space-y-2">
                  {aiSummary.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-600">
                      <CheckCircle className="w-4 h-4 text-teal-500 mt-1 flex-shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Places Visited */}
            {aiSummary.places_visited?.length > 0 && (
              <div>
                <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" /> Places Visited
                </h5>
                <div className="flex flex-wrap gap-2">
                  {aiSummary.places_visited.map((place, idx) => (
                    <span key={idx} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {place}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Future Suggestions */}
            {aiSummary.future_suggestions?.length > 0 && (
              <div>
                <h5 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Plane className="w-4 h-4 text-orange-500" /> Where to Go Next
                </h5>
                <div className="grid gap-3">
                  {aiSummary.future_suggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-orange-50 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-800">{suggestion.destination}</p>
                        <p className="text-sm text-slate-600">{suggestion.reason}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-orange-500" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Memories Timeline */}
      {memories.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Camera className="w-5 h-5 text-teal-500" /> Your Memories
          </h3>
          <div className="space-y-4">
            {memories.map((memory, idx) => (
              <div key={memory.id || idx} className="flex gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {memory.type === 'photo' ? (
                    <Camera className="w-6 h-6 text-teal-600" />
                  ) : memory.type === 'place_visited' ? (
                    <MapPin className="w-6 h-6 text-teal-600" />
                  ) : (
                    <MessageSquare className="w-6 h-6 text-teal-600" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-slate-800">{memory.title}</p>
                  {memory.description && (
                    <p className="text-sm text-slate-600 mt-1">{memory.description}</p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">
                    {new Date(memory.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" /> Rate Your Trip
          </h3>
          {feedback && !showFeedbackForm && (
            <span className="text-sm text-teal-600 font-medium">Thanks for your feedback!</span>
          )}
        </div>

        {feedback && !showFeedbackForm ? (
          <div className="bg-yellow-50 rounded-xl p-4">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < feedback.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
              ))}
            </div>
            <p className="text-sm text-slate-600">{feedback.improvements || 'No additional comments'}</p>
          </div>
        ) : showFeedbackForm ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">How was your trip?</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackData(p => ({ ...p, rating: star }))}
                    className="p-1"
                  >
                    <Star className={`w-8 h-8 ${star <= feedbackData.rating ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Any suggestions for improvement?</label>
              <textarea
                value={feedbackData.improvements}
                onChange={(e) => setFeedbackData(p => ({ ...p, improvements: e.target.value }))}
                placeholder="Share your thoughts..."
                className="w-full p-3 border border-slate-200 rounded-xl resize-none h-24 focus:outline-none focus:border-teal-500"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={submitFeedback}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
              >
                <Send className="w-4 h-4" /> Submit Feedback
              </button>
              <button
                onClick={() => setShowFeedbackForm(false)}
                className="text-slate-600 hover:text-slate-800 px-4 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowFeedbackForm(true)}
            className="w-full p-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-600 hover:border-teal-300 hover:text-teal-600 transition-colors flex items-center justify-center gap-2"
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
    </div>
  );
}
