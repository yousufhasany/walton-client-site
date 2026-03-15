import React from 'react';
import { Link } from 'react-router-dom';

const HeroBanner = () => {
  return (
    <div
      className="relative text-white py-28 px-6 text-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0057B8 0%, #003d82 60%, #002255 100%)',
      }}
    >
      {/* Background decorative circles */}
      <div
        className="absolute top-[-60px] right-[-60px] w-64 h-64 rounded-full opacity-10"
        style={{ backgroundColor: '#FF7A00' }}
      />
      <div
        className="absolute bottom-[-40px] left-[-40px] w-48 h-48 rounded-full opacity-10"
        style={{ backgroundColor: '#FF7A00' }}
      />

      <div className="relative max-w-4xl mx-auto">
        <span
          className="inline-block px-4 py-1 rounded-full text-sm font-semibold mb-4"
          style={{ backgroundColor: '#FF7A00' }}
        >
          Bangladesh's Trusted Brand
        </span>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
          Welcome to{' '}
          <span style={{ color: '#FF7A00' }}>WALTON</span> Showroom
        </h1>
        <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Discover the finest home appliances — Refrigerators, ACs, LED TVs, and more.
          Quality you can trust, prices you'll love.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/products"
            className="px-8 py-3 rounded-full font-bold text-white text-lg transition-transform hover:scale-105 shadow-lg"
            style={{ backgroundColor: '#FF7A00' }}
          >
            Shop Now
          </Link>
          <Link
            to="/about"
            className="px-8 py-3 rounded-full font-bold text-lg border-2 border-white hover:bg-white hover:text-blue-800 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,25 C480,50 960,0 1440,25 L1440,50 L0,50 Z" fill="#f5f5f5" />
        </svg>
      </div>
    </div>
  );
};

export default HeroBanner;
