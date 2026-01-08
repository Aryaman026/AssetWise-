import { useEffect, useState } from 'react';
import api from '../api';
import Card from '../components/Card'; // Import the new Card component

function Warranties() {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      const res = await api.get('/assets');
      // Filter assets to only show those with a warranty
      const warrantyAssets = res.data.filter(asset => asset.warranty_expiry);
      setAssets(warrantyAssets);
    } catch (err) {
      console.error("Error fetching assets", err);
    }
  };

  // We only want to show a few details for warranties
  const createWarrantyAsset = (asset) => ({
    id: asset.id,
    name: asset.name,
    purchase_date: asset.purchase_date,
    warranty_expiry: asset.warranty_expiry,
  });

  return (
    <div>
      <h2>Warranties</h2>
      {assets.length === 0 ? (
        <p>No assets with warranties found.</p>
      ) : (
        <div className="card-grid">
          {assets.map(asset => (
            <Card key={asset.id} asset={createWarrantyAsset(asset)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Warranties;