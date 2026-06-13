import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-border-subtle bg-bg-base pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1">
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
              <a href="#" className="hover:text-white transition-colors">
                Feed
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Explore
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Pricing
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Changelog
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Resources</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Documentation
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                API Reference
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Community
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Guidelines
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-white">Legal</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
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
