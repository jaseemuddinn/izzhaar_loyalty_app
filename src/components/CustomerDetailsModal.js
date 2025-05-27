import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AddPurchaseModal from './AddPurchaseModal';

const CustomerDetailsModal = ({ customer, open, onClose, onCustomerUpdate }) => {
    const [addPurchaseOpen, setAddPurchaseOpen] = useState(false);
    const [addPurchaseLoading, setAddPurchaseLoading] = useState(false);
    const [addPurchaseSuccess, setAddPurchaseSuccess] = useState('');
    const [addPurchaseError, setAddPurchaseError] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '', phone: '' });
    const [editLoading, setEditLoading] = useState(false);
    const [editError, setEditError] = useState('');
    const [editSuccess, setEditSuccess] = useState('');
    const [addNoteOpen, setAddNoteOpen] = useState(false);
    const [note, setNote] = useState('');
    const [noteLoading, setNoteLoading] = useState(false);
    const [noteError, setNoteError] = useState('');
    const [noteSuccess, setNoteSuccess] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Keep a local customer state to reflect updates immediately in the modal
    const [localCustomer, setLocalCustomer] = useState(customer);

    React.useEffect(() => {
        setLocalCustomer(customer);
    }, [customer]);

    React.useEffect(() => {
        if (customer) {
            setEditData({ name: customer.name || '', email: customer.email || '', phone: customer.phone || '' });
        }
    }, [customer]);

    // Update modal fields when customer prop changes (after update)
    React.useEffect(() => {
        if (localCustomer && !editMode) {
            setEditData({ name: localCustomer.name || '', email: localCustomer.email || '', phone: localCustomer.phone || '' });
        }
    }, [localCustomer, editMode]);

    if (!open || !localCustomer) return null;

    const handleAddPurchaseClick = () => {
        setAddPurchaseOpen(true);
        setAddPurchaseSuccess('');
        setAddPurchaseError('');
    };

    const handleAddPurchaseClose = () => {
        setAddPurchaseOpen(false);
    };

    const handleAddPurchase = async (amount, note, redeemAmount = 0) => {
        setAddPurchaseLoading(true);
        setAddPurchaseError('');
        setAddPurchaseSuccess('');
        try {
            const res = await axios.patch('/api/customers', {
                customerId: localCustomer._id,
                amount,
                note,
                redeemAmount, // Pass redeemAmount to backend
            });
            setAddPurchaseSuccess('Purchase added successfully!');
            if (res.data && res.data.customer && onCustomerUpdate) {
                onCustomerUpdate(res.data.customer);
                setLocalCustomer(res.data.customer);
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

    const handleEditClick = () => {
        setEditMode(true);
        setEditError('');
        setEditSuccess('');
    };

    const handleEditCancel = () => {
        setEditMode(false);
        setEditError('');
        setEditSuccess('');
        setEditData({ name: customer.name, email: customer.email, phone: customer.phone });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData({ ...editData, [name]: value });
    };

    // After successful update, update modal fields
    const handleEditSave = async () => {
        setEditLoading(true);
        setEditError('');
        setEditSuccess('');
        try {
            const res = await axios.put('/api/customers', { customerId: localCustomer._id, ...editData });
            setEditSuccess('Customer updated!');
            if (res.data && res.data.customer && onCustomerUpdate) {
                onCustomerUpdate(res.data.customer);
                setLocalCustomer(res.data.customer);
                setEditData({
                    name: res.data.customer.name || '',
                    email: res.data.customer.email || '',
                    phone: res.data.customer.phone || ''
                });
            }
            toast.success('Customer updated!');
            setEditMode(false);
        } catch (err) {
            setEditError(err.response?.data || err.message);
            toast.error('Failed to update customer.');
        } finally {
            setEditLoading(false);
        }
    };

    const handleAddNoteClick = () => {
        setAddNoteOpen(true);
        setNote('');
        setNoteError('');
        setNoteSuccess('');
    };

    const handleAddNoteSave = async () => {
        setNoteLoading(true);
        setNoteError('');
        setNoteSuccess('');
        try {
            const res = await axios.patch('/api/customers', { customerId: localCustomer._id, note, addNote: true });
            setNoteSuccess('Note added!');
            if (res.data && res.data.customer && onCustomerUpdate) {
                onCustomerUpdate(res.data.customer);
                setLocalCustomer(res.data.customer);
            } else {
                // If backend does not return updated customer, update localCustomer manually
                setLocalCustomer(prev => ({ ...prev, notes: note }));
            }
            toast.success('Note added!');
            setAddNoteOpen(false);
        } catch (err) {
            setNoteError(err.response?.data || err.message);
            toast.error('Failed to add note.');
        } finally {
            setNoteLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 ">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl relative mx-2 sm:mx-auto overflow-y-auto max-h-[90vh]">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-2xl font-bold mb-2">Customer Details</h2>
                <div className="mb-2"><span className="font-semibold">Name:</span> {localCustomer.name}</div>
                <div className="mb-2"><span className="font-semibold">Email:</span> {localCustomer.email || '-'}</div>
                <div className="mb-2"><span className="font-semibold">Phone:</span> {localCustomer.phone || '-'}</div>
                <div className="mb-2"><span className="font-semibold">Credits:</span> {localCustomer.loyaltyPoints ?? 0}</div>
                <div className="mb-2"><span className="font-semibold">Tags:</span> {localCustomer.tags?.join(', ') || '-'}</div>
                <div className="mb-2"><span className="font-semibold">Notes:</span> {localCustomer.notes || '-'}</div>
                <div className="mb-2"><span className="font-semibold">Created At:</span> {localCustomer.createdAt ? new Date(localCustomer.createdAt).toLocaleString() : '-'}</div>
                <div className="mb-4">
                    <span className="font-semibold">Purchase History:</span>
                    <ul className="list-disc ml-6 mt-1 max-h-40 overflow-y-auto pr-2">
                        {localCustomer.purchaseHistory && localCustomer.purchaseHistory.length > 0 ? (
                            localCustomer.purchaseHistory.map((t, idx) => (
                                <li key={idx} className="text-sm">
                                    {t.date ? new Date(t.date).toLocaleDateString() : '-'}: ₹{t.amount} {t.pointsEarned ? `- ${t.pointsEarned} pts (${t.note || ""}) ` : ''}
                                    {t.creditsRedeemed ? (
                                        <span className="text-blue-600 ml-2">(used {t.creditsRedeemed} credits)</span>
                                    ) : null}
                                </li>
                            ))
                        ) : (
                            <li className="text-sm">No purchases yet.</li>
                        )}
                    </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button className="bg-red-600 text-white px-3 py-1 rounded w-full sm:w-auto" onClick={() => setShowDeleteConfirm(true)}>
                        Delete
                    </button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded w-full sm:w-auto" onClick={handleEditClick}>
                        Edit
                    </button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded w-full sm:w-auto" onClick={handleAddNoteClick}>
                        Add Note
                    </button>
                </div>
                {showDeleteConfirm && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
                            <div className="mb-4 text-lg font-semibold">Are you sure you want to delete this customer?</div>
                            <div className="flex gap-4 justify-center">
                                <button
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={async () => {
                                        try {
                                            await axios.delete(`/api/customers?id=${customer._id}`);
                                            toast.success('Customer deleted successfully!');
                                            if (onCustomerUpdate) onCustomerUpdate({ ...customer, _deleted: true });
                                            onClose();
                                        } catch (err) {
                                            setAddPurchaseError('Failed to delete customer.');
                                            toast.error('Failed to delete customer.');
                                        }
                                    }}
                                >
                                    Yes, Delete
                                </button>
                                <button
                                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                                    onClick={() => setShowDeleteConfirm(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {editMode && (
                    <div className="mt-4 p-4 border rounded bg-yellow-50">
                        <h3 className="font-bold mb-2">Edit Customer</h3>
                        <input
                            type="text"
                            name="name"
                            value={editData.name}
                            onChange={handleEditChange}
                            className="border p-2 rounded mb-2 w-full"
                            placeholder="Name"
                        />
                        <input
                            type="email"
                            name="email"
                            value={editData.email}
                            onChange={handleEditChange}
                            className="border p-2 rounded mb-2 w-full"
                            placeholder="Email"
                        />
                        <input
                            type="text"
                            name="phone"
                            value={editData.phone}
                            onChange={handleEditChange}
                            className="border p-2 rounded mb-2 w-full"
                            placeholder="Phone"
                        />
                        <div className="flex gap-2 mt-2">
                            <button className="bg-blue-500 text-white px-3 py-1 rounded" onClick={handleEditSave} disabled={editLoading}>
                                {editLoading ? 'Saving...' : 'Save'}
                            </button>
                            <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={handleEditCancel}>
                                Cancel
                            </button>
                        </div>
                        {editError && <div className="text-red-500 mt-2">{editError}</div>}
                        {editSuccess && <div className="text-green-600 mt-2">{editSuccess}</div>}
                    </div>
                )}
                {addNoteOpen && (
                    <div className="mt-4 p-4 border rounded bg-green-50">
                        <h3 className="font-bold mb-2">Add Note</h3>
                        <textarea
                            value={note}
                            onChange={e => setNote(e.target.value)}
                            className="border p-2 rounded mb-2 w-full"
                            rows={2}
                            placeholder="Enter note..."
                        />
                        <div className="flex gap-2 mt-2">
                            <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={handleAddNoteSave} disabled={noteLoading}>
                                {noteLoading ? 'Saving...' : 'Save Note'}
                            </button>
                            <button className="bg-gray-300 text-gray-800 px-3 py-1 rounded" onClick={() => setAddNoteOpen(false)}>
                                Cancel
                            </button>
                        </div>
                        {noteError && <div className="text-red-500 mt-2">{noteError}</div>}
                        {noteSuccess && <div className="text-green-600 mt-2">{noteSuccess}</div>}
                    </div>
                )}
                <AddPurchaseModal open={addPurchaseOpen} onClose={handleAddPurchaseClose} onAdd={handleAddPurchase} loading={addPurchaseLoading} customer={localCustomer} />
                {addPurchaseError && <div className="text-red-500 mt-2">{addPurchaseError}</div>}
                {addPurchaseSuccess && <div className="text-green-600 mt-2">{addPurchaseSuccess}</div>}
            </div>
        </div>
    );
};

export default CustomerDetailsModal;
