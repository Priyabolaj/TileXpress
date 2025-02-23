import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrderContext';
import CartItem from './CartItem';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const Cart = () => {
  const { cart, loading, clearCart, refreshCart } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  // Add this useEffect to fetch cart data when component mounts
  useEffect(() => {
    refreshCart();
  }, []);

  const handleCheckout = async () => {
    try {
      const result = await createOrder();
      if (result.success) {
        navigate(`/orders/${result.order.id}`);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Loading />;
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <h2>Your Cart is Empty</h2>
          <p>Add some beautiful Tiles to your cart!</p>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Shopping Cart</h2>
      <ErrorMessage message={error} />
      
      <div className="mb-4">
        {cart.items.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </div>

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0">Total Items: {cart.totalItems}</h5>
              <h4 className="mb-0">Total Amount: ${cart.totalAmount.toFixed(2)}</h4>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => clearCart()}
              >
                Clear Cart
              </button>
              <button
                className="btn btn-primary"
                onClick={handleCheckout}
                disabled={!cart.items.length}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;