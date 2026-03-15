import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import { fetchProduct, updateProduct } from '../services/api';

const CATEGORIES = [
  'Refrigerator',
  'Oven',
  'Iron Machine',
  'Rice Cooker',
  'Washing Machine',
  'Fan',
  'LED TV',
  'Air Conditioner',
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    productId: '',
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchProduct(id)
      .then((res) => {
        const p = res.data;
        setForm({
          productId: p.productId || '',
          name: p.name || '',
          category: p.category || '',
          price: p.price ?? '',
          quantity: p.quantity ?? '',
          description: p.description || '',
        });
        if (p.image) {
          setImagePreview(
            p.image.startsWith('http') ? p.image : `http://localhost:5000${p.image}`
          );
        }
      })
      .catch(console.error)
      .finally(() => setFetching(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'productId') data.append(k, v); // productId is immutable
      });
      if (image) data.append('image', image);
      await updateProduct(id, data);
      navigate('/admin/inventory');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: '#0057B8' }}
          />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-2 mb-6 text-sm">
        <Link to="/admin/inventory" className="text-blue-600 hover:underline">
          Inventory
        </Link>
        <span className="text-gray-400">/</span>
        <span className="text-gray-600 font-medium">Edit Product</span>
      </div>

      <h1 className="text-3xl font-bold mb-6" style={{ color: '#0057B8' }}>
        Edit Product
      </h1>

      <div className="bg-white rounded-xl shadow p-8 max-w-2xl">
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product ID</label>
              <input
                value={form.productId}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                disabled
              />
              <p className="text-xs text-gray-400 mt-1">Product ID cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                required
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                required
                min="0"
                value={form.price}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                name="quantity"
                type="number"
                required
                min="0"
                value={form.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Image
            </label>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Current"
                className="mb-3 h-32 w-32 object-cover rounded-lg border border-gray-200"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 rounded-lg text-white font-bold disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#0057B8' }}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              to="/admin/inventory"
              className="flex-1 py-3 rounded-lg text-center font-bold border-2 border-gray-300 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditProduct;
