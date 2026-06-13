import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import BlogDetailsPage from './pages/BlogDetailsPage';
import SignUpPage from './pages/SignUpPage';
import SignInPage from './pages/SignInPage';
import WritePage from './pages/WritePage';
import ProfileLayout from './layouts/ProfileLayout';
import PublicProfilePage from './pages/PublicProfilePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function ProfileRoutes() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <ProfileLayout />
      </MainLayout>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: '#1e1e2d',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
      <Routes>
        {/* Auth Routes */}
        <Route path="/signup" element={<MainLayout><SignUpPage /></MainLayout>} />
        <Route path="/signin" element={<MainLayout><SignInPage /></MainLayout>} />
        
        {/* Main Routes */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/post/:id" element={<MainLayout><BlogDetailsPage /></MainLayout>} />
        <Route path="/profile" element={<ProfileRoutes />}>
          <Route index element={<PublicProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Protected Routes */}
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