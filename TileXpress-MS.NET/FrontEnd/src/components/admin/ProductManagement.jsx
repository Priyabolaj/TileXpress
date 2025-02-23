import React, { useState, useEffect } from 'react';

// Internal Components
const Loading = () => (
  <div className="flex justify-center items-center p-8">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
      <span>{message}</span>
    </div>
  );
};

const ProductManagement = () => {
  // State declarations remain the same
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  });

  // Rest of the component implementation remains the same
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5135/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
  });
  const data = await response.json();
  if (data.success) {
    setProducts(data.data);
  } else {
    setError(data.message);
  }
} catch (err) {
  setError('Failed to fetch products');
} finally {
  setLoading(false);
}
  };

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleImageError = (e) => {
  e.target.src = '/api/placeholder/200/200';
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const data = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      categoryId: parseInt(formData.categoryId)
    };

    const url = editingProduct
      ? `http://localhost:5135/api/products/${editingProduct.id}`
      : 'http://localhost:5135/api/products';

    const response = await fetch(url, {
      method: editingProduct ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (result.success) {
      await fetchProducts();
      resetForm();
    } else {
      setError(result.message);
    }
  } catch (err) {
    setError('Failed to save product');
  } finally {
    setLoading(false);
  }
};

const resetForm = () => {
  setFormData({
    name: '',
    price: '',
    stock: '',
    imageUrl: '',
    categoryId: ''
  });
  setEditingProduct(null);
};

const handleEdit = (product) => {
  setEditingProduct(product);
  setFormData({
    name: product.name,
    price: product.price.toString(),
    stock: product.stock.toString(),
    imageUrl: product.imageUrl || '',
    categoryId: product.categoryId.toString()
  });
};

const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this product?')) {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5135/api/products/${id}`, {
        method: 'DELETE',
        headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
  });
  const result = await response.json();
  if (result.success) {
    await fetchProducts();
  } else {
    setError(result.message);
  }
} catch (err) {
  setError('Failed to delete product');
} finally {
  setLoading(false);
}
    }
  };

if (loading) return <Loading />;

return (
  <div className="container mt-4">
    <h2 className="text-2xl font-bold mb-4">Product Management</h2>
    <ErrorMessage message={error} />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-lg shadow">
          <h5 className="text-xl font-semibold mb-4">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Stock</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                />
                {formData.imageUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded border"
                      onError={handleImageError}
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="1">Indoor Tiles</option>
                  <option value="2">Outdoor Tiles</option>
                  <option value="3">Kitchen Tiles</option>
                  <option value="4">Bathroom Tiles</option>
                </select>
              </div>

              <div className="flex flex-col space-y-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>

                {editingProduct && (
                  <button
                    type="button"
                    className="w-full bg-gray-200 text-gray-800 p-2 rounded-md hover:bg-gray-300"
                    onClick={resetForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h5 className="text-xl font-semibold mb-4">Product List</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">Image</th>
                    <th className="p-4 text-left">Name</th>
                    <th className="p-4 text-left">Category</th>
                    <th className="p-4 text-left">Price</th>
                    <th className="p-4 text-left">Stock</th>
                    <th className="p-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="p-4">
                        <img
                          src={product.imageUrl || '/api/placeholder/50/50'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                          onError={handleImageError}
                        />
                      </td>
                      <td className="p-4">{product.name}</td>
                      <td className="p-4">{product.categoryName}</td>
                      <td className="p-4">${product.price.toFixed(2)}</td>
                      <td className="p-4">{product.stock}</td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default ProductManagement;