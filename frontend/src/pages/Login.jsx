import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, ArrowRight, Star, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { preferencesAPI } from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [hasNavigated, setHasNavigated] = useState(false);

  // Redirect if already authenticated (only for returning users, not fresh registrations)
  useEffect(() => {
    if (isAuthenticated && !isSignUp && !hasNavigated) {
      setHasNavigated(true);
      checkOnboardingAndRedirect();
    }
  }, [isAuthenticated]);

  const checkOnboardingAndRedirect = async () => {
    try {
      const response = await preferencesAPI.checkOnboardingStatus();
      if (response.data.success && !response.data.data.completed) {
        // New user, go to onboarding
        navigate('/onboarding', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      // If preferences don't exist, redirect to onboarding
      navigate('/onboarding', { replace: true });
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result?.success) {
        // checkOnboardingAndRedirect will be called via useEffect
      }
    } catch (err) {
      console.error("Login Error:", err);
      const errorData = err.response?.data?.error;
      // Handle Zod validation errors (object) vs simple string errors
      if (typeof errorData === 'object') {
        const firstError = Object.values(errorData).find(e => e?._errors?.length);
        setError(firstError?._errors?.[0] || 'Login failed.');
      } else {
        setError(errorData || 'Invalid email or password.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name, email, password, '', 'en');
      if (result?.success) {
        // New user, redirect to onboarding immediately
        setHasNavigated(true);
        navigate('/onboarding', { replace: true });
      }
    } catch (err) {
      console.error("Register Error:", err);
      const errorData = err.response?.data?.error;
      // Handle Zod validation errors (object) vs simple string errors
      if (typeof errorData === 'object') {
        const firstError = Object.values(errorData).find(e => e?._errors?.length);
        setError(firstError?._errors?.[0] || 'Registration failed.');
      } else if (err.response?.status === 409) {
        setError('An account with this email already exists.');
      } else {
        setError(errorData || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex font-sans bg-white">
      
      {/* --- LEFT SIDE: BRANDING --- */}
      {/* Added 'bg-slate-900' here: If image breaks, this dark color shows instead of white */}
      <div className="hidden lg:flex w-[55%] relative bg-slate-900 text-white overflow-hidden">
        
        {/* Background Image - Reliable Link */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-50 mix-blend-overlay"></div>
        
        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-roam-navy via-roam-navy/80 to-roam-teal/30"></div>

        <div className="relative z-10 p-16 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center gap-3 mb-12">
               <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-lg">
                 <Globe className="text-roam-gold" size={28} />
               </div>
               <span className="text-2xl font-bold tracking-tight text-white">Roam.</span>
            </div>
            
            <h1 className="text-6xl font-extrabold leading-tight mb-6">
              Travel <br/>
              <span className="text-roam-teal">Unbound.</span>
            </h1>
            <p className="text-lg text-slate-200 max-w-md leading-relaxed font-medium">
              Experience the world with the only AI companion that plans, guides, and protects you in real-time.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl max-w-sm hover:bg-white/10 transition-colors">
            <div className="flex gap-1 text-roam-gold mb-3">
              {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
            </div>
            <p className="text-sm font-medium italic mb-4 text-slate-100">"Roam's emergency feature literally saved me when I lost my passport in Tokyo. Indispensable."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-roam-teal flex items-center justify-center text-xs font-bold text-white shadow-md">JD</div>
              <div>
                <p className="text-sm font-bold text-white">John Doe</p>
                <p className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Elite Member</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT SIDE: FORM --- */}
      <div className="w-full lg:w-[45%] bg-white flex flex-col justify-center px-10 lg:px-24 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold text-roam-navy mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isSignUp ? 'Sign up to start your journey.' : 'Log in to access your itinerary.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
               <div className="text-red-500 mt-0.5">⚠️</div>
               <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-roam-navy uppercase tracking-wider ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-roam-teal transition-colors" size={20} />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-roam-navy font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-roam-teal/20 focus:border-roam-teal transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-roam-navy uppercase tracking-wider ml-1">Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-roam-teal transition-colors" size={20} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-roam-navy font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-roam-teal/20 focus:border-roam-teal transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-roam-navy uppercase tracking-wider ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-roam-teal transition-colors" size={20} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-12 pr-4 text-roam-navy font-medium focus:outline-none focus:bg-white focus:ring-2 focus:ring-roam-teal/20 focus:border-roam-teal transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-roam-navy hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg shadow-roam-navy/20 flex items-center justify-center gap-2 transform active:scale-[0.98] transition-all mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>{isSignUp ? 'Create Account' : 'Sign In'} <ArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 font-medium">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                }}
                className="text-roam-teal font-bold hover:text-rose-700 hover:underline transition-colors ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <p className="text-center text-xs text-slate-400 mt-8">
            © 2026 Roam Inc. • <a href="#" className="hover:text-roam-navy transition-colors">Privacy & Terms</a>
          </p>
        </div>
      </div>
    </div>
  );
}