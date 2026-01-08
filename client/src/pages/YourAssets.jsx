import { useEffect, useState } from 'react';
import api from '../api';
import Card from '../components/Card'; // Import the new Card component

function YourAssets() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    // You'll need to add the auth headers here as we discussed
    // For this example, I'm showing the API call as you had it
    try {
      const res = await api.get('/assets');
      setAssets(res.data);
    } catch (err) {
      console.error("Error fetching assets", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assets/${id}`);
      fetchAssets(); // Refresh the list after deleting
    } catch (err) {
      console.error("Error deleting asset", err);
    }
  };

  return (
    <div>
      <h2>Your Assets</h2>
      {assets.length === 0 ? (
        <p>No assets found. Add one to get started!</p>
      ) : (
        <div className="card-grid">
          {assets.map(asset => (
            <Card key={asset.id} asset={asset} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

export default YourAssets;