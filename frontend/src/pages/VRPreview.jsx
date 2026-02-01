import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize2, 
  RotateCcw, ChevronLeft, ChevronRight, MapPin, Star, 
  Camera, Clock, Sparkles, Eye, Heart, Share2, Info
} from 'lucide-react';
import { tripAPI } from '../services/api';

// Sample VR/360 destinations with placeholder images
const VR_DESTINATIONS = [
  {
    id: 1,
    name: 'Eiffel Tower',
    location: 'Paris, France',
    image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=400',
    description: 'Experience the iconic iron lattice tower from 360°',
    rating: 4.9,
    views: '2.3M',
    category: 'Landmarks'
  },
  {
    id: 2,
    name: 'Santorini Sunset',
    location: 'Oia, Greece',
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=400',
    description: 'Witness the famous Santorini sunset over the caldera',
    rating: 4.8,
    views: '1.8M',
    category: 'Scenic'
  },
  {
    id: 3,
    name: 'Machu Picchu',
    location: 'Cusco, Peru',
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400',
    description: 'Explore the ancient Incan citadel in the clouds',
    rating: 4.9,
    views: '3.1M',
    category: 'Historical'
  },
  {
    id: 4,
    name: 'Tokyo Streets',
    location: 'Shibuya, Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400',
    description: 'Walk through the vibrant neon-lit streets of Tokyo',
    rating: 4.7,
    views: '2.1M',
    category: 'Urban'
  },
  {
    id: 5,
    name: 'Northern Lights',
    location: 'Tromsø, Norway',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
    description: 'Witness the magical Aurora Borealis dance',
    rating: 5.0,
    views: '4.5M',
    category: 'Natural Wonder'
  },
  {
    id: 6,
    name: 'Great Barrier Reef',
    location: 'Queensland, Australia',
    image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=1200',
    thumbnail: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=400',
    description: 'Dive into the world\'s largest coral reef system',
    rating: 4.8,
    views: '2.8M',
    category: 'Underwater'
  }
];

export default function VRPreview() {
  const { tripId } = useParams();
  const [selectedDestination, setSelectedDestination] = useState(VR_DESTINATIONS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [rotation, setRotation] = useState(0);
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    loadTripContext();
  }, [tripId]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setRotation(prev => (prev + 0.5) % 360);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const loadTripContext = async () => {
    if (tripId) {
      try {
        const res = await tripAPI.getTripContext(Number(tripId));
        if (res.data.success) {
          setTrip(res.data.data.trip);
        }
      } catch (e) {
        console.log('Using demo mode');
      }
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleFullscreen = () => {
    const viewer = document.getElementById('vr-viewer');
    if (!document.fullscreenElement) {
      viewer?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const navigateDestination = (direction) => {
    const currentIndex = VR_DESTINATIONS.findIndex(d => d.id === selectedDestination.id);
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % VR_DESTINATIONS.length;
    } else {
      newIndex = (currentIndex - 1 + VR_DESTINATIONS.length) % VR_DESTINATIONS.length;
    }
    setSelectedDestination(VR_DESTINATIONS[newIndex]);
    setRotation(0);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-3 hover:bg-slate-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-slate-800">VR Destination Preview</h1>
          <p className="text-slate-500 flex items-center gap-2 mt-1">
            <Eye size={16} className="text-teal-500" />
            Explore destinations before you travel
          </p>
        </div>
      </div>

      {/* MAIN VR VIEWER */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* VIEWER */}
        <div className="lg:col-span-3 space-y-4">
          <div 
            id="vr-viewer"
            className="relative bg-slate-900 rounded-3xl overflow-hidden aspect-video group"
          >
            {/* MAIN IMAGE WITH SIMULATED 360 EFFECT */}
            <div 
              className="absolute inset-0 transition-transform duration-100"
              style={{ 
                transform: `translateX(${-rotation * 2}px)`,
                width: '200%'
              }}
            >
              <img 
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* OVERLAY GRADIENT */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

            {/* VR INDICATOR */}
            <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-black/50 backdrop-blur-sm rounded-full">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white text-sm font-medium">360° VR</span>
            </div>

            {/* DESTINATION INFO */}
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-1 bg-teal-500/90 text-white text-xs font-medium rounded-full">
                      {selectedDestination.category}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full">
                      <Star size={12} className="fill-yellow-400 text-yellow-400" />
                      {selectedDestination.rating}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-1">{selectedDestination.name}</h2>
                  <p className="text-white/80 flex items-center gap-2">
                    <MapPin size={16} />
                    {selectedDestination.location}
                  </p>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => toggleFavorite(selectedDestination.id)}
                    className={`p-3 rounded-full backdrop-blur-sm transition-colors ${
                      favorites.includes(selectedDestination.id) 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    <Heart size={20} className={favorites.includes(selectedDestination.id) ? 'fill-current' : ''} />
                  </button>
                  <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors">
                    <Share2 size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* NAVIGATION ARROWS */}
            <button 
              onClick={() => navigateDestination('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => navigateDestination('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* CONTROLS */}
          <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-3 rounded-xl transition-colors ${
                  isPlaying ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <button 
                onClick={() => setRotation(0)}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <RotateCcw size={20} />
              </button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Eye size={16} />
                {selectedDestination.views} views
              </div>
              <button 
                onClick={() => setShowInfo(!showInfo)}
                className={`p-3 rounded-xl transition-colors ${
                  showInfo ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Info size={20} />
              </button>
              <button 
                onClick={handleFullscreen}
                className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <Maximize2 size={20} />
              </button>
            </div>
          </div>

          {/* INFO PANEL */}
          {showInfo && (
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl border border-teal-100 p-6">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Sparkles className="text-teal-500" size={20} />
                About This Location
              </h3>
              <p className="text-slate-600 mb-4">{selectedDestination.description}</p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-slate-400" />
                  <span className="text-slate-600">Best time: Early morning or sunset</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Camera size={16} className="text-slate-400" />
                  <span className="text-slate-600">Great for photography</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* THUMBNAIL GALLERY */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-slate-800">Explore More</h3>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {VR_DESTINATIONS.map(dest => (
              <button
                key={dest.id}
                onClick={() => {
                  setSelectedDestination(dest);
                  setRotation(0);
                }}
                className={`relative rounded-2xl overflow-hidden group transition-all ${
                  selectedDestination.id === dest.id 
                    ? 'ring-2 ring-teal-500 ring-offset-2' 
                    : 'hover:ring-2 hover:ring-slate-200 hover:ring-offset-2'
                }`}
              >
                <img 
                  src={dest.thumbnail}
                  alt={dest.name}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white font-semibold text-sm truncate">{dest.name}</p>
                  <p className="text-white/70 text-xs truncate">{dest.location}</p>
                </div>
                {selectedDestination.id === dest.id && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-teal-500 rounded-full" />
                )}
                {favorites.includes(dest.id) && (
                  <Heart size={14} className="absolute top-2 left-2 text-red-500 fill-red-500" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8">
        <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">Experience Before You Travel</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={Eye}
            title="360° Virtual Tours"
            description="Explore destinations from every angle with immersive 360-degree views"
          />
          <FeatureCard
            icon={Camera}
            title="High-Resolution Imagery"
            description="Crystal clear photos and videos to help you plan your perfect trip"
          />
          <FeatureCard
            icon={Sparkles}
            title="AI Recommendations"
            description="Get personalized destination suggestions based on your preferences"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div className="text-center p-6 rounded-2xl bg-slate-50">
      <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-teal-600" />
      </div>
      <h4 className="font-bold text-slate-800 mb-2">{title}</h4>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
