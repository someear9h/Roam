import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import api, { destinationAPI } from '../services/api';
import { 
  ArrowLeft, MapPin, Star, Heart, Share2, Eye, Compass, 
  Building, Wifi, Tv, Wind, Coffee, Utensils, Bath, Home,
  ChevronLeft, ChevronRight, Maximize2, Minimize2, Glasses,
  Play, Pause, RotateCcw, Info
} from 'lucide-react';

// Dynamic VR assets will be loaded from backend per-trip
// Destination and hotel lists are fetched at runtime for the given tripId

const AMENITY_ICONS = { wifi: Wifi, tv: Tv, aircon: Wind, coffee: Coffee, restaurant: Utensils, pool: Bath, spa: Bath, fireplace: Home, butler: Star };

export default function VRPreview() {
  // route parameters (tripId) - try multiple fallbacks for explore routes
  const params = useParams();
  let tripId = params?.tripId;

  // fallback: ?tripId=123 in query string
  if (!tripId) {
    try {
      const qp = new URLSearchParams(window.location.search);
      const q = qp.get('tripId');
      if (q) tripId = q;
    } catch (e) {}
  }

  // fallback: extract from pathname like /trip/123/... when component mounted under a different route
  if (!tripId) {
    const m = window.location.pathname.match(/\/trip\/(\d+)/);
    if (m) tripId = m[1];
  }

  // read optional view selector from query string
  const qp = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const requestedViewIndex = qp ? Number(qp.get('view') || 0) : 0;
  const [activeTab, setActiveTab] = useState('destinations');
  const [destinations, setDestinations] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedViewIndex, setSelectedViewIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [aframeLoaded, setAframeLoaded] = useState(false);
  const [loadingAssets, setLoadingAssets] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  
  // Load A-Frame script
  useEffect(() => {
    if (window.AFRAME) {
      setAframeLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
    script.async = true;
    script.onload = () => {
      setAframeLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup scene when component unmounts
      if (sceneRef.current) {
        sceneRef.current.innerHTML = '';
      }
    };
  }, []);

  // Update A-Frame scene when panorama changes (for image-type assets)
  useEffect(() => {
    if (!sceneRef.current) return;

    const buildAFrame = (panoramaUrl) => {
      sceneRef.current.innerHTML = `
        <a-scene 
          embedded 
          vr-mode-ui="enabled: true; enterVRButton: #enterVRButton; exitVRButton: #exitVRButton"
          loading-screen="enabled: false"
          renderer="antialias: true; alpha: true"
        >
          <a-assets>
            <img id="sky-img" src="${panoramaUrl}" crossorigin="anonymous">
          </a-assets>
          <a-sky 
            src="#sky-img" 
            rotation="0 -90 0"
            ${isAutoRotate ? 'animation="property: rotation; to: 0 270 0; dur: 100000; easing: linear; loop: true"' : ''}
          ></a-sky>
          <a-camera>
            <a-cursor 
              color="#FF5A1F" 
              fuse="false" 
              raycaster="objects: .clickable"
            ></a-cursor>
          </a-camera>
        </a-scene>
      `;
    };

    // If selected item is a hotel with multiple views, prefer the view panorama
    if (selectedItem) {
      const currentView = selectedItem.views?.[selectedViewIndex];
      const isKuulaView = currentView?.type === 'kuula' || selectedItem.type === 'kuula';
      if (isKuulaView) {
        // For kuula embeds we don't render A-Frame
        sceneRef.current.innerHTML = '';
        return;
      }

      // Determine panorama URL
      const panoramaUrl = currentView?.panorama || selectedItem.panorama || '';
      if (!panoramaUrl) {
        sceneRef.current.innerHTML = '';
        return;
      }

      // If A-Frame not yet loaded, wait until it's available
      if (!aframeLoaded) {
        sceneRef.current.innerHTML = '';
        return;
      }

      buildAFrame(panoramaUrl);
    }
  }, [aframeLoaded, selectedItem, selectedViewIndex, isAutoRotate]);

  const getCurrentPanorama = () => {
    // Return panorama URL for A-Frame usage
    if (!selectedItem) return '';
    const view = selectedItem.views?.[selectedViewIndex];
    if (view && view.panorama) return view.panorama;
    return selectedItem.panorama || '';
  };

  // Fetch VR assets using route param
  

  useEffect(() => {
    let cancelled = false;
    setLoadingAssets(true);
    setFetchError(null);

    const normalizeAsset = (asset, fallbackName, index) => {
      const obj = typeof asset === 'string' ? { panorama: asset } : (asset || {});
      const panorama = obj.panorama || obj.url || obj.image || '';
      const embed_url = obj.embed_url || obj.embedUrl || '';
      const thumbnail = obj.thumbnail || obj.preview || '';
      const type = obj.type || (embed_url ? 'kuula' : 'image');

      return {
        id: obj.id || `${fallbackName || 'asset'}-${index}`,
        name: obj.name || fallbackName || 'View',
        location: obj.location || fallbackName || '',
        thumbnail,
        panorama,
        embed_url,
        type,
        rating: obj.rating || 4.8,
        highlights: obj.highlights || [],
        amenities: obj.amenities || [],
        views: obj.views || []
      };
    };

    const loadTripAssets = async () => {
      try {
        const destResp = await api.get(`/destination/trip/${tripId}/vr-assets`);
        const destData = destResp?.data?.data ?? [];

        // destData can be array of assets or object with destinations key
        let destItems = [];
        if (Array.isArray(destData)) {
          destItems = destData.map((a, i) => normalizeAsset(a, (a?.name || a?.location || `Destination`), i));
        } else if (Array.isArray(destData.destinations)) {
          destItems = destData.destinations.map((a, i) => normalizeAsset(a, a?.name || a?.location || `Destination`, i));
        } else {
          // try to find array inside
          const arr = Object.values(destData).find(v => Array.isArray(v)) || [];
          destItems = arr.map((a, i) => normalizeAsset(a, a?.name || a?.location || `Destination`, i));
        }

        if (cancelled) return;
        setDestinations(destItems);
        if (destItems.length) setSelectedItem(destItems[0]);
        setActiveTab('destinations');
        setSelectedViewIndex(Number.isFinite(requestedViewIndex) ? requestedViewIndex : 0);
        setLoadingAssets(false);
      } catch (err) {
        if (cancelled) return;
        console.error('loadTripAssets error', err);
        setFetchError(err?.friendlyMessage || err?.message || 'Failed to load VR assets');
        setLoadingAssets(false);
      }
    };

    const loadGlobalAssets = async () => {
      try {
        const listResp = await destinationAPI.list();
        const dests = listResp?.data?.data ?? [];

        // For each destination fetch its vr assets
        const calls = dests.map(d => destinationAPI.getVrAssets(d.name));
        const results = await Promise.all(calls);

        const destItems = [];
        results.forEach((r, idx) => {
          const assets = r?.data?.data ?? [];
          if (Array.isArray(assets)) {
            assets.forEach((a, i) => destItems.push(normalizeAsset(a, dests[idx].name, i)));
          }
        });

        if (cancelled) return;
        setDestinations(destItems);
        if (destItems.length) setSelectedItem(destItems[0]);
        setLoadingAssets(false);
      } catch (err) {
        if (cancelled) return;
        console.error('loadGlobalAssets error', err);
        setFetchError(err?.friendlyMessage || err?.message || 'Failed to load VR assets');
        setLoadingAssets(false);
      }
    };

    if (tripId) loadTripAssets();
    else loadGlobalAssets();

    return () => { cancelled = true; };
  }, [tripId]);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const enterVR = () => {
    const scene = sceneRef.current?.querySelector('a-scene');
    if (scene && scene.enterVR) {
      scene.enterVR();
    }
  };

  const selectItem = (item, isHotel = false) => {
    setSelectedItem(item);
    setSelectedViewIndex(0);
    if (isHotel) setActiveTab('hotels');
    else setActiveTab('destinations');
  };

  const items = destinations;

  const currentView = selectedItem?.views?.[selectedViewIndex];
  const isKuulaView = currentView?.type === 'kuula' || selectedItem?.type === 'kuula';
  const needsAframe = !!selectedItem && !isKuulaView;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft size={22} className="text-slate-600" />
              </Link>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">360° VR Preview</h1>
                <p className="text-slate-500 text-sm hidden sm:block">Explore destinations in immersive virtual reality</p>
              </div>
            </div>
            
            {/* Tab Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => { setActiveTab('destinations'); setSelectedItem(destinations[0] || null); setSelectedViewIndex(0); }}
                className={`px-3 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'destinations' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Compass size={18} className="sm:hidden" />
                <span className="hidden sm:flex items-center gap-2"><Compass size={16} /> Destinations</span>
              </button>
              {/* Hotels are shown in the trip-scoped Hotel VR page; global VR shows only destinations */}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* Main VR Viewer */}
          <div className="lg:col-span-2 space-y-4">
            <div 
              ref={containerRef}
              className="relative bg-slate-900 rounded-2xl overflow-hidden"
              style={{ height: isFullscreen ? '100vh' : '480px' }}
            >
              {(loadingAssets || (needsAframe && !aframeLoaded)) ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Loading VR Experience...</p>
                  </div>
                </div>
              ) : fetchError ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="font-medium">{fetchError}</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Viewer area: either A-Frame scene for image panoramas or iframe for kuula embeds */}
                  {selectedItem && ((selectedItem.type === 'kuula') || (selectedItem.views?.[selectedViewIndex]?.type === 'kuula')) ? (
                    <iframe
                      title={selectedItem.name}
                      src={selectedItem.views?.[selectedViewIndex]?.embed_url || selectedItem.embed_url}
                      className="w-full h-full border-0"
                      allowFullScreen
                      loading="lazy"
                    />
                  ) : (
                    <div ref={sceneRef} className="w-full h-full" />
                  )}

                  {/* Overlay Controls */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
                    <div className="flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-sm rounded-full pointer-events-auto">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-white text-sm font-medium">360° VR</span>
                    </div>
                    
                    <div className="flex items-center gap-2 pointer-events-auto">
                      <button
                        onClick={() => setIsAutoRotate(!isAutoRotate)}
                        className={`p-2 rounded-full transition-colors ${isAutoRotate ? 'bg-orange-500 text-white' : 'bg-black/60 text-white'}`}
                        title={isAutoRotate ? 'Stop auto-rotate' : 'Auto-rotate'}
                      >
                        {isAutoRotate ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button
                        onClick={enterVR}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors font-medium"
                      >
                        <Glasses size={18} />
                        <span className="hidden sm:inline">Enter VR</span>
                      </button>
                      <button
                        onClick={handleFullscreen}
                        className="p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                      >
                        {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Hidden VR buttons for A-Frame */}
                  <button id="enterVRButton" className="hidden">Enter VR</button>
                  <button id="exitVRButton" className="hidden">Exit VR</button>

                  {/* Bottom Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-20">
                    <div className="flex items-end justify-between">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{selectedItem?.name}</h2>
                        <p className="text-white/80 flex items-center gap-2 text-sm">
                          <MapPin size={14} />
                          {selectedItem?.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setFavorites(prev => prev.includes(selectedItem?.id) ? prev.filter(f => f !== selectedItem?.id) : [...prev, selectedItem?.id])}
                          className={`p-2 sm:p-3 rounded-full transition-colors ${favorites.includes(selectedItem?.id) ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}
                        >
                          <Heart size={18} className={favorites.includes(selectedItem?.id) ? 'fill-current' : ''} />
                        </button>
                        <button className="p-2 sm:p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors">
                          <Share2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Room View Switcher (for hotels) */}
            {activeTab === 'hotels' && selectedItem?.views && (
              <div className="bg-white rounded-xl p-4 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <Eye size={18} className="text-orange-500" />
                  Room Views - Click to explore different areas
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedItem.views.map((view, index) => (
                    <button
                      key={view.id}
                      onClick={() => setSelectedViewIndex(index)}
                      className={`relative rounded-xl overflow-hidden aspect-video transition-all ${
                        selectedViewIndex === index 
                          ? 'ring-2 ring-orange-500 ring-offset-2 scale-[1.02]' 
                          : 'hover:ring-2 hover:ring-slate-300'
                      }`}
                    >
                      <img src={view.thumbnail} alt={view.name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <p className="absolute bottom-2 left-2 text-white text-xs sm:text-sm font-medium">{view.name}</p>
                      {selectedViewIndex === index && (
                        <div className="absolute top-2 right-2 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Item Description */}
            {selectedItem && (
              <div className="bg-white rounded-xl p-5 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{selectedItem.name}</h3>
                    {selectedItem.hotelName && <p className="text-slate-500 text-sm">{selectedItem.hotelName}</p>}
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 rounded-full">
                    <Star size={14} className="text-orange-500 fill-orange-500" />
                    <span className="font-semibold text-slate-800">{selectedItem.rating}</span>
                    <span className="text-slate-500 text-sm">({selectedItem.reviews})</span>
                  </div>
                </div>
                <p className="text-slate-600 mb-4">{selectedItem.description}</p>
                
                {selectedItem.pricePerNight && (
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-2xl font-bold text-slate-800">${selectedItem.pricePerNight}</span>
                    <span className="text-slate-500">per night</span>
                  </div>
                )}

                {selectedItem.amenities && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedItem.amenities.map(amenity => {
                      const Icon = AMENITY_ICONS[amenity] || Wifi;
                      return (
                        <span key={amenity} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-sm text-slate-600 capitalize">
                          <Icon size={14} /> {amenity}
                        </span>
                      );
                    })}
                  </div>
                )}

                {selectedItem.highlights && (
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.highlights.map(h => (
                      <span key={h} className="px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-sm">{h}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Selection List */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-lg">
              {activeTab === 'destinations' ? 'Explore Destinations' : 'Browse Hotel Rooms'}
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {items.map(item => (
                <button
                  key={item.id}
                  onClick={() => selectItem(item, activeTab === 'hotels')}
                  className={`w-full text-left bg-white rounded-xl overflow-hidden border transition-all ${
                    selectedItem?.id === item.id 
                      ? 'border-orange-500 shadow-lg shadow-orange-100' 
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="relative">
                    <img 
                      src={item.thumbnail || item.views?.[0]?.thumbnail}
                      alt={item.name}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-white/95 rounded-full">
                      <Star size={12} className="text-orange-500 fill-orange-500" />
                      <span className="text-xs font-semibold">{item.rating}</span>
                    </div>
                    {favorites.includes(item.id) && (
                      <Heart size={16} className="absolute top-2 left-2 text-red-500 fill-red-500" />
                    )}
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full">
                      <span className="text-white text-xs font-medium">360°</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-semibold text-slate-800 text-sm mb-0.5">{item.name}</h4>
                    <p className="text-slate-500 text-xs flex items-center gap-1">
                      <MapPin size={10} /> {item.location}
                    </p>
                    {item.pricePerNight && (
                      <p className="mt-2 text-slate-800 text-sm">
                        <span className="font-bold">${item.pricePerNight}</span>
                        <span className="text-slate-500"> / night</span>
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructions Footer */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-3 bg-white rounded-full shadow-lg border border-slate-200 z-50">
        <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-2 sm:gap-4">
          <span className="flex items-center gap-1"><Compass size={14} className="text-orange-500" /> Drag to look around</span>
          <span className="hidden sm:inline w-px h-4 bg-slate-200"></span>
          <span className="flex items-center gap-1"><Glasses size={14} className="text-orange-500" /> VR headset supported</span>
        </p>
      </div>
    </div>
  );
}
