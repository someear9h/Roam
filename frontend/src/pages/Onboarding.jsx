import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, ChevronLeft, Plane, MapPin, Utensils, 
  Camera, Compass, Clock, Accessibility, Sparkles, Heart,
  Globe, Mountain, Building, Palmtree, Music, ShoppingBag,
  Coffee, Wine, TreePine, Waves, Sun, Moon, Check
} from 'lucide-react';
import { preferencesAPI } from '../services/api';

const STEPS = [
  { id: 'welcome', title: 'Welcome', subtitle: 'Let\'s personalize your travel experience' },
  { id: 'style', title: 'Travel Style', subtitle: 'How do you like to explore?' },
  { id: 'interests', title: 'Interests', subtitle: 'What excites you most?' },
  { id: 'food', title: 'Food & Dining', subtitle: 'Your culinary preferences' },
  { id: 'pace', title: 'Travel Pace', subtitle: 'Fast-paced or relaxed?' },
  { id: 'accessibility', title: 'Accessibility', subtitle: 'Any special requirements?' },
  { id: 'complete', title: 'All Set!', subtitle: 'Your profile is ready' }
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preferences, setPreferences] = useState({
    travelStyle: [],
    interests: [],
    foodPreferences: [],
    pace: 'moderate',
    accessibility: []
  });

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await preferencesAPI.savePreferences(preferences);
    } catch (error) {
      console.log('Saving preferences locally');
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
    setIsSubmitting(false);
    navigate('/dashboard');
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

  const progress = (currentStep / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex flex-col">
      {/* PROGRESS BAR */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          
          {/* STEP INDICATORS */}
          {currentStep > 0 && currentStep < STEPS.length - 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {STEPS.slice(1, -1).map((step, idx) => (
                <div
                  key={step.id}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx + 1 === currentStep 
                      ? 'bg-teal-500 scale-125' 
                      : idx + 1 < currentStep 
                        ? 'bg-teal-300' 
                        : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          )}

          {/* STEP CONTENT */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12">
            
            {/* WELCOME STEP */}
            {currentStep === 0 && (
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-teal-200">
                  <Plane className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 mb-3">Welcome to Roam</h1>
                  <p className="text-lg text-slate-500 max-w-md mx-auto">
                    Let's create your personalized travel profile. This helps us recommend the perfect experiences for you.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                  <Feature icon={MapPin} label="Smart Tips" />
                  <Feature icon={Utensils} label="Food Picks" />
                  <Feature icon={Camera} label="Hidden Gems" />
                </div>

                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-teal-200 hover:shadow-xl hover:-translate-y-0.5 transition-all"
                >
                  Let's Get Started
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* TRAVEL STYLE STEP */}
            {currentStep === 1 && (
              <StepContainer
                title="What's your travel style?"
                subtitle="Select all that apply"
              >
                <div className="grid grid-cols-2 gap-4">
                  <StyleOption
                    icon={Compass}
                    label="Adventure Seeker"
                    description="Thrill & exploration"
                    selected={preferences.travelStyle.includes('adventure')}
                    onClick={() => toggleArrayPreference('travelStyle', 'adventure')}
                  />
                  <StyleOption
                    icon={Palmtree}
                    label="Relaxation"
                    description="Beaches & spas"
                    selected={preferences.travelStyle.includes('relaxation')}
                    onClick={() => toggleArrayPreference('travelStyle', 'relaxation')}
                  />
                  <StyleOption
                    icon={Building}
                    label="Culture & History"
                    description="Museums & heritage"
                    selected={preferences.travelStyle.includes('culture')}
                    onClick={() => toggleArrayPreference('travelStyle', 'culture')}
                  />
                  <StyleOption
                    icon={Mountain}
                    label="Nature Lover"
                    description="Parks & wildlife"
                    selected={preferences.travelStyle.includes('nature')}
                    onClick={() => toggleArrayPreference('travelStyle', 'nature')}
                  />
                  <StyleOption
                    icon={ShoppingBag}
                    label="Shopping & Luxury"
                    description="Boutiques & malls"
                    selected={preferences.travelStyle.includes('shopping')}
                    onClick={() => toggleArrayPreference('travelStyle', 'shopping')}
                  />
                  <StyleOption
                    icon={Camera}
                    label="Photography"
                    description="Scenic spots"
                    selected={preferences.travelStyle.includes('photography')}
                    onClick={() => toggleArrayPreference('travelStyle', 'photography')}
                  />
                </div>
              </StepContainer>
            )}

            {/* INTERESTS STEP */}
            {currentStep === 2 && (
              <StepContainer
                title="What interests you most?"
                subtitle="Pick your top interests"
              >
                <div className="flex flex-wrap gap-3 justify-center">
                  {[
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
                  ].map(interest => (
                    <InterestChip
                      key={interest.label}
                      icon={interest.icon}
                      label={interest.label}
                      selected={preferences.interests.includes(interest.label)}
                      onClick={() => toggleArrayPreference('interests', interest.label)}
                    />
                  ))}
                </div>
              </StepContainer>
            )}

            {/* FOOD STEP */}
            {currentStep === 3 && (
              <StepContainer
                title="Food & Dining Preferences"
                subtitle="Tell us about your taste"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Local Cuisine', emoji: '🍜' },
                    { label: 'Street Food', emoji: '🌮' },
                    { label: 'Fine Dining', emoji: '🍽️' },
                    { label: 'Vegetarian', emoji: '🥗' },
                    { label: 'Vegan', emoji: '🌱' },
                    { label: 'Seafood', emoji: '🦐' },
                    { label: 'Halal', emoji: '☪️' },
                    { label: 'Kosher', emoji: '✡️' },
                  ].map(food => (
                    <FoodOption
                      key={food.label}
                      label={food.label}
                      emoji={food.emoji}
                      selected={preferences.foodPreferences.includes(food.label)}
                      onClick={() => toggleArrayPreference('foodPreferences', food.label)}
                    />
                  ))}
                </div>
              </StepContainer>
            )}

            {/* PACE STEP */}
            {currentStep === 4 && (
              <StepContainer
                title="What's your ideal travel pace?"
                subtitle="How do you like to spend your days?"
              >
                <div className="space-y-4">
                  <PaceOption
                    label="Relaxed"
                    description="Few activities, lots of free time. Enjoy the moment."
                    emoji="🐢"
                    selected={preferences.pace === 'relaxed'}
                    onClick={() => setPacePreference('relaxed')}
                  />
                  <PaceOption
                    label="Moderate"
                    description="Balance of planned activities and spontaneous exploration."
                    emoji="🚶"
                    selected={preferences.pace === 'moderate'}
                    onClick={() => setPacePreference('moderate')}
                  />
                  <PaceOption
                    label="Fast-Paced"
                    description="Pack in as much as possible. See everything!"
                    emoji="🚀"
                    selected={preferences.pace === 'fast'}
                    onClick={() => setPacePreference('fast')}
                  />
                </div>
              </StepContainer>
            )}

            {/* ACCESSIBILITY STEP */}
            {currentStep === 5 && (
              <StepContainer
                title="Accessibility Needs"
                subtitle="Any special requirements? (Optional)"
              >
                <div className="space-y-4">
                  {[
                    { label: 'Wheelchair Accessible', description: 'Ramps, elevators, accessible paths' },
                    { label: 'Limited Mobility', description: 'Minimal walking, rest stops' },
                    { label: 'Visual Assistance', description: 'Audio guides, large print' },
                    { label: 'Hearing Assistance', description: 'Visual aids, sign language' },
                    { label: 'Dietary Restrictions', description: 'Allergy-friendly dining options' },
                    { label: 'None', description: 'No special requirements' },
                  ].map(option => (
                    <AccessibilityOption
                      key={option.label}
                      label={option.label}
                      description={option.description}
                      selected={preferences.accessibility.includes(option.label)}
                      onClick={() => toggleArrayPreference('accessibility', option.label)}
                    />
                  ))}
                </div>
              </StepContainer>
            )}

            {/* COMPLETE STEP */}
            {currentStep === 6 && (
              <div className="text-center space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-200">
                  <Check className="w-12 h-12 text-white" />
                </div>
                
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 mb-3">You're All Set!</h1>
                  <p className="text-lg text-slate-500 max-w-md mx-auto">
                    Your personalized travel profile is ready. We'll use this to recommend the best experiences for you.
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-6 text-left max-w-sm mx-auto">
                  <h3 className="font-semibold text-slate-700 mb-4">Your Profile Summary:</h3>
                  <div className="space-y-3 text-sm">
                    {preferences.travelStyle.length > 0 && (
                      <ProfileItem label="Style" value={preferences.travelStyle.join(', ')} />
                    )}
                    {preferences.interests.length > 0 && (
                      <ProfileItem label="Interests" value={preferences.interests.slice(0, 3).join(', ')} />
                    )}
                    {preferences.foodPreferences.length > 0 && (
                      <ProfileItem label="Food" value={preferences.foodPreferences.join(', ')} />
                    )}
                    <ProfileItem label="Pace" value={preferences.pace} />
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold rounded-2xl shadow-lg shadow-teal-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Start Exploring'}
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* NAVIGATION BUTTONS */}
            {currentStep > 0 && currentStep < STEPS.length - 1 && (
              <div className="flex justify-between mt-10">
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <ChevronLeft size={20} />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors"
                >
                  Continue
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, label }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mx-auto mb-2">
        <Icon className="w-6 h-6 text-teal-600" />
      </div>
      <p className="text-xs text-slate-600">{label}</p>
    </div>
  );
}

function StepContainer({ title, subtitle, children }) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-slate-500">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function StyleOption({ icon: Icon, label, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-2xl border-2 text-left transition-all ${
        selected 
          ? 'border-teal-500 bg-teal-50' 
          : 'border-slate-200 hover:border-slate-300 bg-white'
      }`}
    >
      <Icon className={`w-8 h-8 mb-3 ${selected ? 'text-teal-600' : 'text-slate-400'}`} />
      <p className={`font-semibold ${selected ? 'text-teal-700' : 'text-slate-700'}`}>{label}</p>
      <p className="text-sm text-slate-500 mt-1">{description}</p>
      {selected && (
        <div className="mt-3">
          <span className="text-xs bg-teal-500 text-white px-2 py-1 rounded-full">Selected</span>
        </div>
      )}
    </button>
  );
}

function InterestChip({ icon: Icon, label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 transition-all ${
        selected 
          ? 'border-teal-500 bg-teal-50 text-teal-700' 
          : 'border-slate-200 hover:border-slate-300 text-slate-600'
      }`}
    >
      <Icon size={18} className={selected ? 'text-teal-600' : 'text-slate-400'} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function FoodOption({ label, emoji, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
        selected 
          ? 'border-teal-500 bg-teal-50' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className="text-2xl">{emoji}</span>
      <span className={`font-medium ${selected ? 'text-teal-700' : 'text-slate-700'}`}>{label}</span>
      {selected && <Check size={18} className="text-teal-500 ml-auto" />}
    </button>
  );
}

function PaceOption({ label, description, emoji, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all ${
        selected 
          ? 'border-teal-500 bg-teal-50' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <span className="text-3xl">{emoji}</span>
      <div className="flex-1">
        <p className={`font-semibold ${selected ? 'text-teal-700' : 'text-slate-700'}`}>{label}</p>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>
      {selected && (
        <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </div>
      )}
    </button>
  );
}

function AccessibilityOption({ label, description, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${
        selected 
          ? 'border-teal-500 bg-teal-50' 
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
        selected ? 'bg-teal-500 border-teal-500' : 'border-slate-300'
      }`}>
        {selected && <Check size={14} className="text-white" />}
      </div>
      <div>
        <p className={`font-medium ${selected ? 'text-teal-700' : 'text-slate-700'}`}>{label}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </button>
  );
}

function ProfileItem({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}:</span>
      <span className="text-slate-700 font-medium capitalize">{value}</span>
    </div>
  );
}
