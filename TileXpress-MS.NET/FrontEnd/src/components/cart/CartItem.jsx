import React from 'react';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (e) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity >= 1 && newQuantity <= item.availableStock) {
      await updateQuantity(item.productId, newQuantity);
    }
  };

  const handleRemove = async () => {
    await removeFromCart(item.productId);
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-4">
            <h5 className="card-title">{item.productName}</h5>
            <p className="card-text">
              <small className="text-muted">
                Price: ${item.productPrice.toFixed(2)}
              </small>
            </p>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <label className="input-group-text">Quantity</label>
              <input
                type="number"
                className="form-control"
                value={item.quantity}
                onChange={handleQuantityChange}
                min="1"
                max={item.availableStock}
              />
            </div>
          </div>
          <div className="col-md-3">
            <p className="mb-0">
              <strong>Subtotal: ${item.subtotal.toFixed(2)}</strong>
            </p>
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-outline-danger"
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
