import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import '../../css/Navbar.css';
import Home from '../../pages/Home';
const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <>
    <nav className="navbar navbar-expand-lg ">
      <div className="container">
        <Link className="navbar-brand" to={isAdmin ? "/admin/dashboard" : "/"}>


          TilesXpress


        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAdmin ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/products">
                    Manage Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/admin/orders">
                    Manage Orders
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/products">
                    Products
                  </Link>
                </li>
                {user && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/cart">
                        Cart {cart && cart.totalItems > 0 && (
                          <span className="badge bg-primary">{cart.totalItems}</span>
                        )}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/orders">
                        Orders
                      </Link>
                    </li>
                  </>
                )}
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {user ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                >
                  {user.firstName} {user.lastName}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
    {/* <Home/> */}
    </>

    
    
  );
};

export default Navbar;