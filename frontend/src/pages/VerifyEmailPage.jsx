import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Loader2, Mail, ArrowRight } from "lucide-react";
import { authAPI, getErrorMessage } from "../lib/api";
import AuthBackground from "../components/auth/AuthBackground";
import Button from "../components/ui/Button";
import useDocumentTitle from "../hooks/useDocumentTitle";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  useDocumentTitle("Verify Email");
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [errorMessage, setErrorMessage] = useState("");
  
  // Resend verification states
  const [email, setEmail] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was provided. Please check your verification link.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        if (response.success) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMessage(response.message || "Email verification failed.");
        }
      } catch (err) {
        setStatus("error");
        setErrorMessage(getErrorMessage(err, "The verification link is invalid or has expired."));
      }
    };

    verifyEmail();
  }, [token]);

  const handleResendSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }
    
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      const response = await authAPI.resendVerification(email);
      if (response.success) {
        setResendSuccess(true);
        toast.success("Verification link sent to your email!");
        setResendTimer(60);
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to resend verification link. Please check the email and try again."));
    } finally {
      setIsResending(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3 } },
  };

  return (
    <>
      <AuthBackground />
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] max-w-md mx-auto px-4 py-12 relative z-10">
        <AnimatePresence mode="wait">
          {status === "verifying" && (
            <motion.div
              key="verifying"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full glass-panel p-8 text-center flex flex-col items-center space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-brand-purple/10 flex items-center justify-center border border-brand-purple/20">
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                </div>
                <div className="absolute inset-0 rounded-full bg-brand-purple/20 blur-xl animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Verifying your email</h2>
                <p className="text-gray-400 text-sm">
                  We are validating your account with the database. Please hold on.
                </p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              key="success"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full glass-panel p-8 text-center flex flex-col items-center space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Email Verified!</h2>
                <p className="text-gray-300 text-sm">
                  Your email address has been successfully verified. Your account is now fully active.
                </p>
              </div>

              <div className="w-full pt-2">
                <Link to="/signin">
                  <Button variant="primary" className="w-full !rounded-xl py-3 text-sm font-semibold">
                    Sign In to Your Account <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              key="error"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="w-full glass-panel p-8 text-center flex flex-col items-center space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
                <div className="absolute inset-0 rounded-full bg-red-500/20 blur-xl" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
                <p className="text-red-400/90 text-xs bg-red-950/20 border border-red-900/30 rounded-lg p-2.5 mb-4">
                  {errorMessage}
                </p>
                <p className="text-gray-400 text-xs">
                  Your token might be expired (valid for 24h) or incorrect. Enter your email below to request a new link.
                </p>
              </div>

              <form onSubmit={handleResendSubmit} className="w-full space-y-3.5 pt-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/[0.04] border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-brand-purple/50 focus:ring-1 focus:ring-brand-purple/20 transition-all text-sm text-left"
                  />
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-500" />
                </div>
                
                <Button
                  type="submit"
                  variant="secondary"
                  disabled={isResending || resendTimer > 0}
                  className="w-full !rounded-xl py-2.5 text-xs font-semibold bg-white/[0.06] border border-border-subtle hover:bg-white/[0.1] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                      Resending Link...
                    </>
                  ) : resendTimer > 0 ? (
                    `Resend in ${resendTimer}s`
                  ) : (
                    "Request New Link"
                  )}
                </Button>
              </form>

              {resendSuccess && (
                <div className="text-xs text-emerald-400 bg-emerald-950/10 border border-emerald-900/30 p-2 rounded-lg w-full">
                  New verification link successfully emailed.
                </div>
              )}

              <div className="text-xs text-gray-500 pt-2 border-t border-white/[0.05] w-full flex justify-between">
                <Link to="/signup" className="hover:text-white transition-colors">Create new account</Link>
                <Link to="/signin" className="hover:text-white transition-colors">Back to Sign In</Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default VerifyEmailPage;
