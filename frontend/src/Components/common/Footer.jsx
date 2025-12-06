import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { HiBookOpen } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <HiBookOpen className="text-indigo-400 text-3xl" />
              <span className="text-2xl font-bold text-white">BookHeaven</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your premier destination for discovering and exploring a world of books. 
              Journey through stories that inspire and transform.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaTwitter className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaFacebook className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaInstagram className="text-xl" />
              </a>
              <a href="#" className="text-gray-400 hover:text-indigo-400 transition-colors">
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-400 hover:text-indigo-400 transition-colors">Home</a></li>
              <li><a href="/books" className="text-gray-400 hover:text-indigo-400 transition-colors">Browse Books</a></li>
              <li><a href="/new-releases" className="text-gray-400 hover:text-indigo-400 transition-colors">New Releases</a></li>
              <li><a href="/best-sellers" className="text-gray-400 hover:text-indigo-400 transition-colors">Best Sellers</a></li>
              <li><a href="/genres" className="text-gray-400 hover:text-indigo-400 transition-colors">Genres</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Support</h3>
            <ul className="space-y-3">
              <li><a href="/contact" className="text-gray-400 hover:text-indigo-400 transition-colors">Contact Us</a></li>
              <li><a href="/faq" className="text-gray-400 hover:text-indigo-400 transition-colors">FAQs</a></li>
              <li><a href="/shipping" className="text-gray-400 hover:text-indigo-400 transition-colors">Shipping Policy</a></li>
              <li><a href="/returns" className="text-gray-400 hover:text-indigo-400 transition-colors">Returns & Refunds</a></li>
              <li><a href="/privacy" className="text-gray-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 uppercase tracking-wider">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaEnvelope className="text-indigo-400 mt-1" />
                <a href="mailto:contact@bookheaven.com" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  contact@bookheaven.com
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <FaPhone className="text-indigo-400 mt-1" />
                <a href="tel:+919876543210" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <p className="text-gray-400 pt-2">
                123 Book Street, Literary District<br />
                Bangalore, Karnataka 560001
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} BookHeaven. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/terms" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">Terms of Service</a>
            <a href="/privacy" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">Privacy Policy</a>
            <a href="/cookies" className="text-gray-500 hover:text-indigo-400 text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer