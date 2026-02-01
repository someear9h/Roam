import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, Map, Glasses, MessageSquare, ShieldAlert, Compass, 
  Menu, User, Phone, Mail, Facebook, Twitter, Instagram, Globe, LogOut 
} from 'lucide-react';

// --- CONTEXT & SERVICES ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- PAGE IMPORTS ---
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TripOverview from './pages/TripOverview';
import VRPreview from './pages/VRPreview';
import Itinerary from './pages/Itinerary';
import Assistant from './pages/Assistant';
import Emergency from './pages/Emergency';
import LocalGuide from './pages/LocalGuide';

// --- ASSETS ---
import logoImg from './assets/logo.png'; 

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isActive = (path) => location.pathname === path;

  // --- THE FIX: Hide Navbar on Login AND VR Page ---
  if (['/login', '/vr'].includes(location.pathname)) return null;

  return (
    <>
      {/* DESKTOP NAV (Pill Style Preserved) */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 h-28 items-center justify-between px-6 lg:px-10 shadow-sm transition-all">
        
        {/* LEFT GROUP: LOGO + NAV LINKS */}
        <div className="flex items-center gap-10">
          
          {/* BRAND LOGO */}
          <Link to="/" className="flex-shrink-0 hover:opacity-90 transition-opacity">
            <img 
              src={logoImg} 
              alt="Roam Logo" 
              className="h-20 w-auto object-contain" 
              onError={(e) => {e.target.style.display='none'; e.target.nextSibling.style.display='flex'}} 
            />
            <div className="hidden h-16 w-16 bg-slate-900 rounded-full items-center justify-center text-amber-500">
              <Globe size={36} />
            </div>
          </Link>

          {/* NAV LINKS (Pill Style) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full border border-slate-200 shadow-inner">
            <NavLink to="/" label="Dashboard" active={isActive('/')} />
            <NavLink to="/trip" label="My Trip" active={isActive('/trip')} />
            <NavLink to="/itinerary" label="Itinerary" active={isActive('/itinerary')} />
            <NavLink to="/local-guide" label="Guide" active={isActive('/local-guide')} />
          </div>

        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-5">
          <Link to="/emergency" className="group flex items-center gap-2 text-red-600 font-bold text-sm bg-red-50 px-6 py-3 rounded-2xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm">
            <ShieldAlert size={20} className="group-hover:animate-pulse" />
            <span>SOS</span>
          </Link>
          
          <div className="h-10 w-px bg-slate-200 mx-2"></div>

          <div className="flex items-center gap-3 cursor-pointer p-2 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 p-0.5 bg-white">
               <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" className="w-full h-full rounded-full object-cover" alt="Profile" />
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name || 'User'}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Explorer</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 py-3 px-6 flex justify-between items-center z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <MobileNavLink to="/" icon={Home} label="Home" active={isActive('/')} />
        <MobileNavLink to="/trip" icon={Map} label="Trip" active={isActive('/trip')} />
        <MobileNavLink to="/assistant" icon={MessageSquare} label="AI Chat" active={isActive('/assistant')} />
        <MobileNavLink to="/local-guide" icon={Compass} label="Guide" active={isActive('/local-guide')} />
        <Link to="/emergency" className={`flex flex-col items-center justify-center w-14 rounded-xl ${isActive('/emergency') ? 'text-red-500' : 'text-slate-400'}`}>
          <ShieldAlert size={24} />
          <span className="text-[10px] font-bold mt-1">SOS</span>
        </Link>
      </nav>
    </>
  );
};

// --- FOOTER COMPONENT ---
const Footer = () => {
  const location = useLocation();
  
  // --- THE FIX: Hide Footer on VR Page too ---
  if (['/login', '/vr'].includes(location.pathname)) return null;

  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10 mt-24 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <img src={logoImg} alt="Roam" className="h-14 w-auto object-contain brightness-0 invert opacity-90 mb-6" />
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            Your AI-native travel companion. Explore further, safer, and smarter.
          </p>
          <div className="flex gap-4">
            <SocialIcon icon={Facebook} />
            <SocialIcon icon={Twitter} />
            <SocialIcon icon={Instagram} />
          </div>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-200 text-xs uppercase tracking-widest mb-6">Explore</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Destinations</a></li>
            <li><a href="#" className="hover:text-white transition-colors">VR Library</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Safety Guides</a></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold text-slate-200 text-xs uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Legal</a></li>
          </ul>
        </div>
        
        <div>
           <h4 className="font-bold text-slate-200 text-xs uppercase tracking-widest mb-6">Contact</h4>
           <p className="text-sm text-slate-400 mb-2">support@roam.com</p>
           <p className="text-sm text-slate-400">+1 (888) ROAM-NOW</p>
        </div>
      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
        <p>© 2026 Roam Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
        </div>
      </div>
    </footer>
  );
};

// --- HELPER COMPONENTS ---
const NavLink = ({ to, label, active }) => (
  <Link 
    to={to} 
    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
      active 
        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center w-14 rounded-2xl ${active ? 'text-slate-900' : 'text-slate-400'}`}>
    <Icon size={24} strokeWidth={2.5} className="mb-1" />
    <span className="text-[10px] font-bold tracking-wide">{label}</span>
  </Link>
);

const SocialIcon = ({ icon: Icon }) => (
  <a href="#" className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:bg-white hover:text-slate-900 transition-all">
    <Icon size={18} />
  </a>
);

// --- MAIN LAYOUT ---
function Layout() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  // Check if we are on an immersive page
  const isImmersive = ['/vr', '/login'].includes(location.pathname);

  // If not authenticated and not on login page, redirect to login
  if (!isLoading && !isAuthenticated && !isImmersive) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-[#F8FAFC]">
      <Navbar />
      
      {/* If Immersive (VR), remove top padding so it fills the screen. 
         If Normal Page, keep padding to push content below the fixed navbar.
      */}
      <div className={`${isImmersive ? '' : 'pt-36 min-h-[85vh] max-w-[1440px] mx-auto px-4 md:px-8'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />} />
          <Route path="/trip" element={isAuthenticated ? <TripOverview /> : <Navigate to="/login" replace />} />
          <Route path="/vr" element={isAuthenticated ? <VRPreview /> : <Navigate to="/login" replace />} />
          <Route path="/itinerary" element={isAuthenticated ? <Itinerary /> : <Navigate to="/login" replace />} />
          <Route path="/assistant" element={isAuthenticated ? <Assistant /> : <Navigate to="/login" replace />} />
          <Route path="/emergency" element={isAuthenticated ? <Emergency /> : <Navigate to="/login" replace />} />
          <Route path="/local-guide" element={isAuthenticated ? <LocalGuide /> : <Navigate to="/login" replace />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout />
      </AuthProvider>
    </BrowserRouter>
  );
}