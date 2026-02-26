import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Mail, Lock, ArrowRight, User, Eye, EyeOff,
  MapPin, Camera, Shield, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { preferencesAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasNavigated, setHasNavigated] = useState(false);



const handleLogin = async (e) => {
  e.preventDefault();

  if (isLoading) return;

  setError("");
  setIsLoading(true);

  try {
    const result = await login(email.trim(), password);

    if (result.success) {

      if (!result.onboardingComplete) {
        navigate("/onboarding", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } else {
      setError("Login failed");
    }

  } catch (err) {

    if (err?.friendlyMessage) {
      setError(err.friendlyMessage);
    } else {
      setError(err.message || "Login failed");
    }

  } finally {
    setIsLoading(false);
  }
};

const handleSignUp = async (e) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const result = await register(name, email, password, "", "en");

    if (result.success) {
      // Always send newly registered users through onboarding
      navigate("/onboarding", { replace: true });
    } else {
      setError("Registration failed");
    }

  } catch (err) {
    setError(
      err?.friendlyMessage ||
      err?.response?.data?.error ||
      err.message ||
      "Registration failed"
    );
  } finally {
    setIsLoading(false);
  }
};

  const features = [
    { icon: MapPin, text: 'AI-Powered Itineraries' },
    { icon: Camera, text: 'VR Destination Preview' },
    { icon: Shield, text: '24/7 Emergency Support' },
    { icon: MapPin, text: 'Local Expert Guides' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex">
      
      {/* LEFT SIDE - VISUAL */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80')` 
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-600/80 via-orange-500/70 to-amber-500/60" />
        
        {/* Floating Cards */}
        <div className="absolute top-20 left-10 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce-slow">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=100" alt="Paris" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Paris, France</p>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-slate-500">4.9 • 2.3k reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute top-40 right-10 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce-slow" style={{ animationDelay: '1s' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=100" alt="Tokyo" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-semibold text-slate-800">Tokyo, Japan</p>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-slate-500">4.8 • 1.8k reviews</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-32 left-16 bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-xl animate-bounce-slow" style={{ animationDelay: '2s' }}>
          <div className="flex items-center gap-2 text-green-600">
            <Shield size={20} />
            <span className="font-medium">Traveler Protected</span>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo2.png" alt="Roam" className="h-20 w-auto" />
          </div>
          
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Explore the<br />
            <span className="text-amber-200">Wonders</span> of<br />
            the World
          </h1>
          
          <p className="text-xl text-white/80 mb-10 max-w-md">
            Your AI-powered travel companion for unforgettable adventures.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <feature.icon size={20} className="text-amber-200" />
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <img src="/logo2.png" alt="Roam" className="h-16 w-auto" />
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-slate-100 rounded-2xl p-1.5 mb-8">
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isSignUp ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isSignUp ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500">
              {isSignUp ? 'Start your journey with us today' : 'Sign in to continue your adventure'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-12 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end">
                <button type="button" className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                  Forgot password?
                </button>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isSignUp ? 'Create Account' : 'Sign In'}
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-sm text-slate-400">or continue with</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Social Login */}
          <div className="w-full">
            <button className="w-full flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-slate-700">Continue with Google</span>
            </button>
          </div>

          <p className="text-center text-sm text-slate-500 mt-8">
            By continuing, you agree to our{' '}
            <a href="#" className="text-orange-600 hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
