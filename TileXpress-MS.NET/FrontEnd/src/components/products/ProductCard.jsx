import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import ErrorMessage from '../common/ErrorMessage';

const ProductCard = ({ product }) => {
  const { addToCart, refreshCart } = useCart();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await addToCart(product.id, 1);
      if (result.success) {
        await refreshCart();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card h-100">
      <img
        src={product.imageUrl || '/placeholder-image.jpg'}
        className="card-img-top"
        alt={product.name}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.src = '/placeholder-image.jpg';
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">Category: {product.categoryName}</p>
        <p className="card-text">
          <strong>Price: ${product.price.toFixed(2)}</strong>
        </p>
        <p className="card-text">
          <small className="text-muted">Stock: {product.stock} items</small>
        </p>
        {error && <ErrorMessage message={error} />}
      </div>
      <div className="card-footer bg-transparent border-top-0">
        <div className="d-flex justify-content-between">
          <Link to={`/products/${product.id}`} className="btn btn-outline-primary">
          View Details
        </Link>
        <button
          className="btn btn-primary"
          onClick={handleAddToCart}
          disabled={product.stock === 0 || loading}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
    </div >
  );
};

export default ProductCard;