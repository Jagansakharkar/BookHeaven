import React from 'react';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Branding Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">📘 BookHeaver</h2>
            <p className="text-gray-400">
              Your go-to place for the best collection of books across genres.
              Discover, learn, and grow with every page.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Quick Links</h2>
            <ul className="space-y-2">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/all-books" className="hover:text-white transition">All Books</a></li>
              <li><a href="/contact" className="hover:text-white transition">Contact</a></li>
              <li><a href="/profile" className="hover:text-white transition">My Account</a></li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
            <p className="text-gray-400">📧 contact@bookheaver.com</p>
            <p className="text-gray-400">📞 +91 98765 43210</p>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="hover:text-white text-lg">🌐</a>
              <a href="#" className="hover:text-white text-lg">🐦</a>
              <a href="#" className="hover:text-white text-lg">📘</a>
              <a href="#" className="hover:text-white text-lg">📸</a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} BookHeaver. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
