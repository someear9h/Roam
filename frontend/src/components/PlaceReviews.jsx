import React, { useState } from 'react';
import { 
  Star, ThumbsUp, ThumbsDown, Shield, AlertTriangle, 
  CheckCircle, MapPin, Clock, Users, Camera, ChevronDown, ChevronUp
} from 'lucide-react';

// Mock review data for destinations
const MOCK_REVIEWS = {
  'Paris': [
    {
      id: 1,
      place: 'Eiffel Tower',
      image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=400',
      rating: 4.8,
      totalReviews: 12450,
      verdict: 'must-visit',
      summary: 'Iconic landmark with breathtaking views. Best visited early morning or at sunset.',
      highlights: ['Stunning views', 'Iconic photos', 'Romantic atmosphere'],
      warnings: ['Long queues', 'Pickpockets nearby', 'Expensive restaurants around'],
      bestTime: 'Early morning (8-9 AM) or Sunset',
      avgVisitDuration: '2-3 hours',
      crowdLevel: 'High',
      safetyScore: 85,
      reviews: [
        { user: 'Sarah M.', rating: 5, text: 'Absolutely magical at sunset! Book tickets online to skip the queue.', date: '2 weeks ago' },
        { user: 'James K.', rating: 4, text: 'Beautiful but very crowded. Go early!', date: '1 month ago' },
      ]
    },
    {
      id: 2,
      place: 'Louvre Museum',
      image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400',
      rating: 4.7,
      totalReviews: 9870,
      verdict: 'must-visit',
      summary: 'World\'s largest art museum. Plan at least half a day to explore properly.',
      highlights: ['Mona Lisa', 'World-class art', 'Beautiful architecture'],
      warnings: ['Very large - easy to get lost', 'Crowded near popular exhibits'],
      bestTime: 'Wednesday or Friday evenings',
      avgVisitDuration: '4-6 hours',
      crowdLevel: 'Very High',
      safetyScore: 90,
      reviews: [
        { user: 'Emily R.', rating: 5, text: 'A must for art lovers. Get the museum map!', date: '3 days ago' },
        { user: 'Michael T.', rating: 4, text: 'Amazing collection but exhausting. Wear comfortable shoes.', date: '2 weeks ago' },
      ]
    },
    {
      id: 3,
      place: 'Gare du Nord Area (Night)',
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=400',
      rating: 2.8,
      totalReviews: 3240,
      verdict: 'caution',
      summary: 'Major train station area. Be cautious at night, especially in surrounding streets.',
      highlights: ['Transport hub', 'Convenient location'],
      warnings: ['Pickpockets very active', 'Avoid side streets at night', 'Aggressive vendors', 'Drug activity reported'],
      bestTime: 'Daytime only',
      avgVisitDuration: 'Transit only',
      crowdLevel: 'Variable',
      safetyScore: 45,
      reviews: [
        { user: 'David L.', rating: 2, text: 'Got my wallet stolen here. Stay alert!', date: '1 week ago' },
        { user: 'Anna P.', rating: 3, text: 'Fine during the day, but I wouldn\'t walk around at night.', date: '3 weeks ago' },
      ]
    },
    {
      id: 4,
      place: 'Montmartre',
      image: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=400',
      rating: 4.5,
      totalReviews: 8920,
      verdict: 'must-visit',
      summary: 'Charming artistic neighborhood with stunning views from Sacré-Cœur.',
      highlights: ['Sacré-Cœur Basilica', 'Artist square', 'Charming streets', 'Great cafes'],
      warnings: ['Scam artists with friendship bracelets', 'Steep hills', 'Crowded at peak times'],
      bestTime: 'Early morning for photos',
      avgVisitDuration: '3-4 hours',
      crowdLevel: 'Moderate to High',
      safetyScore: 75,
      reviews: [
        { user: 'Sophie B.', rating: 5, text: 'The view from Sacré-Cœur is incredible! Watch out for the bracelet scam.', date: '5 days ago' },
        { user: 'Tom H.', rating: 4, text: 'Beautiful area but those stairs are a workout!', date: '2 weeks ago' },
      ]
    }
  ],
  'Tokyo': [
    {
      id: 1,
      place: 'Shibuya Crossing',
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400',
      rating: 4.6,
      totalReviews: 15680,
      verdict: 'must-visit',
      summary: 'World\'s busiest pedestrian crossing. An iconic Tokyo experience.',
      highlights: ['Iconic experience', 'Great for photos', 'Vibrant atmosphere'],
      warnings: ['Extremely crowded', 'Easy to get disoriented'],
      bestTime: 'Evening for neon lights',
      avgVisitDuration: '30 min - 1 hour',
      crowdLevel: 'Very High',
      safetyScore: 95,
      reviews: [
        { user: 'Ken Y.', rating: 5, text: 'Mind-blowing! Best viewed from Starbucks above.', date: '1 week ago' },
      ]
    },
    {
      id: 2,
      place: 'Kabukicho (Late Night)',
      image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=400',
      rating: 3.2,
      totalReviews: 4520,
      verdict: 'caution',
      summary: 'Tokyo\'s famous entertainment district. Exercise caution late at night.',
      highlights: ['Neon lights', 'Nightlife', 'Unique atmosphere'],
      warnings: ['Aggressive touts', 'Overpriced clubs', 'Drink spiking reported', 'Avoid back alleys'],
      bestTime: 'Early evening for photos',
      avgVisitDuration: 'Varies',
      crowdLevel: 'High at night',
      safetyScore: 55,
      reviews: [
        { user: 'Alex M.', rating: 3, text: 'Interesting to see but don\'t follow the touts into clubs.', date: '2 weeks ago' },
      ]
    }
  ],
  'New York': [
    {
      id: 1,
      place: 'Central Park',
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=400',
      rating: 4.9,
      totalReviews: 22340,
      verdict: 'must-visit',
      summary: 'Iconic urban oasis in the heart of Manhattan. Perfect for all seasons.',
      highlights: ['Beautiful scenery', 'Free activities', 'Great for families'],
      warnings: ['Avoid isolated areas at night', 'Keep valuables secure'],
      bestTime: 'Morning or late afternoon',
      avgVisitDuration: '2-4 hours',
      crowdLevel: 'Moderate',
      safetyScore: 85,
      reviews: [
        { user: 'Lisa T.', rating: 5, text: 'Absolutely beautiful! Rent a bike to explore.', date: '4 days ago' },
      ]
    }
  ],
  'default': [
    {
      id: 1,
      place: 'City Center',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400',
      rating: 4.2,
      totalReviews: 5430,
      verdict: 'recommended',
      summary: 'The heart of the city with main attractions and dining options.',
      highlights: ['Central location', 'Easy access', 'Many restaurants'],
      warnings: ['Can be crowded', 'Tourist prices'],
      bestTime: 'Anytime',
      avgVisitDuration: '2-3 hours',
      crowdLevel: 'Moderate',
      safetyScore: 80,
      reviews: [
        { user: 'Traveler', rating: 4, text: 'Great starting point for exploring.', date: '1 week ago' },
      ]
    }
  ]
};

const getVerdictStyle = (verdict) => {
  switch (verdict) {
    case 'must-visit':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        icon: CheckCircle,
        label: '✨ Must Visit',
        badgeBg: 'bg-green-100'
      };
    case 'caution':
      return {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        icon: AlertTriangle,
        label: '⚠️ Exercise Caution',
        badgeBg: 'bg-amber-100'
      };
    case 'unsafe':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        icon: Shield,
        label: '🚫 Avoid',
        badgeBg: 'bg-red-100'
      };
    default:
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        icon: MapPin,
        label: '👍 Recommended',
        badgeBg: 'bg-blue-100'
      };
  }
};

const getSafetyColor = (score) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-amber-500';
  return 'text-red-500';
};

const getSafetyBg = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-amber-500';
  return 'bg-red-500';
};

function PlaceReviewCard({ place, isExpanded, onToggle }) {
  const verdict = getVerdictStyle(place.verdict);
  const VerdictIcon = verdict.icon;

  return (
    <div className={`${verdict.bg} border ${verdict.border} rounded-2xl overflow-hidden transition-all duration-300`}>
      {/* Card Header */}
      <div 
        className="cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex gap-4 p-4">
          {/* Image */}
          <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
            <img 
              src={place.image} 
              alt={place.place}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-gray-900 text-lg">{place.place}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold text-gray-800">{place.rating}</span>
                  </div>
                  <span className="text-gray-400 text-sm">({place.totalReviews.toLocaleString()} reviews)</span>
                </div>
              </div>
              <span className={`${verdict.badgeBg} ${verdict.text} px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shrink-0`}>
                <VerdictIcon size={14} />
                {verdict.label}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">{place.summary}</p>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {place.avgVisitDuration}
              </span>
              <span className="flex items-center gap-1">
                <Users size={12} />
                {place.crowdLevel}
              </span>
              <span className={`flex items-center gap-1 ${getSafetyColor(place.safetyScore)}`}>
                <Shield size={12} />
                Safety: {place.safetyScore}%
              </span>
            </div>
          </div>

          <button className="self-center p-2 hover:bg-white/50 rounded-lg transition-colors">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-white/50 space-y-4">
          {/* Safety Bar */}
          <div className="bg-white/70 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Safety Score</span>
              <span className={`font-bold ${getSafetyColor(place.safetyScore)}`}>{place.safetyScore}/100</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${getSafetyBg(place.safetyScore)} transition-all duration-500`}
                style={{ width: `${place.safetyScore}%` }}
              />
            </div>
          </div>

          {/* Highlights & Warnings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Highlights */}
            <div className="bg-white/70 rounded-xl p-4">
              <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <ThumbsUp size={16} />
                Highlights
              </h5>
              <ul className="space-y-1">
                {place.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warnings */}
            <div className="bg-white/70 rounded-xl p-4">
              <h5 className="font-semibold text-amber-700 mb-2 flex items-center gap-2">
                <AlertTriangle size={16} />
                Warnings
              </h5>
              <ul className="space-y-1">
                {place.warnings.map((w, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Best Time & Duration */}
          <div className="bg-white/70 rounded-xl p-4 flex items-center justify-around">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Best Time to Visit</p>
              <p className="font-semibold text-gray-800 text-sm">{place.bestTime}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Avg. Visit Duration</p>
              <p className="font-semibold text-gray-800 text-sm">{place.avgVisitDuration}</p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">Crowd Level</p>
              <p className="font-semibold text-gray-800 text-sm">{place.crowdLevel}</p>
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white/70 rounded-xl p-4">
            <h5 className="font-semibold text-gray-700 mb-3">Recent Reviews</h5>
            <div className="space-y-3">
              {place.reviews.map((review, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-semibold shrink-0">
                    {review.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">{review.user}</span>
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            className={i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <p className="text-sm text-gray-600">{review.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlaceReviews({ destination }) {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  // Get reviews for the destination or use default
  const reviews = MOCK_REVIEWS[destination] || MOCK_REVIEWS['default'];
  
  const filteredReviews = filter === 'all' 
    ? reviews 
    : reviews.filter(r => r.verdict === filter);

  const mustVisitCount = reviews.filter(r => r.verdict === 'must-visit').length;
  const cautionCount = reviews.filter(r => r.verdict === 'caution' || r.verdict === 'unsafe').length;

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Star className="text-yellow-500" size={20} />
            Place Reviews & Safety
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {mustVisitCount} must-visit places • {cautionCount} areas to be cautious
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {[
          { key: 'all', label: 'All Places' },
          { key: 'must-visit', label: '✨ Must Visit' },
          { key: 'caution', label: '⚠️ Caution' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === tab.key 
                ? 'bg-coral-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map(place => (
          <PlaceReviewCard
            key={place.id}
            place={place}
            isExpanded={expandedId === place.id}
            onToggle={() => setExpandedId(expandedId === place.id ? null : place.id)}
          />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No places found for this filter.
        </div>
      )}
    </div>
  );
}
