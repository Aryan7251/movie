import React, { useState, useEffect } from 'react';
import { 
  MonitorPlay, 
  Save, 
  RefreshCw, 
  Code2, 
  Image as ImageIcon, 
  Globe, 
  Sparkles, 
  Layers, 
  Eye, 
  CheckCircle2, 
  Play,
  HelpCircle 
} from 'lucide-react';
import { adsService } from '../services/api';
import { useToast } from '../context/ToastContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdsConfigPage.css';

const DEFAULT_CONFIG = {
  globalScript: {
    enabled: false,
    code: ''
  },
  appOpen: {
    enabled: true,
    mode: 'banner', // 'banner' or 'custom_code'
    customCode: '',
    adUnitId: 'demo-app-open-ad',
    displayDuration: 5,
    imageUrl: '/ads/app-open-placeholder.svg',
    clickUrl: '#',
    title: 'Advertisement'
  },
  preRoll: {
    enabled: true,
    mode: 'banner', // 'banner' or 'custom_code'
    customCode: '',
    adUnitId: 'demo-pre-roll-ad',
    displayDuration: 5,
    imageUrl: '/ads/pre-roll-placeholder.svg',
    clickUrl: '#',
    title: 'Your ad here'
  },
  bannerHeader: {
    enabled: false,
    mode: 'custom_code', // 'banner' or 'custom_code'
    customCode: '',
    imageUrl: '',
    clickUrl: '#',
    title: ''
  },
  bannerWatchPage: {
    enabled: false,
    mode: 'custom_code', // 'banner' or 'custom_code'
    customCode: '',
    imageUrl: '',
    clickUrl: '#',
    title: ''
  }
};

const PRESET_SCRIPTS = {
  adsense: `<!-- Google AdSense Auto Ads -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>`,
  adsterra: `<!-- Adsterra Banner/Popunder Tag -->\n<script type="text/javascript" src="//www.topcreativeformat.com/YOUR_ZONE_KEY/invoke.js"></script>`,
  monetag: `<!-- Monetag In-Page Push / MultiTag -->\n<script src="https://alwingulla.com/88/tag.min.js" data-zone="YOUR_ZONE_ID" async data-cfasync="false"></script>`,
  popads: `<!-- PopAds Popunder Script -->\n<script type="text/javascript" src="//c1.popads.net/pop.js"></script>`
};

const AdsConfigPage = () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'global', 'appOpen', 'preRoll', 'banners'
  const [previewSlot, setPreviewSlot] = useState(null);
  const { addToast } = useToast();

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const res = await adsService.getAdsConfig();
      if (res) {
        setConfig({
          globalScript: {
            enabled: res.globalScript?.enabled ?? false,
            code: res.globalScript?.code || ''
          },
          appOpen: {
            enabled: res.appOpen?.enabled ?? true,
            mode: res.appOpen?.mode || 'banner',
            customCode: res.appOpen?.customCode || '',
            adUnitId: res.appOpen?.adUnitId || 'demo-app-open-ad',
            displayDuration: res.appOpen?.displayDuration || 5,
            imageUrl: res.appOpen?.imageUrl || '/ads/app-open-placeholder.svg',
            clickUrl: res.appOpen?.clickUrl || '#',
            title: res.appOpen?.title || 'Advertisement'
          },
          preRoll: {
            enabled: res.preRoll?.enabled ?? true,
            mode: res.preRoll?.mode || 'banner',
            customCode: res.preRoll?.customCode || '',
            adUnitId: res.preRoll?.adUnitId || 'demo-pre-roll-ad',
            displayDuration: res.preRoll?.displayDuration || 5,
            imageUrl: res.preRoll?.imageUrl || '/ads/pre-roll-placeholder.svg',
            clickUrl: res.preRoll?.clickUrl || '#',
            title: res.preRoll?.title || 'Your ad here'
          },
          bannerHeader: {
            enabled: res.bannerHeader?.enabled ?? false,
            mode: res.bannerHeader?.mode || 'custom_code',
            customCode: res.bannerHeader?.customCode || '',
            imageUrl: res.bannerHeader?.imageUrl || '',
            clickUrl: res.bannerHeader?.clickUrl || '#',
            title: res.bannerHeader?.title || ''
          },
          bannerWatchPage: {
            enabled: res.bannerWatchPage?.enabled ?? false,
            mode: res.bannerWatchPage?.mode || 'custom_code',
            customCode: res.bannerWatchPage?.customCode || '',
            imageUrl: res.bannerWatchPage?.imageUrl || '',
            clickUrl: res.bannerWatchPage?.clickUrl || '#',
            title: res.bannerWatchPage?.title || ''
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

  const applyPreset = (presetKey) => {
    const script = PRESET_SCRIPTS[presetKey];
    if (script) {
      setConfig((prev) => ({
        ...prev,
        globalScript: {
          ...prev.globalScript,
          enabled: true,
          code: prev.globalScript.code ? `${prev.globalScript.code}\n\n${script}` : script
        }
      }));
      addToast('success', 'Preset script template added!');
    }
  };

  if (loading) return <div className="page-loader"><LoadingSpinner /></div>;

  return (
    <div className="ads-config-page">
      <div className="ads-config-header">
        <div>
          <h2>Advertisement & Monetization Hub</h2>
          <p className="subtitle">
            Integrate custom ad codes from Google AdSense, Adsterra, Monetag, PropellerAds, PopAds, or any ad provider.
          </p>
        </div>
        <button type="button" className="btn-refresh" onClick={fetchConfig} disabled={saving}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="ads-tab-nav">
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Layers size={15} /> All Ad Slots
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'global' ? 'active' : ''}`}
          onClick={() => setActiveTab('global')}
        >
          <Code2 size={15} /> Global & Head Scripts
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'appOpen' ? 'active' : ''}`}
          onClick={() => setActiveTab('appOpen')}
        >
          <Globe size={15} /> App-Open Popup
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'preRoll' ? 'active' : ''}`}
          onClick={() => setActiveTab('preRoll')}
        >
          <Play size={15} /> Pre-Roll Video
        </button>
        <button 
          type="button" 
          className={`tab-btn ${activeTab === 'banners' ? 'active' : ''}`}
          onClick={() => setActiveTab('banners')}
        >
          <MonitorPlay size={15} /> Banners (Header & Watch)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="config-grid">
          
          {/* 1. Global / Head Scripts Card */}
          {(activeTab === 'all' || activeTab === 'global') && (
            <div className="config-card full-width">
              <div className="card-header">
                <div className="card-header-left">
                  <Code2 size={20} className="card-icon accent" />
                  <div>
                    <h3>Global Head & Body Scripts (Any Ad Network)</h3>
                    <span className="card-subtitle">
                      Auto-ads, Popunders, In-Page Push, Google AdSense verification, or Adsterra scripts
                    </span>
                  </div>
                </div>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={config.globalScript.enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        globalScript: { ...prev.globalScript, enabled: e.target.checked }
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="card-body">
                <div className="presets-bar">
                  <span className="presets-label"><Sparkles size={13} /> Quick Templates:</span>
                  <button type="button" className="preset-btn" onClick={() => applyPreset('adsense')}>
                    + AdSense
                  </button>
                  <button type="button" className="preset-btn" onClick={() => applyPreset('adsterra')}>
                    + Adsterra
                  </button>
                  <button type="button" className="preset-btn" onClick={() => applyPreset('monetag')}>
                    + Monetag
                  </button>
                  <button type="button" className="preset-btn" onClick={() => applyPreset('popads')}>
                    + PopAds
                  </button>
                </div>

                <div className="form-group">
                  <label>Custom HTML / JavaScript Code (Paste full &lt;script&gt; tags here)</label>
                  <textarea
                    rows={6}
                    value={config.globalScript.code}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        globalScript: { ...prev.globalScript, code: e.target.value }
                      }))
                    }
                    placeholder="<!-- Paste your ad network script code here -->\n<script async src='https://...'></script>"
                    className="code-textarea"
                    spellCheck={false}
                  />
                  <span className="helper-text">
                    This code runs on every page across the entire website for all viewers.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 2. App Open Ad Card */}
          {(activeTab === 'all' || activeTab === 'appOpen') && (
            <div className="config-card">
              <div className="card-header">
                <div className="card-header-left">
                  <Globe size={20} className="card-icon" />
                  <div>
                    <h3>App-Open Pop-up Ad</h3>
                    <span className="card-subtitle">Shown upon opening the website</span>
                  </div>
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
                {/* Format Mode Toggle */}
                <div className="mode-toggle-group">
                  <label className="mode-label">Ad Type:</label>
                  <div className="mode-pill-group">
                    <button
                      type="button"
                      className={`mode-pill ${config.appOpen.mode === 'custom_code' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          appOpen: { ...prev.appOpen, mode: 'custom_code' }
                        }))
                      }
                    >
                      <Code2 size={13} /> Custom Code / Script
                    </button>
                    <button
                      type="button"
                      className={`mode-pill ${config.appOpen.mode === 'banner' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          appOpen: { ...prev.appOpen, mode: 'banner' }
                        }))
                      }
                    >
                      <ImageIcon size={13} /> Custom Banner Image
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Display Duration Before Skip (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={config.appOpen.displayDuration}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        appOpen: { ...prev.appOpen, displayDuration: parseInt(e.target.value) || 5 }
                      }))
                    }
                  />
                </div>

                {config.appOpen.mode === 'custom_code' ? (
                  <div className="form-group">
                    <label>Custom Ad Code (HTML / Script / Iframe / Ad Tag)</label>
                    <textarea
                      rows={5}
                      value={config.appOpen.customCode}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          appOpen: { ...prev.appOpen, customCode: e.target.value }
                        }))
                      }
                      placeholder="Paste 300x250, responsive banner, or custom iframe ad code here..."
                      className="code-textarea"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <>
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
                      <label>Banner Image URL</label>
                      <input
                        type="text"
                        value={config.appOpen.imageUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            appOpen: { ...prev.appOpen, imageUrl: e.target.value }
                          }))
                        }
                        placeholder="https://example.com/banner.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Click URL</label>
                      <input
                        type="text"
                        value={config.appOpen.clickUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            appOpen: { ...prev.appOpen, clickUrl: e.target.value }
                          }))
                        }
                        placeholder="https://sponsor.com"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 3. Pre-Roll Video Ad Card */}
          {(activeTab === 'all' || activeTab === 'preRoll') && (
            <div className="config-card">
              <div className="card-header">
                <div className="card-header-left">
                  <Play size={20} className="card-icon" />
                  <div>
                    <h3>Pre-Roll Video / Player Ad</h3>
                    <span className="card-subtitle">Plays before movies start streaming</span>
                  </div>
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
                {/* Format Mode Toggle */}
                <div className="mode-toggle-group">
                  <label className="mode-label">Ad Type:</label>
                  <div className="mode-pill-group">
                    <button
                      type="button"
                      className={`mode-pill ${config.preRoll.mode === 'custom_code' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          preRoll: { ...prev.preRoll, mode: 'custom_code' }
                        }))
                      }
                    >
                      <Code2 size={13} /> Custom Code / Script
                    </button>
                    <button
                      type="button"
                      className={`mode-pill ${config.preRoll.mode === 'banner' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          preRoll: { ...prev.preRoll, mode: 'banner' }
                        }))
                      }
                    >
                      <ImageIcon size={13} /> Custom Banner Image
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Display Duration Before Skip (seconds)</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={config.preRoll.displayDuration}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        preRoll: { ...prev.preRoll, displayDuration: parseInt(e.target.value) || 5 }
                      }))
                    }
                  />
                </div>

                {config.preRoll.mode === 'custom_code' ? (
                  <div className="form-group">
                    <label>Custom Ad Code (HTML / Script / Iframe / Video Ad Tag)</label>
                    <textarea
                      rows={5}
                      value={config.preRoll.customCode}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          preRoll: { ...prev.preRoll, customCode: e.target.value }
                        }))
                      }
                      placeholder="Paste VAST embed, HTML5 video ad tag, or iframe code..."
                      className="code-textarea"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <>
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
                      <label>Banner Image URL</label>
                      <input
                        type="text"
                        value={config.preRoll.imageUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            preRoll: { ...prev.preRoll, imageUrl: e.target.value }
                          }))
                        }
                        placeholder="https://example.com/preroll.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Click URL</label>
                      <input
                        type="text"
                        value={config.preRoll.clickUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            preRoll: { ...prev.preRoll, clickUrl: e.target.value }
                          }))
                        }
                        placeholder="https://sponsor.com"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 4. Top Header Banner Ad Card */}
          {(activeTab === 'all' || activeTab === 'banners') && (
            <div className="config-card">
              <div className="card-header">
                <div className="card-header-left">
                  <MonitorPlay size={20} className="card-icon" />
                  <div>
                    <h3>Top / Header Banner Ad</h3>
                    <span className="card-subtitle">Displayed across top of pages (728x90 / responsive)</span>
                  </div>
                </div>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={config.bannerHeader.enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        bannerHeader: { ...prev.bannerHeader, enabled: e.target.checked }
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="card-body">
                <div className="mode-toggle-group">
                  <label className="mode-label">Ad Type:</label>
                  <div className="mode-pill-group">
                    <button
                      type="button"
                      className={`mode-pill ${config.bannerHeader.mode === 'custom_code' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          bannerHeader: { ...prev.bannerHeader, mode: 'custom_code' }
                        }))
                      }
                    >
                      <Code2 size={13} /> Custom Code / Script
                    </button>
                    <button
                      type="button"
                      className={`mode-pill ${config.bannerHeader.mode === 'banner' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          bannerHeader: { ...prev.bannerHeader, mode: 'banner' }
                        }))
                      }
                    >
                      <ImageIcon size={13} /> Custom Banner Image
                    </button>
                  </div>
                </div>

                {config.bannerHeader.mode === 'custom_code' ? (
                  <div className="form-group">
                    <label>Custom Header Ad Code (AdSense unit, iframe, or banner script)</label>
                    <textarea
                      rows={5}
                      value={config.bannerHeader.customCode}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          bannerHeader: { ...prev.bannerHeader, customCode: e.target.value }
                        }))
                      }
                      placeholder="Paste 728x90, 320x50, or responsive header ad unit code..."
                      className="code-textarea"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Banner Image URL</label>
                      <input
                        type="text"
                        value={config.bannerHeader.imageUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            bannerHeader: { ...prev.bannerHeader, imageUrl: e.target.value }
                          }))
                        }
                        placeholder="https://example.com/header-banner.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Click URL</label>
                      <input
                        type="text"
                        value={config.bannerHeader.clickUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            bannerHeader: { ...prev.bannerHeader, clickUrl: e.target.value }
                          }))
                        }
                        placeholder="https://sponsor.com"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 5. Watch Page Banner Ad Card */}
          {(activeTab === 'all' || activeTab === 'banners') && (
            <div className="config-card">
              <div className="card-header">
                <div className="card-header-left">
                  <MonitorPlay size={20} className="card-icon" />
                  <div>
                    <h3>Watch Page In-Content Banner</h3>
                    <span className="card-subtitle">Displayed below video player on watch page</span>
                  </div>
                </div>
                <label className="switch-toggle">
                  <input
                    type="checkbox"
                    checked={config.bannerWatchPage.enabled}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        bannerWatchPage: { ...prev.bannerWatchPage, enabled: e.target.checked }
                      }))
                    }
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="card-body">
                <div className="mode-toggle-group">
                  <label className="mode-label">Ad Type:</label>
                  <div className="mode-pill-group">
                    <button
                      type="button"
                      className={`mode-pill ${config.bannerWatchPage.mode === 'custom_code' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          bannerWatchPage: { ...prev.bannerWatchPage, mode: 'custom_code' }
                        }))
                      }
                    >
                      <Code2 size={13} /> Custom Code / Script
                    </button>
                    <button
                      type="button"
                      className={`mode-pill ${config.bannerWatchPage.mode === 'banner' ? 'active' : ''}`}
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          bannerWatchPage: { ...prev.bannerWatchPage, mode: 'banner' }
                        }))
                      }
                    >
                      <ImageIcon size={13} /> Custom Banner Image
                    </button>
                  </div>
                </div>

                {config.bannerWatchPage.mode === 'custom_code' ? (
                  <div className="form-group">
                    <label>Custom Watch Page Ad Code</label>
                    <textarea
                      rows={5}
                      value={config.bannerWatchPage.customCode}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          bannerWatchPage: { ...prev.bannerWatchPage, customCode: e.target.value }
                        }))
                      }
                      placeholder="Paste AdSense in-feed unit, native ad tag, or banner code..."
                      className="code-textarea"
                      spellCheck={false}
                    />
                  </div>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Banner Image URL</label>
                      <input
                        type="text"
                        value={config.bannerWatchPage.imageUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            bannerWatchPage: { ...prev.bannerWatchPage, imageUrl: e.target.value }
                          }))
                        }
                        placeholder="https://example.com/watch-banner.jpg"
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Click URL</label>
                      <input
                        type="text"
                        value={config.bannerWatchPage.clickUrl}
                        onChange={(e) =>
                          setConfig((prev) => ({
                            ...prev,
                            bannerWatchPage: { ...prev.bannerWatchPage, clickUrl: e.target.value }
                          }))
                        }
                        placeholder="https://sponsor.com"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

        </div>

        <div className="form-submit-bar">
          <button type="submit" className="btn btn-primary save-btn" disabled={saving}>
            <Save size={18} />
            <span>{saving ? 'Saving Settings...' : 'Save All Ad Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdsConfigPage;
