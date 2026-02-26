import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { hotelAPI } from "../services/api";
import {
  MapPin,
  Star,
  BedDouble,
  Wifi,
  Coffee,
  Tv,
  Bath,
  Sparkles,
  Eye,
} from "lucide-react";

export default function TripHotels() {

  const { tripId } = useParams();
  const navigate = useNavigate();

  const [rooms, setRooms] = useState([]);   // always an array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {

    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        // Fetch trip-scoped hotels with vr_assets using existing hotel search endpoint
        const res = await hotelAPI.searchHotels(tripId, {});
        if (!mounted) return;

        const data = res.data?.data || [];
        const hotelsArray = Array.isArray(data)
          ? data
          : Array.isArray(data.hotels)
          ? data.hotels
          : [];

        setRooms(hotelsArray);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || "Failed to load hotels");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };

  }, [tripId]);


  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trip Hotels</h1>
          <p className="text-sm text-slate-500 mt-1">
            Browse your recommended stays and jump into a 360° VR preview.
          </p>
        </div>
        <button
          onClick={() => navigate(`/trip/${tripId}/hotel-vr`)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-semibold rounded-xl shadow-md hover:from-orange-600 hover:to-amber-600 transition-all"
        >
          <Eye size={18} />
          Open VR Preview
        </button>
      </div>

      {/* Loading / error / empty */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Loading hotels...</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 px-4 py-6 rounded-2xl text-sm text-slate-600">
          No hotels found for this trip yet. Try refreshing later or adjusting your trip dates.
        </div>
      )}

      {/* Hotel cards */}
      <div className="grid gap-5">
        {rooms.map((hotel) => {
          const hasVr = Array.isArray(hotel.vr_assets) && hotel.vr_assets.length > 0;
          const firstVr = hasVr ? hotel.vr_assets[0] : null;
          // Prefer VR imagery as the card visual when available
          const thumbnail =
            firstVr?.thumbnail ||
            firstVr?.panorama ||
            hotel.thumbnail ||
            hotel.image ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";

          return (
            <div
              key={hotel.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/3 h-40 md:h-auto relative">
                <img
                  src={thumbnail}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                {hasVr && (
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded-full">
                    <Sparkles size={12} className="text-amber-300" />
                    360° VR available
                  </div>
                )}
              </div>

              <div className="flex-1 p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                      {hotel.name}
                    </h2>
                    <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin size={14} className="text-orange-500" />
                      {hotel.area || hotel.location || hotel.city}
                    </p>
                  </div>
                  {hotel.rating && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-full text-xs font-semibold text-slate-800">
                      <Star size={14} className="text-orange-500 fill-orange-500" />
                      {hotel.rating}
                    </div>
                  )}
                </div>

                {hotel.description && (
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {hotel.description}
                  </p>
                )}

                {/* Compact VR preview strip */}
                {hasVr && (
                  <div className="flex gap-2 mt-2">
                    {hotel.vr_assets.slice(0, 3).map((view, idx) => (
                      <button
                        key={`${hotel.id}-preview-${idx}`}
                        onClick={() => navigate(`/trip/${tripId}/hotel-vr?hotelId=${hotel.id}&view=${idx}`)}
                        className="relative w-20 h-14 rounded-lg overflow-hidden border border-slate-200 hover:border-orange-400 transition-colors"
                      >
                        <img
                          src={view.thumbnail || view.panorama}
                          alt={view.name || `View ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <span className="text-[10px] font-semibold text-white">360°</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  {hotel.room_type && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-full">
                      <BedDouble size={14} />
                      {hotel.room_type}
                    </span>
                  )}
                  {hotel.amenities?.includes("wifi") && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-full">
                      <Wifi size={14} /> Free Wi‑Fi
                    </span>
                  )}
                  {hotel.amenities?.includes("breakfast") && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-full">
                      <Coffee size={14} /> Breakfast
                    </span>
                  )}
                  {hotel.amenities?.includes("tv") && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-full">
                      <Tv size={14} /> TV
                    </span>
                  )}
                  {hotel.amenities?.includes("bath") && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-50 border border-slate-200 rounded-full">
                      <Bath size={14} /> Bath
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    {hotel.price_per_night && (
                      <p className="text-sm text-slate-500">
                        <span className="text-xl font-bold text-slate-900">
                          ${hotel.price_per_night}
                        </span>{" "}
                        <span>/ night</span>
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {hasVr && (
                      <button
                        onClick={() => navigate(`/trip/${tripId}/hotel-vr?hotelId=${hotel.id}&view=0`)}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-black transition-colors"
                      >
                        <Eye size={14} />
                        View in VR
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}