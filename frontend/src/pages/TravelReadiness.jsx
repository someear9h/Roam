import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, CheckCircle, Circle, Luggage, CreditCard, FileText,
  Stethoscope, Phone, Lightbulb, Sparkles, ChevronDown, ChevronRight,
  Plane, Globe, Shield, AlertCircle, DollarSign, Heart, 
  Thermometer, Pill, Building, MapPin, Clock, Check, X
} from 'lucide-react';
import { tripAPI } from '../services/api';

export default function TravelReadiness() {
  const { tripId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [readiness, setReadiness] = useState(null);
  const [trip, setTrip] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    packing: true,
    currency: false,
    visa: false,
    emergency: false,
    health: false,
    tips: false,
  });
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    loadReadiness();
    // Load saved checks from localStorage
    const saved = localStorage.getItem(`readiness-${tripId}`);
    if (saved) {
      setCheckedItems(JSON.parse(saved));
    }
  }, [tripId]);

  // Save checks to localStorage
  useEffect(() => {
    if (Object.keys(checkedItems).length > 0) {
      localStorage.setItem(`readiness-${tripId}`, JSON.stringify(checkedItems));
    }
  }, [checkedItems, tripId]);

  const loadReadiness = async () => {
    try {
      setIsLoading(true);
      const id = Number(tripId);
      
      try {
        const contextRes = await tripAPI.getTripContext(id);
        if (contextRes.data.success) {
          setTrip(contextRes.data.data.trip);
        }
      } catch (e) {}
      
      try {
        const readinessRes = await tripAPI.getTravelReadiness(id);
        if (readinessRes.data.success) {
          setReadiness(readinessRes.data.data);
        }
      } catch (e) {}
      
      // Demo fallback
      if (!readiness) {
        setReadiness(getDemoReadiness());
      }
    } catch (error) {
      console.error('Failed to load readiness:', error);
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
      electronics: ['Phone charger', 'Power adapter (check plug type)', 'Portable charger/power bank', 'Headphones', 'Camera (optional)'],
      toiletries: ['Toothbrush & toothpaste', 'Deodorant', 'Medications', 'Sunscreen', 'Basic first-aid kit'],
      documents: ['Hotel confirmations', 'Travel itinerary', 'Emergency contacts list', 'Credit card info (separate)', 'Visa documents (if needed)']
    },
    currency: {
      local_currency: 'EUR',
      symbol: '€',
      exchange_tip: 'Avoid airport exchanges - they have worst rates. Use ATMs or local banks.',
      payment_methods: ['Credit/debit cards widely accepted', 'Contactless payments common', 'Keep some cash for small shops', 'Notify bank of travel plans']
    },
    visa_info: {
      required: false,
      details: 'No visa required for stays up to 90 days for most nationalities. Check specific requirements for your passport.'
    },
    emergency_contacts: {
      emergency_number: '112',
      police: '17',
      ambulance: '15',
      embassy: 'Contact your embassy before traveling'
    },
    health: {
      vaccinations: ['No special vaccinations required', 'Ensure routine vaccinations are up to date'],
      recommendations: ['Get travel insurance', 'Bring prescription medications', 'Know your blood type', 'Check for health advisories']
    },
    local_tips: [
      'Learn basic local phrases - it\'s appreciated',
      'Tipping varies by country - research beforehand',
      'Dress code for religious sites - bring modest clothing',
      'Download offline maps before you go',
      'Register with your embassy (optional but recommended)'
    ]
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleItem = (category, item) => {
    const key = `${category}-${item}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecked = (category, item) => checkedItems[`${category}-${item}`] || false;

  const countChecked = (items) => {
    if (!items) return { checked: 0, total: 0 };
    let total = 0;
    let checked = 0;
    Object.entries(items).forEach(([category, itemList]) => {
      if (Array.isArray(itemList)) {
        total += itemList.length;
        itemList.forEach(item => {
          if (isChecked(category, item)) checked++;
        });
      }
    });
    return { checked, total };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading travel checklist...</p>
        </div>
      </div>
    );
  }

  const packingStats = countChecked(readiness?.packing_checklist);
  const progressPercent = packingStats.total ? Math.round((packingStats.checked / packingStats.total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <Link to="/dashboard" className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Travel Readiness</h1>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            <MapPin size={16} className="text-rose-500" />
            Everything you need for {trip?.destination || 'your trip'}
          </p>
        </div>
      </div>

      {/* PROGRESS HERO */}
      <div className="relative bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Luggage size={40} />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Packing Progress</h2>
              <p className="text-rose-100 mt-1">Track your preparation checklist</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-5xl font-bold">{packingStats.checked}</span>
              <span className="text-2xl text-rose-200">/{packingStats.total}</span>
              <p className="text-sm text-rose-100 mt-1">items packed</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="white"
                  strokeWidth="3"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
                {progressPercent}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-4">
        
        {/* PACKING CHECKLIST */}
        <CollapsibleSection
          title="Packing Checklist"
          icon={Luggage}
          color="rose"
          isExpanded={expandedSections.packing}
          onToggle={() => toggleSection('packing')}
          badge={`${packingStats.checked}/${packingStats.total}`}
        >
          {readiness?.packing_checklist && Object.entries(readiness.packing_checklist).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h4 className="font-bold text-gray-700 capitalize mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
                {category.replace('_', ' ')}
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {items.map((item, idx) => (
                  <ChecklistItem 
                    key={idx}
                    label={item}
                    checked={isChecked(category, item)}
                    onToggle={() => toggleItem(category, item)}
                  />
                ))}
              </div>
            </div>
          ))}
        </CollapsibleSection>

        {/* CURRENCY */}
        <CollapsibleSection
          title="Currency & Payments"
          icon={CreditCard}
          color="green"
          isExpanded={expandedSections.currency}
          onToggle={() => toggleSection('currency')}
        >
          {readiness?.currency && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl">
                <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-3xl font-bold text-green-600">{readiness.currency.symbol || '€'}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800">Local Currency</p>
                  <p className="text-green-600 font-semibold">{readiness.currency.local_currency || 'EUR'}</p>
                </div>
              </div>
              
              {readiness.currency.exchange_tip && (
                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-amber-500 shrink-0 mt-1" size={20} />
                    <div>
                      <p className="font-semibold text-amber-800 mb-1">Exchange Tip</p>
                      <p className="text-sm text-amber-700">{readiness.currency.exchange_tip}</p>
                    </div>
                  </div>
                </div>
              )}

              {readiness.currency.payment_methods && (
                <div>
                  <p className="font-semibold text-slate-700 mb-2">Payment Methods</p>
                  <ul className="space-y-2">
                    {readiness.currency.payment_methods.map((method, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle size={16} className="text-green-500" />
                        {method}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </CollapsibleSection>

        {/* VISA INFO */}
        <CollapsibleSection
          title="Visa & Documents"
          icon={FileText}
          color="blue"
          isExpanded={expandedSections.visa}
          onToggle={() => toggleSection('visa')}
        >
          {readiness?.visa_info && (
            <div className={`p-5 rounded-2xl ${readiness.visa_info.required ? 'bg-red-50 border border-red-100' : 'bg-green-50 border border-green-100'}`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${readiness.visa_info.required ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                  {readiness.visa_info.required ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                </div>
                <div>
                  <p className={`font-bold ${readiness.visa_info.required ? 'text-red-800' : 'text-green-800'}`}>
                    {readiness.visa_info.required ? 'Visa Required' : 'No Visa Required'}
                  </p>
                  <p className={`text-sm mt-1 ${readiness.visa_info.required ? 'text-red-600' : 'text-green-600'}`}>
                    {readiness.visa_info.details}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* EMERGENCY CONTACTS */}
        <CollapsibleSection
          title="Emergency Contacts"
          icon={Phone}
          color="red"
          isExpanded={expandedSections.emergency}
          onToggle={() => toggleSection('emergency')}
        >
          {readiness?.emergency_contacts && (
            <div className="grid md:grid-cols-2 gap-4">
              <EmergencyNumber label="Emergency" number={readiness.emergency_contacts.emergency_number} icon={Shield} />
              <EmergencyNumber label="Police" number={readiness.emergency_contacts.police} icon={Shield} />
              <EmergencyNumber label="Ambulance" number={readiness.emergency_contacts.ambulance} icon={Stethoscope} />
              <div className="md:col-span-2 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="flex items-center gap-3">
                  <Building className="text-blue-600" size={24} />
                  <div>
                    <p className="font-semibold text-blue-800">Embassy</p>
                    <p className="text-sm text-blue-600">{readiness.emergency_contacts.embassy}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* HEALTH */}
        <CollapsibleSection
          title="Health & Safety"
          icon={Stethoscope}
          color="purple"
          isExpanded={expandedSections.health}
          onToggle={() => toggleSection('health')}
        >
          {readiness?.health && (
            <div className="space-y-6">
              <div>
                <p className="font-semibold text-slate-700 mb-3">Vaccinations</p>
                <div className="space-y-2">
                  {readiness.health.vaccinations?.map((vax, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                      <Pill className="text-purple-500" size={18} />
                      <span className="text-sm text-slate-600">{vax}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="font-semibold text-slate-700 mb-3">Recommendations</p>
                <div className="space-y-2">
                  {readiness.health.recommendations?.map((rec, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                      <Heart className="text-green-500" size={18} />
                      <span className="text-sm text-slate-600">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* LOCAL TIPS */}
        <CollapsibleSection
          title="Local Tips"
          icon={Lightbulb}
          color="amber"
          isExpanded={expandedSections.tips}
          onToggle={() => toggleSection('tips')}
        >
          {readiness?.local_tips && (
            <div className="space-y-3">
              {readiness.local_tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-amber-50 rounded-xl">
                  <Sparkles className="text-amber-500 shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-amber-800">{tip}</p>
                </div>
              ))}
            </div>
          )}
        </CollapsibleSection>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, icon: Icon, color, isExpanded, onToggle, badge, children }) {
  const colorClasses = {
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    amber: 'bg-amber-50 text-amber-600 border-amber-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
            <Icon size={22} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          {badge && (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-sm font-semibold rounded-full">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown size={22} className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
      
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100 pt-5">
          {children}
        </div>
      )}
    </div>
  );
}

function ChecklistItem({ label, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left w-full ${
        checked 
          ? 'bg-rose-50 border-rose-200 text-rose-700' 
          : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
      }`}
    >
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
        checked ? 'bg-rose-500 border-rose-500' : 'border-gray-300'
      }`}>
        {checked && <Check size={12} className="text-white" />}
      </div>
      <span className={`text-sm ${checked ? 'line-through opacity-70' : ''}`}>{label}</span>
    </button>
  );
}

function EmergencyNumber({ label, number, icon: Icon }) {
  const callNumber = () => {
    window.location.href = `tel:${number}`;
  };

  return (
    <button
      onClick={callNumber}
      className="flex items-center gap-4 p-4 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-left w-full"
    >
      <div className="p-2 bg-red-100 rounded-lg">
        <Icon className="text-red-600" size={20} />
      </div>
      <div>
        <p className="text-sm text-red-600">{label}</p>
        <p className="text-xl font-bold text-red-700">{number}</p>
      </div>
    </button>
  );
}
