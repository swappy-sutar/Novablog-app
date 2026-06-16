import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  User, 
  Shield, 
  Sparkles, 
  Bell, 
  Lock, 
  Settings, 
  HelpCircle, 
  Globe, 
  Mail, 
  Check, 
  ChevronRight, 
  Trash2, 
  Download,
  AlertTriangle
} from 'lucide-react';
import Button from '../components/ui/Button';
import { authAPI } from '../lib/api';

const PREFS_KEY = 'novablog_settings_prefs_v1';

const defaultPrefs = () => ({
  twoFactor: false,
  theme: 'dark',
  fontScale: 100,
  notify: {
    followers: { push: true, email: false },
    engagement: { push: true, email: true },
    newsletter: { push: false, email: true },
  },
  publicProfile: true,
});

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    if (!raw) return defaultPrefs();
    return { ...defaultPrefs(), ...JSON.parse(raw) };
  } catch {
    return defaultPrefs();
  }
}

function savePrefs(prefs) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

function formatDisplayName(p) {
  if (!p) return '';
  const first = p.firstname?.trim();
  const last = p.lastname?.trim();
  if (first || last) {
    return [first, last].filter(Boolean).join(' ');
  }
  return p.username || '';
}

function splitDisplayName(displayName) {
  const t = displayName.trim();
  if (!t) return { firstname: '', lastname: '' };
  const i = t.indexOf(' ');
  if (i === -1) return { firstname: t, lastname: '' };
  return { firstname: t.slice(0, i).trim(), lastname: t.slice(i + 1).trim() };
}

function persistUserFromProfile(data) {
  try {
    const prev = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...prev,
        id: data.id,
        firstname: data.firstname,
        lastname: data.lastname,
        username: data.username,
        email: data.email,
        avatar: data.avatar,
        bio: data.bio,
        websiteUrl: data.websiteUrl,
        githubUrl: data.githubUrl,
        role: data.role,
      }),
    );
    window.dispatchEvent(new Event('auth-change'));
  } catch {
    /* ignore */
  }
}

function Toggle({ on, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        on ? 'bg-brand-cyan' : 'bg-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

const SettingsPage = () => {
  const [active, setActive] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loadState, setLoadState] = useState({ loading: true, error: null });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    bio: '',
    websiteUrl: '',
    githubUrl: '',
  });
  
  const initialPrefs = loadPrefs();
  const prefsBaseline = useRef(JSON.parse(JSON.stringify(initialPrefs)));
  const [prefs, setPrefs] = useState(initialPrefs);
  const fileRef = useRef(null);

  // Setup Refs for Scroll-Spy
  const sectionRefs = {
    profile: useRef(null),
    security: useRef(null),
    appearance: useRef(null),
    notifications: useRef(null),
    privacy: useRef(null),
  };

  const applyTheme = useCallback((theme) => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else if (theme === 'dark') {
      root.classList.remove('light-mode');
    } else {
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (dark) root.classList.remove('light-mode');
      else root.classList.add('light-mode');
    }
  }, []);

  useEffect(() => {
    applyTheme(prefs.theme);
  }, [prefs.theme, applyTheme]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${prefs.fontScale}%`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [prefs.fontScale]);

  const loadProfile = useCallback(async () => {
    setLoadState({ loading: true, error: null });
    try {
      const res = await authAPI.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        persistUserFromProfile(res.data);
        const dn = formatDisplayName(res.data);
        setForm({
          displayName: dn || res.data.username || '',
          bio: res.data.bio ?? '',
          websiteUrl: res.data.websiteUrl ?? '',
          githubUrl: res.data.githubUrl ?? '',
        });
        setLoadState({ loading: false, error: null });
      } else {
        setLoadState({ loading: false, error: 'Unexpected response' });
      }
    } catch (e) {
      const msg = e.response?.data?.message || e.message || 'Could not load profile';
      setLoadState({ loading: false, error: msg });
      toast.error(typeof msg === 'string' ? msg : 'Could not load profile');
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // offset

      for (const id in sectionRefs) {
        const ref = sectionRefs[id].current;
        if (ref) {
          const top = ref.offsetTop;
          const bottom = top + ref.offsetHeight;

          if (scrollPosition >= top && scrollPosition < bottom) {
            setActive(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const ref = sectionRefs[id].current;
    if (ref) {
      const offset = 100; // Adjust for sticky header
      const elementPosition = ref.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setActive(id);
    }
  };

  const syncFormFromProfile = useCallback(() => {
    if (!profile) return;
    setForm({
      displayName: formatDisplayName(profile) || profile.username || '',
      bio: profile.bio ?? '',
      websiteUrl: profile.websiteUrl ?? '',
      githubUrl: profile.githubUrl ?? '',
    });
  }, [profile]);

  const handlePickPhoto = () => fileRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Please choose an image file');
      return;
    }
    setUploading(true);
    try {
      const res = await authAPI.uploadProfilePicture(file);
      if (res.success && res.data) {
        setProfile(res.data);
        persistUserFromProfile(res.data);
        toast.success(res.message || 'Profile picture updated');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Upload failed';
      toast.error(typeof msg === 'string' ? msg : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const saveProfileApi = async () => {
    const { firstname, lastname } = splitDisplayName(form.displayName);
    if (!firstname) {
      toast.error('Display name is required');
      return 'invalid';
    }
    setSaving(true);
    try {
      const res = await authAPI.updateProfile({
        firstname,
        lastname: lastname || undefined,
        bio: form.bio.trim(),
        websiteUrl: form.websiteUrl.trim(),
        githubUrl: form.githubUrl.trim(),
      });
      if (res.success && res.data) {
        setProfile(res.data);
        persistUserFromProfile(res.data);
        return true;
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        err.message ||
        'Could not save profile';
      toast.error(typeof msg === 'string' ? msg : 'Could not save profile');
    } finally {
      setSaving(false);
    }
    return false;
  };

  const handleSaveAll = async () => {
    const profileResult = await saveProfileApi();
    if (profileResult === 'invalid') return;
    savePrefs(prefs);
    prefsBaseline.current = JSON.parse(JSON.stringify(prefs));
    if (profileResult === true) {
      toast.success('Settings saved successfully');
    } else {
      toast.success('Preferences saved locally');
    }
  };

  const handleDiscard = () => {
    syncFormFromProfile();
    const restored = JSON.parse(JSON.stringify(prefsBaseline.current));
    setPrefs(restored);
    applyTheme(restored.theme);
    toast('Changes discarded', { icon: '↩' });
  };

  const avatarSrc =
    profile?.avatar &&
    `${profile.avatar}${profile.avatar.includes('?') ? '&' : '?'}cb=${encodeURIComponent(profile.updatedAt || profile.id || '')}`;
  const initials =
    `${profile?.firstname?.[0] || ''}${profile?.lastname?.[0] || ''}`.toUpperCase() ||
    profile?.username?.[0]?.toUpperCase() ||
    '?';

  if (loadState.loading && !profile) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading settings…</p>
      </div>
    );
  }

  if (loadState.error && !profile) {
    return (
      <div className="max-w-7xl mx-auto px-6 text-center py-16">
        <p className="text-gray-400 mb-4">{loadState.error}</p>
        <Button variant="secondary" type="button" onClick={loadProfile}>
          Try again
        </Button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white/[0.04] border border-border-subtle rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all';
  const labelClass = 'block text-xs font-semibold text-gray-400 mb-2';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 pb-28 pt-4">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Settings Navigation Sidebar */}
      <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
        <div className="px-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-xs font-medium text-brand-purple tracking-wide uppercase mt-0.5">
            Developer Edition
          </p>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1 custom-scrollbar">
          {[
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'security', label: 'Security', icon: Shield },
            { id: 'appearance', label: 'Appearance', icon: Settings },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy', icon: Lock },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-3 border ${
                  isActive
                    ? 'bg-brand-purple/15 text-[#c4b5fd] border-brand-purple/20'
                    : 'text-gray-400 border-transparent hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                {item.label}
              </button>
            );
          })}

          <div className="hidden lg:block my-2 border-t border-border-subtle" />

          <button onClick={() => toast("Advanced config loaded")} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] flex items-center gap-3 border border-transparent">
            <Settings className="w-4 h-4 opacity-75" />
            Settings
          </button>
          <button onClick={() => toast("Help center loaded")} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/[0.04] flex items-center gap-3 border border-transparent">
            <HelpCircle className="w-4 h-4 opacity-75" />
            Help
          </button>
        </nav>

        {/* Upgrade Pro Sidebar Card */}
        <div className="hidden lg:block relative overflow-hidden rounded-2xl border border-brand-purple/20 bg-gradient-to-b from-brand-purple/10 to-transparent p-5">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-cyan/10 rounded-full blur-2xl" />
          <Sparkles className="w-5 h-5 text-brand-cyan mb-3" />
          <p className="text-xs font-medium text-gray-400 leading-relaxed">
            Unlock team accounts and advanced SEO features.
          </p>
          <button 
            type="button"
            onClick={() => toast("Upgrade request received")}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-500 via-brand-purple to-brand-cyan shadow-lg shadow-brand-purple/20 hover:opacity-95 transition-opacity"
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* Main Content Area: Stacked Sections */}
      <div className="flex-1 min-w-0 space-y-10">
        
        {/* PROFILE SETTINGS CARD */}
        <section 
          ref={sectionRefs.profile} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-brand-blue border-b border-border-subtle pb-3">
            Profile Settings
          </h2>

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="relative shrink-0">
              <div className="w-24 h-24 rounded-xl border border-border-subtle overflow-hidden bg-bg-card-hover flex items-center justify-center">
                {profile?.avatar ? (
                  <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/30 to-brand-cyan/20 text-2xl font-bold text-white">
                    {initials}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-3 text-center sm:text-left">
              <p className="text-xs text-gray-400">
                Recommended size: 400x400px. JPG, PNG or GIF.
              </p>
              <div className="flex justify-center sm:justify-start">
                <Button
                  type="button"
                  variant="outline"
                  className="!rounded-xl !py-2 !px-4 text-xs font-semibold"
                  onClick={handlePickPhoto}
                  disabled={uploading}
                >
                  {uploading ? 'Uploading…' : 'Upload image'}
                </Button>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Display Name</label>
              <input
                className={inputClass}
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                placeholder="Alex Rivera"
                maxLength={120}
              />
            </div>

            <div>
              <label className={labelClass}>Username</label>
              <input
                className={`${inputClass} opacity-60 cursor-not-allowed`}
                readOnly
                value={profile?.username ? `@${profile.username}` : ''}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Bio</label>
            <textarea
              className={`${inputClass} min-h-[100px] resize-y`}
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Product Designer & Developer focused on the intersection of AI and creative tools."
              maxLength={500}
              rows={3}
            />
            <p className="text-[10px] text-gray-600 mt-1 text-right">{form.bio.length}/500</p>
          </div>

          <div>
            <label className={labelClass}>Social Links</label>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <Globe className="w-4 h-4" />
                </span>
                <input
                  className={`${inputClass} pl-10`}
                  value={form.websiteUrl}
                  onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                  placeholder="Website URL"
                />
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                    <path d="M9 18c-4.51 2-5-2-7-2" />
                  </svg>
                </span>
                <input
                  className={`${inputClass} pl-10`}
                  value={form.githubUrl}
                  onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                  placeholder="GitHub profile"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT SECURITY CARD */}
        <section 
          ref={sectionRefs.security} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-brand-blue border-b border-border-subtle pb-3">
            Account Security
          </h2>

          <div className="rounded-xl border border-border-subtle bg-[#0c0d1c]/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.03] text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email address</p>
                <p className="text-sm font-semibold text-gray-200 mt-0.5">{profile?.email}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toast('Email updates coming soon')}
              className="text-xs font-semibold text-brand-cyan hover:text-cyan-300 py-1.5 px-4 rounded-lg bg-brand-cyan/5 border border-brand-cyan/20 transition-all text-center"
            >
              Update
            </button>
          </div>

          <div className="rounded-xl border border-border-subtle bg-[#0c0d1c]/40 p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-lg bg-white/[0.03] text-gray-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-200">Two-Factor Authentication</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Secure your account with an extra layer of protection.
                </p>
              </div>
            </div>
            <Toggle
              on={prefs.twoFactor}
              onChange={(v) => setPrefs((p) => ({ ...p, twoFactor: v }))}
            />
          </div>

          <button
            type="button"
            onClick={() => toast('Password change flow coming soon')}
            className="w-full py-3.5 rounded-xl border border-border-subtle text-xs font-semibold text-gray-300 hover:bg-white/[0.04] hover:text-white flex items-center justify-center gap-2 transition-all"
          >
            <Lock className="w-4 h-4 opacity-75" />
            Change Password
          </button>
        </section>

        {/* APPEARANCE CARD */}
        <section 
          ref={sectionRefs.appearance} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-brand-blue border-b border-border-subtle pb-3">
            Appearance
          </h2>

          {/* Theme Selector */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { id: 'light', label: 'Light Mode' },
              { id: 'dark', label: 'Dark Mode' },
              { id: 'system', label: 'System' },
            ].map((t) => {
              const isSelected = prefs.theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setPrefs((p) => ({ ...p, theme: t.id }))}
                  className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-brand-cyan bg-brand-cyan/5 text-white ring-1 ring-brand-cyan/25'
                      : 'border-border-subtle bg-white/[0.01] text-gray-400 hover:border-gray-600 hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{t.label}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-cyan text-black flex items-center justify-center text-xs">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Font scale adjustment */}
          <div className="space-y-3">
            <div className="flex justify-between text-xs text-gray-400 font-semibold">
              <span>Text Size Adjustment</span>
              <span className="text-white bg-white/[0.05] px-2 py-0.5 rounded">{prefs.fontScale}%</span>
            </div>
            <div className="flex items-center gap-4 bg-[#0c0d1c]/30 border border-border-subtle px-5 py-4 rounded-xl">
              <span className="text-gray-500 text-xs font-medium select-none">Aa</span>
              <input
                type="range"
                min={85}
                max={125}
                step={5}
                value={prefs.fontScale}
                onChange={(e) =>
                  setPrefs((p) => ({ ...p, fontScale: Number(e.target.value) }))
                }
                className="flex-1 accent-brand-cyan h-1.5 rounded-full bg-gray-800 cursor-pointer"
              />
              <span className="text-gray-200 text-base font-bold select-none">Aa</span>
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS CARD */}
        <section 
          ref={sectionRefs.notifications} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <div className="flex items-center justify-between border-b border-border-subtle pb-3">
            <h2 className="text-lg font-bold text-brand-blue">
              Notifications
            </h2>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-brand-purple/20 text-[#c4b5fd] border border-brand-purple/30">
              Custom Active
            </span>
          </div>

          {/* Matrix Headers */}
          <div className="grid grid-cols-[1fr_50px_50px] gap-4 text-[10px] font-extrabold uppercase tracking-widest text-gray-500 px-3">
            <span>Notification Feed Type</span>
            <span className="text-center">Push</span>
            <span className="text-center">Email</span>
          </div>

          {/* Notification Rows */}
          {[
            {
              key: 'followers',
              title: 'New followers',
              desc: 'Notify when someone follows your feed',
            },
            {
              key: 'engagement',
              title: 'Comments & mentions',
              desc: 'Stay engaged with your community',
            },
            {
              key: 'newsletter',
              title: 'Weekly newsletter',
              desc: 'Weekly curation of the best dev articles',
            },
          ].map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[1fr_50px_50px] gap-4 items-center p-3 rounded-xl border border-white/[0.02] bg-[#0c0d1c]/20"
            >
              <div>
                <p className="text-sm font-semibold text-gray-200">{row.title}</p>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{row.desc}</p>
              </div>
              <div className="flex justify-center">
                <Toggle
                  on={prefs.notify[row.key].push}
                  onChange={(v) =>
                    setPrefs((p) => ({
                      ...p,
                      notify: {
                        ...p.notify,
                        [row.key]: { ...p.notify[row.key], push: v },
                      },
                    }))
                  }
                />
              </div>
              <div className="flex justify-center">
                <Toggle
                  on={prefs.notify[row.key].email}
                  onChange={(v) =>
                    setPrefs((p) => ({
                      ...p,
                      notify: {
                        ...p.notify,
                        [row.key]: { ...p.notify[row.key], email: v },
                      },
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </section>

        {/* PRIVACY CARD */}
        <section 
          ref={sectionRefs.privacy} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-brand-blue border-b border-border-subtle pb-3">
            Privacy
          </h2>

          <div className="rounded-xl border border-border-subtle bg-[#0c0d1c]/40 p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-200">Public Profile Visibility</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  When enabled, your profile and posts are visible to everyone on the internet. Turning this off limits visibility to approved followers.
                </p>
              </div>
              <span className="text-[#a5b4fc]/70 p-2.5 rounded-lg bg-white/[0.03] shrink-0">
                <Globe className="w-5 h-5" />
              </span>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap pt-2">
              <Toggle
                on={prefs.publicProfile}
                onChange={(v) => setPrefs((p) => ({ ...p, publicProfile: v }))}
              />
              <button
                type="button"
                onClick={() => toast('Visibility settings updated')}
                className="px-4 py-2 rounded-xl bg-[#c3c7f3] text-[#0f172a] text-xs font-semibold hover:opacity-90 transition-opacity"
              >
                Manage Visibility
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => toast('Export requested — check your registered email shortly')}
              className="rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-white/[0.03] p-4 flex items-center justify-between text-xs font-semibold text-gray-300 transition-all"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-gray-400" />
                Export My Data
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
            
            <button
              type="button"
              onClick={() => toast.error('To delete your account, contact database administration')}
              className="rounded-xl border border-red-500/20 bg-red-500/[0.01] hover:bg-red-500/[0.04] p-4 flex items-center justify-between text-xs font-semibold text-red-400 transition-all"
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 opacity-75" />
                Delete Account
              </span>
              <ChevronRight className="w-4 h-4 text-red-400/60" />
            </button>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-base/90 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between sm:justify-end gap-6">
          <button
            type="button"
            onClick={handleDiscard}
            className="text-xs font-bold text-gray-500 hover:text-gray-300 transition-colors py-2 uppercase tracking-wide cursor-pointer"
          >
            Discard Changes
          </button>
          
          <Button
            type="button"
            variant="primary"
            className="!rounded-xl !py-3 !px-8 text-xs font-bold uppercase tracking-wide cursor-pointer bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-purple shadow-lg shadow-brand-purple/20 hover:scale-102"
            onClick={handleSaveAll}
            disabled={saving || uploading}
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
