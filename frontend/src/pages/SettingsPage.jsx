import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  Download,
  AlertTriangle,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { authAPI, getErrorMessage } from '../lib/api';
import useDocumentTitle from '../hooks/useDocumentTitle';

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
  window.dispatchEvent(new Event('storage'));
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
        techStack: data.techStack,
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
        on ? 'bg-brand-purple' : 'bg-gray-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-[#ffffff] shadow transition-transform ${
          on ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

const SettingsPage = () => {
  useDocumentTitle("Settings");

  const navigate = useNavigate();
  
  const storedUser = (() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
    } catch {}
    return null;
  })();

  const [active, setActive] = useState('profile');
  const [profile, setProfile] = useState(storedUser);
  const [loadState, setLoadState] = useState(() => {
    if (storedUser) return { loading: false, error: null };
    return { loading: true, error: null };
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => {
    const dn = formatDisplayName(storedUser);
    return {
      displayName: dn || storedUser?.username || '',
      bio: storedUser?.bio ?? '',
      websiteUrl: storedUser?.websiteUrl ?? '',
      githubUrl: storedUser?.githubUrl ?? '',
      techStack: storedUser?.techStack ?? [],
    };
  });
  const [newTechInput, setNewTechInput] = useState('');

  // API settings modals states
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isExportingData, setIsExportingData] = useState(false);

  // 2FA States
  const [is2FAEnabled, setIs2FAEnabled] = useState(storedUser?.isTwoFactorEnabled || false);
  const [is2FAModalOpen, setIs2FAModalOpen] = useState(false);
  const [isGenerating2FA, setIsGenerating2FA] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying2FA, setIsVerifying2FA] = useState(false);

  const [isDisable2FAModalOpen, setIsDisable2FAModalOpen] = useState(false);
  const [disableCode, setDisableCode] = useState('');
  const [isDisabling2FA, setIsDisabling2FA] = useState(false);
  
  const initialPrefs = loadPrefs();
  const prefsBaseline = useRef(JSON.parse(JSON.stringify(initialPrefs)));
  const [prefs, setPrefs] = useState(initialPrefs);
  const fileRef = useRef(null);

  // Setup Refs for Scroll-Spy
  const profileRef = useRef(null);
  const securityRef = useRef(null);
  const appearanceRef = useRef(null);
  const notificationsRef = useRef(null);
  const privacyRef = useRef(null);

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

  const handlePreferenceChange = (key, value) => {
    setPrefs((p) => {
      const next = { ...p, [key]: value };
      savePrefs(next);
      prefsBaseline.current = JSON.parse(JSON.stringify(next));
      return next;
    });
  };

  useEffect(() => {
    applyTheme(prefs.theme);
  }, [prefs.theme, applyTheme]);

  useEffect(() => {
    document.documentElement.style.fontSize = `${prefs.fontScale}%`;
    return () => {
      try {
        const raw = localStorage.getItem(PREFS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.fontScale === "number") {
            document.documentElement.style.fontSize = `${parsed.fontScale}%`;
            return;
          }
        }
      } catch (e) {}
      document.documentElement.style.fontSize = '';
    };
  }, [prefs.fontScale]);

  const loadProfile = useCallback(async () => {
    setLoadState({ loading: true, error: null });
    try {
      const res = await authAPI.getProfile();
      if (res.success && res.data) {
        setProfile(res.data);
        setIs2FAEnabled(res.data.isTwoFactorEnabled || false);
        persistUserFromProfile(res.data);
        const dn = formatDisplayName(res.data);
        setForm({
          displayName: dn || res.data.username || '',
          bio: res.data.bio ?? '',
          websiteUrl: res.data.websiteUrl ?? '',
          githubUrl: res.data.githubUrl ?? '',
          techStack: res.data.techStack ?? [],
        });
        setLoadState({ loading: false, error: null });
      } else {
        setLoadState({ loading: false, error: 'Unexpected response' });
      }
    } catch (e) {
      const msg = getErrorMessage(e, 'Could not load profile');
      setLoadState({ loading: false, error: msg });
      toast.error(msg);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadProfile();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadProfile]);

  useEffect(() => {
    const syncPrefs = () => {
      try {
        const raw = localStorage.getItem(PREFS_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setPrefs((p) => {
            if (p.theme === parsed.theme && p.fontScale === parsed.fontScale) return p;
            return { ...p, theme: parsed.theme, fontScale: parsed.fontScale };
          });
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', syncPrefs);
    return () => window.removeEventListener('storage', syncPrefs);
  }, []);

  // Scrollspy logic
  useEffect(() => {
    const refs = {
      profile: profileRef,
      security: securityRef,
      appearance: appearanceRef,
      notifications: notificationsRef,
      privacy: privacyRef,
    };

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 220; // offset

      for (const id in refs) {
        const ref = refs[id].current;
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
    const refs = {
      profile: profileRef,
      security: securityRef,
      appearance: appearanceRef,
      notifications: notificationsRef,
      privacy: privacyRef,
    };
    const ref = refs[id]?.current;
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
      techStack: profile.techStack ?? [],
    });
  }, [profile]);

  const openEnable2FAModal = async () => {
    setIs2FAModalOpen(true);
    setIsGenerating2FA(true);
    setVerificationCode('');
    try {
      const res = await authAPI.generate2FA();
      if (res.success && res.data) {
        setQrCodeDataUrl(res.data.qrCodeDataUrl);
        setTwoFactorSecret(res.data.secret);
      } else {
        toast.error('Failed to generate 2FA secret key');
        setIs2FAModalOpen(false);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to generate 2FA secret key'));
      setIs2FAModalOpen(false);
    } finally {
      setIsGenerating2FA(false);
    }
  };

  const handleEnable2FASubmit = async (e) => {
    e.preventDefault();
    if (verificationCode.trim().length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }
    setIsVerifying2FA(true);
    try {
      const res = await authAPI.enable2FA(verificationCode.trim());
      if (res.success) {
        toast.success('Two-factor authentication enabled successfully');
        setIs2FAEnabled(true);
        setIs2FAModalOpen(false);
        setVerificationCode('');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid verification code'));
    } finally {
      setIsVerifying2FA(false);
    }
  };

  const openDisable2FAModal = () => {
    setDisableCode('');
    setIsDisable2FAModalOpen(true);
  };

  const handleDisable2FASubmit = async (e) => {
    e.preventDefault();
    if (disableCode.trim().length !== 6) {
      toast.error('Please enter a 6-digit verification code');
      return;
    }
    setIsDisabling2FA(true);
    try {
      const res = await authAPI.disable2FA(disableCode.trim());
      if (res.success) {
        toast.success('Two-factor authentication disabled successfully');
        setIs2FAEnabled(false);
        setIsDisable2FAModalOpen(false);
        setDisableCode('');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Invalid verification code'));
    } finally {
      setIsDisabling2FA(false);
    }
  };

  const handleAddTechTag = () => {
    const tag = newTechInput.trim();
    if (!tag) return;
    
    if (tag.length > 30) {
      toast.error('Technology tag name must be less than 30 characters');
      return;
    }

    if (form.techStack.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      toast.error('This tag is already added');
      return;
    }

    if (form.techStack.length >= 15) {
      toast.error('You can add up to 15 tech stack tags');
      return;
    }

    setForm((f) => ({
      ...f,
      techStack: [...f.techStack, tag],
    }));
    setNewTechInput('');
  };

  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTechTag();
    }
  };

  const handleRemoveTechTag = (tagToRemove) => {
    setForm((f) => ({
      ...f,
      techStack: f.techStack.filter((t) => t !== tagToRemove),
    }));
  };

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
      toast.error(getErrorMessage(err, 'Upload failed'));
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
        lastname: lastname || "",
        bio: form.bio.trim(),
        websiteUrl: form.websiteUrl.trim(),
        githubUrl: form.githubUrl.trim(),
        techStack: form.techStack,
      });
      if (res.success && res.data) {
        setProfile(res.data);
        persistUserFromProfile(res.data);
        return true;
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not save profile'));
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

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordForm.oldPassword) {
      toast.error('Current password is required');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setIsChangingPassword(true);
    try {
      const res = await authAPI.changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });
      if (res.success) {
        toast.success('Password changed successfully');
        setIsPasswordModalOpen(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to change password'));
    } finally {
      setIsChangingPassword(false);
    }
  };


  const handleDeleteAccountSubmit = async (e) => {
    e.preventDefault();
    if (deleteConfirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }
    setIsDeletingAccount(true);
    try {
      const res = await authAPI.deleteAccount();
      if (res.success) {
        toast.success('Your account has been deleted successfully');
        // Clear auth details
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth-change'));
        // Redirect
        window.location.href = '/';
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to delete account'));
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleExportData = async () => {
    setIsExportingData(true);
    try {
      const res = await authAPI.exportData();
      if (res.success && res.data) {
        // Trigger file download in browser
        const jsonStr = JSON.stringify(res.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${profile?.username || 'user'}_data_export.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.success('Data export download started');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to export data'));
    } finally {
      setIsExportingData(false);
    }
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-center min-h-[50vh]">
        <Loader message="Loading settings..." size="md" />
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
    'w-full bg-bg-input border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-input placeholder-text-muted/50 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all';
  const labelClass = 'block text-xs font-semibold text-text-muted mb-2';

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col lg:flex-row gap-8 lg:gap-10 pb-28 pt-12">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Settings Navigation Sidebar */}
      <aside className="lg:w-64 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-white transition-all duration-200 group/back cursor-pointer bg-white/[0.02] border border-border-subtle hover:border-brand-purple/40 hover:bg-brand-purple/5 px-3 py-1.5 rounded-lg w-fit mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover/back:-translate-x-0.5 duration-200 text-brand-purple" />
          <span>Go Back</span>
        </button>

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
                    ? 'bg-brand-purple/15 text-brand-purple border-brand-purple/20'
                    : 'text-text-muted border-transparent hover:text-text-input hover:bg-bg-input'
                }`}
              >
                <Icon className="w-4 h-4 opacity-75" />
                {item.label}
              </button>
            );
          })}

          <div className="hidden lg:block my-2 border-t border-border-subtle" />

          <button onClick={() => toast("Advanced config loaded")} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-input hover:bg-bg-input flex items-center gap-3 border border-transparent">
            <Settings className="w-4 h-4 opacity-75" />
            Settings
          </button>
          <button onClick={() => toast("Help center loaded")} className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-input hover:bg-bg-input flex items-center gap-3 border border-transparent">
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
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-premium shadow-lg shadow-brand-purple/20 hover:opacity-95 transition-opacity"
          >
            Upgrade to Pro
          </button>
        </div>
      </aside>

      {/* Main Content Area: Stacked Sections */}
      <div className="flex-1 min-w-0 space-y-10">
        
        {/* PROFILE SETTINGS CARD */}
        <section 
          ref={profileRef} 
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
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/30 to-brand-purple/20 text-2xl font-bold text-white">
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

          <div>
            <label className={labelClass}>Tech Stack (Max 15 technologies)</label>
            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Add technology (e.g. React, Docker, Rust) and press Enter"
                  value={newTechInput}
                  onChange={(e) => setNewTechInput(e.target.value)}
                  onKeyDown={handleTechInputKeyDown}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddTechTag}
                  className="!rounded-xl !py-2.5 !px-5 text-sm"
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 p-3 bg-white/[0.02] border border-border-subtle rounded-xl min-h-[60px] items-center">
                {form.techStack.length === 0 ? (
                  <span className="text-xs text-gray-500 italic px-1">No custom technologies added. Showcase defaults will be shown on profile.</span>
                ) : (
                  form.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-[#8b5cf6]/20 bg-[#8b5cf6]/10 text-gray-300"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => handleRemoveTechTag(tech)}
                        className="text-gray-400 hover:text-white transition-colors cursor-pointer text-[10px]"
                        aria-label={`Remove ${tech}`}
                      >
                        ✕
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ACCOUNT SECURITY CARD */}
        <section 
          ref={securityRef} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-brand-blue border-b border-border-subtle pb-3">
            Account Security
          </h2>

          <div className="rounded-xl border border-border-subtle bg-bg-card-sub p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-bg-input text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Email address</p>
                <p className="text-sm font-semibold text-gray-200 mt-0.5">{profile?.email}</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border-subtle bg-bg-card-sub p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="p-2.5 rounded-lg bg-bg-input text-gray-400 shrink-0">
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
              on={is2FAEnabled}
              onChange={(v) => {
                if (v) {
                  openEnable2FAModal();
                } else {
                  openDisable2FAModal();
                }
              }}
            />
          </div>

          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full py-3.5 rounded-xl border border-border-subtle text-xs font-semibold text-gray-300 hover:bg-white/[0.04] hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Lock className="w-4 h-4 opacity-75" />
            Change Password
          </button>
        </section>

        {/* APPEARANCE CARD */}
        <section 
          ref={appearanceRef} 
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
                  onClick={() => handlePreferenceChange('theme', t.id)}
                  className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'border-brand-purple bg-brand-purple/5 text-white ring-1 ring-brand-purple/25'
                      : 'border-border-subtle bg-white/[0.01] text-gray-400 hover:border-gray-600 hover:bg-white/[0.03]'
                  }`}
                >
                  <span>{t.label}</span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-purple text-white flex items-center justify-center text-xs">
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
            <div className="flex items-center gap-4 bg-bg-card-sub border border-border-subtle px-5 py-4 rounded-xl">
              <span className="text-gray-500 text-xs font-medium select-none">Aa</span>
              <input
                type="range"
                min={85}
                max={125}
                step={5}
                value={prefs.fontScale}
                onChange={(e) =>
                  handlePreferenceChange('fontScale', Number(e.target.value))
                }
                className="flex-1 accent-brand-cyan h-1.5 rounded-full bg-gray-800 cursor-pointer"
              />
              <span className="text-gray-200 text-base font-bold select-none">Aa</span>
            </div>
          </div>
        </section>

        {/* NOTIFICATIONS CARD */}
        <section 
          ref={notificationsRef} 
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
              className="grid grid-cols-[1fr_50px_50px] gap-4 items-center p-3 rounded-xl border border-border-subtle bg-bg-card-sub-light"
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
          ref={privacyRef} 
          className="rounded-2xl border border-border-subtle bg-white/[0.02] p-6 md:p-8 space-y-6"
        >
          <h2 className="text-lg font-bold text-brand-blue border-b border-border-subtle pb-3">
            Privacy
          </h2>

          <div className="rounded-xl border border-border-subtle bg-bg-card-sub p-5 space-y-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-200">Public Profile Visibility</p>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                  When enabled, your profile and posts are visible to everyone on the internet. Turning this off limits visibility to approved followers.
                </p>
              </div>
              <div className="p-2.5 rounded-lg bg-bg-input text-gray-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
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
              onClick={handleExportData}
              disabled={isExportingData}
              className="rounded-xl border border-border-subtle bg-white/[0.01] hover:bg-white/[0.03] p-4 flex items-center justify-between text-xs font-semibold text-gray-300 transition-all cursor-pointer disabled:opacity-50"
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4 text-gray-400" />
                {isExportingData ? 'Exporting...' : 'Export My Data'}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500" />
            </button>
            
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmText('');
                setIsDeleteModalOpen(true);
              }}
              className="rounded-xl border border-red-500/20 bg-red-500/[0.01] hover:bg-red-500/[0.04] p-4 flex items-center justify-between text-xs font-semibold text-red-400 transition-all cursor-pointer"
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
          <button
            type="button"
            onClick={handleDiscard}
            className="text-xs font-bold text-text-muted hover:text-text-input transition-colors py-2 uppercase tracking-wide cursor-pointer"
          >
            Discard Changes
          </button>
          
          <Button
            type="button"
            variant="primary"
            className="!rounded-xl !py-3 !px-5 sm:!px-8 text-xs font-bold uppercase tracking-wide cursor-pointer shadow-lg shadow-brand-purple/20 hover:scale-102"
            onClick={handleSaveAll}
            disabled={saving || uploading}
          >
            {saving ? 'Saving…' : 'Save Settings'}
          </Button>
        </div>
      </div>

      {/* PASSWORD CHANGE MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPasswordModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-dropdown border border-border-subtle rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-10"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-5">
                <h3 className="text-lg font-bold text-text-input flex items-center gap-2">
                  <Lock className="w-5 h-5 text-brand-purple" />
                  Change Password
                </h3>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-text-muted hover:text-text-input text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2">Current Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showOldPassword ? "text" : "password"}
                      required
                      className="w-full bg-bg-input border border-border-subtle rounded-xl pl-4 pr-12 py-3 text-sm text-text-input focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
                      value={passwordForm.oldPassword}
                      onChange={(e) => setPasswordForm((f) => ({ ...f, oldPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2">New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      className="w-full bg-bg-input border border-border-subtle rounded-xl pl-4 pr-12 py-3 text-sm text-text-input focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2">Confirm New Password</label>
                  <div className="relative flex items-center">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className="w-full bg-bg-input border border-border-subtle rounded-xl pl-4 pr-12 py-3 text-sm text-text-input focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 text-gray-400 hover:text-white transition-colors cursor-pointer flex items-center justify-center"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="flex gap-4 justify-end pt-4 border-t border-border-subtle">
                  <Button
                    type="button"
                    variant="outline"
                    className="!rounded-xl"
                    onClick={() => setIsPasswordModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="!rounded-xl"
                    disabled={isChangingPassword}
                  >
                    {isChangingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* DELETE ACCOUNT MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDeleteModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-dropdown border border-red-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-10"
            >
              <div className="flex items-center justify-between border-b border-red-500/10 pb-4 mb-5">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Delete Account Permanently
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="text-text-muted hover:text-text-input text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDeleteAccountSubmit} className="space-y-4">
                <div className="rounded-xl bg-red-500/5 border border-red-500/10 p-4 mb-4">
                  <p className="text-xs text-red-400/90 leading-relaxed font-semibold">
                    Warning: This action is irreversible. All your articles, bookmarks, comments, likes, and followers will be deleted permanently.
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2">
                    To confirm, type <span className="text-text-input font-bold">DELETE</span> below:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="DELETE"
                    className="w-full bg-bg-input border border-border-subtle rounded-xl px-4 py-3 text-sm text-text-input focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                  />
                </div>
                <div className="flex gap-4 justify-end pt-4 border-t border-border-subtle">
                  <Button
                    type="button"
                    variant="outline"
                    className="!rounded-xl"
                    onClick={() => setIsDeleteModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    className="!rounded-xl"
                    disabled={isDeletingAccount || deleteConfirmText !== 'DELETE'}
                  >
                    {isDeletingAccount ? 'Deleting...' : 'Delete My Account'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ENABLE 2FA MODAL */}
      <AnimatePresence>
        {is2FAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIs2FAModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-dropdown border border-border-subtle rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-10"
            >
              <div className="flex items-center justify-between border-b border-border-subtle pb-4 mb-5">
                <h3 className="text-lg font-bold text-text-input flex items-center gap-2">
                  <Shield className="w-5 h-5 text-brand-cyan" />
                  Enable Two-Factor (2FA)
                </h3>
                <button
                  type="button"
                  onClick={() => setIs2FAModalOpen(false)}
                  className="text-text-muted hover:text-text-input text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {isGenerating2FA ? (
                <div className="flex items-center justify-center py-8">
                  <Loader message="Generating secret key..." size="sm" />
                </div>
              ) : (
                <form onSubmit={handleEnable2FASubmit} className="space-y-5">
                  <p className="text-xs text-text-muted leading-relaxed">
                    Scan this QR code with an authenticator app (like Google Authenticator or Authy) to start receiving login codes.
                  </p>
                  
                  {qrCodeDataUrl && (
                    <div className="flex justify-center bg-white p-3 rounded-xl w-48 h-48 mx-auto border border-border-subtle">
                      <img src={qrCodeDataUrl} alt="2FA QR Code" className="w-full h-full object-contain" />
                    </div>
                  )}

                  {twoFactorSecret && (
                    <div className="bg-bg-input border border-border-subtle rounded-xl p-3 text-center">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">
                        Or enter secret key manually
                      </p>
                      <code className="text-xs font-mono font-bold text-brand-cyan select-all tracking-wider">
                        {twoFactorSecret}
                      </code>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-text-muted mb-2">
                      Enter the 6-digit verification code:
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="000000"
                      className="w-full bg-bg-input border border-border-subtle rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-text-input focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>

                  <div className="flex gap-4 justify-end pt-4 border-t border-border-subtle">
                    <Button
                      type="button"
                      variant="outline"
                      className="!rounded-xl"
                      onClick={() => setIs2FAModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      className="!rounded-xl"
                      disabled={isVerifying2FA || verificationCode.length !== 6}
                    >
                      {isVerifying2FA ? 'Enabling...' : 'Enable 2FA'}
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DISABLE 2FA MODAL */}
      <AnimatePresence>
        {isDisable2FAModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDisable2FAModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-bg-dropdown border border-red-500/20 rounded-2xl p-6 shadow-2xl backdrop-blur-xl z-10"
            >
              <div className="flex items-center justify-between border-b border-red-500/10 pb-4 mb-5">
                <h3 className="text-lg font-bold text-red-400 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Disable Two-Factor (2FA)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDisable2FAModalOpen(false)}
                  className="text-text-muted hover:text-text-input text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleDisable2FASubmit} className="space-y-4">
                <p className="text-xs text-text-muted leading-relaxed">
                  To disable Two-Factor Authentication, please enter the 6-digit verification code from your authenticator app.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-text-muted mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="000000"
                    className="w-full bg-bg-input border border-border-subtle rounded-xl px-4 py-3 text-center text-lg font-mono font-bold tracking-widest text-text-input focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 transition-all"
                    value={disableCode}
                    onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ''))}
                  />
                </div>

                <div className="flex gap-4 justify-end pt-4 border-t border-border-subtle">
                  <Button
                    type="button"
                    variant="outline"
                    className="!rounded-xl"
                    onClick={() => setIsDisable2FAModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="danger"
                    className="!rounded-xl"
                    disabled={isDisabling2FA || disableCode.length !== 6}
                  >
                    {isDisabling2FA ? 'Disabling...' : 'Disable 2FA'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SettingsPage;
