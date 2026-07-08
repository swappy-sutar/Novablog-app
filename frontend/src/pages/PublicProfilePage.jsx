import { useMemo, useEffect, useState, useCallback, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { ProfileSkeleton } from '../components/ui/Skeleton';
import { authAPI } from '../lib/api';

const HEAT_WEEKS = 52;
const HEAT_DAYS = 7;

function heatLevel(seed) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  const f = x - Math.floor(x);
  return Math.min(4, Math.floor(f * 5));
}

const heatColors = [
  'bg-bg-input',
  'bg-brand-purple/20',
  'bg-brand-purple/40',
  'bg-brand-purple/65',
  'bg-brand-purple/90',
];

function WritingHeatmap() {
  const cells = useMemo(() => {
    const out = [];
    for (let w = 0; w < HEAT_WEEKS; w++) {
      for (let d = 0; d < HEAT_DAYS; d++) {
        out.push(heatLevel(w * HEAT_DAYS + d + d * 3));
      }
    }
    return out;
  }, []);

  return (
    <div
      className="grid gap-[3px] w-max max-w-none mx-auto sm:mx-0 pb-1"
      style={{
        gridTemplateColumns: `repeat(${HEAT_WEEKS}, 11px)`,
        gridTemplateRows: `repeat(${HEAT_DAYS}, 11px)`,
        gridAutoFlow: 'column',
      }}
    >
      {cells.map((lvl, i) => (
        <div
          key={i}
          className={`w-full h-full rounded-[2px] ${heatColors[lvl]}`}
          title={`Activity level ${lvl}`}
        />
      ))}
    </div>
  );
}

function formatDisplayName(p) {
  if (!p) return '';
  const first = p.firstname?.trim();
  const last = p.lastname?.trim();
  if (first || last) {
    return [first, last]
      .filter(Boolean)
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ');
  }
  return p.username || 'Member';
}

function formatJoined(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso);
    return `Joined ${d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  } catch {
    return '';
  }
}

const getWriterLevel = (reads) => {
  if (typeof reads !== 'number' || reads < 1) return 'Reader';
  if (reads < 10) return 'Seedling';
  if (reads < 50) return 'Contributor';
  if (reads < 100) return 'Influencer';
  if (reads < 250) return 'Rising Writer';
  if (reads < 500) return 'Legend';
  return 'Established Voice';
};

const PublicProfilePage = () => {
  const { username } = useParams();

  const currentUser = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      if (stored && stored !== 'undefined') {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) return parsed;
      }
    } catch {}
    return null;
  }, []);

  const isOwnProfile = !username || (currentUser && currentUser.username === username);

  const [profile, setProfile] = useState(() => {
    if (isOwnProfile && currentUser) {
      return currentUser;
    }
    return null;
  });

  const [loading, setLoading] = useState(() => {
    if (isOwnProfile && currentUser) {
      return false;
    }
    return true;
  });

  const [error, setError] = useState(null);
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = username 
        ? await authAPI.getPublicProfile(username)
        : await authAPI.getProfile();
      if (res.success && res.data) setProfile(res.data);
      else setError('Unexpected response');
    } catch (e) {
      setError(e.response?.data?.message || e.message || 'Could not load profile');
      toast.error('Could not load profile');
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    const timer = setTimeout(() => {
      load();
    }, 0);
    return () => clearTimeout(timer);
  }, [load]);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file?.type.startsWith('image/')) {
      toast.error('Choose an image file');
      return;
    }
    setUploading(true);
    try {
      const res = await authAPI.uploadProfilePicture(file);
      if (res.success && res.data) {
        setProfile(res.data);
        toast.success(res.message || 'Photo updated');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };


  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error('Please log in to follow users');
      return;
    }
    try {
      const res = await authAPI.toggleFollow(profile.id);
      if (res.success && res.data) {
        setProfile((prev) => ({
          ...prev,
          isFollowing: res.data.followed,
          followersCount: res.data.followed
            ? (prev.followersCount ?? 0) + 1
            : Math.max(0, (prev.followersCount ?? 0) - 1),
        }));
        toast.success(res.data.followed ? `Following @${profile.username}` : `Unfollowed @${profile.username}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const displayName = formatDisplayName(profile);
  const subtitle =
    profile?.bio?.trim() ||
    (profile?.username ? `@${profile.username}` : '') ||
    'NovaBlog writer';
  const joinedLine = formatJoined(profile?.createdAt);
  const initials =
    `${profile?.firstname?.[0] || ''}${profile?.lastname?.[0] || ''}`.toUpperCase() ||
    profile?.username?.[0]?.toUpperCase() ||
    '?';
  const avatarSrc =
    profile?.avatar &&
    `${profile.avatar}${profile.avatar.includes('?') ? '&' : '?'}cb=${encodeURIComponent(profile.updatedAt || profile.id || '')}`;
  const websiteDisplay = profile?.websiteUrl?.replace(/^https?:\/\//i, '') || '';
  const roleLabel = profile?.role ? profile.role.replace(/_/g, ' ') : 'Member';

  if (loading && !profile) {
    return <ProfileSkeleton />;
  }

  if (error && !profile) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400 mb-4">{error}</p>
        <Button variant="secondary" type="button" onClick={load}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="max-w-6xl mx-auto px-4 md:px-6 pt-6 pb-12"
    >
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />

      {isOwnProfile && (
        <div className="flex justify-end mb-4">
          <Link
            to="/profile/settings"
            className="text-sm font-medium text-brand-purple hover:underline transition-colors"
          >
            Edit profile & settings →
          </Link>
        </div>
      )}

      <section className="relative mb-8">
        <div
          className="relative h-44 md:h-52 rounded-xl overflow-hidden border border-border-subtle"
          style={{
            background: `
              radial-gradient(ellipse 90% 80% at 50% 100%, rgba(112, 225, 245, 0.22), transparent 55%),
              radial-gradient(ellipse 60% 40% at 20% 30%, rgba(195, 199, 243, 0.12), transparent),
              linear-gradient(165deg, #0b0e14 0%, #121a2e 45%, #0b0e14 100%)
            `,
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: `
                linear-gradient(90deg, rgba(112,225,245,0.07) 1px, transparent 1px),
                linear-gradient(rgba(112,225,245,0.07) 1px, transparent 1px)
              `,
              backgroundSize: '28px 28px',
              maskImage: 'radial-gradient(ellipse 70% 70% at 50% 60%, black 20%, transparent)',
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-1/2 opacity-40"
            style={{
              background:
                'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(112,225,245,0.15) 60deg, transparent 120deg)',
            }}
          />
        </div>

        <div className="relative -mt-16 md:-mt-20 flex flex-col md:flex-row md:items-end gap-6 md:gap-8 px-1 md:px-2">
          <div className="relative shrink-0 group">
            <button
              type="button"
              onClick={() => isOwnProfile && fileRef.current?.click()}
              disabled={uploading || !isOwnProfile}
              className={`relative w-32 h-32 md:w-40 md:h-40 rounded-xl border-2 border-[#0b0e14] overflow-hidden shadow-xl shadow-black/40 bg-bg-card text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan ${isOwnProfile ? 'cursor-pointer' : 'cursor-default'}`}
              aria-label="Profile photo"
            >
              {profile?.avatar ? (
                <img src={avatarSrc} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-purple/40 to-brand-purple/20 text-3xl font-semibold text-white">
                  {initials}
                </div>
              )}
              {isOwnProfile && (
                <span className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-medium text-white">
                  {uploading ? '…' : 'Change'}
                </span>
              )}
            </button>
            <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide bg-brand-purple text-white shadow-lg border border-white/10">
              {profile?.isVerified ? 'Verified' : roleLabel}
            </span>
          </div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pb-1 md:pb-2 min-w-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                {displayName}
              </h1>
              <p className="text-gray-400 mt-1.5 text-sm md:text-base max-w-xl line-clamp-3">
                {subtitle}
              </p>
            </div>
            {!isOwnProfile && (
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  type="button"
                  variant={profile?.isFollowing ? "primary" : "outline"}
                  onClick={handleFollowToggle}
                  className={`!rounded-[10px] !py-2.5 !px-4 ${
                    profile?.isFollowing 
                      ? "bg-brand-purple text-white hover:opacity-90 border-transparent" 
                      : "border-border-subtle bg-white/[0.04] hover:bg-white/[0.08]"
                  }`}
                >
                  {profile?.isFollowing ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                  )}
                  {profile?.isFollowing ? "Following" : "Follow"}
                </Button>
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-[10px] font-medium text-sm flex items-center justify-center gap-2 bg-[#c3c7f3] text-[#0b0e14] hover:opacity-90 transition-opacity"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Message
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-10">
        {[
          { label: 'FOLLOWERS', value: profile?.followersCount ?? 0, accent: false },
          { label: 'FOLLOWING', value: profile?.followingCount ?? 0, accent: false },
          { label: 'TOTAL READS', value: profile?.totalViews ?? 0, accent: true },
          { label: 'WRITER LEVEL', value: getWriterLevel(profile?.totalViews ?? 0), accent: true },
        ].map((stat) => (
          <GlassCard
            key={stat.label}
            hoverEffect={false}
            className="!rounded-[10px] p-4 md:p-5 border border-border-subtle bg-white/[0.03]"
          >
            <p className="text-[10px] md:text-xs font-medium text-gray-500 tracking-wider mb-1">
              {stat.label}
            </p>
            <p
              className={`text-xl md:text-2xl font-semibold tabular-nums ${
                stat.accent ? 'text-brand-cyan' : 'text-white'
              }`}
            >
              {stat.value}
            </p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 items-stretch">
        <GlassCard hoverEffect={false} className="!rounded-xl p-6 flex flex-col h-full">
          <h2 className="text-lg font-semibold text-white mb-4">About</h2>
          <p className="text-sm text-gray-400 leading-relaxed flex-1">
            {profile?.bio?.trim() ||
              'Tell the community what you build — add a bio in Settings.'}
          </p>
          <ul className="mt-6 space-y-3 text-sm text-gray-400 border-t border-border-subtle pt-5">
            {profile?.email && (
              <li className="flex items-center gap-3 min-w-0">
                <span className="text-gray-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <span className="truncate">{profile.email}</span>
              </li>
            )}
            {websiteDisplay && profile?.websiteUrl && (
              <li className="flex items-center gap-3 min-w-0">
                <span className="text-gray-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                </span>
                <a
                  href={
                    /^https?:\/\//i.test(profile.websiteUrl)
                      ? profile.websiteUrl
                      : `https://${profile.websiteUrl.replace(/^\/+/, '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-cyan hover:underline truncate"
                >
                  {websiteDisplay}
                </a>
              </li>
            )}
            {profile?.githubUrl && (
              <li className="flex items-center gap-3 min-w-0">
                <span className="text-gray-500 shrink-0">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </span>
                <a
                  href={
                    profile.githubUrl.startsWith('http')
                      ? profile.githubUrl
                      : `https://github.com/${profile.githubUrl.replace(/^@/, '')}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-cyan hover:underline truncate"
                >
                  GitHub
                </a>
              </li>
            )}
            {joinedLine && (
              <li className="flex items-center gap-3">
                <span className="text-gray-500 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                {joinedLine}
              </li>
            )}
          </ul>
        </GlassCard>

        <GlassCard hoverEffect={false} className="!rounded-xl p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Tech stack</h2>
              {isOwnProfile && (
                <Link
                  to="/profile/settings"
                  className="text-xs font-medium text-brand-cyan hover:underline"
                >
                  Edit
                </Link>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {profile?.techStack && profile.techStack.length > 0 ? (
                profile.techStack.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border border-border-subtle bg-white/[0.04] text-gray-300"
                  >
                    {t}
                  </span>
                ))
              ) : (
                <span className="text-xs text-gray-500 italic py-1">
                  No tech stack tags added yet.
                </span>
              )}
            </div>
          </div>
          {profile?.techStack && profile.techStack.length > 0 && (
            <p className="text-xs text-gray-600 mt-4 pt-2 border-t border-border-subtle/30">
              Customized tech stack tags
            </p>
          )}
        </GlassCard>

        <GlassCard hoverEffect={false} className="!rounded-xl p-6 h-full flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold text-white">Writing activity</h2>
            <span className="text-xs text-gray-500 shrink-0">Past year</span>
          </div>
          <div className="flex-1 min-h-[140px] flex flex-col justify-center overflow-x-auto -mx-1 px-1">
            <WritingHeatmap />
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-gray-500">
            <span>Less</span>
            <div className="flex gap-1">
              {heatColors.map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-[2px] ${c}`} />
              ))}
            </div>
            <span>More</span>
          </div>
        </GlassCard>
      </div>
    </motion.div>
  );
};

export default PublicProfilePage;
