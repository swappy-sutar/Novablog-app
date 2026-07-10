import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, HeartCrack } from "lucide-react";
import { newsletterAPI } from "../lib/api";
import Button from "../components/ui/Button";

const UnsubscribePage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  
  const [status, setStatus] = useState("loading"); // loading, success, error, resubscribed
  const [message, setMessage] = useState("");
  const [isResubscribing, setIsResubscribing] = useState(false);

  useEffect(() => {
    if (!email) {
      setStatus("error");
      setMessage("No email address was provided in the link. Please make sure the link is fully copied from your email.");
      return;
    }

    const performUnsubscribe = async () => {
      try {
        const res = await newsletterAPI.unsubscribe(email);
        if (res.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setMessage(res.message || "Failed to unsubscribe. Please try again later.");
        }
      } catch (e) {
        console.error(e);
        const errorMsg = e.response?.data?.message || "An error occurred while processing your request.";
        setStatus("error");
        setMessage(errorMsg);
      }
    };

    performUnsubscribe();
  }, [email]);

  const handleResubscribe = async () => {
    if (!email) return;
    setIsResubscribing(true);
    try {
      const res = await newsletterAPI.subscribe(email);
      if (res.success) {
        setStatus("resubscribed");
      }
    } catch (e) {
      console.error(e);
      setStatus("error");
      setMessage("Failed to resubscribe. Please go to the home page to try again.");
    } finally {
      setIsResubscribing(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#05050f]">
      <div className="w-full max-w-md">
        <AnimatePresence mode="wait">
          {status === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-3xl border border-border-subtle bg-bg-card p-8 text-center space-y-6 shadow-2xl shadow-brand-purple/5"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple">
                  <RefreshCw className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white">Processing Request</h2>
                <p className="text-sm text-gray-400">
                  Safely deactivating your subscription. Please hold on a second.
                </p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl border border-red-500/20 bg-bg-card p-8 text-center space-y-6 shadow-2xl shadow-red-500/5"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <HeartCrack className="w-8 h-8" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white">Successfully Unsubscribed</h2>
                <p className="text-sm text-gray-400">
                  You have been removed from the list. We won't send you any more weekly digests or custom campaigns to <strong className="text-gray-200">{email}</strong>.
                </p>
              </div>

              <div className="border-t border-border-subtle pt-6 space-y-4">
                <p className="text-xs text-gray-500 font-medium">
                  Did you click this by mistake? You can resubscribe instantly:
                </p>
                <button
                  onClick={handleResubscribe}
                  disabled={isResubscribing}
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6366f1] hover:bg-[#4f46e5] text-white disabled:opacity-50 transition-all cursor-pointer shadow-lg shadow-[#6366f1]/20"
                >
                  {isResubscribing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                  Resubscribe {email}
                </button>
                
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors pt-2"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Homepage
                </Link>
              </div>
            </motion.div>
          )}

          {status === "resubscribed" && (
            <motion.div
              key="resubscribed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl border border-emerald-500/20 bg-bg-card p-8 text-center space-y-6 shadow-2xl shadow-emerald-500/5"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white">Resubscribed Successfully!</h2>
                <p className="text-sm text-gray-400">
                  Awesome! You are back on our newsletter list for <strong className="text-gray-200">{email}</strong>.
                </p>
              </div>

              <div className="pt-4">
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-white/5 border border-border-subtle hover:border-gray-500 text-white transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Go to Homepage
                </Link>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-3xl border border-yellow-500/20 bg-bg-card p-8 text-center space-y-6 shadow-2xl shadow-yellow-500/5"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <AlertCircle className="w-8 h-8" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-white">Unsubscribe Failed</h2>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {message || "We could not complete your request. Please try again."}
                </p>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <Link
                  to="/"
                  className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#6366f1] hover:bg-[#4f46e5] text-white transition-all shadow-lg"
                >
                  Go to Homepage
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UnsubscribePage;
