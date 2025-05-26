import { useState } from 'react';

export default function CustomerJourney() {
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    purchaseAmount: '',
    customerType: 'first-time', // 'first-time' or 'returning'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerData({ ...customerData, [name]: value });
  };

  const handleTypeChange = (type) => {
    setCustomerData({ ...customerData, customerType: type });
    setResult(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      if (customerData.customerType === 'first-time') {
        // Add new customer
        const res = await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerData.name,
            phone: customerData.phone,
            email: customerData.email,
            purchaseAmount: Number(customerData.purchaseAmount),
          }),
        });
        if (!res.ok) throw new Error('Failed to add customer');
        const data = await res.json();
        setResult({
          message: 'Customer added successfully!',
          points: data.loyaltyPoints,
          customer: data,
        });
      } else {
        // Returning customer: search by phone or email
        const res = await fetch(`/api/customers?phone=${customerData.phone}&email=${customerData.email}`);
        if (!res.ok) throw new Error('Customer not found');
        const data = await res.json();
        setResult({
          message: 'Customer found!',
          points: data.loyaltyPoints,
          customer: data,
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-journey">
      <h2 className="text-2xl font-bold mb-4">Customer Journey</h2>
      <div className="flex gap-4 mb-4">
        <button
          type="button"
          className={`p-2 rounded ${customerData.customerType === 'first-time' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTypeChange('first-time')}
        >
          First-Time Customer
        </button>
        <button
          type="button"
          className={`p-2 rounded ${customerData.customerType === 'returning' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTypeChange('returning')}
        >
          Returning Customer
        </button>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={customerData.name}
          onChange={handleInputChange}
          required={customerData.customerType === 'first-time'}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={customerData.phone}
          onChange={handleInputChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email (optional)"
          value={customerData.email}
          onChange={handleInputChange}
          className="border p-2 rounded"
        />
        {customerData.customerType === 'first-time' && (
          <input
            type="number"
            name="purchaseAmount"
            placeholder="Total Purchase Amount"
            value={customerData.purchaseAmount}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
            min="0"
          />
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
          {loading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
      {result && (
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold mb-2">{result.message}</div>
          <div>Name: {result.customer.name}</div>
          <div>Phone: {result.customer.phone}</div>
          <div>Email: {result.customer.email || 'N/A'}</div>
          {typeof result.points !== 'undefined' && (
            <div>Loyalty Points: {result.points}</div>
          )}
        </div>
      )}
    </div>
  );
}