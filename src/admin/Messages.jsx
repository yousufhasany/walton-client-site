import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';
import { fetchContactMessages, markContactMessageAsRead } from '../services/api';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const loadMessages = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchContactMessages();
      setMessages(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const handleMarkRead = async (id) => {
    setUpdatingId(id);
    try {
      await markContactMessageAsRead(id);
      setMessages((prev) =>
        prev.map((message) =>
          message._id === id ? { ...message, status: 'read' } : message
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update message status');
    } finally {
      setUpdatingId(null);
    }
  };

  const newCount = messages.filter((message) => message.status !== 'read').length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold" style={{ color: '#0057B8' }}>
          Customer Messages
        </h1>
        <div className="bg-white rounded-lg px-4 py-2 shadow text-sm text-gray-600">
          New: <span className="font-bold text-red-600">{newCount}</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div
            className="animate-spin rounded-full h-10 w-10 border-b-2"
            style={{ borderColor: '#0057B8' }}
          />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center text-gray-400">
          <p className="text-5xl mb-3">📭</p>
          <p className="text-lg font-semibold">No customer messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => {
            const isRead = message.status === 'read';

            return (
              <div key={message._id} className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{message.subject}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleString('en-GB')}
                    </p>
                  </div>
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                      isRead ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {isRead ? 'Read' : 'New'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <p className="text-gray-700">
                    <strong>Name:</strong> {message.name}
                  </p>
                  <p className="text-gray-700 break-all">
                    <strong>Email:</strong> {message.email}
                  </p>
                  <p className="text-gray-700">
                    <strong>Phone:</strong> {message.phone}
                  </p>
                </div>

                <div className="mt-4 bg-gray-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                  {message.message}
                </div>

                {!isRead && (
                  <div className="mt-4">
                    <button
                      onClick={() => handleMarkRead(message._id)}
                      disabled={updatingId === message._id}
                      className="px-4 py-2 rounded-lg text-white text-sm font-semibold disabled:opacity-60"
                      style={{ backgroundColor: '#0057B8' }}
                    >
                      {updatingId === message._id ? 'Updating...' : 'Mark as Read'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminMessages;