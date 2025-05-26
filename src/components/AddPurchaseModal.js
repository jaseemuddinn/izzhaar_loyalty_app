import React, { useState } from 'react';

const AddPurchaseModal = ({ open, onClose, onAdd, loading }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        onAdd(Number(amount), note);
        setAmount('');
        setNote('');
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl"
                    onClick={onClose}
                    aria-label="Close"
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-4">Add Purchase</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="Purchase Amount (₹)"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="border p-2 rounded"
                        required
                    />
                    <textarea
                        placeholder="Note (optional)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="border p-2 rounded"
                        rows={2}
                    />
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Purchase'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPurchaseModal;
