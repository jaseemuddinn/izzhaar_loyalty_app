import { useState } from 'react';

const LoyaltyConfigForm = () => {
  const [discountTiers, setDiscountTiers] = useState([{ minPoints: 0, discount: 0 }]);
  
  const handleAddTier = () => {
    setDiscountTiers([...discountTiers, { minPoints: 0, discount: 0 }]);
  };

  const handleChange = (index, field, value) => {
    const newTiers = [...discountTiers];
    newTiers[index][field] = value;
    setDiscountTiers(newTiers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit the discount tiers to the server
    console.log('Submitting discount tiers:', discountTiers);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Configure Loyalty Program</h2>
      {discountTiers.map((tier, index) => (
        <div key={index} className="flex space-x-2">
          <input
            type="number"
            placeholder="Min Points"
            value={tier.minPoints}
            onChange={(e) => handleChange(index, 'minPoints', e.target.value)}
            className="border rounded p-2"
          />
          <input
            type="number"
            placeholder="Discount (%)"
            value={tier.discount}
            onChange={(e) => handleChange(index, 'discount', e.target.value)}
            className="border rounded p-2"
          />
        </div>
      ))}
      <button type="button" onClick={handleAddTier} className="text-blue-500">
        Add Discount Tier
      </button>
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Save Settings
      </button>
    </form>
  );
};

export default LoyaltyConfigForm;