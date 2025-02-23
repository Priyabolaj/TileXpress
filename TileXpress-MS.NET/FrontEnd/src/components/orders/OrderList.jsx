import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useOrders } from '../../context/OrderContext';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const OrderList = () => {
  const { orders, loading, fetchOrders } = useOrders();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Your Orders</h2>
      {orders.length === 0 ? (
        <div className="text-center">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Order #{order.id}</h5>
                  <p className="mb-1">
                    Date: {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                  <p className="mb-1">Status: {order.status}</p>
                  <p className="mb-1">
                    Total Amount: ${order.totalAmount.toFixed(2)}
                  </p>
                  <p className="mb-1">
                    Items: {order.items.length}
                  </p>
                  <Link
                    to={`/orders/${order.id}`}
                    className="btn btn-outline-primary"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
