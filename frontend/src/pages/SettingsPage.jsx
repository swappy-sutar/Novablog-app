import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { authAPI } from '../lib/api';

/** Optional reference art: place PNGs in `public/settings/` (see SETTINGS_REF). */
const SETTINGS_REF = {
  overview: '/settings/settings-overview.png',
  security: '/settings/security.png',
  social: '/settings/social-links.png',
  notifications: '/settings/notifications.png',
  privacy: '/settings/privacy.png',
};

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

function RefImage({ src, className = '' }) {
  return (
    <img
      src={src}
      alt=""
      className={`rounded-xl border border-border-subtle bg-[#0f172a]/40 object-contain w-full ${className}`}
      onError={(e) => {
        e.currentTarget.style.display = 'none';
      }}
    />
  );
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

const NAV = [
  { id: 'profile', label: 'Profile' },
  { id: 'security', label: 'Security' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'privacy', label: 'Privacy' },
];

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
      const msg =
        e.response?.data?.message || e.message || 'Could not load profile';
      setLoadState({ loading: false, error: msg });
      toast.error(typeof msg === 'string' ? msg : 'Could not load profile');
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

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
      const msg =
        err.response?.data?.message || err.message || 'Upload failed';
      toast.error(typeof msg === 'string' ? msg : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  /** @returns {'invalid' | true | false} */
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
      toast.success('Settings saved');
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
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="w-10 h-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading settings…</p>
      </div>
    );
  }

  if (loadState.error && !profile) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 text-center py-16">
        <p className="text-gray-400 mb-4">{loadState.error}</p>
        <Button variant="secondary" type="button" onClick={loadProfile}>
          Try again
        </Button>
      </div>
    );
  }

  const inputClass =
    'w-full bg-white/[0.06] border border-border-subtle rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20';
  const labelClass = 'block text-xs font-semibold text-[#a5b4fc] mb-2';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1400px] mx-auto px-4 md:px-6 pb-28"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0 lg:sticky lg:top-28 lg:self-start space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Settings</h1>
            <p className="text-sm text-gray-500 mt-1 truncate">
              {formatDisplayName(profile) || profile?.username}
            </p>
          </div>
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(item.id)}
                className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  active === item.id
                    ? 'bg-brand-purple/20 text-[#c4b5fd] border border-brand-purple/30'
                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="hidden lg:block space-y-2 pt-4 border-t border-border-subtle">
            <button
              type="button"
              className="w-full text-left text-sm text-gray-500 hover:text-gray-300 py-2"
            >
              Help
            </button>
            <button
              type="button"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 via-brand-purple to-brand-cyan shadow-lg shadow-brand-purple/20 hover:opacity-95 transition-opacity"
            >
              Upgrade to Pro
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0 space-y-8">
          <AnimatePresence mode="wait">
            {active === 'profile' && (
              <motion.section
                key="profile"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="space-y-8"
              >
                <div className="grid xl:grid-cols-[1fr_280px] gap-6 items-start">
                  <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-8">
                    <h2 className="text-lg font-semibold text-[#a5b4fc]">Profile</h2>

                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="relative shrink-0">
                        <div className="w-28 h-28 rounded-xl border border-border-subtle overflow-hidden bg-bg-card">
                          {profile?.avatar ? (
                            <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/30 to-brand-cyan/20 text-2xl font-semibold text-white">
                              {initials}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 space-y-3 min-w-0">
                        <p className="text-xs text-gray-500">
                          Recommended size: 800×800px. JPG, PNG or GIF.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="!rounded-xl !py-2 !px-4 text-sm"
                          onClick={handlePickPhoto}
                          disabled={uploading}
                        >
                          {uploading ? 'Uploading…' : 'Upload image'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Display name</label>
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
                        className={`${inputClass} opacity-70 cursor-not-allowed`}
                        readOnly
                        value={profile?.username ? `@${profile.username}` : ''}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Bio</label>
                      <textarea
                        className={`${inputClass} min-h-[120px] resize-y`}
                        value={form.bio}
                        onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                        placeholder="Senior software architect. I write about systems that ship."
                        maxLength={500}
                        rows={4}
                      />
                      <p className="text-[10px] text-gray-600 mt-1 text-right">{form.bio.length}/500</p>
                    </div>

                    <div>
                      <h3 className={`${labelClass} mt-2`}>Social links</h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </span>
                          <input
                            className={`${inputClass} pl-11`}
                            value={form.websiteUrl}
                            onChange={(e) => setForm((f) => ({ ...f, websiteUrl: e.target.value }))}
                            placeholder="Website URL"
                          />
                        </div>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                          </span>
                          <input
                            className={`${inputClass} pl-11`}
                            value={form.githubUrl}
                            onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))}
                            placeholder="GitHub profile"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <RefImage src={SETTINGS_REF.overview} className="max-h-56" />
                    <RefImage src={SETTINGS_REF.social} className="max-h-40" />
                  </div>
                </div>
              </motion.section>
            )}

            {active === 'security' && (
              <motion.section
                key="security"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="grid xl:grid-cols-[1fr_300px] gap-6 items-start"
              >
                <div className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-4">
                  <h2 className="text-lg font-semibold text-[#a5b4fc] mb-6">Account security</h2>

                  <div className="rounded-xl border border-border-subtle bg-[#0f172a]/50 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Email address</p>
                      <p className="text-sm text-gray-200 mt-1">{profile?.email}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toast('Email updates coming soon')}
                      className="text-sm font-medium text-[#a5b4fc] hover:text-[#c4b5fd]"
                    >
                      Update
                    </button>
                  </div>

                  <div className="rounded-xl border border-border-subtle bg-[#0f172a]/50 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200">Two-factor authentication</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Secure your account with an extra layer of protection.
                      </p>
                    </div>
                    <Toggle
                      on={prefs.twoFactor}
                      onChange={(v) => setPrefs((p) => ({ ...p, twoFactor: v }))}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => toast('Password change flow coming soon')}
                    className="w-full rounded-xl border border-border-subtle py-3.5 text-sm text-gray-300 hover:bg-white/[0.04] flex items-center justify-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    Change password
                  </button>
                </div>
                <RefImage src={SETTINGS_REF.security} className="max-h-72" />
              </motion.section>
            )}

            {active === 'appearance' && (
              <motion.section
                key="appearance"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-8 max-w-3xl"
              >
                <h2 className="text-lg font-semibold text-[#a5b4fc]">Appearance</h2>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { id: 'light', label: 'Light mode' },
                    { id: 'dark', label: 'Dark mode' },
                    { id: 'system', label: 'System' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPrefs((p) => ({ ...p, theme: t.id }))}
                      className={`rounded-xl border p-4 text-left text-sm font-medium transition-all ${
                        prefs.theme === t.id
                          ? 'border-brand-cyan bg-brand-cyan/10 text-white ring-1 ring-brand-cyan/40'
                          : 'border-border-subtle text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        {t.label}
                        {prefs.theme === t.id && (
                          <span className="text-brand-cyan text-lg leading-none">✓</span>
                        )}
                      </span>
                    </button>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Font size</span>
                    <span>{prefs.fontScale}%</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-500 text-sm">Aa</span>
                    <input
                      type="range"
                      min={85}
                      max={125}
                      step={5}
                      value={prefs.fontScale}
                      onChange={(e) =>
                        setPrefs((p) => ({ ...p, fontScale: Number(e.target.value) }))
                      }
                      className="flex-1 accent-brand-cyan h-2 rounded-full"
                    />
                    <span className="text-gray-200 text-lg font-medium">Aa</span>
                  </div>
                </div>
              </motion.section>
            )}

            {active === 'notifications' && (
              <motion.section
                key="notifications"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="grid xl:grid-cols-[1fr_320px] gap-6 items-start"
              >
                <div className="rounded-2xl border border-border-subtle bg-white/[0.02] overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
                    <h2 className="text-lg font-semibold text-[#a5b4fc]">Notifications</h2>
                    <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded-full bg-brand-purple/20 text-[#c4b5fd] border border-brand-purple/25">
                      Custom active
                    </span>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 text-[10px] uppercase tracking-wider text-gray-500 border-b border-border-subtle">
                    <span />
                    <span className="text-center w-14">Push</span>
                    <span className="text-center w-14">Email</span>
                  </div>
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
                      className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-4 border-b border-border-subtle last:border-0"
                    >
                      <div>
                        <p className="text-sm text-gray-200">{row.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{row.desc}</p>
                      </div>
                      <div className="flex justify-center w-14">
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
                      <div className="flex justify-center w-14">
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
                </div>
                <RefImage src={SETTINGS_REF.notifications} className="max-h-80" />
              </motion.section>
            )}

            {active === 'privacy' && (
              <motion.section
                key="privacy"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                className="grid xl:grid-cols-[1fr_300px] gap-6 items-start"
              >
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-[#a5b4fc]">Privacy</h2>
                  <div className="rounded-2xl border border-border-subtle bg-[#0f172a]/40 p-6 space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-200">Public profile visibility</p>
                        <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xl">
                          When enabled, your profile and posts are visible to everyone. Turning this off
                          limits visibility to followers only (when supported).
                        </p>
                      </div>
                      <span className="text-[#a5b4fc] shrink-0">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Toggle
                        on={prefs.publicProfile}
                        onChange={(v) => setPrefs((p) => ({ ...p, publicProfile: v }))}
                      />
                      <button
                        type="button"
                        onClick={() => toast('Visibility controls coming soon')}
                        className="px-5 py-2.5 rounded-xl bg-[#c3c7f3] text-[#0f172a] text-sm font-medium hover:opacity-90"
                      >
                        Manage visibility
                      </button>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => toast('Export requested — coming soon')}
                      className="rounded-xl border border-border-subtle py-4 px-4 flex items-center justify-between text-sm text-gray-300 hover:bg-white/[0.04]"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                        Export my data
                      </span>
                      <span className="text-gray-600">›</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toast.error('Account deletion is not available yet')}
                      className="rounded-xl border border-red-500/30 py-4 px-4 flex items-center justify-between text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete account
                      </span>
                      <span className="text-red-400/80">›</span>
                    </button>
                  </div>
                </div>
                <RefImage src={SETTINGS_REF.privacy} className="max-h-96" />
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border-subtle bg-bg-base/90 backdrop-blur-lg">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleDiscard}
            className="text-sm text-gray-500 hover:text-gray-300 py-2 order-2 sm:order-1 sm:mr-auto"
          >
            Discard changes
          </button>
          <Button
            type="button"
            variant="primary"
            className="!rounded-xl !py-3 !px-8 order-1 sm:order-2"
            onClick={handleSaveAll}
            disabled={saving || uploading}
          >
            {saving ? 'Saving…' : 'Save settings'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
