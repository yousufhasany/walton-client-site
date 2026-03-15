import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { submitContactMessage } from '../services/api';

const Contact = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitting(true);

    try {
      await submitContactMessage(form);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#F5F5F5' }} className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <div style={{ backgroundColor: '#0057B8' }} className="text-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold">Contact Us</h1>
        <p className="text-blue-100 mt-2">We'd love to hear from you</p>
      </div>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6" style={{ color: '#0057B8' }}>
              Send a Message
            </h2>

            {submitted ? (
              <div className="text-center py-10">
                <div className="text-6xl mb-4">✅</div>
                <p className="text-green-600 font-bold text-xl">Message Sent!</p>
                <p className="text-gray-500 mt-2">We'll get back to you as soon as possible.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 px-6 py-2 rounded-lg text-white font-semibold"
                  style={{ backgroundColor: '#0057B8' }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm">
                    {submitError}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="+880 1XXX-XXXXXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="How can we help?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                    placeholder="Write your message here..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg text-white font-bold text-lg transition-opacity hover:opacity-90 disabled:opacity-60"
                  style={{ backgroundColor: '#FF7A00' }}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-4" style={{ color: '#0057B8' }}>
                Contact Information
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="flex items-start gap-3">
                  <span className="text-xl">📍</span>
                  <span>
                    <strong>Address:</strong>
                    <br />
                    Walton Showroom, Salimgong, Nabinagor, Brahmonbaria
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">📞</span>
                  <span>
                    <strong>Phone:</strong> +880 1821520067
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">✉️</span>
                  <span>
                    <strong>Email:</strong> salimahmad336@gmail.com
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <span className="text-xl">🕐</span>
                  <span>
                    <strong>Hours:</strong> Saturday – Friday, 9:00am – 8:00pm
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-6">
              <h3 className="text-lg font-bold mb-3" style={{ color: '#0057B8' }}>
                Product Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Refrigerator',
                  'Oven',
                  'Iron Machine',
                  'Rice Cooker',
                  'Washing Machine',
                  'Fan',
                  'LED TV',
                  'Air Conditioner',
                ].map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: '#0057B8' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="rounded-2xl p-6 text-white"
              style={{ backgroundColor: '#FF7A00' }}
            >
              <h3 className="text-lg font-bold mb-2">Need Quick Help?</h3>
              <p className="text-sm opacity-90">
                Visit our showroom for a hands-on experience with our full product range, or call
                us for immediate assistance.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
