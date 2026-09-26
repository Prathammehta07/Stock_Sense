import React, { useState } from 'react';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';
import { Save, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  const [companyName, setCompanyName] = useState('StockSense Logistics Inc.');
  const [currency, setCurrency] = useState('USD');
  const [autoReorderAlerts, setAutoReorderAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="animate-fade-in">
      <Header title="System Settings" subtitle="Configure inventory thresholds, notifications, and company profile" />

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '700px' }}>
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database size={20} color="var(--primary)" /> Company Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Company Legal Name
              </label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} style={{ width: '100%' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
                Default Base Currency
              </label>
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ width: '100%' }}>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
                <option value="GBP">GBP (£) - British Pound</option>
                <option value="INR">INR (₹) - Indian Rupee</option>
              </select>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bell size={20} color="var(--warning)" /> Inventory Alerts
          </h3>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Automatic Low Stock Notifications</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Trigger top bar alert badges whenever physical stock falls below minimum reorder rules</div>
            </div>
            <input
              type="checkbox"
              checked={autoReorderAlerts}
              onChange={(e) => setAutoReorderAlerts(e.target.checked)}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Preferences
          </Button>
          {saved && <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: '0.875rem' }}>✓ Settings updated!</span>}
        </div>
      </form>
    </div>
  );
};

export default Settings;
