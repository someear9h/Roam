import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { hotelAPI } from '../services/api';
import { ArrowLeft, Eye, MapPin, Star, Heart, Share2, Glasses, Play, Pause, Maximize2, Minimize2 } from 'lucide-react';

export default function HotelVR() {
  const { tripId } = useParams();
  const [searchParams] = useSearchParams();
  const requestedHotelId = searchParams.get('hotelId');
  const requestedView = Number(searchParams.get('view') || 0);

  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedViewIndex, setSelectedViewIndex] = useState(requestedView || 0);
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // no refs for injecting A-Frame; render scene via JSX

  useEffect(() => {
    let script;
    if (window.AFRAME) { setAframeLoaded(true); return; }
    script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
    script.async = true;
    script.onload = () => setAframeLoaded(true);
    document.body.appendChild(script);
    return () => { try { if (script && script.parentNode) script.parentNode.removeChild(script); } catch (e) {} };
  }, []);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true); setError(null);
      try {
        const res = await hotelAPI.searchHotels(tripId, {});
        if (!mounted) return;
        const data = res.data?.data || [];
        const hotelsArray = Array.isArray(data) ? data : Array.isArray(data.hotels) ? data.hotels : [];

        // normalize hotels' vr_assets
        const normalized = hotelsArray.map(h => {
          let raw = h.vr_assets || [];
          if (typeof raw === 'string') {
            try { raw = JSON.parse(raw); } catch (e) { raw = [raw]; }
          }
          if (raw && !Array.isArray(raw)) raw = [raw];
          const views = (Array.isArray(raw) ? raw : []).filter(a => a != null).map((asset, idx) => ({
            id: asset?.id || `${h.id}-${idx}`,
            name: asset?.name || `Room ${idx+1}`,
            panorama: asset?.panorama || asset?.url || '',
            thumbnail: asset?.thumbnail || '',
            type: asset?.type || (asset?.embed_url ? 'kuula' : 'image'),
            embed_url: asset?.embed_url || asset?.embedUrl || ''
          }));

          return { ...h, views };
        });

        if (!mounted) return;
        setHotels(normalized);

        // choose selected hotel
        let sel = null;
        if (requestedHotelId) sel = normalized.find(h => String(h.id) === String(requestedHotelId));
        if (!sel) sel = normalized[0] || null;
        setSelectedHotel(sel);
        setSelectedViewIndex(requestedView || 0);
        setLoading(false);
      } catch (e) {
        if (!mounted) return;
        setError(e.message || 'Failed to load hotels');
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [tripId]);

  // A-Frame scene is rendered via JSX below; no manual DOM manipulation required
  const enterVR = () => {
    try {
      const id = `a-scene-${selectedHotel?.id}-${selectedViewIndex}`;
      const sceneEl = document.getElementById(id);
      if (sceneEl && typeof sceneEl.enterVR === 'function') sceneEl.enterVR();
    } catch (e) {
      console.warn('enterVR failed', e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors"><ArrowLeft size={22} className="text-slate-600" /></Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Hotel VR Preview</h1>
                <p className="text-slate-500 text-sm hidden sm:block">Explore hotel rooms in immersive 360°</p>
              </div>
            </div>
            <div>
              <button onClick={() => enterVR()} className="px-3 py-2 bg-orange-500 text-white rounded-md">Enter VR</button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative bg-slate-900 rounded-2xl overflow-hidden h-[480px]">
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">Loading hotels...</div>
                </div>
              )}
              {!loading && error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">{error}</div>
                </div>
              )}

              {/** Render A-Frame scene via JSX so React manages lifecycle. Key forces remount when switching views/hotels. */}
              {aframeLoaded && selectedHotel && selectedHotel.views?.[selectedViewIndex] && selectedHotel.views[selectedViewIndex].type !== 'kuula' && (
                <a-scene
                  id={`a-scene-${selectedHotel?.id}-${selectedViewIndex}`}
                  key={`${selectedHotel?.id}-${selectedViewIndex}`}
                  embedded
                  vr-mode-ui="enabled: true; enterVRButton: #enterVRButton; exitVRButton: #exitVRButton"
                  loading-screen="enabled: false"
                  renderer="antialias: true; alpha: true"
                >
                  <a-assets>
                    <img id={`panorama-${selectedHotel?.id}-${selectedViewIndex}`} src={selectedHotel.views[selectedViewIndex].panorama} crossOrigin="anonymous" />
                  </a-assets>
                  <a-sky src={`#panorama-${selectedHotel?.id}-${selectedViewIndex}`} rotation="0 -90 0"></a-sky>
                  <a-camera>
                    <a-cursor color="#FF5A1F" fuse="false"></a-cursor>
                  </a-camera>
                </a-scene>
              )}

              {/** kuula embeds via iframe */}
              {aframeLoaded && selectedHotel && selectedHotel.views?.[selectedViewIndex] && selectedHotel.views[selectedViewIndex].type === 'kuula' && (
                <iframe
                  title={selectedHotel.name}
                  src={selectedHotel.views?.[selectedViewIndex]?.embed_url || selectedHotel.embed_url}
                  className="w-full h-full border-0"
                  allowFullScreen
                />
              )}
            </div>

            {/* View thumbnails */}
            {selectedHotel?.views && (
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><Eye size={18} className="text-orange-500" /> Room Views</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedHotel.views.map((v, i) => (
                    <button key={v.id || i} onClick={() => setSelectedViewIndex(i)} className={`relative rounded-xl overflow-hidden aspect-video transition-all ${selectedViewIndex === i ? 'ring-2 ring-orange-500' : 'hover:ring-2 hover:ring-slate-300'}`}>
                      <img src={v.thumbnail || v.panorama} alt={v.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <p className="absolute bottom-2 left-2 text-white text-xs font-medium">{v.name}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {selectedHotel && (
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{selectedHotel.name}</h3>
                    <p className="text-sm text-slate-500">{selectedHotel.area}</p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 rounded-full">
                    <Star size={14} className="text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-slate-800">{selectedHotel.rating}</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">{selectedHotel.description}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">Browse Hotel Rooms</h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {hotels.map(h => (
                <button key={h.id} onClick={() => { setSelectedHotel(h); setSelectedViewIndex(0); }} className={`w-full text-left bg-white rounded-xl overflow-hidden border transition-all ${selectedHotel?.id === h.id ? 'border-orange-500 shadow-lg shadow-orange-100' : 'border-slate-200 hover:border-slate-300 hover:shadow-md'}`}>
                  <div className="relative">
                    <img src={h.views?.[0]?.thumbnail || h.thumbnail || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800'} alt={h.name} className="w-full h-28 object-cover" />
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/95 rounded-full">
                      <Star size={12} className="text-orange-500 fill-orange-500" />
                      <span className="text-xs font-semibold">{h.rating}</span>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <span className="text-white text-xs font-medium">360°</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-slate-800 text-sm mb-0.5">{h.name}</h4>
                    <p className="text-slate-500 text-xs flex items-center gap-1"><MapPin size={10} /> {h.area}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-3 bg-white rounded-full shadow-lg border border-slate-200 z-50">
        <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1"><Eye size={14} className="text-orange-500" /> Drag to look around</span>
          <span className="hidden sm:inline w-px h-4 bg-slate-200"></span>
          <span className="flex items-center gap-1"><Glasses size={14} className="text-orange-500" /> VR headset supported</span>
        </p>
      </div>
    </div>
  );
}
