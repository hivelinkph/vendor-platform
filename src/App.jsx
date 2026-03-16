import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { CheckCircle, Clock, ShieldCheck, UploadCloud, FileText, Search, Shield, ChevronRight, Check, Activity, Award, Phone, MessageCircle, Globe, MapPin, Users, Plus, X, ChevronDown } from 'lucide-react';
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

// --- Document Lists ---
const DTI_DOCS = [
  'DTI Business Name Registration',
  "Mayor's Permit",
  'BIR Certificate of Registration (Form 2303)',
  'Official Service Invoice',
  'Official Sales Invoice',
  'Audited Financial Statements',
  'Social Security System (SSS) Company Registration',
  'PhilHealth Company Registration',
  'Pag-IBIG Fund Company Registration',
];

const SEC_DOCS = [
  'SEC Certificate of Incorporation',
  'Articles of Incorporation',
  'Corporate By-Laws',
  "Mayor's Permit",
  'BIR Certificate of Registration (Form 2303)',
  'General Information Sheet (GIS)',
  'Board Resolutions / Secretary Certificates',
  'Stock Certificates / Shareholder Records',
  'Official Service Invoice',
  'Official Sales Invoice',
  'Audited Financial Statements',
  'Social Security System (SSS) Company Registration',
  'PhilHealth Company Registration',
  'Pag-IBIG Fund Company Registration',
];

// --- Vendor Auth Screen ---
const VendorAuthScreen = () => {
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
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { role: 'vendor' } } });
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
          <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)] flex items-center justify-center mx-auto mb-4 transform -rotate-3">
            <ShieldCheck className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">{isLogin ? 'Vendor Login' : 'Vendor Registration'}</h2>
          <p className="text-gray-500">{isLogin ? 'Sign in to manage your vendor profile' : 'Join the verified vendor network'}</p>
        </div>
        <form onSubmit={handleAuth} className="space-y-5">
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">{errorMsg}</div>}
          {successMsg && <div className="p-3 bg-green-50 text-green-600 border border-green-200 rounded-lg text-sm text-center">{successMsg}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-colors" placeholder="vendor@company.com" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white transition-colors" placeholder="••••••••" />
          </div>
          <Button primary className="w-full py-3 mt-4" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }} className="font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors">
            {isLogin ? 'Sign up here' : 'Log in instead'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- CCAP Member Auth Screen ---
const MemberAuthScreen = () => {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: credential, password });
      if (error) throw error;
      navigate('/member');
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
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mx-auto mb-4 transform -rotate-3">
            <Users className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">CCAP Member Login</h2>
          <p className="text-gray-500">Access the verified vendor network</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">{errorMsg}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Email or Mobile Number</label>
            <input type="text" required value={credential} onChange={e => setCredential(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="member@ccap.ph or 09171234567" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">Account provided by your CCAP administrator.</p>
      </div>
    </div>
  );
};

// --- Admin Auth Screen ---
const AdminAuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/admin');
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
            <Shield className="text-white" size={24} />
          </div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] mb-2">Admin Login</h2>
          <p className="text-gray-500">Vendigo administration panel</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm text-center">{errorMsg}</div>}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Admin Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors" placeholder="admin@vendigo.ph" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 mt-4 rounded-lg font-medium bg-[var(--color-primary)] text-white hover:bg-[#46505c] transition-all shadow-md disabled:opacity-50">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
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
  const [loginDropdown, setLoginDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setUser(session?.user || null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setLoginDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
              <button onClick={handleLogout} className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">Log Out</button>
            </div>
          ) : (
            <div className="relative ml-4" ref={dropdownRef}>
              <Button primary className="shadow-md flex items-center" onClick={() => setLoginDropdown(!loginDropdown)}>
                Login <ChevronDown size={16} className={`ml-1 transition-transform ${loginDropdown ? 'rotate-180' : ''}`} />
              </Button>
              {loginDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in duration-200">
                  <button onClick={() => { navigate('/login/vendor'); setLoginDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 flex items-center justify-center"><ShieldCheck size={16} className="text-[var(--color-accent)]" /></div>
                    <div><p className="font-semibold text-sm text-[var(--color-text)]">Vendor Login</p><p className="text-xs text-gray-400">Suppliers & contractors</p></div>
                  </button>
                  <button onClick={() => { navigate('/login/member'); setLoginDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center"><Users size={16} className="text-blue-600" /></div>
                    <div><p className="font-semibold text-sm text-[var(--color-text)]">CCAP Member</p><p className="text-xs text-gray-400">BPO company access</p></div>
                  </button>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button onClick={() => { navigate('/login/admin'); setLoginDropdown(false); }} className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center"><Shield size={16} className="text-[var(--color-primary)]" /></div>
                    <div><p className="font-semibold text-sm text-[var(--color-text)]">Admin Login</p><p className="text-xs text-gray-400">Platform administration</p></div>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

// --- App Layout ---
const Layout = ({ children }) => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex flex-col font-sans w-full noise-bg pb-12 selection:bg-[var(--color-accent)] selection:text-white">
      <Navbar />
      <main className="flex-grow pt-24 pb-12">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: 0.4, ease: "easeOut" }} className="w-full">
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
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0">
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 z-10" />
        <div className="relative z-20 px-8 sm:px-12 w-full">
          <div className="max-w-3xl space-y-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
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

      <div className="py-20 bg-white relative z-10 border-t border-gray-100 overflow-hidden shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-6 mb-10 text-center">
          <h2 className="text-3xl font-bold text-[var(--color-primary)] font-[var(--font-heading)] uppercase tracking-wider">OUR CLIENTS (CCAP members)</h2>
          <div className="w-16 h-1 bg-[var(--color-accent)] mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="relative flex overflow-hidden w-full bg-white before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-24 before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-24 after:bg-gradient-to-l after:from-white after:to-transparent">
          <div className="animate-marquee flex items-center whitespace-nowrap py-4">
            {[...ccapLogos, ...ccapLogos].map((logo, index) => (
              <img key={`logo-${index}`} src={`/CCAPlogos/${logo}`} alt="Client Logo" className="h-14 md:h-20 mx-10 object-contain max-w-[192px] flex-shrink-0" loading="lazy" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Map Rankings Screen ---
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

const MAP_LOCATIONS = [
  { id: 'National', name: 'National Scope', x: '50%', y: '50%' },
  { id: 'Manila', name: 'Metro Manila', x: '35%', y: '40%' },
  { id: 'Clark', name: 'Clark', x: '32%', y: '35%' },
  { id: 'Cebu', name: 'Cebu City', x: '60%', y: '65%' },
  { id: 'Davao', name: 'Davao City', x: '80%', y: '85%' },
  { id: 'Bacolod', name: 'Bacolod', x: '51%', y: '61%' },
  { id: 'GenSan', name: 'General Santos', x: '75%', y: '90%' },
  { id: 'Subic', name: 'Subic', x: '29%', y: '38%' },
];

// Shared vendor card component
const VendorCard = ({ vendor, index, locations, showContacts = false }) => {
  const [expanded, setExpanded] = useState(false);

  const contacts = vendor.contacts || {
    phone: '09171234567',
    messenger: 'vendorpage',
    whatsapp: '639171234567',
    viber: '639171234567',
    telegram: 'vendorhandle',
    facebook: 'https://facebook.com/vendor',
    instagram: 'https://instagram.com/vendor',
    linkedin: 'https://linkedin.com/company/vendor',
  };

  return (
    <GlassPanel className="p-4 bg-white/80 border-l-4 border-l-[var(--color-accent)] hover:border-l-[var(--color-text)] transition-all">
      <div className="flex justify-between items-start gap-4">
        <div className="flex gap-4 flex-grow">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[var(--color-text)] flex-shrink-0 mt-1 shadow-sm">
            {index + 1}
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-lg text-[var(--color-text)] leading-tight">{vendor.name}</h4>
              {showContacts && (
                <button onClick={() => setExpanded(!expanded)} className="text-xs text-[var(--color-accent)] hover:text-[#20b896] font-bold">
                  {expanded ? 'Hide' : 'Contact'}
                </button>
              )}
            </div>
            <p className="text-[0.8rem] text-gray-500 font-medium uppercase tracking-wider mb-2">{vendor.location === 'National' ? 'National Scope' : locations.find(l => l.id === vendor.location)?.name}</p>
            <div className="flex flex-wrap gap-2 items-center">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">{vendor.category}</span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold border ${vendor.level === 3 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                {vendor.level === 3 ? <Award size={12} className="mr-1" /> : <Activity size={12} className="mr-1" />}
                {vendor.levelName}
              </span>
              {vendor.level === 3 && (
                <span className="text-xs text-gray-500 flex items-center">
                  <CheckCircle size={12} className="mr-1 text-[var(--color-accent)]" />
                  {vendor.projects} Projects ({vendor.vouched} members)
                </span>
              )}
            </div>

            {showContacts && expanded && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Contact</p>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${contacts.phone}`} className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center hover:scale-110 transition-transform" title="Phone"><Phone size={16} className="text-white" /></a>
                  <a href={`https://m.me/${contacts.messenger}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center hover:scale-110 transition-transform" title="Messenger"><MessageCircle size={16} className="text-white" /></a>
                  <a href={`https://wa.me/${contacts.whatsapp}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center hover:scale-110 transition-transform" title="WhatsApp"><Phone size={16} className="text-white" /></a>
                  <a href={`viber://chat?number=${contacts.viber}`} className="w-9 h-9 rounded-full bg-purple-600 flex items-center justify-center hover:scale-110 transition-transform" title="Viber"><MessageCircle size={16} className="text-white" /></a>
                  <a href={`https://t.me/${contacts.telegram}`} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-sky-500 flex items-center justify-center hover:scale-110 transition-transform" title="Telegram"><MessageCircle size={16} className="text-white" /></a>
                  <a href={contacts.facebook} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-blue-700 flex items-center justify-center hover:scale-110 transition-transform" title="Facebook"><Globe size={16} className="text-white" /></a>
                  <a href={contacts.instagram} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center hover:scale-110 transition-transform" title="Instagram"><Globe size={16} className="text-white" /></a>
                  <a href={contacts.linkedin} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-blue-800 flex items-center justify-center hover:scale-110 transition-transform" title="LinkedIn"><Globe size={16} className="text-white" /></a>
                </div>
              </div>
            )}
          </div>
        </div>
        {vendor.score && (
          <div className="text-right">
            <div className="text-3xl font-bold text-[var(--color-accent)] leading-none">{vendor.score.toFixed(1)}</div>
            <div className="text-[0.65rem] uppercase font-bold text-gray-400 tracking-wider">KPI Score</div>
          </div>
        )}
      </div>
    </GlassPanel>
  );
};

const MapRankingsScreen = ({ showContacts = false }) => {
  const [selectedLocation, setSelectedLocation] = useState('National');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [vendorsData, setVendorsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVendors() {
      setIsLoading(true);
      try {
        const { data: vData, error: vError } = await supabase.from('vendors').select('id, name, level, category');
        if (vError) throw vError;
        const { data: locData, error: locError } = await supabase.from('vendor_locations').select('vendor_id, location_id');
        if (locError) throw locError;
        const { data: kpiData, error: kpiError } = await supabase.from('kpi_scores').select('vendor_id, overall_score');
        if (kpiError) throw kpiError;
        const { data: certData, error: certError } = await supabase.from('certification_projects').select('vendor_id, ccap_member_name');
        if (certError) throw certError;

        const combined = [];
        for (const vendor of vData) {
          const vLocations = locData.filter(l => l.vendor_id === vendor.id);
          const kpi = kpiData.find(k => k.vendor_id === vendor.id);
          const vendorProjects = certData.filter(c => c.vendor_id === vendor.id);
          const uniqueMembers = new Set(vendorProjects.map(p => p.ccap_member_name)).size;
          const baseVendorObj = {
            id: vendor.id, name: vendor.name, level: vendor.level,
            levelName: vendor.level === 3 ? "Certified" : (vendor.level === 2 ? "Validating" : "Qualify"),
            category: vendor.category || 'Uncategorized',
            score: kpi ? kpi.overall_score : null,
            projects: vendorProjects.length, vouched: uniqueMembers
          };
          if (vLocations.length > 0) {
            vLocations.forEach(loc => combined.push({ ...baseVendorObj, location: loc.location_id }));
          } else {
            combined.push({ ...baseVendorObj, location: 'National' });
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

  const rankedVendors = filteredVendors.filter(v => v.level > 1).sort((a, b) => b.score - a.score);
  const unrankedVendors = filteredVendors.filter(v => v.level === 1).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="w-full max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-4 border-b border-gray-200 pb-6 gap-4">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-text)] font-[var(--font-heading)] mb-2">Vendor Network</h2>
          <p className="text-[var(--color-primary)] max-w-2xl">Explore verified BPO suppliers and contractors across the Philippines.</p>
        </div>
        <div className="flex gap-4">
          <div className="w-full md:w-56">
            <label className="block text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">Category</label>
            <div className="relative">
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 text-[var(--color-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent shadow-sm">
                {VENDOR_CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
            </div>
          </div>
          <div className="w-full md:w-56">
            <label className="block text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider mb-2">Location</label>
            <div className="relative">
              <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="w-full appearance-none bg-white border border-gray-300 rounded-lg py-3 px-4 text-[var(--color-text)] font-medium focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:border-transparent shadow-sm">
                {MAP_LOCATIONS.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"><svg className="fill-current h-4 w-4" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="relative rounded-2xl p-6 shadow-sm flex items-center justify-center min-h-[500px]" style={{ background: '#1a2332' }}>
          <div className="relative w-full max-w-sm mx-auto h-[600px]">
            <img src="/ph_glow_map.png" alt="Philippine Map" className="absolute inset-0 w-full h-full object-contain" />
            {MAP_LOCATIONS.filter(l => l.id !== 'National').map(loc => (
              <button key={loc.id} onClick={() => setSelectedLocation(loc.id)} className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group" style={{ left: loc.x, top: loc.y }}>
                <div className={`location-marker ${selectedLocation === loc.id ? 'active' : ''}`} />
                <div className={`absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-xs font-bold shadow-sm border border-white/20 text-white transition-opacity duration-300 ${selectedLocation === loc.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>{loc.name}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6 flex flex-col h-[600px]">
          <h3 className="text-xl font-bold text-[var(--color-text)] flex items-center justify-between">
            {MAP_LOCATIONS.find(l => l.id === selectedLocation)?.name} Vendors
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
                {rankedVendors.map((vendor, index) => (
                  <VendorCard key={vendor.id + vendor.location} vendor={vendor} index={index} locations={MAP_LOCATIONS} showContacts={showContacts} />
                ))}
                {unrankedVendors.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-300">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center"><Shield size={14} className="mr-2" /> Unranked (Recently Qualified)</h4>
                    <div className="space-y-3">
                      {unrankedVendors.map(vendor => (
                        <div key={vendor.id + vendor.location} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center opacity-80 hover:opacity-100 transition-opacity">
                          <div>
                            <h4 className="font-bold text-[var(--color-text)]">{vendor.name}</h4>
                            <p className="text-[0.7rem] text-gray-500 font-medium uppercase tracking-wider">{vendor.location === 'National' ? 'National Scope' : MAP_LOCATIONS.find(l => l.id === vendor.location)?.name}</p>
                          </div>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Level 1: Qualify</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {!isLoading && filteredVendors.length === 0 && (
                  <div className="text-center py-12"><Search size={32} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500 font-medium">No vendors found.</p></div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- CCAP Member Dashboard ---
const MemberDashboard = () => {
  return (
    <div>
      <MapRankingsScreen showContacts={true} />
    </div>
  );
};

// --- Vendor Qualification Screen ---
const QualifyScreen = () => {
  const [step, setStep] = useState(1);
  const [businessType, setBusinessType] = useState('');
  const [category, setCategory] = useState('');
  const [contactInfo, setContactInfo] = useState({ phone: '', messenger: '', whatsapp: '', viber: '', telegram: '', facebook: '', instagram: '', linkedin: '', website: '', address: '' });
  const [docStatuses, setDocStatuses] = useState({});
  const [scanningDoc, setScanningDoc] = useState(null);

  const docs = businessType === 'dti' ? DTI_DOCS : businessType === 'sec' ? SEC_DOCS : [];
  const allVerified = docs.length > 0 && docs.every((_, i) => docStatuses[i] === 'verified');

  const simulateDocUpload = (index) => {
    setDocStatuses(prev => ({ ...prev, [index]: 'uploading' }));
    setTimeout(() => {
      setDocStatuses(prev => ({ ...prev, [index]: 'scanning' }));
      setScanningDoc(index);
      setTimeout(() => {
        setDocStatuses(prev => ({ ...prev, [index]: 'verified' }));
        setScanningDoc(null);
      }, 2000);
    }, 1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-10 text-left">
      <div className="max-w-3xl">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block py-1 px-3 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-bold tracking-wider uppercase mb-5 border border-[var(--color-accent)]/20">Step {step} of 2</motion.span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-6 leading-tight">Vendor Qualification</h2>
        <p className="text-lg text-[var(--color-primary)] leading-relaxed max-w-2xl">
          {step === 1 ? 'Set up your business profile, select your category, and provide contact information.' : 'Upload your required business documents for AI-powered OCR verification.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 space-y-6">
          {step === 1 && (
            <GlassPanel className="bg-white/40 space-y-6">
              <h3 className="text-xl font-bold flex items-center"><FileText className="mr-3 text-[var(--color-primary)]" size={24} /> Business Profile</h3>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Business Registration Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button onClick={() => setBusinessType('dti')} className={`p-4 rounded-xl border-2 text-left transition-all ${businessType === 'dti' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <p className="font-bold text-[var(--color-text)]">Sole Proprietorship</p>
                    <p className="text-sm text-gray-500 mt-1">DTI-registered business</p>
                    <p className="text-xs text-gray-400 mt-2">9 documents required</p>
                  </button>
                  <button onClick={() => setBusinessType('sec')} className={`p-4 rounded-xl border-2 text-left transition-all ${businessType === 'sec' ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                    <p className="font-bold text-[var(--color-text)]">SEC Registered</p>
                    <p className="text-sm text-gray-500 mt-1">OPC, Partnership, Corporation</p>
                    <p className="text-xs text-gray-400 mt-2">14 documents required</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Product/Service Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]">
                  <option value="">Select a category...</option>
                  {VENDOR_CATEGORIES.filter(c => c.id !== 'All').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Contact Information</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'phone', label: 'Phone Number', placeholder: '09171234567' },
                    { key: 'messenger', label: 'Messenger', placeholder: 'facebook.com/yourpage' },
                    { key: 'whatsapp', label: 'WhatsApp', placeholder: '+639171234567' },
                    { key: 'viber', label: 'Viber', placeholder: '+639171234567' },
                    { key: 'telegram', label: 'Telegram', placeholder: '@yourhandle' },
                    { key: 'facebook', label: 'Facebook Page', placeholder: 'https://facebook.com/...' },
                    { key: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/...' },
                    { key: 'website', label: 'Website', placeholder: 'https://yourcompany.com' },
                    { key: 'address', label: 'Business Address', placeholder: 'City, Province' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{field.label}</label>
                      <input type="text" value={contactInfo[field.key]} onChange={e => setContactInfo(prev => ({ ...prev, [field.key]: e.target.value }))} className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:bg-white" placeholder={field.placeholder} />
                    </div>
                  ))}
                </div>
              </div>

              <Button primary className="w-full mt-4" disabled={!businessType || !category} onClick={() => setStep(2)}>
                Continue to Document Upload <ChevronRight size={18} className="inline ml-1" />
              </Button>
            </GlassPanel>
          )}

          {step === 2 && (
            <GlassPanel className="bg-white/40">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center"><FileText className="mr-3 text-[var(--color-primary)]" size={24} /> Required Documents ({businessType === 'dti' ? 'DTI' : 'SEC'})</h3>
                <button onClick={() => setStep(1)} className="text-sm text-[var(--color-primary)] hover:text-[var(--color-accent)] font-medium">Back to Profile</button>
              </div>

              <div className="space-y-3">
                {docs.map((doc, idx) => {
                  const status = docStatuses[idx];
                  return (
                    <div key={idx} className={`flex items-center p-4 rounded-xl border transition-all duration-300 ${status === 'verified' ? 'border-green-200 bg-green-50/50' : status === 'scanning' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-white/60 hover:bg-white hover:shadow-md'}`}>
                      <div className="mt-0.5 mr-4 flex-shrink-0 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[var(--color-primary)] font-bold text-xs">{idx + 1}</div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800 text-sm">{doc}</p>
                        <p className="text-xs text-gray-400 mt-0.5">PDF, JPG, or PNG under 10MB</p>
                      </div>
                      {status === 'verified' ? (
                        <CheckCircle className="text-[var(--color-accent)] flex-shrink-0" size={20} />
                      ) : status === 'scanning' ? (
                        <div className="flex-shrink-0 text-xs font-bold text-blue-600 animate-pulse">Scanning...</div>
                      ) : status === 'uploading' ? (
                        <div className="flex-shrink-0 text-xs font-bold text-gray-400 animate-pulse">Uploading...</div>
                      ) : (
                        <button onClick={() => simulateDocUpload(idx)} className="flex-shrink-0 px-3 py-1.5 bg-gray-100 hover:bg-[var(--color-accent)]/10 text-gray-600 hover:text-[var(--color-accent)] rounded-lg text-xs font-bold transition-colors">
                          <UploadCloud size={14} className="inline mr-1" /> Upload
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {allVerified && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-6 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 text-center">
                  <Check size={32} className="text-[var(--color-accent)] mx-auto mb-2" />
                  <p className="font-bold text-[var(--color-text)] text-lg">All Documents Verified!</p>
                  <p className="text-sm text-[var(--color-primary)] mb-4">Your vendor profile is now active in the network.</p>
                  <Link to="/validating"><Button primary>Proceed to Validation <ChevronRight size={18} className="inline ml-1" /></Button></Link>
                </motion.div>
              )}
            </GlassPanel>
          )}
        </div>

        <div className="lg:col-span-2">
          <GlassPanel className="sticky top-32 bg-white/50 backdrop-blur-2xl border border-white/60">
            <h3 className="text-lg font-bold mb-6 font-[var(--font-heading)] border-b border-gray-100 pb-4">Verification Journey</h3>
            <ul className="space-y-8 relative before:absolute before:inset-0 before:ml-[11px] before:-translate-x-px before:h-full before:w-[2px] before:bg-gradient-to-b before:from-[var(--color-accent)] before:via-gray-200 before:to-transparent">
              <li className="relative flex gap-5">
                <div className={`${allVerified ? 'bg-[var(--color-accent)]' : step >= 1 ? 'bg-[var(--color-accent)]' : 'bg-gray-200'} w-[24px] h-[24px] rounded-full border-[3px] border-white shadow-md flex-shrink-0 z-10 flex items-center justify-center mt-0.5`}>
                  {allVerified && <Check size={12} className="text-white" />}
                </div>
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">1. Level: Qualify</h4>
                  <p className="text-sm text-[var(--color-primary)] mt-1.5 leading-relaxed">Upload and verify all business documents via OCR.</p>
                </div>
              </li>
              <li className="relative flex gap-5 opacity-40">
                <div className="bg-gray-200 w-[24px] h-[24px] rounded-full border-[3px] border-white shadow flex-shrink-0 z-10 mt-0.5" />
                <div>
                  <h4 className="font-bold text-[var(--color-text)]">2. Level: Validating</h4>
                  <p className="text-sm text-[var(--color-primary)] mt-1.5 leading-relaxed">On-site operational verification by field inspectors.</p>
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

// --- Validating Screen ---
const ValidatingScreen = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
      <div className="text-center mb-10">
        <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-wider uppercase mb-5 border border-blue-200">Step 2: Field Verification</span>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--color-text)] mb-6 font-[var(--font-heading)]">Validating Operation</h2>
        <p className="text-lg text-[var(--color-primary)] leading-relaxed max-w-2xl mx-auto">Your documents passed AI verification. A Vendigo inspector is scheduled to visit your site.</p>
      </div>
      <GlassPanel className="bg-white/60">
        <div className="flex flex-col md:flex-row items-center gap-8 py-4">
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="absolute inset-0 bg-blue-100 rounded-full animate-pulse blur-xl opacity-60"></div>
            <div className="w-full h-full bg-white rounded-full border-4 border-blue-50 shadow-xl flex items-center justify-center relative z-10"><Clock size={48} className="text-blue-500" /></div>
          </div>
          <div className="flex-grow space-y-4 text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-sm font-semibold border border-amber-200"><Activity size={14} className="mr-2" /> Pending Inspection</div>
            <h3 className="text-2xl font-bold text-[var(--color-text)]">Site Visit Scheduled</h3>
            <p className="text-[var(--color-primary)]">An inspector will verify your office location and operations.</p>
            <div className="mt-6 pt-6 border-t border-gray-100 grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start"><Shield size={20} className="text-[var(--color-primary)] mr-3 mt-0.5" /><div><p className="font-bold text-sm text-[var(--color-text)]">Inspector Assigned</p><p className="text-xs text-[var(--color-primary)] mt-1">Michael R. (ID: #VND-482)</p></div></div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-start"><Clock size={20} className="text-[var(--color-primary)] mr-3 mt-0.5" /><div><p className="font-bold text-sm text-[var(--color-text)]">Estimated Date</p><p className="text-xs text-[var(--color-primary)] mt-1">Within 3-5 business days</p></div></div>
            </div>
          </div>
        </div>
      </GlassPanel>
      <GlassPanel className="bg-white/60 mt-8">
        <h3 className="text-2xl font-bold text-[var(--color-text)] mb-2">Path to Certification</h3>
        <p className="text-[var(--color-primary)] mb-6">Complete 3 projects vouched by different CCAP members to achieve Certified status.</p>
        <div className="space-y-4">
          {[1, 2, 3].map(num => (
            <div key={num} className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[var(--color-primary)] flex-shrink-0">{num}</div>
                <div><h4 className="font-bold text-[var(--color-text)]">Project Vouch #{num}</h4><p className="text-sm text-gray-500">Upload contract, PO, or endorsement letter.</p></div>
              </div>
              <Button className="w-full md:w-auto bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-none"><UploadCloud size={16} className="inline mr-2" /> Upload</Button>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};

// --- Certified Screen ---
const CertifiedScreen = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700 text-center pt-8">
      <div className="relative inline-block mb-8">
        <div className="absolute inset-0 bg-[var(--color-accent)] rounded-full animate-ping blur-xl opacity-20"></div>
        <div className="w-40 h-40 mx-auto bg-gradient-to-br from-[#20b896] to-[var(--color-accent)] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(45,209,172,0.3)] relative z-10 border-4 border-white"><Award size={72} className="text-white" /></div>
        <div className="absolute -bottom-4 -right-4 bg-white p-2 rounded-full shadow-lg"><CheckCircle size={32} className="text-[var(--color-accent)]" /></div>
      </div>
      <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--color-text)] mb-4 font-[var(--font-heading)]">Vendor Certified</h2>
      <p className="text-xl text-[var(--color-primary)] max-w-2xl mx-auto mb-10">Your operation has been fully verified. You are now a certified vendor for the CCAP network.</p>
      <div className="grid md:grid-cols-3 gap-6 text-left">
        <GlassPanel className="bg-white/80 border-t-4 border-t-[var(--color-accent)]"><ShieldCheck size={28} className="text-[var(--color-accent)] mb-4" /><h4 className="font-bold text-lg mb-2">Verified Documents</h4><p className="text-sm text-[var(--color-primary)]">All business documents passed AI OCR analysis.</p></GlassPanel>
        <GlassPanel className="bg-white/80 border-t-4 border-t-blue-400"><Activity size={28} className="text-blue-400 mb-4" /><h4 className="font-bold text-lg mb-2">Physical Audit Passed</h4><p className="text-sm text-[var(--color-primary)]">Operations confirmed by field inspectors.</p></GlassPanel>
        <GlassPanel className="bg-white/80 border-t-4 border-t-[var(--color-text)]"><Award size={28} className="text-[var(--color-text)] mb-4" /><h4 className="font-bold text-lg mb-2">Premium Listing</h4><p className="text-sm text-[var(--color-primary)]">Certified badge visible to all CCAP members.</p></GlassPanel>
      </div>
    </div>
  );
};

// --- Admin Dashboard ---
const AdminScreen = () => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberMobile, setNewMemberMobile] = useState('');

  const mockMembers = [
    { name: 'Accenture Inc.', email: 'admin@accenture.com', status: 'Active' },
    { name: 'TaskUs', email: 'ops@taskus.com', status: 'Active' },
    { name: 'Concentrix', email: 'vendor@concentrix.com', status: 'Active' },
    { name: 'TELUS International', email: 'procurement@telus.com', status: 'Disabled' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-[var(--color-text)] font-[var(--font-heading)]">Admin Dashboard</h2>
          <p className="text-[var(--color-primary)] mt-2">Manage vendor and CCAP member accounts.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('vendors')} className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'vendors' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-gray-500 hover:text-[var(--color-text)]'}`}>
          Vendors
        </button>
        <button onClick={() => setActiveTab('members')} className={`px-6 py-3 font-bold text-sm transition-colors border-b-2 ${activeTab === 'members' ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-transparent text-gray-500 hover:text-[var(--color-text)]'}`}>
          CCAP Members
        </button>
      </div>

      {activeTab === 'vendors' && (
        <GlassPanel className="bg-white/80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text)]">Vendor Accounts</h3>
            <Button primary className="py-2 text-sm"><Search size={16} className="inline mr-2" /> Find Vendor</Button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="pb-4 font-semibold">Vendor Name</th>
                <th className="pb-4 font-semibold">Category</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold">Docs Verified</th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[
                { name: "Acme Tech Solutions", category: "IT & Computers", status: "Level 2: Validating", statusColor: "text-blue-600 bg-blue-50", docs: "14/14" },
                { name: "Nexus Catering Services", category: "Catering & Food", status: "Level 1: Qualify", statusColor: "text-purple-600 bg-purple-50", docs: "5/9" },
                { name: "Apex Security Inc.", category: "Security Services", status: "Level 2: Validating", statusColor: "text-blue-600 bg-blue-50", docs: "9/9" },
                { name: "Global Office Supplies", category: "Office Supplies", status: "Level 3: Certified", statusColor: "text-[var(--color-accent)] bg-[var(--color-accent)]/10", docs: "14/14" },
              ].map((v, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-medium text-[var(--color-text)]">{v.name}</td>
                  <td className="py-4 text-sm text-[var(--color-primary)]">{v.category}</td>
                  <td className="py-4"><span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${v.statusColor}`}>{v.status}</span></td>
                  <td className="py-4 text-sm text-[var(--color-primary)]">{v.docs}</td>
                  <td className="py-4 text-right">
                    {v.status.includes('Level 2') ? (
                      <Link to="/certified"><Button primary className="py-1.5 px-4 text-xs font-bold shadow-sm">Approve</Button></Link>
                    ) : (
                      <button className="text-sm font-medium text-gray-400 hover:text-[var(--color-text)]">View</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
      )}

      {activeTab === 'members' && (
        <GlassPanel className="bg-white/80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-[var(--color-text)]">CCAP Member Accounts</h3>
            <Button primary className="py-2 text-sm" onClick={() => setShowAddMember(!showAddMember)}>
              <Plus size={16} className="inline mr-2" /> Add Member
            </Button>
          </div>

          {showAddMember && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="font-bold text-sm text-[var(--color-text)] mb-3">Create New CCAP Member Account</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input type="email" value={newMemberEmail} onChange={e => setNewMemberEmail(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email address" />
                <input type="text" value={newMemberMobile} onChange={e => setNewMemberMobile(e.target.value)} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Mobile number" />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">Create Account</button>
              </div>
            </div>
          )}

          <table className="w-full text-left">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-gray-400 border-b border-gray-100">
                <th className="pb-4 font-semibold">Company Name</th>
                <th className="pb-4 font-semibold">Email</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {mockMembers.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-medium text-[var(--color-text)]">{m.name}</td>
                  <td className="py-4 text-sm text-[var(--color-primary)]">{m.email}</td>
                  <td className="py-4"><span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${m.status === 'Active' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>{m.status}</span></td>
                  <td className="py-4 text-right">
                    <button className={`text-sm font-bold ${m.status === 'Active' ? 'text-red-400 hover:text-red-600' : 'text-green-400 hover:text-green-600'} transition-colors`}>
                      {m.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassPanel>
      )}
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
          <Route path="/login" element={<Navigate to="/login/vendor" replace />} />
          <Route path="/login/vendor" element={<VendorAuthScreen />} />
          <Route path="/login/member" element={<MemberAuthScreen />} />
          <Route path="/login/admin" element={<AdminAuthScreen />} />
          <Route path="/qualify" element={<QualifyScreen />} />
          <Route path="/validating" element={<ValidatingScreen />} />
          <Route path="/certified" element={<CertifiedScreen />} />
          <Route path="/member" element={<MemberDashboard />} />
          <Route path="/admin" element={<AdminScreen />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
