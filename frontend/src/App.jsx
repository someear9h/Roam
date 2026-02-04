import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useParams } from 'react-router-dom';
import { 
  Home, Map, MessageSquare, ShieldAlert, Globe, LogOut, Eye,
  Search, Menu, User, ArrowLeft, Star
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
import TripSummary from './pages/TripSummary';
import VRPreview from './pages/VRPreview';
import PlaceReviewsPage from './pages/PlaceReviewsPage';

// --- NAVBAR COMPONENT (Enhanced Style) ---
const Navbar = () => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  
  // Extract tripId from URL if present
  const tripIdMatch = location.pathname.match(/\/trip\/(\d+)/);
  const tripId = tripIdMatch ? tripIdMatch[1] : null;
  
  const isActive = (path) => {
    if (tripId) {
      // For trip-specific pages, match the feature part
      return location.pathname.includes(path.replace('/trip/:tripId', `/trip/${tripId}`));
    }
    return location.pathname === path;
  };
  
  const isTripPage = !!tripId;

  // Hide Navbar on these pages
  const hideNavPaths = ['/', '/login', '/onboarding', '/vr-preview'];
  const hideNavOnVR = location.pathname.includes('/vr') && !location.pathname.includes('/vr-preview');
  if (hideNavPaths.includes(location.pathname) || hideNavOnVR) return null;
  if (!isAuthenticated) return null;

  return (
    <>
      {/* DESKTOP NAV - Enhanced Style */}
      <nav className="hidden md:flex fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 z-50 h-20 items-center justify-between px-6 lg:px-10">
        
        {/* LEFT: LOGO or BACK */}
        {isTripPage ? (
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft size={20} className="text-slate-600" />
            </Link>
            <Link to={`/trip/${tripId}`} className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center">
                <Map size={22} className="text-white" />
              </div>
              <span className="text-lg font-bold text-slate-800">Trip Details</span>
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/logo2.png" alt="Roam" className="h-12 w-auto" />
          </Link>
        )}

        {/* CENTER: NAV PILLS - Context aware */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-full">
          {isTripPage ? (
            <>
              <NavLink to={`/trip/${tripId}`} label="Overview" icon={Home} active={location.pathname === `/trip/${tripId}`} />
              <NavLink to={`/trip/${tripId}/itinerary`} label="Itinerary" icon={Map} active={location.pathname.includes('/itinerary')} />
              <NavLink to={`/trip/${tripId}/reviews`} label="Reviews" icon={Star} active={location.pathname.includes('/reviews')} />
              <NavLink to={`/trip/${tripId}/assistant`} label="Assistant" icon={MessageSquare} active={location.pathname.includes('/assistant')} />
              <NavLink to={`/trip/${tripId}/local-guide`} label="Guide" icon={Globe} active={location.pathname.includes('/local-guide')} />
            </>
          ) : (
            <>
              <NavLink to="/dashboard" label="Dashboard" icon={Home} active={isActive('/dashboard')} />
              <NavLink to="/vr-preview" label="VR Tour" icon={Eye} active={isActive('/vr-preview')} />
            </>
          )}
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-3">
          <Link 
            to={isTripPage ? `/trip/${tripId}/emergency` : '/emergency'} 
            className="flex items-center gap-2 text-red-600 font-semibold text-sm bg-red-50 px-4 py-2.5 rounded-full border border-red-100 hover:bg-red-100 transition-colors"
          >
            <ShieldAlert size={18} />
            <span>Emergency</span>
          </Link>
          
          <div className="h-8 w-px bg-slate-200"></div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-full p-1.5 pl-3 hover:shadow-md transition-shadow cursor-pointer">
            <Menu size={16} className="text-slate-600" />
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      {/* MOBILE NAV - Enhanced Style */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-slate-200 py-2 px-2 flex justify-around items-center z-50 pb-safe">
        {isTripPage ? (
          <>
            <MobileNavLink to={`/trip/${tripId}`} icon={Home} label="Trip" active={location.pathname === `/trip/${tripId}`} />
            <MobileNavLink to={`/trip/${tripId}/itinerary`} icon={Map} label="Plan" active={location.pathname.includes('/itinerary')} />
            <MobileNavLink to={`/trip/${tripId}/reviews`} icon={Star} label="Reviews" active={location.pathname.includes('/reviews')} />
            <MobileNavLink to={`/trip/${tripId}/assistant`} icon={MessageSquare} label="Chat" active={location.pathname.includes('/assistant')} />
            <Link to={`/trip/${tripId}/emergency`} className="flex flex-col items-center justify-center text-red-500">
              <ShieldAlert size={22} />
              <span className="text-[10px] font-semibold mt-0.5">SOS</span>
            </Link>
          </>
        ) : (
          <>
            <MobileNavLink to="/dashboard" icon={Home} label="Home" active={isActive('/dashboard')} />
            <MobileNavLink to="/vr-preview" icon={Eye} label="VR" active={isActive('/vr-preview')} />
            <Link to="/emergency" className="flex flex-col items-center justify-center text-red-500">
              <ShieldAlert size={22} />
              <span className="text-[10px] font-semibold mt-0.5">SOS</span>
            </Link>
          </>
        )}
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
        ? 'bg-white text-orange-600 shadow-sm' 
        : 'text-slate-500 hover:text-slate-900 hover:bg-white/60'
    }`}
  >
    {Icon && <Icon size={16} />}
    {label}
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, active }) => (
  <Link to={to} className={`flex flex-col items-center justify-center px-3 py-1 ${active ? 'text-orange-600' : 'text-slate-400'}`}>
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
          <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
          
          {/* Trip-specific routes */}
          <Route path="/trip/:tripId" element={<TripSummary />} />
          <Route path="/trip/:tripId/itinerary" element={<Itinerary />} />
          <Route path="/trip/:tripId/reviews" element={<PlaceReviewsPage />} />
          <Route path="/trip/:tripId/assistant" element={<Assistant />} />
          <Route path="/trip/:tripId/local-guide" element={<LocalGuide />} />
          <Route path="/trip/:tripId/emergency" element={<Emergency />} />
          <Route path="/trip/:tripId/readiness" element={<TravelReadiness />} />
          <Route path="/trip/:tripId/vr" element={<VRPreview />} />
          
          {/* Global routes */}
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/vr-preview" element={<VRPreview />} />
          
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
