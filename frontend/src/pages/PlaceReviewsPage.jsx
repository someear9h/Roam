import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Star, Shield, MapPin } from 'lucide-react';
import { tripAPI } from '../services/api';
import PlaceReviews from '../components/PlaceReviews';

export default function PlaceReviewsPage() {
  const { tripId } = useParams();
  const [currentTrip, setCurrentTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      setIsLoading(true);
      if (tripId) {
        const res = await tripAPI.getTrip(tripId);
        if (res.data.success && res.data.data) {
          setCurrentTrip(res.data.data);
        }
      }
    } catch (error) {
      console.error('Failed to load trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-coral-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading reviews...</p>
        </div>
      </div>
    );
  }

  if (!currentTrip) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Star className="text-coral-600" size={36} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Trip Found</h2>
          <p className="text-gray-500 mb-6">Please select a trip to view place reviews.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 px-6 py-3 bg-coral-500 text-white font-semibold rounded-xl hover:bg-coral-600 transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link to="/dashboard" className="hover:text-coral-500">Dashboard</Link>
          <ChevronRight size={14} />
          <Link to={`/trip/${tripId}`} className="hover:text-coral-500">{currentTrip.destination}</Link>
          <ChevronRight size={14} />
          <span className="font-semibold text-gray-800">Reviews & Safety</span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Place Reviews</h1>
            <p className="text-gray-500 mt-1">Safety scores and traveler reviews for {currentTrip.destination}</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-gray-200">
            <MapPin className="text-coral-500" size={20} />
            <span className="font-semibold text-gray-800">{currentTrip.destination}</span>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <Shield className="text-amber-600" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-1">Stay Safe While Traveling</h3>
            <p className="text-gray-600 text-sm">
              These reviews and safety scores are based on traveler feedback and local insights. 
              Always stay aware of your surroundings and follow local guidelines. Areas marked with 
              caution may still be visited safely during daytime or with proper precautions.
            </p>
          </div>
        </div>
      </div>

      {/* Place Reviews Component */}
      <PlaceReviews destination={currentTrip.destination} />
    </div>
  );
}
