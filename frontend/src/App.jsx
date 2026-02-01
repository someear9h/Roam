import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  Home, Map, MessageSquare, ShieldAlert, Globe, LogOut, Eye,
  Search, Menu, User
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

// --- NAVBAR COMPONENT (Airbnb-style) ---
const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isActive = (path) => location.pathname === path;

  // Hide Navbar on these pages
  const hideNavPaths = ['/', '/login', '/onboarding', '/vr-preview'];
  const hideNavOnVR = location.pathname.includes('/vr');
  if (hideNavPaths.includes(location.pathname) || hideNavOnVR) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      {/* DESKTOP NAV - Airbnb Style */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white border-b border-gray-200 z-50 h-20 items-center justify-between px-6 lg:px-10">
        
        {/* LEFT: LOGO */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <img src="/logo.png" alt="Roam" className="h-8 w-auto" onError={(e) => e.target.style.display = 'none'} />
          <span className="text-xl font-bold text-rose-500">Roam</span>
        </Link>

        {/* CENTER: NAV PILLS */}
        <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-full">
          <NavLink to="/dashboard" label="Dashboard" icon={Home} active={isActive('/dashboard')} />
          <NavLink to="/itinerary" label="Itinerary" icon={Map} active={isActive('/itinerary')} />
          <NavLink to="/assistant" label="Assistant" icon={MessageSquare} active={isActive('/assistant')} />
          <NavLink to="/local-guide" label="Guide" icon={Globe} active={isActive('/local-guide')} />
          <NavLink to="/vr-preview" label="VR Tour" icon={Eye} active={isActive('/vr-preview')} />
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3">
          <Link 
            to="/emergency" 
            className="flex items-center gap-2 text-rose-600 font-semibold text-sm bg-rose-50 px-4 py-2.5 rounded-full border border-rose-100 hover:bg-rose-100 transition-colors"
          >
            <ShieldAlert size={18} />
            <span>Emergency</span>
          </Link>
          
          <div className="h-8 w-px bg-gray-200"></div>

          <div className="flex items-center gap-2 border border-gray-300 rounded-full p-1.5 pl-3 hover:shadow-md transition-shadow cursor-pointer">
            <Menu size={16} className="text-gray-600" />
            <div className="relative">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* MOBILE NAV - Airbnb Style */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 py-2 px-2 flex justify-around items-center z-50 pb-safe">
        <MobileNavLink to="/dashboard" icon={Home} label="Home" active={isActive('/dashboard')} />
        <MobileNavLink to="/itinerary" icon={Map} label="Trips" active={isActive('/itinerary')} />
        <MobileNavLink to="/vr-preview" icon={Eye} label="VR" active={isActive('/vr-preview')} />
        <MobileNavLink to="/assistant" icon={MessageSquare} label="Chat" active={isActive('/assistant')} />
        <MobileNavLink to="/local-guide" icon={Globe} label="Guide" active={isActive('/local-guide')} />
        <Link to="/emergency" className="flex flex-col items-center justify-center text-rose-500">
          <ShieldAlert size={22} />
          <span className="text-[10px] font-semibold mt-0.5">SOS</span>
        </Link>
      </nav>
    </>
  );
};

// --- HELPER COMPONENTS ---
const NavLink = ({ to, label, icon: Icon, active }) => (
  <Link 
    to={to} 
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
      active 
        ? 'bg-white text-gray-900 shadow-sm' 
        : 'text-gray-500 hover:text-gray-900 hover:bg-white/60'
    }`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center px-3 py-1 ${active ? 'text-rose-500' : 'text-gray-400'}`}>
    <Icon size={22} strokeWidth={active ? 2.5 : 2} />
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
