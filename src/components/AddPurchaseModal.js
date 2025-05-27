import React, { useState } from 'react';

const AddPurchaseModal = ({ open, onClose, onAdd, loading, customer }) => {
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [error, setError] = useState('');
    const [redeemChecked, setRedeemChecked] = useState(false);
    const [redeemAmount, setRedeemAmount] = useState('');

    const maxCredits = customer?.loyaltyPoints ?? 0;
    const canRedeem = maxCredits > 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError('Please enter a valid amount.');
            return;
        }
        if (redeemChecked) {
            if (!redeemAmount || isNaN(redeemAmount) || Number(redeemAmount) <= 0) {
                setError('Please enter a valid credits amount to redeem.');
                return;
            }
            if (Number(redeemAmount) > maxCredits) {
                setError('Cannot redeem more credits than available.');
                return;
            }
        }
        onAdd(Number(amount), note, redeemChecked ? Number(redeemAmount) : 0);
        setAmount('');
        setNote('');
        setRedeemChecked(false);
        setRedeemAmount('');
    };

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative mx-2 sm:mx-auto">
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
                        className="border p-2 rounded w-full"
                        required
                    />
                    <textarea
                        placeholder="Note (optional)"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        className="border p-2 rounded w-full"
                        rows={2}
                    />
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="redeemCredits"
                            checked={redeemChecked}
                            onChange={e => setRedeemChecked(e.target.checked)}
                            disabled={!canRedeem}
                        />
                        <label htmlFor="redeemCredits" className="text-sm">
                            Redeem credits/points for this purchase
                        </label>
                    </div>
                    {canRedeem ? (
                        <span className="ml-2 text-sm text-right text-green-500">(Available: {maxCredits})</span>
                    ) : (
                        <span className="ml-2 text-sm text-right text-red-500">(No credits available)</span>
                    )}
                    {redeemChecked && (
                        <input
                            type="number"
                            min={canRedeem ? 1 : 0}
                            max={maxCredits}
                            step="1"
                            placeholder={`Credits to Redeem (max ${maxCredits})`}
                            value={redeemAmount}
                            onChange={e => setRedeemAmount(e.target.value)}
                            className="border p-2 rounded w-full"
                            disabled={!canRedeem}
                        />
                    )}
                    {error && <div className="text-red-500 text-sm">{error}</div>}
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Purchase'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPurchaseModal;
