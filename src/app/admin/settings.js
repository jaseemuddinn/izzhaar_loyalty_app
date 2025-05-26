import React, { useState, useEffect } from 'react';
import LoyaltyConfigForm from '@/components/LoyaltyConfigForm';
import { fetchSettings, updateSettings } from '@/lib/api';

export default function Settings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await fetchSettings();
        setSettings(data);
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdate = async (newSettings) => {
    try {
      await updateSettings(newSettings);
      setSettings(newSettings);
    } catch (err) {
      setError('Failed to update settings');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Loyalty Program Settings</h1>
      <LoyaltyConfigForm settings={settings} onUpdate={handleUpdate} />
    </div>
  );
}