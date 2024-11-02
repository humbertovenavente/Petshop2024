import React, { useState } from 'react';
import Header from './header';
import Footer from './footer';
import { shippingConfig, setShippingConfig } from './shipping';

function AdminShippingConfig() {
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(shippingConfig.freeShippingThreshold);
  const [shippingCost, setShippingCost] = useState(shippingConfig.shippingCost);

  const handleSaveConfig = () => {
    setShippingConfig({ freeShippingThreshold, shippingCost });
    alert("Shipping configuration updated successfully!");
  };

  return (
    <div  id="root">
      <Header />
      <main className="container my-5">
        <h2>Shipping Configuration</h2>
        <div className="mb-3">
          <label>
            Free Shipping Threshold:
            <input
              type="number"
              value={freeShippingThreshold}
              onChange={(e) => setFreeShippingThreshold(parseFloat(e.target.value))}
              className="form-control"
            />
          </label>
        </div>
        
        <div className="mb-3">
          <label>
            Shipping Cost:
            <input
              type="number"
              value={shippingCost}
              onChange={(e) => setShippingCost(parseFloat(e.target.value))}
              className="form-control"
            />
          </label>
        </div>
        
        <button onClick={handleSaveConfig} className="btn btn-primary">
          Save Configuration
        </button>
      </main>
      <Footer /> 
    </div>
  );
}

export default AdminShippingConfig;
