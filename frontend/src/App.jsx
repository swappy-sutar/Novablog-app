import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ScrollToTop from "./components/layout/ScrollToTop";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import WritePage from "./pages/WritePage";
import ProfileLayout from "./layouts/ProfileLayout";
import PublicProfilePage from "./pages/PublicProfilePage";
import SettingsPage from "./pages/SettingsPage";
import MyBlogsPage from "./pages/MyBlogsPage";
import ExplorePage from "./pages/ExplorePage";
import AboutPage from "./pages/AboutPage";
import FeedPage from "./pages/FeedPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiePage from "./pages/CookiePage";
import TermsPage from "./pages/TermsPage";
import ProtectedRoute from "./components/auth/ProtectedRoute";

function App() {
  useEffect(() => {
    const syncFontScale = () => {
      try {
        const raw = localStorage.getItem("novablog_settings_prefs_v1");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed && typeof parsed.fontScale === "number") {
            document.documentElement.style.fontSize = `${parsed.fontScale}%`;
          }
        }
      } catch (e) {
        /* ignore */
      }
    };

    // Apply on mount
    syncFontScale();

    // Sync if updated anywhere
    window.addEventListener("storage", syncFontScale);
    return () => window.removeEventListener("storage", syncFontScale);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#1e1e2d",
            color: "#fff",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      />
      <Routes>
        {/* Pages that share the main layout with persistent Navbar and Footer */}
        <Route element={<MainLayout />}>
          {/* Auth Routes */}
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Main Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/feed" element={<FeedPage />} />
          <Route path="/post/:id" element={<BlogDetailsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/cookie-policy" element={<CookiePage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected Routes sharing MainLayout */}
          <Route
            path="/profile/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-blogs"
            element={
              <ProtectedRoute>
                <MyBlogsPage />
              </ProtectedRoute>
            }
          />

          <Route path="/profile/:username" element={<PublicProfilePage />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfileLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<PublicProfilePage />} />
          </Route>
        </Route>

        {/* Protected Routes with custom layout (e.g. Write page) */}
        <Route
          path="/write"
          element={
            <ProtectedRoute>
              <WritePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
