import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { useCart } from '../../context/CartContext';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addingToCart, setAddingToCart] = useState(false);
  const { addToCart, refreshCart } = useCart();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      if (response.success) {
        setProduct(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      setError('');
      const result = await addToCart(product.id, quantity);
      if (result.success) {
        await refreshCart();
        navigate('/cart');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;
  if (!product) return <ErrorMessage message="Product not found" />;

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-6">
            <img
              src={product.imageUrl || '/placeholder-image.jpg'}
              className="img-fluid rounded-start"
              alt={product.name}
              style={{ width: '100%', height: '500px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/placeholder-image.jpg';
              }}
            />
          </div>
          <div className="col-md-6">
            <div className="card-body">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <span style={{ cursor: 'pointer' }} onClick={() => navigate('/products')}>
                      Products
                    </span>
                  </li>
                  <li className="breadcrumb-item">
                    <span>{product.categoryName}</span>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    {product.name}
                  </li>
                </ol>
              </nav>

              <h1 className="card-title display-6">{product.name}</h1>

              <div className="mb-3">
                <span className="badge bg-secondary me-2">{product.categoryName}</span>
                <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <p className="card-text fs-2 fw-bold text-primary">
              ${product.price.toFixed(2)}
            </p>

            <p className="card-text">
              <small className="text-muted">
                Available Stock: {product.stock} items
              </small>
            </p>

            {product.stock > 0 ? (
              <>
                <div className="mb-4">
                  <label htmlFor="quantity" className="form-label">Quantity</label>
                  <div className="input-group" style={{ width: '150px' }}>
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      className="form-control text-center"
                      id="quantity"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (val >= 1 && val <= product.stock) {
                          setQuantity(val);
                        }
                      }}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                  >
                    {addingToCart ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Adding to Cart...
                      </>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="alert alert-warning">
                This product is currently out of stock. Please check back later.
              </div>
            )}

            {error && <ErrorMessage message={error} />}

            <div className="mt-4">
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
};

export default ProductDetails;