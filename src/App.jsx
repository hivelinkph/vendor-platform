import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { CheckCircle, Clock, ShieldCheck, UploadCloud, FileText, Search, Shield, ChevronRight, Check, Activity, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ccapLogos from './ccapLogosList.json';
import './App.css';
import { mockVendors } from './mockVendors';

// --- Global UI Components ---
const GlassPanel = ({ children, className = "" }) => (
  <div className={`glass-panel rounded-2xl p-6 md:p-8 relative overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, primary, onClick, className = "", disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 shadow-md ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-0.5 hover:shadow-xl'}
      ${primary ? 'bg-[var(--color-accent)] text-white hover:bg-[#20b896]' : 'bg-[var(--color-primary)] text-white hover:bg-[#46505c]'} ${className}`}
  >
    {children}
  </button>
);

// --- Auth Screen ---
const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/qualify');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setSuccessMsg('Registration successful! Check your email to confirm your account.');
      }
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="w-full max-w-md mx-auto mt-20 p-8 bg-white/80 backdrop-blur-md rounded-2xl border border-gray-100 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--color-primary)] flex items-center justify-center mx-auto mb-4 transform -rotate-3">
            <span className="text-white font-bold text-2xl">V</span>
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-gray-500">{isLogin ? 'Sign in to manage your vendor profile' : 'Join the verified vendor network'}</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="p-3 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm text-center">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-colors"
              placeholder="vendor@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button primary className="w-full py-3 mt-4" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }}
            className="font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
          >
            {isLogin ? 'Sign up here' : 'Log in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for Navbar buttons
const NavButton = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`relative px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300
      ${active ? 'text-[var(--color-accent)]' : 'text-gray-600 hover:text-[var(--color-primary)]'}
    `}
  >
    {children}
    {active && (
      <motion.span
        layoutId="underline"
        className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-accent)]"
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    )}
  </button>
);

// --- Navbar Component ---
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-6 max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] flex items-center justify-center transform rotate-3">
            <span className="text-white font-bold text-xl tracking-tighter">V</span>
          </div>
          <span className="text-2xl font-bold text-[var(--color-primary)] tracking-tight">vendigo<span className="text-[var(--color-accent)]">.</span></span>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <NavButton active={location.pathname === '/'} onClick={() => navigate('/')}>Home</NavButton>
          <NavButton active={location.pathname === '/map'} onClick={() => navigate('/map')}>Vendor Network</NavButton>
          <NavButton active={location.pathname === '/qualify'} onClick={() => navigate('/qualify')}>Get Qualified</NavButton>

          {user ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
              <span className="text-sm font-medium text-gray-600">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Button primary className="ml-4 shadow-md" onClick={() => navigate('/login')}>
              Vendor Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- App Layout ---
const Layout = ({ children }) => {
  const location = useLocation(); // Keep useLocation for potential future use or if children rely on it

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans w-full noise-bg pb-12 selection:bg-[var(--color-accent)] selection:text-white">
      <Navbar /> {/* Use the new Navbar component */}

      <main className="flex-grow pt-24 pb-12">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="w-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

// --- Landing Screen ---
const LandingScreen = () => {
  return (
    <div className="w-full relative text-left">
      <div className="relative w-full min-h-[90vh] flex items-end pb-12 overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/hero.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <div className="absolute inset-0 bg-black/20 z-10" />

        <div className="relative z-20 px-8 sm:px-12 w-full">
          <div className="max-w-3xl space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-6 font-[var(--font-heading)] leading-tight shadow-sm" style={{ color: 'white' }}>
                Verified suppliers for modern BPO operations.
              </h1>

              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 leading-relaxed font-light mb-10 max-w-2xl drop-shadow-md">
                Operating a BPO is complex enough. Our platform verifies suppliers, contractors, and service providers so you can focus on scaling operations with confidence.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/map" className="w-full sm:w-auto">
                  <Button primary className="w-full text-lg px-8 py-4 flex items-center justify-center">
                    Get Verified Vendors <ChevronRight size={20} className="ml-2" />
                  </Button>
                </Link>
                <button className="w-full sm:w-auto text-lg px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all rounded-lg font-medium cursor-pointer">
                  Browse Supplier Network
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* OUR CLIENT Section */}
      <div className="py-20 bg-white relative z-10 border-t border-gray-100 overflow-hidden shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] font-[var(--font-heading)] uppercase tracking-wider">
            OUR CLIENTS (CCAP members)
          </h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="relative flex overflow-hidden w-full bg-white before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent">
          <div className="animate-marquee flex items-center whitespace-nowrap py-4">
            {[...ccapLogos, ...ccapLogos].map((logo, index) => (
              <img
                key={`logo-${index}`}
                src={`/CCAPlogos/${logo}`}
                alt="Client Logo"
                className="h-14 md:h-20 mx-10 object-contain max-w-[192px] flex-shrink-0"
                loading="lazy"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Map Rankings Screen ---
// import {supabase} from './lib/supabase'; // Already imported at the top

const VENDOR_CATEGORIES = [
  { id: 'All', name: 'All Categories' },
  { id: 'IT & Computers', name: 'IT & Computers' },
  { id: 'Office Supplies', name: 'Office Supplies' },
  { id: 'Facilities & Maintenance', name: 'Facilities & Maintenance' },
  { id: 'Security Services', name: 'Security Services' },
  { id: 'Catering & Food', name: 'Catering & Food' },
  { id: 'HR & Recruitment', name: 'HR & Recruitment' },
  { id: 'Telecommunications', name: 'Telecommunications' },
  { id: 'Transportation & Logistics', name: 'Transportation & Logistics' },
];

const MapRankingsScreen = () => {
  const [selectedLocation, setSelectedLocation] = useState('National');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vendorsData, setVendorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Map configuration
  const locations = [
    { id: 'National', name: 'National Scope', x: '50%', y: '50%' }, // Virtual, not on map
    { id: 'Manila', name: 'Metro Manila', x: '35%', y: '40%' },
    { id: 'Clark', name: 'Clark', x: '32%', y: '35%' },
    { id: 'Cebu', name: 'Cebu City', x: '60%', y: '65%' },
    { id: 'Davao', name: 'Davao City', x: '80%', y: '85%' },
    { id: 'Bacolod', name: 'Bacolod', x: '51%', y: '61%' },
    { id: 'GenSan', name: 'General Santos', x: '75%', y: '90%' },
    { id: 'Subic', name: 'Subic', x: '29%', y: '38%' },
  ];

  useEffect(() => {
    async function fetchVendors() {
      setIsLoading(true);
      try {
        // 1. Fetch Vendors (including category)
        const { data: vData, error: vError } = await supabase
          .from('vendors')
          .select('id, name, level, category');

        if (vError) throw vError;

        // 2. Fetch Locations
        const { data: locData, error: locError } = await supabase
          .from('vendor_locations')
          .select('vendor_id, location_id');

        if (locError) throw locError;

        // 3. Fetch KPI Scores (for Level 2 and 3)
        const { data: kpiData, error: kpiError } = await supabase
          .from('kpi_scores')
          .select('vendor_id, overall_score');

        if (kpiError) throw kpiError;

        // 4. Fetch Certification Projects count (for Level 3)
        const { data: certData, error: certError } = await supabase
          .from('certification_projects')
          .select('vendor_id, ccap_member_name');

        if (certError) throw certError;

        // Combine the data into our expected structure
        const combined = [];

        // Loop through each vendor and expand by location
        for (const vendor of vData) {
          const vLocations = locData.filter(l => l.vendor_id === vendor.id);
          const kpi = kpiData.find(k => k.vendor_id === vendor.id);

          const vendorProjects = certData.filter(c => c.vendor_id === vendor.id);
          // Get unique members who vouched for this vendor
          const uniqueMembers = new Set(vendorProjects.map(p => p.ccap_member_name)).size;

          const baseVendorObj = {
            id: vendor.id,
            name: vendor.name,
            level: vendor.level,
            levelName: vendor.level === 3 ? "Certified" : (vendor.level === 2 ? "Validating" : "Qualify"),
            category: vendor.category || 'Uncategorized',
            score: kpi ? kpi.overall_score : null,
            projects: vendorProjects.length,
            vouched: uniqueMembers
          };

          // If a vendor operates in multiple locations, we create an entry for each location for filtering purposes
          if (vLocations.length > 0) {
            vLocations.forEach(loc => {
              combined.push({
                ...baseVendorObj,
                location: loc.location_id
              });
            });
          } else {
            // Fallback if no location defined
            combined.push({
              ...baseVendorObj,
              location: 'National'
            });
          }
        }

        setVendorsData(combined.length > 0 ? combined : mockVendors);
      } catch (error) {
        console.error("Error fetching vendor data:", error.message);
        setVendorsData(mockVendors);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVendors();
  }, []);

  const filteredVendors = vendorsData.filter(v => {
    const locationMatch = selectedLocation === 'National' ? true : (v.location === selectedLocation || v.location === 'National');
    const categoryMatch = selectedCategory === 'All' ? true : v.category === selectedCategory;
    return locationMatch && categoryMatch;
  });

  // Sorting logic: Validating/Certified (Level 2/3) are ranked. Qualify (Level 1) at bottom unranked.
  const rankedVendors = filteredVendors
    .filter(v => v.level > 1)
    .sort((a, b) => b.score - a.score);

  const unrankedVendors = filteredVendors
    .filter(v => v.level === 1)
    .sort((a, b) => a.name.localeCompare(b.name));


  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-gray-200 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[var(--font-heading)] mb-2">Vendor Network</h2>
          <p className="text-[var(--color-primary)] max-w-2xl">
            Explore verified BPO suppliers and contractors across the Philippines.
            Vendors are ranked by performance metrics gathered during on-site inspections.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="w-full md:w-56">
            <label className="block text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">Category</label>
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 text-[var(--color-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent shadow-sm"
              >
                {VENDOR_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-56">
            <label className="block text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">Location</label>
            <div className="relative">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 text-[var(--color-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent shadow-sm"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Map Column */}
        <div className="relative rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[500px]" style={{ background: '#1a2332' }}>
          <div className="relative w-full max-w-sm mx-auto h-[600px]">
            <img
              src="/ph_glow_map.png"
              alt="Philippine Map"
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Map Dots */}
            {locations.filter(l => l.id !== 'National').map(loc => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc.id)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group"
                style={{ left: loc.x, top: loc.y }}
              >
                <div className={`location-marker ${selectedLocation === loc.id ? 'active' : ''}`} />
                <div className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold shadow-sm border border-white/20 text-white transition-opacity duration-300
                  ${selectedLocation === loc.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                `}>
                  {loc.name}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Listings Column */}
        <div className="space-y-6 flex flex-col h-[600px]">
          <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center justify-between">
            {locations.find(l => l.id === selectedLocation)?.name} Vendors
            <span className="text-sm font-normal text-gray-400 bg-gray-100 rounded-full px-3 py-1">{filteredVendors.length} found</span>
          </h3>

          <div className="flex-grow overflow-y-auto pr-2 space-y-4 pt-1">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-[var(--color-accent)] rounded-full mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium">Loading network data...</p>
              </div>
            ) : (
              <>
                {/* Ranked List (Level 2 and 3) */}
                {rankedVendors.map((vendor, index) => (
                  <GlassPanel key={vendor.id + vendor.location} className="p-4 bg-white/80 border-l-4 border-l-[var(--color-accent)] hover:border-l-[var(--color-text)] transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[var(--color-text)] flex-shrink-0 mt-1 shadow-sm">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-[var(--color-text)] leading-tight">{vendor.name}</h4>
                          <p className="text-[0.8rem] text-gray-500 font-medium uppercase tracking-wider mb-2">{vendor.location === 'National' ? 'National Scope' : locations.find(l => l.id === vendor.location)?.name}</p>

                          <div className="flex flex-wrap gap-2 items-center">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                              {vendor.category}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border
                          ${vendor.level === 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}
                        `}>
                              {vendor.level === 3 ? <Award size={12} className="mr-1" /> : <Activity size={12} className="mr-1" />}
                              {vendor.levelName}
                            </span>

                            {vendor.level === 3 && (
                              <span className="text-xs text-gray-500 flex items-center">
                                <CheckCircle size={12} className="mr-1 text-[var(--color-accent)]" />
                                {vendor.projects} Projects Vouched ({vendor.vouched} members)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-[var(--color-accent)] leading-none">{vendor.score.toFixed(1)}</div>
                        <div className="text-[0.65rem] uppercase font-bold text-gray-400 tracking-wider">KPI Score</div>
                      </div>
                    </div>
                  </GlassPanel>
                ))}

                {/* Unranked Section (Level 1) */}
                {unrankedVendors.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center">
                      <Shield size={14} className="mr-2" /> Unranked (Recently Qualified)
                    </h4>
                    <div className="space-y-3">
                      {unrankedVendors.map(vendor => (
                        <div key={vendor.id + vendor.location} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                          <div>
                            <h4 className="font-bold text-[var(--color-text)]">{vendor.name}</h4>
                            <p className="text-[0.7rem] text-gray-500 font-medium uppercase tracking-wider">{vendor.location === 'National' ? 'National Scope' : locations.find(l => l.id === vendor.location)?.name}</p>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            Level 1: Qualify
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!isLoading && filteredVendors.length === 0 && (
                  <div className="text-center py-12">
                    <Search size={32} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-500 font-medium">No vendors found in this location.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Screen 1: Qualify ---
const QualifyScreen = () => {
  const [uploadState, setUploadState] = useState('idle'); // idle, uploading, scanning, success
  const [progress, setProgress] = useState(0);

  const simulateUploadAndScan = () => {
    setUploadState('uploading');
    setProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(uploadInterval);
          setUploadState('scanning');

          // Simulate AI OCR Scan
          setTimeout(() => setUploadState('success'), 3000);
          return 100;
        }
        return p + 5;
      });
    }, 100);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 text-left">
      <div className="max-w-3xl">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block py-1 px-3 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase mb-5 border border-[var(--color-accent)]/20">Step 1: Initiation</motion.span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-6 leading-tight">Vendor Qualification</h2>
        <p className="text-lg text-[var(--color-primary)] leading-relaxed max-w-2xl">
          Create your profile and upload your official business documents.
          Our AI system instantly verifies your corporate artifacts via OCR to ensure compliance with CCAP standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <GlassPanel className="group bg-white/40">
            <div className="absolute top-0 left-0 w-1 h-full bg-[var(--color-accent)] transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out" />

            <h3 className="text-xl font-bold mb-6 flex items-center">
              <FileText className="mr-3 text-[var(--color-primary)]" size={24} />
              Required Documentation
            </h3>

            <div className="space-y-4">
              {['Business Permit (Current Year)', 'SEC / DTI Registration', 'BIR Certificate of Registration'].map((doc, idx) => (
                <div key={idx} className="flex items-start p-4 rounded-xl border border-gray-100 bg-white/60 hover:bg-white hover:shadow-md transition-all duration-300">
                  <div className="mt-0.5 mr-4 flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">{idx + 1}</div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{doc}</p>
                    <p className="text-sm text-gray-400 mt-1">PDF, JPG, or PNG under 10MB</p>
                  </div>
                  {uploadState === 'success' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-1">
                      <CheckCircle className="text-[var(--color-accent)]" size={20} />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {uploadState === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, height: 0 }}
                  className="mt-8 border-2 border-dashed border-gray-300/80 rounded-xl p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-[var(--color-accent)]/5 hover:border-[var(--color-accent)]/50 transition-all cursor-pointer group/dropbox"
                  onClick={simulateUploadAndScan}
                >
                  <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover/dropbox:scale-110 transition-transform">
                    <UploadCloud size={32} className="text-[var(--color-primary)]" />
                  </div>
                  <p className="font-medium text-[var(--color-text)]">Drag & drop your files securely</p>
                  <p className="text-sm text-[var(--color-primary)] mt-1">or click to browse from your device</p>
                  <Button className="mt-6" primary>Select Documents</Button>
                </motion.div>
              )}

              {uploadState === 'uploading' && (
                <motion.div key="uploading" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-10 rounded-xl bg-white/80 border border-gray-100 shadow-inner flex flex-col items-center justify-center">
                  <UploadCloud size={32} className="text-[var(--color-accent)] animate-bounce mb-4" />
                  <p className="font-bold text-[var(--color-text)] mb-2">Uploading Documents...</p>
                  <div className="w-full max-w-xs h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-accent)] transition-all duration-200" style={{ width: `${progress}%` }} />
                  </div>
                </motion.div>
              )}

              {uploadState === 'scanning' && (
                <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-10 rounded-xl bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 shadow-inner flex flex-col items-center justify-center">
                  <div className="relative w-16 h-16 mb-4">
                    <FileText size={48} className="text-[var(--color-primary)] absolute inset-0 m-auto opacity-20" />
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 w-full h-1 bg-[var(--color-accent)] shadow-[0_0_8px_rgba(45,209,172,0.8)] z-10 rounded"
                    />
                  </div>
                  <p className="font-bold text-[var(--color-text)] mb-1">AI OCR Verification in Progress</p>
                  <p className="text-sm text-[var(--color-primary)]">Scanning for authenticity and valid dates...</p>
                </motion.div>
              )}

              {uploadState === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 p-10 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center mb-4">
                    <Check size={32} className="text-[var(--color-accent)]" />
                  </div>
                  <p className="font-bold text-[var(--color-text)] mb-1 text-lg">Documents Verified!</p>
                  <p className="text-sm text-[var(--color-primary)] mb-6">OCR validation passed successfully.</p>
                  <Link to="/validating">
                    <Button primary className="flex items-center">Proceed to Validation <ChevronRight size={18} className="ml-1" /></Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>
        </div>

        <div className="lg:col-span-2">
          <GlassPanel className="sticky top-32 bg-white/50 backdrop-blur-2xl border border-white/60">
            <h3 className="text-lg font-bold mb-6 font-[var(--font-heading)] border-b border-gray-100 pb-4">Verification Journey</h3>
            <ul className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-accent)] before:via-gray-200 before:to-transparent">
              <li className="relative flex gap-5">
                <div className="bg-[var(--color-accent)] w-[24px] h-[24px] rounded-full border-[3px] border-white shadow-md flex-shrink-0 z-10 flex items-center justify-center mt-0.5">
                  {uploadState === 'success' && <Check size={12} className="text-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">1. Level: Qualify</h4>
                  <p className="text-sm text-[var(--color-primary)] mt-1.5 leading-relaxed">Instant OCR verification of SEC/DTI and business records.</p>
                </div>
              </li>
              <li className="relative flex gap-5 opacity-40">
                <div className="bg-gray-200 w-[24px] h-[24px] rounded-full border-[3px] border-white shadow flex-shrink-0 z-10 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">2. Level: Validating</h4>
                  <p className="text-sm text-[var(--color-primary)] mt-1.5 leading-relaxed">On-site operational verification by our field inspectors.</p>
                </div>
              </li>
              <li className="relative flex gap-5 opacity-40 pb-4">
                <div className="bg-gray-200 w-[24px] h-[24px] rounded-full border-[3px] border-white shadow flex-shrink-0 z-10 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">3. Level: Certified</h4>
                  <p className="text-sm text-[var(--color-primary)] mt-1.5 leading-relaxed">Official Vendigo Certified badge for the CCAP network.</p>
                </div>
              </li>
            </ul>
          </GlassPanel>
        </div>
      </div>
    </div>
  );
};

// --- Screen 2: Validating ---
const ValidatingScreen = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-5 border border-blue-200">Step 2: Field Verification</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-6 font-[var(--font-heading)]">Validating Operation</h2>
        <p className="text-lg text-[var(--color-primary)] leading-relaxed max-w-2xl mx-auto">
          Your documents passed AI verification. You are now in the Validating stage.
          A Vendigo inspector is scheduled to visit your site.
        </p>
      </div>

      <GlassPanel className="bg-white/60">
        <div className="flex flex-col md:flex-row items-center gap-8 py-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse blur-xl opacity-60"></div>
            <div className="w-full h-full bg-white rounded-full border-4 border-blue-50 shadow-xl flex items-center justify-center relative z-10">
              <Clock size={48} className="text-blue-500" />
            </div>
          </div>

          <div className="flex-grow space-y-4 text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold border border-amber-200">
              <Activity size={14} className="mr-2" /> Pending Inspection
            </div>
            <h3 className="text-2xl font-bold text-[var(--color-text)]">Site Visit Scheduled</h3>
            <p className="text-[var(--color-primary)]">
              An inspector has been assigned to verify your office location and confirm you have a legitimate, operating facility capable of providing the claimed products and services.
            </p>

            <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start">
                <Shield size={20} className="text-[var(--color-primary)] mr-3 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[var(--color-text)]">Inspector Assigned</p>
                  <p className="text-xs text-[var(--color-primary)] mt-1">Michael R. (ID: #VND-482)</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start">
                <Clock size={20} className="text-[var(--color-primary)] mr-3 mt-0.5" />
                <div>
                  <p className="font-bold text-sm text-[var(--color-text)]">Estimated Date</p>
                  <p className="text-xs text-[var(--color-primary)] mt-1">Within 3-5 business days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </GlassPanel>

      {/* Path to Certification */}
      <GlassPanel className="bg-white/60 mt-8">
        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Path to Certification</h3>
        <p className="text-[var(--color-primary)] mb-6">
          To achieve full <strong>Vendigo Certified</strong> status (Level 3) and receive your ranking, you must complete and upload documentation for at least 3 projects requested by different CCAP members.
        </p>

        <div className="space-y-4">
          {[1, 2, 3].map((num) => (
            <div key={num} className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[var(--color-primary)] flex-shrink-0">
                  {num}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">Project Vouch #{num}</h4>
                  <p className="text-sm text-gray-500">Upload contract, purchase order, or member endorsement letter.</p>
                </div>
              </div>
              <Button className="w-full md:w-auto bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-none">
                <UploadCloud size={16} className="inline mr-2" /> Upload Document
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Button disabled className="opacity-50 cursor-not-allowed">
            Submit 3 Projects for Certification
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};

// --- Screen 3: Certified ---
const CertifiedScreen = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700 text-center pt-8">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-[var(--color-accent)] rounded-full animate-ping blur-xl opacity-20"></div>
        <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#20b896] to-[var(--color-accent)] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(45,209,172,0.3)] relative z-10 border-4 border-white">
          <Award size={72} className="text-white" />
        </div>
        <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-lg">
          <CheckCircle size={32} className="text-[var(--color-accent)]" />
        </div>
      </div>

      <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] mb-4 font-[var(--font-heading)]">Vendor Certified</h2>
      <p className="text-xl text-[var(--color-primary)] max-w-2xl mx-auto mb-10">
        Congratulations! Your operation has been fully verified and vetted by Vendigo. You are now a certified vendor for the CCAP network.
      </p>

      <div className="grid md:grid-cols-3 gap-6 text-left">
        <GlassPanel className="bg-white/80 border-t-4 border-t-[var(--color-accent)]">
          <ShieldCheck size={28} className="text-[var(--color-accent)] mb-4" />
          <h4 className="font-bold text-lg mb-2">Verified Documents</h4>
          <p className="text-sm text-[var(--color-primary)]">All business permits and registrations passed AI OCR analysis.</p>
        </GlassPanel>
        <GlassPanel className="bg-white/80 border-t-4 border-t-blue-400">
          <Activity size={28} className="text-blue-400 mb-4" />
          <h4 className="font-bold text-lg mb-2">Physical Audit Passed</h4>
          <p className="text-sm text-[var(--color-primary)]">Operations and facilities confirmed by Vendigo field inspectors.</p>
        </GlassPanel>
        <GlassPanel className="bg-white/80 border-t-4 border-t-[var(--color-text)]">
          <Award size={28} className="text-[var(--color-text)] mb-4" />
          <h4 className="font-bold text-lg mb-2">Premium Listing</h4>
          <p className="text-sm text-[var(--color-primary)]">Your profile is now highlighted with the Certified badge to all CCAP members.</p>
        </GlassPanel>
      </div>

      <div className="mt-12">
        <Button className="px-8 shadow-lg">Go to Vendor Dashboard</Button>
      </div>
    </div>
  );
};

// --- Screen 4: Admin ---
const AdminScreen = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] font-[var(--font-heading)]">Admin Dashboard</h2>
          <p className="text-[var(--color-primary)] mt-2">Manage vendor applications and physical inspections.</p>
        </div>
        <Button primary className="py-2 text-sm"><Search size={16} className="inline mr-2" /> Find Vendor</Button>
      </div>

      <GlassPanel className="bg-white/80">
        <table className="w-full text-left">
          <thead>
            <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
              <th className="pb-4 font-semibold">Vendor Name</th>
              <th className="pb-4 font-semibold">Status</th>
              <th className="pb-4 font-semibold">Inspector</th>
              <th className="pb-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[
              { name: "Acme Tech Solutions", status: "Level 2: Validating", statusColor: "text-blue-600 bg-blue-50", inspector: "Michael R." },
              { name: "Nexus Catering Services", status: "Level 1: Qualify", statusColor: "text-purple-600 bg-purple-50", inspector: "Unassigned" },
              { name: "Apex Security Inc.", status: "Level 2: Validating", statusColor: "text-blue-600 bg-blue-50", inspector: "Sarah J." },
              { name: "Global Office Supplies", status: "Level 3: Certified", statusColor: "text-[var(--color-accent)] bg-[var(--color-accent)]/10", inspector: "David W." },
            ].map((v, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 font-medium text-[var(--color-text)]">{v.name}</td>
                <td className="py-4">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${v.statusColor}`}>{v.status}</span>
                </td>
                <td className="py-4 text-sm text-[var(--color-primary)]">{v.inspector}</td>
                <td className="py-4 text-right">
                  {v.status.includes('Level 2') ? (
                    <Link to="/certified">
                      <Button primary className="py-1.5 px-4 text-xs font-bold shadow-sm">Approve Inspection</Button>
                    </Link>
                  ) : (
                    <button className="text-sm font-medium text-gray-400 hover:text-[var(--color-text)]">View Details</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </div>
  );
};

// --- App Entry ---
const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingScreen />} />
          <Route path="/map" element={<MapRankingsScreen />} />
          <Route path="/login" element={<AuthScreen />} /> {/* Added AuthScreen route */}
          <Route path="/qualify" element={<QualifyScreen />} />
          <Route path="/validating" element={<ValidatingScreen />} />
          <Route path="/certified" element={<CertifiedScreen />} />
          <Route path="/admin" element={<AdminScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
