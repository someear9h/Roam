import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Phone, MapPin, Share2, Shield, Navigation, Siren, Ambulance, 
  Headphones, MessageCircle, FileText, AlertTriangle, Languages, 
  Loader2, Send, ChevronRight, Heart, Building, Globe, Copy,
  Check, ExternalLink, Users, Clock, PhoneCall, X
} from 'lucide-react';
import { emergencyAPI, tripAPI } from '../services/api';

export default function Emergency() {
  const { tripId: urlTripId } = useParams();
  const [isSharing, setIsSharing] = useState(false);
  const [location, setLocation] = useState({ city: 'Detecting...', country: '', lat: null, lng: null });
  const [issueText, setIssueText] = useState('');
  const [isLoadingHelp, setIsLoadingHelp] = useState(false);
  const [aiHelp, setAiHelp] = useState(null);
  const [tripId, setTripId] = useState(urlTripId || null);
  const [currentTrip, setCurrentTrip] = useState(null);
  const [copiedNumber, setCopiedNumber] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    loadTrip();
    detectLocation();
  }, [urlTripId]);

  const loadTrip = async () => {
    try {
      if (urlTripId) {
        const res = await tripAPI.getTrip(urlTripId);
        if (res.data.success && res.data.data) {
          setTripId(res.data.data.id);
          setCurrentTrip(res.data.data);
        }
      }
    } catch (e) {}
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          setLocation({
            city: data.address?.city || data.address?.town || 'Unknown',
            country: data.address?.country || 'Unknown',
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        } catch (e) {
          setLocation({ city: 'Location detected', country: '', lat: position.coords.latitude, lng: position.coords.longitude });
        }
      }, () => {
        setLocation({ city: 'Unable to detect', country: '', lat: null, lng: null });
      });
    }
  };

  const getEmergencyHelp = async () => {
    if (!issueText.trim()) return;
    
    setIsLoadingHelp(true);
    try {
      const response = await emergencyAPI.getEmergencyInfo({
        tripId: tripId || 1,
        issue: issueText
      });

      if (response.data.success) {
        setAiHelp(response.data.data.response);
      }
    } catch (error) {
      setAiHelp('Unable to connect. For immediate help, call the local emergency number: 112 (Europe) or 911 (USA)');
    } finally {
      setIsLoadingHelp(false);
    }
  };

  const shareLocation = () => {
    setShowShareModal(true);
    setIsSharing(true);
    
    if (navigator.share && location.lat) {
      navigator.share({
        title: 'Emergency - My Location',
        text: `I need help! My current location:`,
        url: `https://maps.google.com/?q=${location.lat},${location.lng}`
      }).catch(() => {});
    }
  };

  const copyNumber = (number) => {
    navigator.clipboard.writeText(number);
    setCopiedNumber(number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  const callNumber = (number) => {
    window.location.href = `tel:${number}`;
  };

  const emergencyNumbers = [
    { label: 'Emergency (EU)', number: '112', icon: Siren, color: 'red', description: 'Police, Fire, Ambulance' },
    { label: 'Police', number: '17', icon: Shield, color: 'blue', description: 'Local police department' },
    { label: 'Ambulance', number: '15', icon: Ambulance, color: 'green', description: 'Medical emergencies' },
    { label: 'Fire', number: '18', icon: Siren, color: 'orange', description: 'Fire department' },
  ];

  return (
    <div className="space-y-8 pb-24">
      {/* SHARE LOCATION MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Location Shared</h3>
            <p className="text-slate-500 mb-6">
              Your live location is being shared. Emergency contacts will be able to see your location.
            </p>
            {location.lat && (
              <a 
                href={`https://maps.google.com/?q=${location.lat},${location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-coral-500 font-semibold hover:underline mb-6"
              >
                <ExternalLink size={18} />
                View on Google Maps
              </a>
            )}
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full py-4 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-600 font-bold text-sm uppercase tracking-wider">Emergency Mode</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Emergency Assistance</h1>
          <div className="flex items-center gap-2 mt-2 text-gray-500">
            <MapPin size={18} className="text-gray-400" />
            <span>
              {location.city}{location.country ? `, ${location.country}` : ''}
            </span>
            <button onClick={detectLocation} className="text-coral-500 text-sm font-semibold hover:underline">
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* CRITICAL ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* EMERGENCY CALL BUTTON */}
        <button 
          onClick={() => callNumber('112')}
          className="relative group bg-gradient-to-br from-red-500 to-red-600 rounded-3xl p-8 text-white overflow-hidden hover:from-red-600 hover:to-red-700 transition-all shadow-xl shadow-red-500/30"
        >
          <div className="absolute inset-0 bg-white/5 opacity-50"></div>
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Phone size={40} />
            </div>
            <h2 className="text-3xl font-bold mb-2">Call Emergency</h2>
            <p className="text-red-100 mb-4">Tap to dial 112 immediately</p>
            <span className="text-5xl font-bold">112</span>
          </div>
        </button>

        {/* SHARE LOCATION */}
        <div className={`rounded-3xl p-8 border-2 transition-all ${
          isSharing ? 'bg-green-50 border-green-300' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-4 rounded-2xl ${isSharing ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
              <Share2 size={28} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">Share Live Location</h3>
              <p className="text-gray-500 text-sm">
                {isSharing ? 'Broadcasting your location...' : 'Send your GPS coordinates to emergency contacts'}
              </p>
            </div>
          </div>
          
          <button
            onClick={shareLocation}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
              isSharing 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gradient-to-r from-coral-500 to-coral-600 text-white hover:from-coral-600 hover:to-coral-700'
            }`}
          >
            {isSharing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                Sharing Location...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Navigation size={20} />
                Share My Location
              </span>
            )}
          </button>
          
          {location.lat && (
            <p className="text-sm text-slate-500 mt-4 text-center">
              📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          )}
        </div>
      </div>

      {/* EMERGENCY NUMBERS */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Emergency Numbers</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {emergencyNumbers.map((item, idx) => {
            const colorClasses = {
              red: 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100',
              blue: 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100',
              green: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
              orange: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
            };
            
            return (
              <div key={idx} className={`rounded-2xl border-2 p-5 transition-all ${colorClasses[item.color]}`}>
                <div className="flex items-center justify-between mb-3">
                  <item.icon size={24} />
                  <button 
                    onClick={() => copyNumber(item.number)}
                    className="p-1 hover:bg-black/10 rounded-lg transition-colors"
                  >
                    {copiedNumber === item.number ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
                <p className="font-bold text-lg mb-1">{item.label}</p>
                <p className="text-3xl font-bold mb-2">{item.number}</p>
                <p className="text-sm opacity-80">{item.description}</p>
                <button
                  onClick={() => callNumber(item.number)}
                  className="mt-4 w-full py-2 bg-white/50 rounded-xl font-semibold text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneCall size={16} /> Call Now
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI EMERGENCY HELP */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <MessageCircle size={24} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white">AI Emergency Assistant</h3>
            <p className="text-sm text-amber-100">Describe your situation for immediate guidance</p>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={issueText}
              onChange={(e) => setIssueText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && getEmergencyHelp()}
              placeholder="e.g., I lost my passport, I'm having a medical issue..."
              className="flex-1 px-5 py-4 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            <button
              onClick={getEmergencyHelp}
              disabled={isLoadingHelp || !issueText.trim()}
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isLoadingHelp ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
            </button>
          </div>

          {/* Quick Issues */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['Lost passport', 'Medical emergency', 'Theft/robbery', 'Lost/stranded', 'Accident'].map((issue) => (
              <button
                key={issue}
                onClick={() => { setIssueText(issue); }}
                className="px-4 py-2 bg-slate-100 text-slate-600 text-sm rounded-full hover:bg-slate-200 transition-colors"
              >
                {issue}
              </button>
            ))}
          </div>

          {aiHelp && (
            <div className="mt-6 p-6 bg-amber-50 border border-amber-100 rounded-2xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 shrink-0 mt-1" size={20} />
                <div>
                  <h4 className="font-bold text-amber-800 mb-2">Emergency Guidance</h4>
                  <p className="text-amber-700 leading-relaxed whitespace-pre-wrap">{aiHelp}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADDITIONAL RESOURCES */}
      <div className="grid md:grid-cols-3 gap-6">
        <ResourceCard 
          icon={Building}
          title="Embassy Information"
          description="Find your country's embassy or consulate"
          action="Get Embassy Info"
          onClick={() => { setIssueText('Find my country\'s embassy contact'); getEmergencyHelp(); }}
        />
        <ResourceCard 
          icon={Heart}
          title="Nearest Hospital"
          description="Locate medical facilities nearby"
          action="Find Hospital"
          onClick={() => { setIssueText('Find the nearest hospital'); getEmergencyHelp(); }}
        />
        <ResourceCard 
          icon={Globe}
          title="Travel Insurance"
          description="Access your insurance provider"
          action="Insurance Help"
          onClick={() => { setIssueText('How do I contact my travel insurance?'); getEmergencyHelp(); }}
        />
      </div>
    </div>
  );
}

function ResourceCard({ icon: Icon, title, description, action, onClick }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-slate-100 rounded-xl text-slate-600">
          <Icon size={24} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">{title}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className="w-full py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
      >
        {action} <ChevronRight size={18} />
      </button>
    </div>
  );
}
