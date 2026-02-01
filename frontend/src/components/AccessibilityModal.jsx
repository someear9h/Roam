import React, { useState, useEffect } from 'react';
import { 
  X, Accessibility, Eye, Ear, Languages, Type, 
  Volume2, Hand, Loader2, Check
} from 'lucide-react';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ACCESSIBILITY_OPTIONS = [
  { id: 'wheelchair', label: 'Wheelchair Access', icon: Accessibility, description: 'Prioritize wheelchair-accessible routes and venues' },
  { id: 'visual', label: 'Visual Impairment', icon: Eye, description: 'Enhanced descriptions and screen reader optimization' },
  { id: 'hearing', label: 'Hearing Impairment', icon: Ear, description: 'Visual alerts and sign language support information' },
  { id: 'mobility', label: 'Limited Mobility', icon: Hand, description: 'Avoid stairs, long walks; prefer elevators and shuttles' },
  { id: 'large_text', label: 'Large Text', icon: Type, description: 'Increase text size throughout the app' },
  { id: 'audio_desc', label: 'Audio Descriptions', icon: Volume2, description: 'Enable audio descriptions for VR experiences' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' },
];

export default function AccessibilityModal({ isOpen, onClose }) {
  const { user, getProfile } = useAuth();
  const [selectedNeeds, setSelectedNeeds] = useState([]);
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setLanguage(user.language || 'en');
      // Parse existing accessibility needs
      if (user.accessibility_needs) {
        try {
          const needs = JSON.parse(user.accessibility_needs);
          setSelectedNeeds(Array.isArray(needs) ? needs : []);
        } catch {
          setSelectedNeeds([]);
        }
      }
    }
  }, [user]);

  if (!isOpen) return null;

  const toggleNeed = (needId) => {
    setSelectedNeeds(prev => 
      prev.includes(needId) 
        ? prev.filter(id => id !== needId)
        : [...prev, needId]
    );
    setSaved(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await authAPI.updatePreferences({
        language,
        accessibility_needs: JSON.stringify(selectedNeeds)
      });
      
      // Refresh user profile
      await getProfile();
      setSaved(true);
      
      // Apply large text if selected
      if (selectedNeeds.includes('large_text')) {
        document.documentElement.style.fontSize = '18px';
      } else {
        document.documentElement.style.fontSize = '16px';
      }

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-xl text-teal-600">
              <Accessibility size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Accessibility & Preferences</h2>
              <p className="text-sm text-slate-500">Customize your travel experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Language Selection */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Languages size={16} />
              Preferred Language
            </label>
            <div className="grid grid-cols-4 gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => { setLanguage(lang.code); setSaved(false); }}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    language === lang.code
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Needs */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
              <Accessibility size={16} />
              Accessibility Needs
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {ACCESSIBILITY_OPTIONS.map(option => {
                const Icon = option.icon;
                const isSelected = selectedNeeds.includes(option.id);
                
                return (
                  <button
                    key={option.id}
                    onClick={() => toggleNeed(option.id)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-teal-500 bg-teal-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm ${isSelected ? 'text-teal-700' : 'text-slate-700'}`}>
                        {option.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">{option.description}</p>
                    </div>
                    {isSelected && (
                      <Check size={18} className="text-teal-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <p className="text-sm text-blue-700">
              <strong>How we use this:</strong> Your preferences help us customize itineraries, 
              filter accessible venues, and provide relevant AI recommendations. 
              All data is stored securely and only used to improve your experience.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : saved ? (
              <Check size={18} />
            ) : null}
            {saved ? 'Saved!' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}
