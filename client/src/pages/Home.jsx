import React, { useState } from 'react';
import api from '../api'; // Your api.js
import { useNavigate } from 'react-router-dom';

function Home() {
  const [formData, setFormData] = useState({
    name: '',
    purchase_date: '',
    cost: '',
    description: '',
    service_date: '',
    warranty_expiry: '',
    expenses: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Filter out empty fields, backend will use defaults
    const assetData = {};
    for (const key in formData) {
      if (formData[key]) {
        assetData[key] = formData[key];
      }
    }

    try {
      // The api.js interceptor automatically adds the auth token
      await api.post('/assets', assetData);
      setMessage('Asset added successfully! Redirecting...');
      
      // Clear form
      setFormData({
        name: '', purchase_date: '', cost: '', description: '',
        service_date: '', warranty_expiry: '', expenses: '',
      });

      // Redirect to the "Your Assets" page after 2 seconds
      setTimeout(() => {
        navigate('/assets');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add asset');
    }
  };

  return (
    <div className="form-container">
      <h2>Add a New Asset</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Asset Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Cost (₹)</label>
          <input
            type="number"
            name="cost"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="form-group">
          <label>Next Service Date</label>
          <input
            type="date"
            name="service_date"
            value={formData.service_date}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Warranty Expiry Date</label>
          <input
            type="date"
            name="warranty_expiry"
            value={formData.warranty_expiry}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Other Expenses (₹)</label>
          <input
            type="number"
            name="expenses"
            value={formData.expenses}
            onChange={handleChange}
          />
        </div>

        {error && <p className="form-error">{error}</p>}
        {message && <p className="form-success">{message}</p>}

        <button type="submit" className="submit-btn">Add Asset</button>
      </form>
    </div>
  );
}

export default Home;