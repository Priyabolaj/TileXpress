import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';
import { formatPrice, formatDate } from '../../utils/formatters';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await orderService.updateOrderStatus(orderId, { status: newStatus });
      if (response.success) {
        await fetchOrders(); // Refresh the orders list after update
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Order Management</h2>
      <ErrorMessage message={error} />

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.userName}</td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatPrice(order.totalAmount)}</td>
                    <td>
                      <span className={`badge bg-${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{order.items?.length || 0} items</td>
                    <td>
                      <div className="dropdown">
                        <button
                          className="btn btn-sm btn-outline-primary dropdown-toggle"
                          type="button"
                          data-bs-toggle="dropdown"
                        >
                          Update Status
                        </button>
                        <ul className="dropdown-menu">
                          {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                            <li key={status}>
                              <button
                                className="dropdown-item"
                                onClick={() => handleStatusUpdate(order.id, status)}
                                disabled={order.status === status}
                              >
                                {status}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div >
  );
};

const getStatusBadgeColor = (status) => {
  switch (status) {
    case 'Pending':
      return 'warning';
    case 'Processing':
      return 'info';
    case 'Shipped':
      return 'primary';
    case 'Delivered':
      return 'success';
    case 'Cancelled':
      return 'danger';
    default:
      return 'secondary';
  }
};

export default OrderManagement;