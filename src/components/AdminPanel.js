'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import CustomerDetailsModal from './CustomerDetailsModal';
import AddPurchaseModal from './AddPurchaseModal';

const AdminPanel = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    purchaseAmount: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [searchField, setSearchField] = useState('phone');
  const [searching, setSearching] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addPurchaseOpen, setAddPurchaseOpen] = useState(false);
  const [addPurchaseLoading, setAddPurchaseLoading] = useState(false);
  const [addPurchaseSuccess, setAddPurchaseSuccess] = useState('');
  const [addPurchaseError, setAddPurchaseError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get(`/api/customers?page=${page}&pageSize=${pageSize}`);
        setCustomers(response.data.customers || []);
        setTotalPages(response.data.totalPages || 1);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [page, pageSize]);

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(`/api/customers?id=${id}`);
      setCustomers(customers.filter(customer => customer._id !== id));
      toast.success('Customer deleted successfully!');
    } catch (err) {
      setError(err.message);
      toast.error('Failed to delete customer.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const res = await axios.post('/api/customers', {
        name: form.name,
        phone: form.phone,
        email: form.email,
        purchaseAmount: Number(form.purchaseAmount),
      });
      // setFormSuccess('Customer added successfully!');
      setForm({ name: '', phone: '', email: '', purchaseAmount: '' });
      // Refresh customer list with correct pagination
      const response = await axios.get(`/api/customers?page=${page}&pageSize=${pageSize}`);
      setCustomers(response.data.customers || []);
      setTotalPages(response.data.totalPages || 1);
      toast.success('Customer added successfully!');
    } catch (err) {
      setFormError(err.response?.data || err.message);
      toast.error('Failed to add customer.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchFieldChange = (e) => {
    setSearchField(e.target.value);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    setError(null);
    try {
      const response = await axios.get(`/api/customers?field=${searchField}&q=${encodeURIComponent(search)}&page=1&pageSize=${pageSize}`);
      setCustomers(response.data.customers || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(1);
    } catch (err) {
      setError('No customer found.');
      setCustomers([]);
    } finally {
      setSearching(false);
    }
  };

  const handleClearSearch = async () => {
    setSearch('');
    setSearching(true);
    setError(null);
    try {
      const response = await axios.get(`/api/customers?page=1&pageSize=${pageSize}`);
      setCustomers(response.data.customers || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));
  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const handleRowClick = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleAddPurchaseClick = (customer) => {
    setSelectedCustomer(customer);
    setAddPurchaseOpen(true);
    setAddPurchaseSuccess('');
    setAddPurchaseError('');
  };

  const handleAddPurchaseClose = () => {
    setAddPurchaseOpen(false);
    setSelectedCustomer(null);
  };

  // Update a single customer in the customers array
  const updateCustomerInList = (updatedCustomer) => {
    if (updatedCustomer._deleted) {
      setCustomers((prev) => prev.filter(c => c._id !== updatedCustomer._id));
    } else {
      setCustomers((prev) => prev.map(c => c._id === updatedCustomer._id ? updatedCustomer : c));
    }
  };

  const handleAddPurchase = async (amount, note, redeemAmount = 0) => {
    setAddPurchaseLoading(true);
    setAddPurchaseError('');
    setAddPurchaseSuccess('');
    try {
      const res = await axios.patch('/api/customers', {
        customerId: selectedCustomer._id,
        amount,
        note,
        redeemAmount, // Pass redeemAmount to backend
      });
      if (res.data && res.data.customer) {
        updateCustomerInList(res.data.customer);
        setSelectedCustomer(res.data.customer);
      }
      toast.success('Purchase added successfully!');
      setAddPurchaseOpen(false);
    } catch (err) {
      setAddPurchaseError(err.response?.data || err.message);
      toast.error('Failed to add purchase.');
    } finally {
      setAddPurchaseLoading(false);
    }
  };

  // Ensure customers is always an array
  const safeCustomers = Array.isArray(customers) ? customers : [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="admin-panel px-2 sm:px-4 max-w-full">
      {/* <h1 className="text-2xl font-bold">Admin Panel</h1> */}
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 w-full sm:w-auto"
        onClick={() => setShowAddForm((prev) => !prev)}
      >
        {showAddForm ? 'Hide Add Customer Form' : 'Add New Customer'}
      </button>
      {showAddForm && (
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-2 max-w-md mb-6 w-full mx-auto">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleFormChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleFormChange}
            required
            className="border p-2 rounded w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Email (optional)"
            value={form.email}
            onChange={handleFormChange}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            name="purchaseAmount"
            placeholder="Bill Amount"
            value={form.purchaseAmount}
            onChange={handleFormChange}
            required
            className="border p-2 rounded w-full"
            min="0"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full" disabled={formLoading}>
            {formLoading ? 'Adding...' : 'Add Customer'}
          </button>
          {formError && <div className="text-red-500">{formError}</div>}
          {formSuccess && <div className="text-green-600">{formSuccess}</div>}
        </form>
      )}
      <h2 className="text-xl mt-4">Customer Management</h2>
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mb-4 max-w-md w-full mx-auto">
        <select value={searchField} onChange={handleSearchFieldChange} className="border p-2 rounded w-full sm:w-auto">
          <option value="name">Name</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
        </select>
        <input
          type="text"
          placeholder={`Search by ${searchField}`}
          value={search}
          onChange={handleSearchChange}
          className="border p-2 rounded flex-1"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full sm:w-auto" disabled={searching}>
          {searching ? 'Searching...' : 'Search'}
        </button>
        {search && (
          <button type="button" onClick={handleClearSearch} className="bg-gray-300 text-gray-800 px-4 py-2 rounded w-full sm:w-auto">
            Clear
          </button>
        )}
      </form>
      {/* Responsive Table */}
      <div className="overflow-x-auto w-full">
        <table className="min-w-full mt-4 border border-gray-300 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-2 text-left whitespace-nowrap">ID</th>
              <th className="border px-2 py-2 text-left whitespace-nowrap">Name</th>
              <th className="border px-2 py-2 text-left whitespace-nowrap">Email</th>
              <th className="border px-2 py-2 text-left whitespace-nowrap">Phone</th>
              <th className="border px-2 py-2 text-left whitespace-nowrap">Credits</th>
              <th className="border px-2 py-2 text-left whitespace-nowrap">Total Purchases</th>
              <th className="border px-2 py-2 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {safeCustomers.map(customer => (
              <tr
                key={customer._id}
                className="even:bg-gray-50 cursor-pointer hover:bg-blue-50"
                onClick={() => handleRowClick(customer)}
              >
                <td className="border px-2 py-2 font-mono text-xs max-w-[100px] truncate">{customer._id}</td>
                <td className="border px-2 py-2 max-w-[120px] truncate">{customer.name}</td>
                <td className="border px-2 py-2 max-w-[120px] truncate">{customer.email || '-'}</td>
                <td className="border px-2 py-2 max-w-[100px] truncate">{customer.phone || '-'}</td>
                <td className="border px-2 py-2">{customer.loyaltyPoints ?? 0}</td>
                <td className="border px-2 py-2">{Array.isArray(customer.purchaseHistory) ? customer.purchaseHistory.length : 0}</td>
                <td className="border px-2 py-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                    onClick={e => { e.stopPropagation(); handleAddPurchaseClick(customer); }}
                  >
                    Add Purchase
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-2 my-4 w-full justify-between">
        <div className="flex gap-2">
          <button onClick={handlePrevPage} disabled={page === 1} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto">Prev</button>
          <button onClick={handleNextPage} disabled={page === totalPages} className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 w-full sm:w-auto">Next</button>
        </div>
        <span className="text-sm">Page {page} of {totalPages}</span>
        <select value={pageSize} onChange={handlePageSizeChange} className="border p-1 rounded w-full sm:w-auto max-w-[120px]">
          {[5, 10, 20, 50].map(size => (
            <option key={size} value={size}>{size} / page</option>
          ))}
        </select>
      </div>
      <CustomerDetailsModal
        customer={selectedCustomer}
        open={modalOpen}
        onClose={handleCloseModal}
        onCustomerUpdate={updateCustomerInList}
      />
      <AddPurchaseModal open={addPurchaseOpen} onClose={handleAddPurchaseClose} onAdd={handleAddPurchase} loading={addPurchaseLoading} customer={selectedCustomer} />
      {addPurchaseError && <div className="text-red-500 mt-2">{addPurchaseError}</div>}
      {addPurchaseSuccess && <div className="text-green-600 mt-2">{addPurchaseSuccess}</div>}
    </div>
  );
};

export default AdminPanel;