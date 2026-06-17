import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-bg-base pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter mb-4 inline-block"
          >
            <span className="text-white">Nova</span>
            <span className="text-gray-400">Blog</span>
          </Link>
          <p className="text-sm text-gray-500 mb-6 max-w-xs">
            Building the future of technical writing. A space for developers, by
            developers, where precision meets clarity.
          </p>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-brand-cyan transition-colors">
              Twitter
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Platform</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <Link to="/feed" className="hover:text-gray-200 transition-colors">
                Feed
              </Link>
            </li>
            <li>
              <Link to="/explore" className="hover:text-gray-200 transition-colors">
                Explore
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-gray-200 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200 transition-colors">
                Changelog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-gray-200 transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200 transition-colors">
                API Reference
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200 transition-colors">
                Community
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-200 transition-colors">
                Guidelines
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <Link to="/privacy" className="hover:text-gray-200 transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-gray-200 transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/cookie-policy" className="hover:text-gray-200 transition-colors">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
        <p>© 2026 NovaBlog Media Group. All rights reserved.</p>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          All systems operational
        </div>
      </div>
    </footer>
  );
};

export default Footer;
