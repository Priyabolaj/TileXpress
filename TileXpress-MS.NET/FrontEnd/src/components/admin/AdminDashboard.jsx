import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Product Management</h5>
              <p className="card-text">Manage your product inventory, add new products, or update existing ones.</p>
              <Link to="/admin/products" className="btn btn-primary">
                Manage Products
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Management</h5>
              <p className="card-text">View and manage customer orders, update order status.</p>
              <Link to="/admin/orders" className="btn btn-primary">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;