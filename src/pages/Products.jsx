import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../services/api';

const CATEGORIES = [
  'All',
  'Refrigerator',
  'Oven',
  'Iron Machine',
  'Rice Cooker',
  'Washing Machine',
  'Fan',
  'LED TV',
  'Air Conditioner',
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'All';

  const loadProducts = (searchTerm) => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    fetchProducts(params)
      .then((res) => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts(search);
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
      <Navbar />

      {/* Page Header */}
      <div style={{ backgroundColor: '#0057B8' }} className="text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold">Our Products</h1>
        <p className="text-blue-100 mt-2">Explore our complete range of home appliances</p>
      </div>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
          />
          <button
            type="submit"
            className="px-6 py-2 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: '#0057B8' }}
          >
            Search
          </button>
        </form>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setSearchParams(cat !== 'All' ? { category: cat } : {})
              }
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                selectedCategory === cat
                  ? 'text-white shadow'
                  : 'bg-white text-gray-600 border border-gray-300 hover:border-blue-500 hover:text-blue-600'
              }`}
              style={selectedCategory === cat ? { backgroundColor: '#0057B8' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2"
              style={{ borderColor: '#0057B8' }}
            />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-400 text-xl">No products found.</p>
            <p className="text-gray-400 text-sm mt-1">Try a different category or search term.</p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-4">{products.length} product(s) found</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Products;
