import React, { useState, useEffect } from 'react';
import { 
  X, ChevronRight, Loader2, Check, Settings,
  Compass, Building, Palmtree, Mountain, ShoppingBag, Camera,
  Music, TreePine, Waves, Globe, Heart, Sparkles, Coffee, Sun, Moon,
  Utensils, Accessibility
} from 'lucide-react';
import { preferencesAPI } from '../services/api';

const TRAVEL_STYLES = [
  { id: 'adventure', icon: Compass, label: 'Adventure Seeker', description: 'Thrill & exploration' },
  { id: 'relaxation', icon: Palmtree, label: 'Relaxation', description: 'Beaches & spas' },
  { id: 'culture', icon: Building, label: 'Culture & History', description: 'Museums & heritage' },
  { id: 'nature', icon: Mountain, label: 'Nature Lover', description: 'Parks & wildlife' },
  { id: 'shopping', icon: ShoppingBag, label: 'Shopping & Luxury', description: 'Boutiques & malls' },
  { id: 'photography', icon: Camera, label: 'Photography', description: 'Scenic spots' },
];

const INTERESTS = [
  { icon: Music, label: 'Music & Nightlife' },
  { icon: TreePine, label: 'Outdoor Activities' },
  { icon: Building, label: 'Architecture' },
  { icon: Waves, label: 'Water Sports' },
  { icon: Camera, label: 'Local Art' },
  { icon: Globe, label: 'Local Markets' },
  { icon: Heart, label: 'Wellness & Yoga' },
  { icon: Sparkles, label: 'Festivals & Events' },
  { icon: Coffee, label: 'Cafés & Coffee' },
  { icon: Sun, label: 'Beaches' },
  { icon: Moon, label: 'Stargazing' },
  { icon: Compass, label: 'Road Trips' },
];

const FOOD_OPTIONS = [
  { label: 'Local Cuisine', emoji: '🍜' },
  { label: 'Street Food', emoji: '🌮' },
  { label: 'Fine Dining', emoji: '🍽️' },
  { label: 'Vegetarian', emoji: '🥗' },
  { label: 'Vegan', emoji: '🌱' },
  { label: 'Seafood', emoji: '🦐' },
  { label: 'Halal', emoji: '☪️' },
  { label: 'Kosher', emoji: '✡️' },
];

const PACE_OPTIONS = [
  { value: 'slow', label: 'Relaxed', description: 'Fewer activities, more free time', emoji: '🐢' },
  { value: 'moderate', label: 'Balanced', description: 'Mix of activities and relaxation', emoji: '🚶' },
  { value: 'fast', label: 'Action-Packed', description: 'See and do as much as possible', emoji: '🏃' },
];

const ACCESSIBILITY_OPTIONS = [
  { id: 'wheelchair', label: 'Wheelchair Access', description: 'Ramps, elevators, accessible paths' },
  { id: 'mobility', label: 'Limited Mobility', description: 'Minimize walking, seating options' },
  { id: 'visual', label: 'Visual Impairment', description: 'Audio guides, tactile experiences' },
  { id: 'hearing', label: 'Hearing Impairment', description: 'Visual cues, sign language' },
  { id: 'none', label: 'No Specific Needs', description: 'Standard accessibility' },
];

export default function PreferencesModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('style');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    travelStyle: [],
    interests: [],
    foodPreferences: [],
    pace: 'moderate',
    accessibility: []
  });

  useEffect(() => {
    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const res = await preferencesAPI.getPreferences();
      if (res.data.success && res.data.data) {
        const data = res.data.data;
        setPreferences({
          travelStyle: data.travel_style ? [data.travel_style] : [],
          interests: data.interests || [],
          foodPreferences: data.food_preference ? [data.food_preference] : [],
          pace: data.pace || 'moderate',
          accessibility: data.accessibility_needs ? data.accessibility_needs.split(',') : []
        });
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
    setIsLoading(false);
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      await preferencesAPI.updatePreferences({
        travel_style: preferences.travelStyle[0] || 'balanced',
        interests: preferences.interests,
        food_preference: preferences.foodPreferences[0] || 'all',
        pace: preferences.pace,
      });
      onClose();
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
    setIsSaving(false);
  };

  const toggleArrayPreference = (key, value) => {
    setPreferences(prev => ({
      ...prev,
      [key]: prev[key].includes(value) 
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value]
    }));
  };

  const setPacePreference = (pace) => {
    setPreferences(prev => ({ ...prev, pace }));
  };

  if (!isOpen) return null;

  const TABS = [
    { id: 'style', label: 'Travel Style', icon: Compass },
    { id: 'interests', label: 'Interests', icon: Heart },
    { id: 'food', label: 'Food', icon: Utensils },
    { id: 'pace', label: 'Pace', icon: Settings },
    { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-coral-100 rounded-xl">
              <Settings className="text-coral-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Travel Preferences</h2>
              <p className="text-sm text-gray-500">Customize your travel experience</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-2 mx-4 mt-4 bg-gray-100 rounded-xl overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-coral-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon size={16} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin text-coral-500" size={32} />
            </div>
          ) : (
            <>
              {/* Travel Style Tab */}
              {activeTab === 'style' && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">Select your preferred travel styles</p>
                  <div className="grid grid-cols-2 gap-4">
                    {TRAVEL_STYLES.map(style => (
                      <button
                        key={style.id}
                        onClick={() => toggleArrayPreference('travelStyle', style.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${
                          preferences.travelStyle.includes(style.id) 
                            ? 'border-coral-500 bg-coral-50' 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <style.icon className={`w-8 h-8 mb-2 ${preferences.travelStyle.includes(style.id) ? 'text-coral-600' : 'text-gray-400'}`} />
                        <p className={`font-semibold ${preferences.travelStyle.includes(style.id) ? 'text-coral-700' : 'text-gray-700'}`}>{style.label}</p>
                        <p className="text-sm text-gray-500 mt-1">{style.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Interests Tab */}
              {activeTab === 'interests' && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">What interests you most?</p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {INTERESTS.map(interest => (
                      <button
                        key={interest.label}
                        onClick={() => toggleArrayPreference('interests', interest.label)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
                          preferences.interests.includes(interest.label) 
                            ? 'border-coral-500 bg-coral-50 text-coral-700' 
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <interest.icon size={18} className={preferences.interests.includes(interest.label) ? 'text-coral-600' : 'text-gray-400'} />
                        <span className="text-sm font-medium">{interest.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Food Tab */}
              {activeTab === 'food' && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">Your food & dining preferences</p>
                  <div className="grid grid-cols-2 gap-3">
                    {FOOD_OPTIONS.map(food => (
                      <button
                        key={food.label}
                        onClick={() => toggleArrayPreference('foodPreferences', food.label)}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          preferences.foodPreferences.includes(food.label) 
                            ? 'border-coral-500 bg-coral-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-2xl">{food.emoji}</span>
                        <span className={`font-medium ${preferences.foodPreferences.includes(food.label) ? 'text-coral-700' : 'text-gray-700'}`}>{food.label}</span>
                        {preferences.foodPreferences.includes(food.label) && <Check size={18} className="text-coral-500 ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pace Tab */}
              {activeTab === 'pace' && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">How do you like to travel?</p>
                  <div className="space-y-3">
                    {PACE_OPTIONS.map(pace => (
                      <button
                        key={pace.value}
                        onClick={() => setPacePreference(pace.value)}
                        className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
                          preferences.pace === pace.value 
                            ? 'border-coral-500 bg-coral-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-3xl">{pace.emoji}</span>
                        <div className="flex-1">
                          <p className={`font-semibold ${preferences.pace === pace.value ? 'text-coral-700' : 'text-gray-700'}`}>{pace.label}</p>
                          <p className="text-sm text-gray-500 mt-1">{pace.description}</p>
                        </div>
                        {preferences.pace === pace.value && (
                          <div className="w-6 h-6 bg-coral-500 rounded-full flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Accessibility Tab */}
              {activeTab === 'accessibility' && (
                <div className="space-y-4">
                  <p className="text-gray-600 text-center mb-6">Any accessibility requirements?</p>
                  <div className="space-y-3">
                    {ACCESSIBILITY_OPTIONS.map(option => (
                      <button
                        key={option.id}
                        onClick={() => toggleArrayPreference('accessibility', option.id)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                          preferences.accessibility.includes(option.id) 
                            ? 'border-coral-500 bg-coral-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                          preferences.accessibility.includes(option.id) ? 'bg-coral-500 border-coral-500' : 'border-gray-300'
                        }`}>
                          {preferences.accessibility.includes(option.id) && <Check size={14} className="text-white" />}
                        </div>
                        <div>
                          <p className={`font-medium ${preferences.accessibility.includes(option.id) ? 'text-coral-700' : 'text-gray-700'}`}>{option.label}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={savePreferences}
            disabled={isSaving}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-coral-500 to-orange-500 text-white font-semibold rounded-xl hover:from-coral-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check size={20} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
