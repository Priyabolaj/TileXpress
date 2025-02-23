import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';





const Home = () => {
  const { user } = useAuth();

  // Redirect admin users to admin dashboard
  if (user?.role === 'Admin') {
    return <Navigate to="/admin/dashboard" />;
  }

  return (
    <div className="container mt-4">
      {user && user.role !== 'Admin' ? (
        // Show carousel only for regular logged-in users
        <div id="homeCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/src/assets/slide-1.jpg" className="d-block w-100" alt="Bathroom Image 1" />
            </div>
            <div className="carousel-item">
              <img src="/src/assets/slide-2.jpg" className="d-block w-100" alt="Bathroom Image 2" />
            </div>
            <div className="carousel-item">
              <img src="/src/assets/slide-3.jpg" className="d-block w-100" alt="Bathroom Image 3" />
            </div>
          </div>
          <button 
            className="carousel-control-prev" 
            type="button" 
            data-bs-target="#homeCarousel" 
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button 
            className="carousel-control-next" 
            type="button" 
            data-bs-target="#homeCarousel" 
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      ) : (
        // Show welcome message for non-logged in users
        <div className="text-center py-5">
          <h1>Welcome to TilesXpress</h1>
          <p className="lead">
            Please login to view our exclusive collection of bathroom tiles.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;