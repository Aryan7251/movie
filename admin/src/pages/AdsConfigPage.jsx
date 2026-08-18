import React, { useState, useEffect } from 'react';
import { MonitorPlay, Save, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { adsService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdsConfigPage.css';

const AdsConfigPage = () => {
  const [config, setConfig] = useState({
    appOpen: {
      enabled: true,
      adUnitId: 'demo-app-open-ad',
      displayDuration: 5,
      imageUrl: '/ads/app-open-placeholder.svg',
      clickUrl: '#',
      title: 'Advertisement'
    },
    preRoll: {
      enabled: true,
      adUnitId: 'demo-pre-roll-ad',
      displayDuration: 5,
      imageUrl: '/ads/pre-roll-placeholder.svg',
      clickUrl: '#',
      title: 'Your ad here'
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await adsService.getAdsConfig();
      if (res) {
        setConfig({
          appOpen: {
            enabled: res.appOpen?.enabled ?? true,
            adUnitId: res.appOpen?.adUnitId || 'demo-app-open-ad',
            displayDuration: res.appOpen?.displayDuration || 5,
            imageUrl: res.appOpen?.imageUrl || '/ads/app-open-placeholder.svg',
            clickUrl: res.appOpen?.clickUrl || '#',
            title: res.appOpen?.title || 'Advertisement'
          },
          preRoll: {
            enabled: res.preRoll?.enabled ?? true,
            adUnitId: res.preRoll?.adUnitId || 'demo-pre-roll-ad',
            displayDuration: res.preRoll?.displayDuration || 5,
            imageUrl: res.preRoll?.imageUrl || '/ads/pre-roll-placeholder.svg',
            clickUrl: res.preRoll?.clickUrl || '#',
            title: res.preRoll?.title || 'Your ad here'
          }
        });
      }
    } catch (err) {
      addToast('error', 'Failed to load ad configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adsService.updateAdsConfig(config);
      addToast('success', 'Ad configuration saved successfully!');
    } catch (err) {
      addToast('error', 'Failed to update ad configuration');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;

  return (
    <div className="ads-config-page">
      <div className="ads-config-header">
        <div>
          <h2>Advertisement Configuration</h2>
          <p className="subtitle">Configure and manage user-facing advertising placements on HubPlays.</p>
        </div>
        <button type="button" className="btn-refresh" onClick={fetchConfig} disabled={saving}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="config-grid">
          {/* App Open Ad Card */}
          <div className="config-card">
            <div className="card-header">
              <div className="card-header-left">
                <MonitorPlay size={20} className="card-icon" />
                <h3>App-Open Advertisement</h3>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={config.appOpen.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      appOpen: { ...prev.appOpen, enabled: e.target.checked }
                    }))
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="card-body">
              <p className="card-desc">
                Shown to visitors upon launching HubPlays. Automatically dismissed or skippable after duration.
              </p>

              <div className="form-group">
                <label>Status</label>
                <div className={`status-pill ${config.appOpen.enabled ? 'active' : 'inactive'}`}>
                  {config.appOpen.enabled ? 'Active / Enabled' : 'Disabled'}
                </div>
              </div>

              <div className="form-group">
                <label>Ad Unit ID</label>
                <input
                  type="text"
                  value={config.appOpen.adUnitId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      appOpen: { ...prev.appOpen, adUnitId: e.target.value }
                    }))
                  }
                  placeholder="e.g. ca-app-pub-xxx/yyy"
                />
              </div>

              <div className="form-group">
                <label>Display Duration (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.appOpen.displayDuration}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      appOpen: { ...prev.appOpen, displayDuration: parseInt(e.target.value) || 5 }
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Headline / Title</label>
                <input
                  type="text"
                  value={config.appOpen.title}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      appOpen: { ...prev.appOpen, title: e.target.value }
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Click URL (Optional)</label>
                <input
                  type="text"
                  value={config.appOpen.clickUrl}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      appOpen: { ...prev.appOpen, clickUrl: e.target.value }
                    }))
                  }
                  placeholder="https://sponsor-website.com"
                />
              </div>
            </div>
          </div>

          {/* Pre-Roll Ad Card */}
          <div className="config-card">
            <div className="card-header">
              <div className="card-header-left">
                <MonitorPlay size={20} className="card-icon" />
                <h3>Pre-Roll Video Advertisement</h3>
              </div>
              <label className="switch-toggle">
                <input
                  type="checkbox"
                  checked={config.preRoll.enabled}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      preRoll: { ...prev.preRoll, enabled: e.target.checked }
                    }))
                  }
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="card-body">
              <p className="card-desc">
                Plays immediately before a movie or video begins streaming. Skippable after countdown.
              </p>

              <div className="form-group">
                <label>Status</label>
                <div className={`status-pill ${config.preRoll.enabled ? 'active' : 'inactive'}`}>
                  {config.preRoll.enabled ? 'Active / Enabled' : 'Disabled'}
                </div>
              </div>

              <div className="form-group">
                <label>Ad Unit ID</label>
                <input
                  type="text"
                  value={config.preRoll.adUnitId}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      preRoll: { ...prev.preRoll, adUnitId: e.target.value }
                    }))
                  }
                  placeholder="e.g. ca-video-pub-xxx/yyy"
                />
              </div>

              <div className="form-group">
                <label>Display Duration (seconds)</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={config.preRoll.displayDuration}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      preRoll: { ...prev.preRoll, displayDuration: parseInt(e.target.value) || 5 }
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Headline / Title</label>
                <input
                  type="text"
                  value={config.preRoll.title}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      preRoll: { ...prev.preRoll, title: e.target.value }
                    }))
                  }
                />
              </div>

              <div className="form-group">
                <label>Click URL (Optional)</label>
                <input
                  type="text"
                  value={config.preRoll.clickUrl}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      preRoll: { ...prev.preRoll, clickUrl: e.target.value }
                    }))
                  }
                  placeholder="https://sponsor-website.com"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-submit-bar">
          <button type="submit" className="btn btn-primary save-btn" disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'Saving Changes...' : 'Save Ad Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdsConfigPage;
