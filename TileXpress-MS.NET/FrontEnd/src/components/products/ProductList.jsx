import React, { useState, useEffect } from 'react';
import { productService } from '../../services/productService';
import ProductCard from './ProductCard';
import Loading from '../common/Loading';
import ErrorMessage from '../common/ErrorMessage';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('');
  const [filterStock, setFilterStock] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedCategory === 'all') {
        response = await productService.getAllProducts();
      } else {
        response = await productService.getProductsByCategory(selectedCategory);
      }

      if (response.success) {
        setProducts(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortedFilteredProducts = () => {
    let filtered = [...products];

    if (filterStock) {
      filtered = filtered.filter((product) => product.stock > 0);
    }

    if (sortBy === 'priceLow') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHigh') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'stockLow') {
      filtered.sort((a, b) => a.stock - b.stock);
    } else if (sortBy === 'stockHigh') {
      filtered.sort((a, b) => b.stock - a.stock);
    }

    return filtered;
  };

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Our Products</h2>
      
      <div className="mb-3 d-flex gap-2">
        <select className="form-select" onChange={(e) => setSortBy(e.target.value)}>
          <option value="">Sort by</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="stockLow">Stock: Low to High</option>
          <option value="stockHigh">Stock: High to Low</option>
        </select>
        <div className="form-check">
          <input 
            className="form-check-input" 
            type="checkbox" 
            id="filterStock" 
            checked={filterStock} 
            onChange={() => setFilterStock(!filterStock)} 
          />
          <label className="form-check-label" htmlFor="filterStock">
            In Stock Only
          </label>
        </div>
      </div>
      
      <div className="row g-4">
        {sortedFilteredProducts().map((product) => (
          <div key={product.id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
