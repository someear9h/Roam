import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Star, Heart, Share2, Eye, Compass, 
  Building, Wifi, Tv, Wind, Coffee, Utensils, Bath, Home,
  ChevronLeft, ChevronRight, Maximize2, Minimize2, Glasses,
  Play, Pause, RotateCcw, Info
} from 'lucide-react';

// Real 360° Equirectangular Panorama Images (Free to use)
const VR_DESTINATIONS = [
  {
    id: 1,
    name: 'Mountain Panorama',
    location: 'Swiss Alps, Switzerland',
    rating: 4.95,
    reviews: 3847,
    // Using actual 360° panorama from Polyhaven/Pixexid
    panorama: 'https://cdn.pixabay.com/photo/2016/01/10/11/35/panoramic-1131620_1280.jpg',
    thumbnail: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Experience breathtaking 360° views of the majestic Swiss Alps.',
    highlights: ['Mountains', 'Snow', 'Nature', 'Hiking'],
  },
  {
    id: 2,
    name: 'Tropical Beach',
    location: 'Maldives',
    rating: 4.97,
    reviews: 5234,
    panorama: 'https://cdn.pixabay.com/photo/2017/12/15/13/51/polynesia-3021072_1280.jpg',
    thumbnail: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Crystal clear waters and pristine beaches in paradise.',
    highlights: ['Beach', 'Ocean', 'Relaxation', 'Snorkeling'],
  },
  {
    id: 3,
    name: 'Ancient Temple',
    location: 'Kyoto, Japan',
    rating: 4.92,
    reviews: 4123,
    panorama: 'https://cdn.pixabay.com/photo/2019/07/21/07/12/temple-4352219_1280.jpg',
    thumbnail: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Step into the serene beauty of traditional Japanese architecture.',
    highlights: ['Culture', 'History', 'Gardens', 'Temples'],
  },
  {
    id: 4,
    name: 'Desert Sunset',
    location: 'Sahara, Morocco',
    rating: 4.88,
    reviews: 2156,
    panorama: 'https://cdn.pixabay.com/photo/2018/03/15/16/11/background-3228704_1280.jpg',
    thumbnail: 'https://images.pexels.com/photos/1001435/pexels-photo-1001435.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Witness the magical colors of a Saharan sunset.',
    highlights: ['Desert', 'Sunset', 'Adventure', 'Photography'],
  },
  {
    id: 5,
    name: 'Northern Lights',
    location: 'Tromsø, Norway',
    rating: 4.99,
    reviews: 6789,
    panorama: 'https://cdn.pixabay.com/photo/2017/02/07/17/52/aurora-2046158_1280.jpg',
    thumbnail: 'https://images.pexels.com/photos/1933239/pexels-photo-1933239.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Experience the magical Aurora Borealis in immersive 360°.',
    highlights: ['Aurora', 'Night Sky', 'Winter', 'Nature'],
  },
];

// Hotel Rooms with multiple 360° views
const HOTEL_ROOMS = [
  {
    id: 101,
    name: 'Ocean View Suite',
    hotelName: 'Grand Resort Maldives',
    location: 'Maldives',
    rating: 4.96,
    reviews: 892,
    pricePerNight: 750,
    views: [
      { id: 'living', name: 'Living Room', panorama: 'https://cdn.pixabay.com/photo/2016/11/30/08/48/bedroom-1872196_1280.jpg', thumbnail: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'bedroom', name: 'Bedroom', panorama: 'https://cdn.pixabay.com/photo/2016/11/30/08/48/bedroom-1872196_1280.jpg', thumbnail: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'bathroom', name: 'Spa Bathroom', panorama: 'https://cdn.pixabay.com/photo/2017/02/24/12/24/bathroom-2094733_1280.jpg', thumbnail: 'https://images.pexels.com/photos/1910472/pexels-photo-1910472.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'terrace', name: 'Ocean Deck', panorama: 'https://cdn.pixabay.com/photo/2017/12/15/13/51/polynesia-3021072_1280.jpg', thumbnail: 'https://images.pexels.com/photos/1450353/pexels-photo-1450353.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    amenities: ['wifi', 'tv', 'aircon', 'pool', 'restaurant'],
    description: 'Overwater villa with private infinity pool and stunning ocean views.',
  },
  {
    id: 102,
    name: 'Alpine Chalet',
    hotelName: 'Swiss Mountain Lodge',
    location: 'Swiss Alps',
    rating: 4.89,
    reviews: 456,
    pricePerNight: 520,
    views: [
      { id: 'living', name: 'Lounge Area', panorama: 'https://cdn.pixabay.com/photo/2017/03/28/12/10/chairs-2181947_1280.jpg', thumbnail: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'bedroom', name: 'Master Suite', panorama: 'https://cdn.pixabay.com/photo/2016/11/30/08/48/bedroom-1872196_1280.jpg', thumbnail: 'https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'balcony', name: 'Mountain View', panorama: 'https://cdn.pixabay.com/photo/2016/01/10/11/35/panoramic-1131620_1280.jpg', thumbnail: 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    amenities: ['wifi', 'fireplace', 'spa', 'restaurant'],
    description: 'Traditional alpine chalet with panoramic mountain views and private spa.',
  },
  {
    id: 103,
    name: 'Paris Penthouse',
    hotelName: 'Le Grand Hotel Paris',
    location: 'Paris, France',
    rating: 4.94,
    reviews: 1234,
    pricePerNight: 980,
    views: [
      { id: 'salon', name: 'Grand Salon', panorama: 'https://cdn.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg', thumbnail: 'https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'bedroom', name: 'Royal Suite', panorama: 'https://cdn.pixabay.com/photo/2016/11/30/08/48/bedroom-1872196_1280.jpg', thumbnail: 'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=400' },
      { id: 'terrace', name: 'City Terrace', panorama: 'https://cdn.pixabay.com/photo/2018/04/25/09/26/eiffel-tower-3349075_1280.jpg', thumbnail: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=400' },
    ],
    amenities: ['wifi', 'tv', 'butler', 'restaurant', 'spa'],
    description: 'Iconic penthouse with breathtaking views of the Eiffel Tower.',
  },
];

const AMENITY_ICONS = { wifi: Wifi, tv: Tv, aircon: Wind, coffee: Coffee, restaurant: Utensils, pool: Bath, spa: Bath, fireplace: Home, butler: Star };

export default function VRPreview() {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('destinations');
  const [selectedItem, setSelectedItem] = useState(VR_DESTINATIONS[0]);
  const [selectedViewIndex, setSelectedViewIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [aframeLoaded, setAframeLoaded] = useState(false);
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

  // Update A-Frame scene when panorama changes
  useEffect(() => {
    if (!aframeLoaded || !sceneRef.current) return;

    const panoramaUrl = getCurrentPanorama();
    
    // Create/update A-Frame scene
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
  }, [aframeLoaded, selectedItem, selectedViewIndex, isAutoRotate]);

  const getCurrentPanorama = () => {
    if (activeTab === 'hotels' && selectedItem?.views) {
      return selectedItem.views[selectedViewIndex]?.panorama || selectedItem.views[0]?.panorama;
    }
    return selectedItem?.panorama || '';
  };

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

  const items = activeTab === 'destinations' ? VR_DESTINATIONS : HOTEL_ROOMS;

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
                onClick={() => { setActiveTab('destinations'); setSelectedItem(VR_DESTINATIONS[0]); setSelectedViewIndex(0); }}
                className={`px-3 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'destinations' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Compass size={18} className="sm:hidden" />
                <span className="hidden sm:flex items-center gap-2"><Compass size={16} /> Destinations</span>
              </button>
              <button
                onClick={() => { setActiveTab('hotels'); setSelectedItem(HOTEL_ROOMS[0]); setSelectedViewIndex(0); }}
                className={`px-3 sm:px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'hotels' ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-600'
                }`}
              >
                <Building size={18} className="sm:hidden" />
                <span className="hidden sm:flex items-center gap-2"><Building size={16} /> Hotels</span>
              </button>
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
              {!aframeLoaded ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white">Loading VR Experience...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* A-Frame Container */}
                  <div ref={sceneRef} className="w-full h-full" />

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
