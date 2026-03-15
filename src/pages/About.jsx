import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div style={{ backgroundColor: '#0057B8' }} className="text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold">About Us</h1>
        <p className="text-blue-100 mt-2">Learn more about Walton Showroom</p>
      </div>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 space-y-8">
        {/* Who We Are */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0057B8' }}>
            Who We Are
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Walton Showroom is your trusted partner for quality home appliances in Bangladesh. We
            carry the full range of Walton products — including refrigerators, air conditioners,
            LED televisions, washing machines, rice cookers, ovens, fans, and iron machines. Our
            mission is to make premium home appliances accessible and affordable for every
            household.
            Provider: Selim Mullha
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { num: '500+', label: 'Products Available' },
            { num: '10+', label: 'Years of Service' },
            { num: '10,000+', label: 'Happy Customers' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow p-6 text-center">
              <p className="text-4xl font-bold" style={{ color: '#FF7A00' }}>
                {stat.num}
              </p>
              <p className="text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Our Values */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0057B8' }}>
            Our Values
          </h2>
          <ul className="space-y-3 text-gray-600">
            {[
              'Quality products that meet international standards',
              'Competitive pricing with regular promotions and discounts',
              'Excellent after-sales support and manufacturer warranty',
              'Honest, transparent, and customer-first business practices',
              'Nationwide delivery and accessible service centers',
            ].map((val) => (
              <li key={val} className="flex items-start gap-3">
                <span className="mt-1 text-lg" style={{ color: '#FF7A00' }}>
                  ✓
                </span>
                <span>{val}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Product Categories */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#0057B8' }}>
            What We Sell
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              '🧊 Refrigerator',
              '🍳 Oven',
              '👔 Iron Machine',
              '🍚 Rice Cooker',
              '🫧 Washing Machine',
              '💨 Fan',
              '📺 LED TV',
              '❄️ Air Conditioner',
            ].map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: '#0057B8' }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
