import React, { useState, useEffect } from 'react';
import { Star, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import toast from 'react-hot-toast';
import { reviewAPI, getErrorMessage } from '../../lib/api';

const defaultAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120";

const ROW1_DATA = [
  {
    name: 'Maria S',
    location: 'California, USA',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Incredible depth of technical blogs',
    text: 'The articles on NovaBlog are exceptionally well-researched. The community of technical minds helps me stay up to date with modern systems architecture and coding best practices.'
  },
  {
    name: 'David Smith',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Perfect for technical growth',
    text: "I was looking for a platform that goes beyond basic tutorials. NovaBlog's articles provide deep architectural explanations that helped me level up my software engineering skills."
  },
  {
    name: 'Emily P',
    location: 'New York, USA',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Excellent community of writers',
    text: 'The technical insights and curated feeds make reading a daily habit. The badge progression system keeps me motivated to read regularly and improve my expertise.'
  }
];

const ROW2_DATA = [
  {
    name: 'David L.',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 4,
    title: 'Valuable real-world insights',
    text: 'Having access to high-quality blog posts written by real industry experts is invaluable. It is like having a mentor sharing real production experience 24/7.'
  },
  {
    name: 'Marsh',
    location: 'Berlin, Germany',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Interactive and clean blogging interface',
    text: 'The reading interface is distraction-free and beautifully designed. The technical progression roadmap is a fun addition that tracks my developer growth.'
  },
  {
    name: 'Nunnez',
    location: 'London, UK',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120&h=120',
    stars: 5,
    title: 'Best platform for developers',
    text: 'NovaBlog has built an amazing community of authors. The quality of writing here is much higher than other platforms, and the insights are immediately actionable.'
  }
];

const Testimonials = () => {
  const [dbReviews, setDbReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    location: '',
    stars: 0,
    text: '',
  });

  const loadReviews = async () => {
    try {
      const res = await reviewAPI.getReviews();
      if (res.success && res.data) {
        setDbReviews(res.data);
      }
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (form.stars < 1 || form.stars > 5) {
      toast.error('Please select a rating star.');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        location: form.location,
        stars: form.stars,
        text: form.text,
      };
      const res = await reviewAPI.createReview(payload);
      if (res.success) {
        toast.success(res.message || 'Review submitted successfully! Thank you.');
        setIsModalOpen(false);
        setForm({
          name: '',
          location: '',
          stars: 0,
          text: '',
        });
        loadReviews();
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to submit review.'));
    } finally {
      setSubmitting(false);
    }
  };

  const row1 = dbReviews.length > 0 ? dbReviews.filter((_, i) => i % 2 === 0) : ROW1_DATA;
  const row2 = dbReviews.length > 0 ? dbReviews.filter((_, i) => i % 2 !== 0) : ROW2_DATA;

  const row1Doubled = [...row1, ...row1, ...row1, ...row1, ...row1, ...row1];
  const row2Doubled = [...row2, ...row2, ...row2, ...row2, ...row2, ...row2];

  return (
    <section className="max-w-7xl mx-auto px-6 mb-24 overflow-visible relative">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-ltr {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes marquee-rtl {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-marquee-ltr {
          animation: marquee-ltr 60s linear infinite;
        }
        .animate-marquee-rtl {
          animation: marquee-rtl 60s linear infinite;
        }
        .hover-pause:hover {
          animation-play-state: paused !important;
        }
        .cinematic-dots {
          background-image: radial-gradient(rgba(15, 23, 42, 0.16) 1.5px, transparent 1.5px);
        }
        :root:not(.light-mode) .cinematic-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1.5px, transparent 1.5px) !important;
        }
      `}} />

      <div 
        className="absolute inset-y-0 w-screen left-1/2 -translate-x-1/2 pointer-events-none cinematic-dots -z-10"
        style={{
          backgroundSize: '24px 24px',
          maskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.6) 24%, black 36%, black 85%, transparent)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.15) 12%, rgba(0,0,0,0.6) 24%, black 36%, black 85%, transparent)'
        }}
      />

      <div className="text-center mb-16 space-y-3 relative flex flex-col items-center">
        <p className="text-xs sm:text-sm font-black tracking-widest text-brand-cyan uppercase">
          Public opinion suggests
        </p>
        
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 w-full max-w-xl">
          <img 
            src="/Purple_crescent_laurel_branch.png" 
            alt="Laurel branch left" 
            className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 select-none object-contain" 
          />

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-text-input leading-tight whitespace-nowrap">
            Our Happy <span className="text-gradient">Readers</span>
          </h2>

          <img 
            src="/Purple_crescent_laurel_branch.png" 
            alt="Laurel branch right" 
            className="w-10 h-10 sm:w-16 sm:h-16 shrink-0 select-none object-contain scale-x-[-1]" 
          />
        </div>

        <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto leading-relaxed !-mt-1 sm:!-mt-2">
          See how our readers are talking about our blogs
        </p>
      </div>

      <div className="relative w-screen left-1/2 -translate-x-1/2 overflow-hidden flex flex-col gap-5 max-w-[100vw]">
        <div 
          className="absolute inset-y-0 left-0 w-24 sm:w-36 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, var(--color-bg-base, #05050f), transparent)' }}
        />
        <div 
          className="absolute inset-y-0 right-0 w-24 sm:w-36 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, var(--color-bg-base, #05050f), transparent)' }}
        />

        <div className="flex w-full overflow-hidden py-1">
          <div className="flex gap-6 animate-marquee-ltr hover-pause select-none">
            {row1Doubled.map((card, idx) => (
              <div key={`${card.name}-${idx}`} className="w-[260px] sm:w-[320px] shrink-0">
                <GlassCard className="p-4 flex flex-col justify-between border border-border-subtle bg-white dark:bg-bg-card hover:border-brand-purple/20 hover:bg-white/[0.01] transition-all duration-300 h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-cyan/10 text-brand-cyan flex items-center justify-center border border-border-subtle shadow-sm shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-input truncate">
                          {card.name}
                        </h4>
                        <p className="text-[9px] text-text-muted truncate">
                          {card.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {Array(5).fill(null).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3 h-3"
                          fill={idx < card.stars ? "#eab308" : "none"}
                          stroke={idx < card.stars ? "#eab308" : "var(--color-border-subtle)"}
                          strokeWidth={2}
                        />
                      ))}
                    </div>

                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                      {card.text}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>

        <div className="flex w-full overflow-hidden py-1">
          <div className="flex gap-6 animate-marquee-rtl hover-pause select-none">
            {row2Doubled.map((card, idx) => (
              <div key={`${card.name}-${idx}`} className="w-[280px] sm:w-[320px] shrink-0">
                <GlassCard className="p-4 flex flex-col justify-between border border-border-subtle bg-white dark:bg-bg-card hover:border-brand-purple/20 hover:bg-white/[0.01] transition-all duration-300 h-full">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center border border-border-subtle shadow-md shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-text-input truncate">
                          {card.name}
                        </h4>
                        <p className="text-[9px] text-text-muted truncate">
                          {card.location}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {Array(5).fill(null).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-3 h-3"
                          fill={idx < card.stars ? "#eab308" : "none"}
                          stroke={idx < card.stars ? "#eab308" : "var(--color-border-subtle)"}
                          strokeWidth={2}
                        />
                      ))}
                    </div>

                    <p className="text-[11px] text-text-muted leading-relaxed line-clamp-2">
                      {card.text}
                    </p>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-12">
        <Button 
          onClick={() => setIsModalOpen(true)}
          variant="primary" 
          className="shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_25px_rgba(139,92,246,0.45)] transition-all duration-300 transform active:scale-95 cursor-pointer"
        >
          Write a Review
        </Button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#04040c]/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative w-full max-w-lg z-10 overflow-hidden"
            >
              <GlassCard className="p-6 sm:p-8 border rounded-2xl shadow-2xl relative testimonial-modal">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute right-4 top-4 text-text-muted hover:text-text-input transition-colors cursor-pointer p-1 rounded-lg hover:bg-bg-input"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-text-input mb-1">Write a Review</h3>
                <p className="text-xs text-text-muted mb-6">
                  Share your experience reading technical insights on NovaBlog.
                </p>

                <form onSubmit={handleSubmitReview} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={form.name}
                        onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-purple transition-all testimonial-input"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1.5">
                        Location
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="London, UK"
                        value={form.location}
                        onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-purple transition-all testimonial-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1.5">
                      Rating
                    </label>
                    <div className="flex items-center gap-2 py-1">
                      {Array(5).fill(null).map((_, idx) => {
                        const starValue = idx + 1;
                        return (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setForm(prev => ({ ...prev, stars: starValue }))}
                            className="text-text-muted hover:scale-110 transition-transform cursor-pointer p-0.5"
                          >
                            <Star
                              className="w-6 h-6"
                              fill={starValue <= form.stars ? "#eab308" : "none"}
                              stroke={starValue <= form.stars ? "#eab308" : "var(--color-border-subtle)"}
                              strokeWidth={2}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>



                  <div>
                    <label className="block text-[10px] uppercase font-bold text-text-muted tracking-wider mb-1.5">
                      Your Feedback
                    </label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Write your detailed testimonial here..."
                      value={form.text}
                      onChange={(e) => setForm(prev => ({ ...prev, text: e.target.value }))}
                      className="w-full border rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-brand-purple transition-all resize-none testimonial-input"
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={submitting}
                      className="w-full py-3 text-xs font-bold uppercase tracking-wider bg-gradient-premium hover:opacity-95 shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 cursor-pointer"
                    >
                      {submitting ? 'Submitting Review...' : 'Submit Feedback'}
                    </Button>
                  </div>
                </form>
              </GlassCard>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Testimonials;
