
import { Link, useLocation } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  const location = useLocation();
  const isSignIn = location.pathname === '/signin';

  return (
    <div className="min-h-screen bg-bg-base flex flex-col relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-brand-cyan/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Minimal Header */}
      <header className="w-full p-6 flex items-center justify-between z-10">
        <Link to="/" className="flex items-center">
          <img src="/svg/novablog-lockup-dark.svg" alt="NovaBlog" className="h-12 logo-lockup-dark" />
          <img src="/svg/novablog-lockup-light.svg" alt="NovaBlog" className="h-12 logo-lockup-light" />
        </Link>
        <Link 
          to={isSignIn ? "/signup" : "/signin"} 
          className="text-sm font-semibold text-gray-300 hover:text-white transition-colors tracking-widest uppercase"
        >
          {isSignIn ? "Sign Up" : "Log In"}
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 z-10 w-full max-w-md mx-auto">
        {children}
      </main>

      {/* Minimal Footer */}
      <footer className="w-full p-6 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 z-10">
        <p>© 2026 NovaBlog. Built for the next generation of developers.</p>
        <div className="flex items-center gap-6 mt-4 md:mt-0 font-medium">
          <Link to="#" className="hover:text-gray-300 transition-colors">PRIVACY POLICY</Link>
          <Link to="#" className="hover:text-gray-300 transition-colors">TERMS OF SERVICE</Link>
          <Link to="#" className="hover:text-gray-300 transition-colors">STATUS</Link>
          <Link to="#" className="hover:text-gray-300 transition-colors">CONTACT</Link>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
