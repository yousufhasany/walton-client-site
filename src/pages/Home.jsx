import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroBanner from '../components/HeroBanner';
import CategoryGrid from '../components/CategoryGrid';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then((res) => setFeatured(res.data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
      <Navbar />
      <HeroBanner />
      <CategoryGrid />

      {/* Featured Products */}
      <section className="py-14 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#0057B8' }}>
            Featured Products
          </h2>
          <p className="text-center text-gray-500 mb-8">Our best-selling home appliances</p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2"
                style={{ borderColor: '#0057B8' }}
              />
            </div>
          ) : featured.length === 0 ? (
            <p className="text-center text-gray-400 py-10 text-lg">
              No products available yet. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featured.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4" style={{ backgroundColor: '#0057B8' }}>
        <div className="max-w-5xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-10">Why Choose Walton?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🏆',
                title: 'Quality Products',
                desc: 'Premium home appliances built to last with international standards.',
              },
              {
                icon: '💰',
                title: 'Best Prices',
                desc: 'Competitive pricing with seasonal discounts and special offers.',
              },
              {
                icon: '🔧',
                title: 'After Sales Service',
                desc: 'Dedicated service centers across Bangladesh for your peace of mind.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white bg-opacity-10 rounded-xl p-6 hover:bg-opacity-20 transition-all">
                <div className="text-5xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-blue-100 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
