import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Loader2, Sparkles } from 'lucide-react';
import { tripAPI, destinationAPI } from '../services/api';

export default function CreateTripModal({ isOpen, onClose, onTripCreated }) {
  const [destination, setDestination] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    let mounted = true;
    destinationAPI.list()
      .then(resp => {
        if (!mounted) return;
        if (resp.data && resp.data.success) {
          setDestinations(resp.data.data || []);
        }
      })
      .catch(() => {
        // ignore - keep text input
      });
    return () => { mounted = false; };
  }, []);

  // Always call hooks above. Only short-circuit rendering after hooks
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!destination.trim()) {
      setError('Please enter a destination');
      return;
    }

    setIsLoading(true);
    try {
      const tripData = {
        destination: destination.trim(),
        start_date: startDate ? new Date(startDate).toISOString() : undefined,
        end_date: endDate ? new Date(endDate).toISOString() : undefined,
        booking_id: bookingId || undefined,
      };

      const response = await tripAPI.createTrip(tripData);
      
      if (response.data.success) {
        onTripCreated(response.data.data);
        onClose();
        // Reset form
        setDestination('');
        setStartDate('');
        setEndDate('');
        setBookingId('');
      }
    } catch (err) {
      console.error('Failed to create trip:', err);
      setError(err.response?.data?.error || 'Failed to create trip');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-orange-500 to-amber-500 p-6">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3 text-white">
            <div className="p-3 bg-white/20 rounded-xl">
              <MapPin size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Plan New Trip</h2>
              <p className="text-white/80 text-sm">Let's start your adventure</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Destination */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              <MapPin size={14} className="inline mr-1" />
              Where are you going?
            </label>
            {destinations.length > 0 ? (
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
                required
              >
                <option value="">Select a destination</option>
                {destinations.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g., Paris, France"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                <Calendar size={14} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
              />
            </div>
          </div>

          {/* Booking ID (Optional) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Booking Reference (Optional)
            </label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              placeholder="e.g., TBO-12345"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-orange-200 text-slate-700 font-bold rounded-xl hover:bg-orange-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Sparkles size={18} />
              )}
              Create Trip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
