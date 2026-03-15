import React from 'react';
import { Link } from 'react-router-dom';

const categories = [
  { name: 'Refrigerator', icon: '🧊', bg: '#e3f2fd' },
  { name: 'Oven', icon: '🍳', bg: '#fff3e0' },
  { name: 'Iron Machine', icon: '👔', bg: '#f3e5f5' },
  { name: 'Rice Cooker', icon: '🍚', bg: '#e8f5e9' },
  { name: 'Washing Machine', icon: '🫧', bg: '#e0f7fa' },
  { name: 'Fan', icon: '💨', bg: '#fff8e1' },
  { name: 'LED TV', icon: '📺', bg: '#fce4ec' },
  { name: 'Air Conditioner', icon: '❄️', bg: '#e8eaf6' },
];

const CategoryGrid = () => {
  return (
    <section className="py-14 px-4" style={{ backgroundColor: '#f5f5f5' }}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2" style={{ color: '#0057B8' }}>
          Product Categories
        </h2>
        <p className="text-center text-gray-500 mb-8">Browse our full range of home appliances</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
              style={{ backgroundColor: cat.bg }}
            >
              <span className="text-5xl mb-3">{cat.icon}</span>
              <span className="font-semibold text-gray-700 text-center text-sm">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
