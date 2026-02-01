import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, Map, MessageSquare, ShieldAlert, Globe, LogOut
} from 'lucide-react';

// --- CONTEXT ---
import { AuthProvider, useAuth } from './context/AuthContext';

// --- PAGE IMPORTS ---
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Itinerary from './pages/Itinerary';
import Assistant from './pages/Assistant';
import Emergency from './pages/Emergency';
import LocalGuide from './pages/LocalGuide';
import Onboarding from './pages/Onboarding';
import TravelReadiness from './pages/TravelReadiness';
import VRPreview from './pages/VRPreview';

// --- NAVBAR COMPONENT ---
const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isActive = (path) => location.pathname === path;

  // Hide Navbar on these pages
  const hideNavPaths = ['/', '/login', '/onboarding'];
  if (hideNavPaths.includes(location.pathname)) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      {/* DESKTOP NAV */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 z-50 h-20 items-center justify-between px-6 lg:px-10 shadow-sm">
        
        {/* LEFT: LOGO + NAV */}
        <div className="flex items-center gap-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/logo.png" alt="Compass" className="h-10 w-auto" onError={(e) => e.target.style.display = 'none'} />
            <span className="text-xl font-bold text-slate-900">Compass</span>
          </Link>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full">
            <NavLink to="/dashboard" label="Dashboard" active={isActive('/dashboard')} />
            <NavLink to="/itinerary" label="Itinerary" active={isActive('/itinerary')} />
            <NavLink to="/assistant" label="Assistant" active={isActive('/assistant')} />
            <NavLink to="/local-guide" label="Guide" active={isActive('/local-guide')} />
          </div>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-4">
          <Link 
            to="/emergency" 
            className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-100 hover:bg-red-100 transition-colors"
          >
            <ShieldAlert size={18} />
            <span>Emergency</span>
          </Link>
          
          <div className="h-8 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-xs text-slate-500">Traveler</p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-200 py-2 px-4 flex justify-around items-center z-50 pb-safe">
        <MobileNavLink to="/dashboard" icon={Home} label="Home" active={isActive('/dashboard')} />
        <MobileNavLink to="/itinerary" icon={Map} label="Itinerary" active={isActive('/itinerary')} />
        <MobileNavLink to="/assistant" icon={MessageSquare} label="Assistant" active={isActive('/assistant')} />
        <MobileNavLink to="/local-guide" icon={Globe} label="Guide" active={isActive('/local-guide')} />
        <Link to="/emergency" className="flex flex-col items-center justify-center text-red-500">
          <ShieldAlert size={22} />
          <span className="text-[10px] font-semibold mt-0.5">SOS</span>
        </Link>
      </nav>
    </>
  );
};

// --- HELPER COMPONENTS ---
const NavLink = ({ to, label, active }) => (
  <Link 
    to={to} 
    className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
      active 
        ? 'bg-white text-slate-900 shadow-sm' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
    }`}
  >
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center ${active ? 'text-teal-600' : 'text-slate-400'}`}>
    <Icon size={22} strokeWidth={2} />
    <span className="text-[10px] font-semibold mt-0.5">{label}</span>
  </Link>
);

// --- MAIN LAYOUT ---
function Layout() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isLandingPage = location.pathname === '/';
  const isLoginPage = location.pathname === '/login';
  const isOnboardingPage = location.pathname === '/onboarding';
  const isPublicPage = isLandingPage || isLoginPage || isOnboardingPage;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  // Landing page - show for unauthenticated users
  if (isLandingPage && !isAuthenticated) {
    return <Landing />;
  }

  // Redirect authenticated users from landing to dashboard
  if (isLandingPage && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated and on login page, redirect to dashboard
  if (isAuthenticated && isLoginPage) {
    return <Navigate to="/dashboard" replace />;
  }

  // If not authenticated and not on public page, redirect to landing
  if (!isAuthenticated && !isPublicPage) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen font-sans text-slate-900 bg-[#F8FAFC]">
      <Navbar />
      
      <div className={`${isPublicPage ? '' : 'pt-24 md:pt-28 min-h-[85vh] max-w-[1440px] mx-auto px-4 md:px-8 pb-24 md:pb-8'}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/assistant" element={<Assistant />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/local-guide" element={<LocalGuide />} />
          <Route path="/trip/:tripId/readiness" element={<TravelReadiness />} />
          <Route path="/vr-preview" element={<VRPreview />} />
          <Route path="/trip/:tripId/vr" element={<VRPreview />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
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
