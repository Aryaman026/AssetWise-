import React from 'react';

// A simple function to format date strings
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

function Card({ asset, onDelete }) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{asset.name}</h3>
        {onDelete && (
          <button className="delete-btn" onClick={() => onDelete(asset.id)}>
            &times;
          </button>
        )}
      </div>
      <div className="card-body">
        {/* Check for properties before rendering them */}
        {asset.purchase_date && <p><strong>Purchase Date:</strong> {formatDate(asset.purchase_date)}</p>}
        {asset.cost && <p><strong>Cost:</strong> ₹{asset.cost}</p>}
        {asset.description && <p><strong>Description:</strong> {asset.description}</p>}
        {asset.service_date && <p><strong>Next Service:</strong> {formatDate(asset.service_date)}</p>}
        {asset.warranty_expiry && <p><strong>Warranty Expiry:</strong> {formatDate(asset.warranty_expiry)}</p>}
        {asset.expenses && <p><strong>Expenses:</strong> ₹{asset.expenses}</p>}
      </div>
    </div>
  );
}

export default Card;