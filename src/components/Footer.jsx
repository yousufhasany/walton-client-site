import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#0057B8' }} className="text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-1">WALTON</h2>
          <p style={{ color: '#FF7A00' }} className="font-semibold mb-3">
            Showroom & Service Center
          </p>
          <p className="text-sm text-blue-100">
            Your trusted destination for quality home appliances in Bangladesh.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-blue-100">
            <li>
              <Link to="/" className="hover:text-orange-300 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-orange-300 transition-colors">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-orange-300 transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-orange-300 transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm text-blue-100">📍 Walton Showroom, Salimgong, Nabinagor, Brahmonbaria</p>
          <p className="text-sm text-blue-100 mt-2">📞 +880 1821520067</p>
          <p className="text-sm text-blue-100 mt-2">✉️ salimahmad336@gmail.com</p>
          <p className="text-sm text-blue-100 mt-2">🕐 Sat–Fri, 9:00am – 8:00pm</p>
        </div>
      </div>

      <div className="border-t border-blue-700 text-center py-4 text-sm text-blue-200">
        © {new Date().getFullYear()} Walton Showroom. All rights reserved Yousuf Hasan.
      </div>
    </footer>
  );
};

export default Footer;
