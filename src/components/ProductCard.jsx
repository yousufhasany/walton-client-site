import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const imageSrc =
    product.image
      ? product.image.startsWith('http')
        ? product.image
        : `http://localhost:5000${product.image}`
      : null;

  const stockStatus =
    product.quantity > 10
      ? { label: `${product.quantity} in stock`, cls: 'bg-green-100 text-green-700' }
      : product.quantity > 0
      ? { label: `Only ${product.quantity} left`, cls: 'bg-yellow-100 text-yellow-700' }
      : { label: 'Out of stock', cls: 'bg-red-100 text-red-700' };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={product.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      ) : (
        <div
          className="w-full h-48 flex items-center justify-center text-6xl"
          style={{ backgroundColor: '#e3f2fd' }}
        >
          📦
        </div>
      )}

      <div className="p-4 flex flex-col flex-1">
        <span
          className="text-xs font-semibold px-2 py-1 rounded-full text-white self-start"
          style={{ backgroundColor: '#0057B8' }}
        >
          {product.category}
        </span>
        <h3 className="text-lg font-bold mt-2 text-gray-800 leading-tight">{product.name}</h3>
        <p className="text-gray-400 text-xs mt-1">ID: {product.productId}</p>
        {product.description && (
          <p className="text-gray-500 text-sm mt-2 line-clamp-2 flex-1">{product.description}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-xl font-bold" style={{ color: '#FF7A00' }}>
            ৳{product.price?.toLocaleString()}
          </span>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${stockStatus.cls}`}>
            {stockStatus.label}
          </span>
        </div>

        <Link
          to={`/products/${product._id}`}
          className="mt-3 block text-center py-2 rounded-lg text-white font-semibold transition-opacity hover:opacity-90"
          style={{ backgroundColor: '#0057B8' }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
