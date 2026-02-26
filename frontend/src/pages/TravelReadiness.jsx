import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Circle, Luggage, CreditCard, FileText,
  Stethoscope, Phone, Lightbulb, Sparkles, ChevronDown, ChevronRight,
  Globe, Shield, AlertCircle, DollarSign, Heart, Plus,
  Thermometer, Pill, Building, MapPin, Clock, Check, X, Trash2,
  Shirt, Camera, Wifi, Droplets, Sun, Lock, Headphones
} from 'lucide-react';
import { tripAPI } from '../services/api';

const CATEGORY_ICONS = {
  essentials: FileText,
  clothing: Shirt,
  electronics: Headphones,
  toiletries: Droplets,
  documents: Lock,
  miscellaneous: Lightbulb,
};

const CATEGORY_COLORS = {
  essentials: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-600', accent: 'bg-red-500' },
  clothing: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-600', accent: 'bg-blue-500' },
  electronics: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-600', accent: 'bg-purple-500' },
  toiletries: { bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-600', accent: 'bg-cyan-500' },
  documents: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-600', accent: 'bg-amber-500' },
  miscellaneous: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-600', accent: 'bg-green-500' },
};

export default function TravelReadiness() {
  const { tripId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [readiness, setReadiness] = useState(null);
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState('packing');
  const [checkedItems, setCheckedItems] = useState({});
  const [customItems, setCustomItems] = useState({});
  const [newItemText, setNewItemText] = useState('');
  const [addingTo, setAddingTo] = useState(null);

  useEffect(() => {
    loadReadiness();
    const saved = localStorage.getItem(`readiness-${tripId}`);
    if (saved) setCheckedItems(JSON.parse(saved));
    const savedCustom = localStorage.getItem(`custom-items-${tripId}`);
    if (savedCustom) setCustomItems(JSON.parse(savedCustom));
  }, [tripId]);

  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem(`readiness-${tripId}`, JSON.stringify(checkedItems));
    }
  }, [checkedItems, tripId]);

  useEffect(() => {
    if (Object.keys(customItems).length > 0) {
      localStorage.setItem(`custom-items-${tripId}`, JSON.stringify(customItems));
    }
  }, [customItems, tripId]);

  const loadReadiness = async () => {
    try {
      setIsLoading(true);
      const id = Number(tripId);
      
      try {
        const contextRes = await tripAPI.getTripContext(id);
        if (contextRes.data.success) setTrip(contextRes.data.data.trip);
      } catch (e) {}
      
      try {
        const readinessRes = await tripAPI.getTravelReadiness(id);
        if (readinessRes.data.success) setReadiness(readinessRes.data.data);
      } catch (e) {}
      
      if (!readiness) setReadiness(getDemoReadiness());
    } catch (error) {
      setTrip({ id: tripId, destination: 'Your Destination' });
      setReadiness(getDemoReadiness());
    } finally {
      setIsLoading(false);
    }
  };

  const getDemoReadiness = () => ({
    packing_checklist: {
      essentials: ['Passport & copies', 'Flight tickets', 'Travel insurance documents', 'Phone & charger', 'Wallet & cards', 'Cash in local currency'],
      clothing: ['Comfortable walking shoes', 'Weather-appropriate outfits', 'Formal outfit (optional)', 'Sleepwear', 'Undergarments', 'Light jacket/sweater'],
      electronics: ['Phone charger', 'Power adapter', 'Portable charger', 'Headphones', 'Camera (optional)'],
      toiletries: ['Toothbrush & toothpaste', 'Deodorant', 'Medications', 'Sunscreen', 'Basic first-aid kit'],
      documents: ['Hotel confirmations', 'Travel itinerary', 'Emergency contacts list', 'Credit card info', 'Visa documents (if needed)']
    },
    currency: {
      local_currency: 'EUR',
      symbol: '€',
      exchange_tip: 'Avoid airport exchanges - they have worst rates. Use ATMs or local banks.',
      payment_methods: ['Credit/debit cards widely accepted', 'Contactless payments common', 'Keep some cash for small shops', 'Notify bank of travel plans']
    },
    visa_info: {
      required: false,
      details: 'No visa required for stays up to 90 days for most nationalities.'
    },
    emergency_contacts: {
      emergency_number: '112',
      police: '17',
      ambulance: '15',
      embassy: 'Contact your embassy before traveling'
    },
    health: {
      vaccinations: ['No special vaccinations required', 'Ensure routine vaccinations are up to date'],
      recommendations: ['Get travel insurance', 'Bring prescription medications', 'Know your blood type']
    },
    tips: [
      'Download offline maps before you go',
      'Learn basic local phrases',
      'Keep digital copies of important documents',
      'Check weather forecast before packing',
      'Register with your embassy if traveling long-term'
    ]
  });

  const toggleCheck = (category, item) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const addCustomItem = (category) => {
    if (!newItemText.trim()) return;
    setCustomItems(prev => ({
      ...prev,
      [category]: [...(prev[category] || []), newItemText.trim()]
    }));
    setNewItemText('');
    setAddingTo(null);
  };

  const removeCustomItem = (category, item) => {
    setCustomItems(prev => ({
      ...prev,
      [category]: prev[category].filter(i => i !== item)
    }));
    const key = `${category}-${item}`;
    setCheckedItems(prev => {
      const newChecked = { ...prev };
      delete newChecked[key];
      return newChecked;
    });
  };

  const getAllItems = (category) => {
    const base = readiness?.packing_checklist?.[category] || [];
    const custom = customItems[category] || [];
    return [...base, ...custom];
  };

  const getCategoryProgress = (category) => {
    const items = getAllItems(category);
    if (items.length === 0) return 0;
    const checked = items.filter(item => checkedItems[`${category}-${item}`]).length;
    return Math.round((checked / items.length) * 100);
  };

  const getTotalProgress = () => {
    const categories = Object.keys(readiness?.packing_checklist || {});
    let total = 0;
    let checked = 0;
    categories.forEach(cat => {
      const items = getAllItems(cat);
      total += items.length;
      checked += items.filter(item => checkedItems[`${cat}-${item}`]).length;
    });
    return total === 0 ? 0 : Math.round((checked / total) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Preparing your checklist...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'packing', label: 'Packing List', icon: Luggage },
    { id: 'money', label: 'Currency & Money', icon: CreditCard },
    { id: 'documents', label: 'Documents & Visa', icon: FileText },
    { id: 'health', label: 'Health & Safety', icon: Stethoscope },
    { id: 'tips', label: 'Travel Tips', icon: Lightbulb },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to={`/trip/${tripId}`} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft size={24} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Travel Readiness</h1>
            <p className="text-slate-500 mt-1">
              {trip?.destination || 'Your Trip'} • Everything you need to prepare
            </p>
          </div>
        </div>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-0 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium mb-1">Overall Progress</p>
            <h2 className="text-5xl font-bold mb-2">{getTotalProgress()}%</h2>
            <p className="text-white/80">
              {getTotalProgress() < 50 ? "Let's start packing!" : getTotalProgress() < 100 ? "Almost ready!" : "You're all set! 🎉"}
            </p>
          </div>
          
          <div className="w-32 h-32 relative">
            <svg className="w-full h-full -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
              <circle 
                cx="64" cy="64" r="56" fill="none" stroke="white" strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 56}`}
                strokeDashoffset={`${2 * Math.PI * 56 * (1 - getTotalProgress() / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Luggage size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-orange-500 text-white shadow-lg'
                : 'bg-white border border-slate-200 text-slate-600 hover:border-orange-200'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'packing' && (
          <>
            {/* Category Progress Overview */}
            <div className="grid md:grid-cols-5 gap-4 mb-8">
              {Object.keys(readiness?.packing_checklist || {}).map(category => {
                const progress = getCategoryProgress(category);
                const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.miscellaneous;
                const Icon = CATEGORY_ICONS[category] || Lightbulb;
                
                return (
                  <div key={category} className={`${colors.bg} ${colors.border} border rounded-2xl p-4`}>
                    <div className="flex items-center gap-2 mb-3">
                      <div className={`p-2 ${colors.accent} rounded-lg`}>
                        <Icon size={16} className="text-white" />
                      </div>
                      <span className="font-semibold text-slate-800 capitalize text-sm">{category}</span>
                    </div>
                    <div className="h-2 bg-white rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors.accent} transition-all duration-500`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <p className={`text-xs ${colors.text} mt-2 font-medium`}>{progress}% complete</p>
                  </div>
                );
              })}
            </div>

            {/* Checklist Categories */}
            {Object.entries(readiness?.packing_checklist || {}).map(([category, items]) => {
              const allItems = getAllItems(category);
              const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.miscellaneous;
              const Icon = CATEGORY_ICONS[category] || Lightbulb;
              const progress = getCategoryProgress(category);
              
              return (
                <div key={category} className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                  {/* Category Header */}
                  <div className={`${colors.bg} ${colors.border} border-b p-5`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 ${colors.accent} rounded-xl`}>
                          <Icon size={22} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg capitalize">{category}</h3>
                          <p className="text-slate-500 text-sm">
                            {allItems.filter(item => checkedItems[`${category}-${item}`]).length} of {allItems.length} items packed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-2xl font-bold ${colors.text}`}>{progress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Items Grid */}
                  <div className="p-5">
                    <div className="grid md:grid-cols-2 gap-3">
                      {allItems.map((item, idx) => {
                        const isChecked = checkedItems[`${category}-${item}`];
                        const isCustom = (customItems[category] || []).includes(item);
                        
                        return (
                          <div 
                            key={idx}
                            className={`group flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isChecked 
                                ? `${colors.bg} ${colors.border}` 
                                : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                            }`}
                            onClick={() => toggleCheck(category, item)}
                          >
                            <div className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                              isChecked 
                                ? `${colors.accent} border-transparent` 
                                : 'border-slate-300 group-hover:border-slate-400'
                            }`}>
                              {isChecked && <Check size={14} className="text-white" />}
                            </div>
                            
                            <span className={`flex-1 transition-all ${
                              isChecked ? 'text-slate-500 line-through' : 'text-slate-700'
                            }`}>
                              {item}
                            </span>
                            
                            {isCustom && (
                              <button
                                onClick={(e) => { e.stopPropagation(); removeCustomItem(category, item); }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        );
                      })}

                      {/* Add Item */}
                      {addingTo === category ? (
                        <div className="flex items-center gap-2 p-3 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50">
                          <input
                            type="text"
                            value={newItemText}
                            onChange={(e) => setNewItemText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && addCustomItem(category)}
                            placeholder="Enter item name..."
                            className="flex-1 bg-transparent outline-none text-slate-700 placeholder-slate-400"
                            autoFocus
                          />
                          <button 
                            onClick={() => addCustomItem(category)}
                            className="p-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => { setAddingTo(null); setNewItemText(''); }}
                            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingTo(category)}
                          className="flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all"
                        >
                          <Plus size={18} /> Add item
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'money' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Currency Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 rounded-xl">
                  <DollarSign size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Local Currency</h3>
                  <p className="text-slate-500">{readiness?.currency?.local_currency}</p>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl mb-4">
                <p className="text-green-800 font-medium flex items-center gap-2">
                  <Lightbulb size={18} /> Exchange Tip
                </p>
                <p className="text-green-700 text-sm mt-1">{readiness?.currency?.exchange_tip}</p>
              </div>

              <h4 className="font-semibold text-slate-800 mb-3">Payment Methods</h4>
              <div className="space-y-2">
                {readiness?.currency?.payment_methods?.map((method, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-slate-700 text-sm">{method}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Tips */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={20} />
                Money-Saving Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-800 text-xs font-bold">1</span>
                  </div>
                  <span className="text-slate-700 text-sm">Use a travel credit card with no foreign transaction fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-800 text-xs font-bold">2</span>
                  </div>
                  <span className="text-slate-700 text-sm">Withdraw larger amounts less frequently to minimize ATM fees</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-800 text-xs font-bold">3</span>
                  </div>
                  <span className="text-slate-700 text-sm">Always pay in local currency to avoid dynamic currency conversion</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-800 text-xs font-bold">4</span>
                  </div>
                  <span className="text-slate-700 text-sm">Keep a backup card in a separate location from your main wallet</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Visa Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${readiness?.visa_info?.required ? 'bg-amber-100' : 'bg-green-100'}`}>
                  <Globe size={24} className={readiness?.visa_info?.required ? 'text-amber-600' : 'text-green-600'} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Visa Requirements</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    readiness?.visa_info?.required 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {readiness?.visa_info?.required ? 'Visa Required' : 'No Visa Required'}
                  </span>
                </div>
              </div>
              
              <p className="text-slate-600">{readiness?.visa_info?.details}</p>
            </div>

            {/* Required Documents */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-4">Document Checklist</h3>
              <div className="space-y-3">
                {['Valid passport', 'Flight tickets', 'Hotel reservations', 'Travel insurance', 'Emergency contacts', 'Credit card copies'].map((doc, idx) => {
                  const isChecked = checkedItems[`docs-${doc}`];
                  return (
                    <div 
                      key={idx}
                      onClick={() => toggleCheck('docs', doc)}
                      className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isChecked ? 'bg-green-50 border-green-200' : 'border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                        isChecked ? 'bg-green-500 border-transparent' : 'border-slate-300'
                      }`}>
                        {isChecked && <Check size={14} className="text-white" />}
                      </div>
                      <span className={isChecked ? 'text-slate-500 line-through' : 'text-slate-700'}>{doc}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Emergency Contacts */}
            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Phone className="text-red-500" size={20} />
                Emergency Numbers
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-slate-600">General Emergency</span>
                  <span className="font-bold text-red-600 text-lg">{readiness?.emergency_contacts?.emergency_number}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-slate-600">Police</span>
                  <span className="font-bold text-slate-800 text-lg">{readiness?.emergency_contacts?.police}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-xl">
                  <span className="text-slate-600">Ambulance</span>
                  <span className="font-bold text-slate-800 text-lg">{readiness?.emergency_contacts?.ambulance}</span>
                </div>
              </div>
            </div>

            {/* Health Recommendations */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <h3 className="font-bold text-slate-800 text-lg mb-4 flex items-center gap-2">
                <Heart className="text-pink-500" size={20} />
                Health Tips
              </h3>
              <div className="space-y-3">
                {readiness?.health?.recommendations?.map((rec, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <Stethoscope size={18} className="text-slate-400" />
                    <span className="text-slate-700 text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-6 flex items-center gap-2">
              <Sparkles className="text-amber-500" size={20} />
              Pro Travel Tips
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {readiness?.tips?.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-800 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <p className="text-slate-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
