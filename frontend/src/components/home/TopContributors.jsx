import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../ui/GlassCard';
import { blogAPI } from '../../lib/api';

const MOCK_CONTRIBUTORS = [
  {
    name: 'Marcus Thorne',
    handle: '1.2M READS',
    role: 'Specialist in Dist. Systems',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    glowColor: 'shadow-[0_0_20px_rgba(6,182,212,0.4)] border-brand-cyan',
    username: 'marcus'
  },
  {
    name: 'Sarah Chen',
    handle: '980K READS',
    role: 'Embedded Systems Pioneer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    glowColor: 'shadow-[0_0_20px_rgba(139,92,246,0.4)] border-brand-purple',
    username: 'sarah'
  },
  {
    name: 'Julian Vogt',
    handle: '880K READS',
    role: 'Full-Stack Architect',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    glowColor: 'shadow-[0_0_20px_rgba(59,130,246,0.4)] border-brand-blue',
    username: 'julian'
  },
  {
    name: 'Nara Williams',
    handle: '720K READS',
    role: 'Cloud Native Strategist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    glowColor: 'shadow-[0_0_20px_rgba(236,72,153,0.4)] border-pink-500',
    username: 'nara'
  }
];

const GLOW_COLORS = [
  'shadow-[0_0_20px_rgba(6,182,212,0.4)] border-brand-cyan',
  'shadow-[0_0_20px_rgba(139,92,246,0.4)] border-brand-purple',
  'shadow-[0_0_20px_rgba(59,130,246,0.4)] border-brand-blue',
  'shadow-[0_0_20px_rgba(236,72,153,0.4)] border-pink-500'
];

const formatReads = (num) => {
  if (!num) return "0 READS";
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M READS";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + "K READS";
  }
  return num + " READS";
};

const TopContributors = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      try {
        const res = await blogAPI.getTopContributors();
        if (res.success && res.data && res.data.length > 0) {
          const mapped = res.data.map((c, idx) => {
            const name = `${c.firstname} ${c.lastname || ""}`.trim() || c.username;
            const initials = `${c.firstname?.[0] || ""}${c.lastname?.[0] || ""}`.toUpperCase() || c.username?.[0]?.toUpperCase() || "U";
            const glowColor = GLOW_COLORS[idx % GLOW_COLORS.length];
            return {
              id: c.id,
              name,
              initials,
              handle: formatReads(c.totalViews),
              role: c.bio || "Technical Architect",
              avatar: c.avatar || null,
              glowColor,
              username: c.username
            };
          });

          let finalContributors = [...mapped];
          while (finalContributors.length < 4 && finalContributors.length < MOCK_CONTRIBUTORS.length) {
            const mockItem = MOCK_CONTRIBUTORS[finalContributors.length];
            finalContributors.push(mockItem);
          }

          setContributors(finalContributors);
        } else {
          setContributors(MOCK_CONTRIBUTORS);
        }
      } catch (err) {
        console.error("Failed to load top contributors:", err);
        setContributors(MOCK_CONTRIBUTORS);
      } finally {
        setLoading(false);
      }
    };
    fetchContributors();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-6 mb-20">
      {/* Title & Subtitle */}
      <div className="text-center mb-12 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          The Collective Intelligence
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed">
          Meet the top technical minds driving the conversation at NovaBlog.
        </p>
      </div>

      {/* Grid of Contributors */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {loading ? (
          Array(4).fill(null).map((_, idx) => (
            <div 
              key={idx} 
              className="h-[218px] bg-white/[0.01] border border-border-subtle rounded-2xl animate-pulse" 
            />
          ))
        ) : (
          contributors.map((user, idx) => (
            <Link
              key={idx}
              to={user.username ? `/profile/${user.username}` : '#'}
              className="block group h-full cursor-pointer"
            >
              <GlassCard 
                className="p-6 flex flex-col items-center text-center border border-border-subtle bg-bg-card group-hover:bg-white/[0.01] group-hover:border-white/10 transition-all duration-300 h-full"
              >
                {/* Circular Neon Gradient Image Wrapper */}
                <div className="relative mb-5 shrink-0">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className={`w-24 h-24 rounded-full border-2 object-cover ${user.glowColor}`} 
                    />
                  ) : (
                    <div className={`w-24 h-24 rounded-full border-2 bg-gradient-to-br from-brand-purple/40 to-brand-cyan/20 flex items-center justify-center text-xl font-bold text-[#ffffff] ${user.glowColor}`}>
                      {user.initials}
                    </div>
                  )}
                </div>
                
                <h4 className="text-sm font-bold text-white tracking-tight">{user.name}</h4>
                <span className="text-[10px] font-mono font-bold text-brand-cyan mt-1 uppercase tracking-widest">{user.handle}</span>
                <p className="text-xs text-gray-500 mt-2 line-clamp-1">{user.role}</p>
              </GlassCard>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default TopContributors;
