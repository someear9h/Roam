import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Maximize2, Minimize2, Volume2, VolumeX,
  ChevronLeft, ChevronRight, MapPin, Star, Heart, Share2, 
  Info, Sofa, Bed, UtensilsCrossed, Bath, TreePine, Car,
  Wifi, Tv, Coffee, Wind, Sparkles, Eye, Camera, X,
  Home, Building, Palmtree, RotateCcw
} from 'lucide-react';
import { tripAPI } from '../services/api';

// VR Property Rooms with 360 equirectangular images
const VR_PROPERTIES = [
  {
    id: 1,
    name: 'Luxury Beach Villa',
    location: 'Maldives',
    rating: 4.98,
    reviews: 156,
    price: '$450',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=400&q=80',
    rooms: [
      {
        id: 'living',
        name: 'Living Room',
        icon: Sofa,
        panorama: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2048&q=80',
        description: 'Spacious living area with ocean views',
      },
      {
        id: 'bedroom',
        name: 'Master Bedroom',
        icon: Bed,
        panorama: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=2048&q=80',
        description: 'King-sized bed with panoramic windows',
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        icon: UtensilsCrossed,
        panorama: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2048&q=80',
        description: 'Fully equipped modern kitchen',
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        icon: Bath,
        panorama: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=2048&q=80',
        description: 'Luxurious spa bathroom with bathtub',
      },
      {
        id: 'terrace',
        name: 'Terrace',
        icon: TreePine,
        panorama: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=2048&q=80',
        description: 'Private terrace with infinity pool',
      },
    ],
    amenities: ['Wifi', 'Pool', 'Kitchen', 'AC', 'Beach Access'],
  },
  {
    id: 2,
    name: 'Paris City Apartment',
    location: 'Paris, France',
    rating: 4.92,
    reviews: 284,
    price: '$180',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=80',
    rooms: [
      {
        id: 'living',
        name: 'Living Room',
        icon: Sofa,
        panorama: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=2048&q=80',
        description: 'Elegant Parisian living room with balcony',
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        icon: Bed,
        panorama: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=2048&q=80',
        description: 'Cozy bedroom with city views',
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        icon: UtensilsCrossed,
        panorama: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2048&q=80',
        description: 'French-style kitchen',
      },
      {
        id: 'balcony',
        name: 'Balcony',
        icon: Building,
        panorama: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=2048&q=80',
        description: 'Balcony with Eiffel Tower view',
      },
    ],
    amenities: ['Wifi', 'Kitchen', 'AC', 'Washer'],
  },
  {
    id: 3,
    name: 'Santorini Cave House',
    location: 'Oia, Greece',
    rating: 4.96,
    reviews: 412,
    price: '$220',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400&q=80',
    rooms: [
      {
        id: 'living',
        name: 'Living Area',
        icon: Sofa,
        panorama: 'https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=2048&q=80',
        description: 'Traditional cave living room',
      },
      {
        id: 'bedroom',
        name: 'Cave Bedroom',
        icon: Bed,
        panorama: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=2048&q=80',
        description: 'Romantic cave bedroom',
      },
      {
        id: 'terrace',
        name: 'Sunset Terrace',
        icon: Palmtree,
        panorama: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=2048&q=80',
        description: 'Private terrace with caldera views',
      },
      {
        id: 'pool',
        name: 'Plunge Pool',
        icon: Bath,
        panorama: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=2048&q=80',
        description: 'Infinity plunge pool',
      },
    ],
    amenities: ['Wifi', 'Pool', 'AC', 'Breakfast'],
  },
  {
    id: 4,
    name: 'Tokyo Modern Loft',
    location: 'Shibuya, Japan',
    rating: 4.89,
    reviews: 567,
    price: '$150',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80',
    rooms: [
      {
        id: 'living',
        name: 'Living Space',
        icon: Sofa,
        panorama: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=2048&q=80',
        description: 'Minimalist Japanese living area',
      },
      {
        id: 'bedroom',
        name: 'Bedroom',
        icon: Bed,
        panorama: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=2048&q=80',
        description: 'Traditional futon bedroom',
      },
      {
        id: 'kitchen',
        name: 'Kitchen',
        icon: UtensilsCrossed,
        panorama: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=2048&q=80',
        description: 'Modern compact kitchen',
      },
      {
        id: 'bathroom',
        name: 'Bathroom',
        icon: Bath,
        panorama: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=2048&q=80',
        description: 'Japanese soaking tub',
      },
    ],
    amenities: ['Wifi', 'Kitchen', 'AC', 'Washer'],
  },
];

export default function VRPreview() {
  const { tripId } = useParams();
  const [selectedProperty, setSelectedProperty] = useState(VR_PROPERTIES[0]);
  const [activeRoom, setActiveRoom] = useState(VR_PROPERTIES[0].rooms[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showInfo, setShowInfo] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isVRMode, setIsVRMode] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const viewerRef = useRef(null);

  useEffect(() => {
    setActiveRoom(selectedProperty.rooms[0]);
  }, [selectedProperty]);

  const toggleFavorite = (id) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const handleFullscreen = () => {
    const viewer = document.getElementById('vr-container');
    if (!document.fullscreenElement) {
      viewer?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navigateRoom = (direction) => {
    const currentIndex = selectedProperty.rooms.findIndex(r => r.id === activeRoom.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % selectedProperty.rooms.length;
    } else {
      newIndex = (currentIndex - 1 + selectedProperty.rooms.length) % selectedProperty.rooms.length;
    }
    setActiveRoom(selectedProperty.rooms[newIndex]);
    setRotation({ x: 0, y: 0 });
  };

  // Mouse drag handlers for 360 rotation
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    setRotation(prev => ({
      x: Math.max(-45, Math.min(45, prev.x - deltaY * 0.3)),
      y: prev.y + deltaX * 0.3
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">VR Property Tour</h1>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Eye size={14} className="text-rose-500" />
                  Explore before you book
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => toggleFavorite(selectedProperty.id)}
                className={`p-2 rounded-full border transition-colors ${
                  favorites.includes(selectedProperty.id) 
                    ? 'bg-rose-50 border-rose-200 text-rose-500' 
                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Heart size={20} className={favorites.includes(selectedProperty.id) ? 'fill-current' : ''} />
              </button>
              <button className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Main VR Viewer */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* A-Frame VR Container */}
            <div 
              id="vr-container" 
              className="relative bg-gray-900 rounded-2xl overflow-hidden"
              style={{ height: '500px' }}
            >
              {/* A-Frame Scene */}
              <a-scene 
                embedded 
                vr-mode-ui="enabled: true"
                loading-screen="enabled: false"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Assets */}
                <a-assets>
                  <img id="room-panorama" src={activeRoom.panorama} crossOrigin="anonymous" />
                </a-assets>

                {/* 360 Sky with current room panorama */}
                <a-sky 
                  src="#room-panorama"
                  rotation="0 -90 0"
                ></a-sky>

                {/* Camera with look controls */}
                <a-camera 
                  look-controls="reverseMouseDrag: true; touchEnabled: true" 
                  wasd-controls="enabled: false"
                  position="0 1.6 0"
                >
                  {/* Cursor for VR interaction */}
                  <a-cursor 
                    color="#FF385C" 
                    fuse="true" 
                    fuse-timeout="1500"
                    raycaster="objects: .clickable"
                  ></a-cursor>
                </a-camera>

                {/* Ambient Light */}
                <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
                <a-light type="directional" color="#ffffff" intensity="0.4" position="1 1 0"></a-light>

                {/* Room hotspots/navigation points */}
                {selectedProperty.rooms.map((room, index) => {
                  if (room.id === activeRoom.id) return null;
                  const angle = (index * 72) * (Math.PI / 180);
                  const x = Math.sin(angle) * 3;
                  const z = -Math.cos(angle) * 3;
                  return (
                    <a-entity
                      key={room.id}
                      position={`${x} 1 ${z}`}
                      className="clickable"
                      geometry="primitive: ring; radiusInner: 0.3; radiusOuter: 0.5"
                      material="color: #FF385C; opacity: 0.8"
                      look-at="[camera]"
                    >
                      <a-text 
                        value={room.name} 
                        align="center" 
                        position="0 -0.7 0"
                        color="#ffffff"
                        width="3"
                      ></a-text>
                    </a-entity>
                  );
                })}
              </a-scene>

              {/* Overlay Controls */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Top Info Bar */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-auto">
                  <div className="bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <activeRoom.icon size={18} className="text-rose-400" />
                      <span className="font-semibold">{activeRoom.name}</span>
                    </div>
                    <p className="text-sm text-white/70">{activeRoom.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={resetView}
                      className="p-3 bg-black/60 backdrop-blur-sm text-white rounded-xl hover:bg-black/80 transition-colors"
                      title="Reset View"
                    >
                      <RotateCcw size={20} />
                    </button>
                    <button 
                      onClick={() => setShowInfo(!showInfo)}
                      className={`p-3 rounded-xl transition-colors ${
                        showInfo ? 'bg-rose-500 text-white' : 'bg-black/60 backdrop-blur-sm text-white hover:bg-black/80'
                      }`}
                    >
                      <Info size={20} />
                    </button>
                    <button 
                      onClick={handleFullscreen}
                      className="p-3 bg-black/60 backdrop-blur-sm text-white rounded-xl hover:bg-black/80 transition-colors"
                    >
                      {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button 
                  onClick={() => navigateRoom('prev')}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors pointer-events-auto"
                >
                  <ChevronLeft size={24} className="text-gray-800" />
                </button>
                <button 
                  onClick={() => navigateRoom('next')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors pointer-events-auto"
                >
                  <ChevronRight size={24} className="text-gray-800" />
                </button>

                {/* Room Navigation Buttons */}
                <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {selectedProperty.rooms.map((room) => (
                      <button
                        key={room.id}
                        onClick={() => {
                          setActiveRoom(room);
                          setRotation({ x: 0, y: 0 });
                        }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                          activeRoom.id === room.id
                            ? 'bg-white text-gray-900 shadow-lg'
                            : 'bg-black/50 backdrop-blur-sm text-white hover:bg-black/70'
                        }`}
                      >
                        <room.icon size={18} />
                        {room.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* VR Mode Button */}
                <button
                  onClick={() => {
                    const scene = document.querySelector('a-scene');
                    if (scene && scene.enterVR) {
                      scene.enterVR();
                    }
                  }}
                  className="absolute bottom-20 right-4 flex items-center gap-2 px-4 py-3 bg-rose-500 text-white rounded-xl font-semibold shadow-lg hover:bg-rose-600 transition-colors pointer-events-auto"
                >
                  <Eye size={18} />
                  Enter VR
                </button>

                {/* Drag instruction */}
                <div className="absolute bottom-20 left-4 bg-black/40 backdrop-blur-sm text-white/80 text-xs px-3 py-2 rounded-lg pointer-events-none">
                  Click and drag to look around
                </div>
              </div>
            </div>

            {/* Property Info Card */}
            {showInfo && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6 animate-fadeIn">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h2>
                    <p className="text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={16} />
                      {selectedProperty.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{selectedProperty.price}</p>
                    <p className="text-gray-500 text-sm">per night</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-rose-500 fill-rose-500" />
                    <span className="font-semibold">{selectedProperty.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{selectedProperty.reviews} reviews</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {selectedProperty.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Room Thumbnails */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <h3 className="font-bold text-gray-900 mb-3">All Rooms</h3>
              <div className="grid grid-cols-5 gap-3">
                {selectedProperty.rooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => {
                      setActiveRoom(room);
                      setRotation({ x: 0, y: 0 });
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-video group ${
                      activeRoom.id === room.id ? 'ring-2 ring-rose-500' : ''
                    }`}
                  >
                    <img 
                      src={room.panorama} 
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">{room.name}</p>
                    </div>
                    {activeRoom.id === room.id && (
                      <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Property List */}
          <div className="space-y-4">
            <h3 className="font-bold text-gray-900">More Properties</h3>
            <div className="space-y-3">
              {VR_PROPERTIES.map((property) => (
                <button
                  key={property.id}
                  onClick={() => setSelectedProperty(property)}
                  className={`w-full text-left bg-white rounded-xl border overflow-hidden transition-all ${
                    selectedProperty.id === property.id 
                      ? 'border-rose-500 ring-1 ring-rose-500' 
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="relative aspect-video">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-semibold">
                      <Eye size={12} className="text-rose-500" />
                      VR Tour
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(property.id);
                      }}
                      className="absolute top-2 right-2"
                    >
                      <Heart 
                        size={20} 
                        className={`${
                          favorites.includes(property.id) 
                            ? 'fill-rose-500 text-rose-500' 
                            : 'fill-black/40 text-white'
                        } drop-shadow-md`}
                      />
                    </button>
                  </div>
                  <div className="p-3">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{property.name}</h4>
                      <div className="flex items-center gap-1">
                        <Star size={12} className="fill-gray-800 text-gray-800" />
                        <span className="text-xs font-medium">{property.rating}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{property.location}</p>
                    <p className="text-sm font-semibold text-gray-900">{property.price}/night</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Tips Card */}
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-100 rounded-lg">
                  <Sparkles size={20} className="text-rose-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">VR Tips</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Click and drag to look around</li>
                    <li>• Use room buttons to navigate</li>
                    <li>• Click "Enter VR" for immersive mode</li>
                    <li>• Works with VR headsets!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
