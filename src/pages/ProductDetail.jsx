import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { fetchProduct, submitContactMessage } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  // Buy form modal state
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [buyForm, setBuyForm] = useState({ name: '', phone: '', email: '', quantity: '1', message: '' });
  const [buySubmitting, setBuySubmitting] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [buyError, setBuyError] = useState('');

  const handleBuySubmit = async (e) => {
    e.preventDefault();
    setBuyError('');
    setBuySubmitting(true);
    try {
      await submitContactMessage({
        name: buyForm.name,
        phone: buyForm.phone,
        email: buyForm.email,
        subject: `Purchase Inquiry: ${product.name} (x${buyForm.quantity})`,
        message: buyForm.message || `I would like to purchase ${buyForm.quantity} unit(s) of ${product.name} (ID: ${product.productId}).`,
      });
      setBuySuccess(true);
      setBuyForm({ name: '', phone: '', email: '', quantity: '1', message: '' });
    } catch (err) {
      setBuyError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setBuySubmitting(false);
    }
  };

  const closeBuyModal = () => {
    setShowBuyForm(false);
    setBuySuccess(false);
    setBuyError('');
    setBuyForm({ name: '', phone: '', email: '', quantity: '1', message: '' });
  };

  useEffect(() => {
    fetchProduct(id)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div
            className="animate-spin rounded-full h-12 w-12 border-b-2"
            style={{ borderColor: '#0057B8' }}
          />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <p className="text-5xl">😕</p>
          <p className="text-xl text-gray-500">Product not found.</p>
          <Link
            to="/products"
            className="px-6 py-2 rounded-lg text-white font-semibold"
            style={{ backgroundColor: '#0057B8' }}
          >
            Back to Products
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageSrc =
    !imgError && product.image
      ? product.image.startsWith('http')
        ? product.image
        : `http://localhost:5000${product.image}`
      : null;

  const stockStatus =
    product.quantity > 10
      ? { label: `${product.quantity} units in stock`, cls: 'bg-green-100 text-green-700' }
      : product.quantity > 0
      ? { label: `Only ${product.quantity} units left!`, cls: 'bg-yellow-100 text-yellow-700' }
      : { label: 'Out of Stock', cls: 'bg-red-100 text-red-700' };

  return (
    <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline mb-6"
        >
          ← Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden md:flex">
          {/* Product Image */}
          <div className="md:w-1/2 bg-gray-50 flex items-center justify-center min-h-64">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-72 md:h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="flex flex-col items-center text-gray-300 py-16">
                <span className="text-8xl">📦</span>
                <p className="mt-2 text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8 md:w-1/2 flex flex-col justify-center">
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full text-white self-start"
              style={{ backgroundColor: '#0057B8' }}
            >
              {product.category}
            </span>

            <h1 className="text-3xl font-bold mt-3 text-gray-800">{product.name}</h1>
            <p className="text-gray-400 text-sm mt-1">Product ID: {product.productId}</p>

            <p className="text-4xl font-bold mt-5" style={{ color: '#FF7A00' }}>
              ৳{product.price?.toLocaleString()}
            </p>

            <div className="mt-3">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${stockStatus.cls}`}>
                {stockStatus.label}
              </span>
            </div>

            {product.description && (
              <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>
            )}

            <button
              onClick={() => product.quantity > 0 && setShowBuyForm(true)}
              className="mt-8 w-full py-3 rounded-xl text-white font-bold text-lg transition-opacity hover:opacity-90"
              style={{
                backgroundColor: product.quantity > 0 ? '#FF7A00' : '#9ca3af',
                cursor: product.quantity > 0 ? 'pointer' : 'not-allowed',
              }}
              disabled={product.quantity === 0}
            >
              {product.quantity > 0 ? '🛒 Buy Now' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </main>

      {/* Buy Now Modal */}
      {showBuyForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => { if (e.target === e.currentTarget) closeBuyModal(); }}
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            <button
              onClick={closeBuyModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-2xl font-bold leading-none"
            >
              ×
            </button>

            {buySuccess ? (
              <div className="text-center py-6">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-green-600 font-bold text-xl">Order Request Sent!</p>
                <p className="text-gray-500 mt-2 text-sm">We'll contact you shortly to confirm your order.</p>
                <button
                  onClick={closeBuyModal}
                  className="mt-6 px-6 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: '#0057B8' }}
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1" style={{ color: '#0057B8' }}>Place an Order</h2>
                <p className="text-sm text-gray-500 mb-5">
                  {product.name} — <span style={{ color: '#FF7A00' }} className="font-semibold">৳{product.price?.toLocaleString()}</span>
                </p>

                {buyError && (
                  <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg mb-4 text-sm">
                    {buyError}
                  </div>
                )}

                <form onSubmit={handleBuySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={buyForm.name}
                      onChange={(e) => setBuyForm({ ...buyForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      required
                      value={buyForm.phone}
                      onChange={(e) => setBuyForm({ ...buyForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="+880 1XXX-XXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={buyForm.email}
                      onChange={(e) => setBuyForm({ ...buyForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max={product.quantity}
                      value={buyForm.quantity}
                      onChange={(e) => setBuyForm({ ...buyForm, quantity: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Additional Message <span className="text-gray-400 font-normal">(optional)</span></label>
                    <textarea
                      rows={3}
                      value={buyForm.message}
                      onChange={(e) => setBuyForm({ ...buyForm, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Delivery address, special requests..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={buySubmitting}
                    className="w-full py-3 rounded-xl text-white font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-60"
                    style={{ backgroundColor: '#FF7A00' }}
                  >
                    {buySubmitting ? 'Submitting...' : 'Confirm Order'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductDetail;
