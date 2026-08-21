'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';
import { useAuth } from '../context/AuthContext';

/* ─── MOCK DATA ─────────────────────────────────────────── */
const MONTHLY_REVENUE = [38000, 42000, 39000, 51000, 47000, 54460];
const MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];

const INITIAL_PRODUCTS = [
  { id: 1, name: 'Subtilita Aquarelle One Day - Cocoa Brown', brand: 'Acuvue', type: 'Contact Lens', basePrice: 38, status: 'active', stock: 142, variants: 4 },
  { id: 2, name: 'Prada Minimalist Wire Frame', brand: 'Prada', type: 'Frame', basePrice: 340, status: 'active', stock: 28, variants: 3 },
  { id: 3, name: 'Ray-Ban Aviator Classic G-15', brand: 'Ray-Ban', type: 'Sunglass', basePrice: 175, status: 'active', stock: 67, variants: 5 },
  { id: 4, name: 'Persol Calligrapher Edition', brand: 'Persol', type: 'Sunglass', basePrice: 320, status: 'draft', stock: 0, variants: 2 },
  { id: 5, name: 'Tom Ford Keyhole Bridge', brand: 'Tom Ford', type: 'Frame', basePrice: 310, status: 'active', stock: 14, variants: 2 },
  { id: 6, name: 'Biofinity Monthly Toric', brand: 'CooperVision', type: 'Contact Lens', basePrice: 55, status: 'active', stock: 8, variants: 12 },
];

const LOW_STOCK = [
  { name: 'Biofinity Monthly Toric', variant: 'SPH -3.00 / BC 8.6', stock: 8, threshold: 10 },
  { name: 'Tom Ford Keyhole Bridge', variant: 'Matte Black / Large', stock: 14, threshold: 15 },
  { name: 'Amara Mirage Monthly', variant: 'Contact Lens - Blue', stock: 3, threshold: 10 },
  { name: 'Lacoste L2908 Oval', variant: 'Gold / Medium', stock: 6, threshold: 10 },
];

const ORDERS = [
  { id: '#ORD-8821', customer: 'Ahmed Khan', product: 'Prada Wire Frame', date: '2026-08-20', total: 340, status: 'delivered' },
  { id: '#ORD-8820', customer: 'Sara Malik', product: 'Acuvue Oasys x4', date: '2026-08-20', total: 192, status: 'processing' },
  { id: '#ORD-8819', customer: 'Usman Ali', product: 'Ray-Ban Aviator', date: '2026-08-19', total: 175, status: 'shipped' },
  { id: '#ORD-8818', customer: 'Fatima Noor', product: 'Biofinity Toric x6', date: '2026-08-19', total: 330, status: 'delivered' },
  { id: '#ORD-8817', customer: 'Hamza Rizvi', product: 'Tom Ford Keyhole', date: '2026-08-18', total: 310, status: 'cancelled' },
  { id: '#ORD-8816', customer: 'Ayesha Siddiqui', product: 'Persol Calligrapher', date: '2026-08-18', total: 320, status: 'processing' },
];

const INITIAL_REVIEWS = [
  { id: 1, product: 'Prada Minimalist Wire', customer: 'Ahmed K.', rating: 5, text: 'Absolutely stunning frame. The quality is unmatched, lightweight and stylish.', date: '2026-08-19', status: 'pending' },
  { id: 2, product: 'Ray-Ban Aviator Classic', customer: 'Sara M.', rating: 4, text: 'Great sunglasses, classic look. Very comfortable for all day wear.', date: '2026-08-18', status: 'pending' },
  { id: 3, product: 'Acuvue Oasys Monthly', customer: 'Usman A.', rating: 5, text: 'Best contact lenses I have ever used. Zero dryness even after 12 hours.', date: '2026-08-17', status: 'approved' },
  { id: 4, product: 'Tom Ford Keyhole', customer: 'Hamza R.', rating: 2, text: 'Not happy with the fit. Feels cheaper than expected for this price.', date: '2026-08-16', status: 'pending' },
];

const INITIAL_BRANDS = [
  { id: 1, name: 'Prada', country: 'Italy 🇮🇹', margin: '45%', productsCount: 14, status: 'Active' },
  { id: 2, name: 'Ray-Ban', country: 'Italy / USA 🇮🇹', margin: '40%', productsCount: 22, status: 'Active' },
  { id: 3, name: 'Persol', country: 'Italy 🇮🇹', margin: '48%', productsCount: 9, status: 'Active' },
  { id: 4, name: 'Tom Ford', country: 'Italy 🇮🇹', margin: '52%', productsCount: 11, status: 'Active' },
  { id: 5, name: 'Acuvue', country: 'USA 🇺🇸', margin: '35%', productsCount: 18, status: 'Active' },
  { id: 6, name: 'CooperVision', country: 'USA 🇺🇸', margin: '38%', productsCount: 12, status: 'Active' },
  { id: 7, name: 'Gucci', country: 'Italy 🇮🇹', margin: '50%', productsCount: 7, status: 'Active' },
  { id: 8, name: 'Oakley', country: 'USA 🇺🇸', margin: '42%', productsCount: 15, status: 'Active' },
];

const INITIAL_SWATCHES = [
  { name: 'Gold', hex: '#c5a47e' },
  { name: 'Silver', hex: '#c0c0c0' },
  { name: 'Gunmetal', hex: '#4a4a4a' },
  { name: 'Matte Black', hex: '#1a1a1a' },
  { name: 'Tortoise', hex: '#8b5e3c' },
  { name: 'Havana', hex: '#5c3317' },
  { name: 'Emerald Green', hex: '#059669' },
];

const INITIAL_LENS_RULES = [
  { id: 'single', name: 'Single Vision Lenses', basePrice: 1200, sphMin: '-12.00', sphMax: '+8.00', cylMax: '-4.00', status: true },
  { id: 'progressive', name: 'Progressive No-Line Multifocal', basePrice: 3500, sphMin: '-10.00', sphMax: '+6.00', addMax: '+3.50', status: true },
  { id: 'bluecut', name: 'Digital Blue-Cut Filter Lenses', basePrice: 2200, sphMin: '-12.00', sphMax: '+8.00', status: true },
  { id: 'nonrx', name: 'Non-Prescription Fashion Clear', basePrice: 0, sphMin: '0.00', sphMax: '0.00', status: true },
];

const INITIAL_INDEX_RULES = [
  { id: '1.56', indexName: '1.56 Standard Thin', markup: 0, targetSph: '-2.00 to +2.00', thinness: 'Standard' },
  { id: '1.61', indexName: '1.61 Super Thin High-Index', markup: 1800, targetSph: '-4.00 to +4.00', thinness: '30% Thinner' },
  { id: '1.67', indexName: '1.67 Ultra Thin High-Index', markup: 3200, targetSph: '> -4.00 High Rx', thinness: '45% Thinner' },
  { id: '1.74', indexName: '1.74 Extreme Thin High-Index', markup: 5500, targetSph: '> -8.00 Ultra Rx', thinness: '60% Thinner' },
];

const INITIAL_COATING_RULES = [
  { id: 'ar', name: 'Anti-Reflective & Hydrophobic Coating', price: 800, active: true, desc: 'Glare reduction & hydrophobic water repellent' },
  { id: 'transitions', name: 'Transitions Signature Gen 8 (Photochromic)', price: 2800, active: true, desc: 'Auto-darkens in outdoor UV light' },
  { id: 'polarized', name: 'Polarized Sun Tint Coating', price: 2400, active: true, desc: '99% water & glare reflection reduction' },
];

const NAV_ITEMS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'orders', icon: '📦', label: 'Orders', badge: 'NEW' },
  { key: 'customizer', icon: '🎨', label: 'Customizer', badge: 'PRO' },
  { key: 'attributes', icon: '⚙️', label: 'Store Attributes' },
  { key: 'lensengine', icon: '🔬', label: 'Lens Engine Setup' },
  { key: 'frames', icon: '👓', label: 'Frames & Sunglasses' },
  { key: 'contacts', icon: '👁️', label: 'Contact Lenses' },
  { key: 'reviews', icon: '⭐', label: 'Reviews' },
  { key: 'customers', icon: '👥', label: 'Customers' },
];

/* ─── SUBCOMPONENTS ─────────────────────────────────────── */
function MiniBarChart({ data, labels }) {
  const max = Math.max(...data);
  return (
    <div className={styles.barChart}>
      {data.map((val, i) => (
        <div key={i} className={styles.barCol}>
          <div className={styles.barWrap}>
            <div
              className={`${styles.bar} ${i === data.length - 1 ? styles.barActive : ''}`}
              style={{ height: `${(val / max) * 100}%` }}
              title={`Rs ${val.toLocaleString()}`}
            />
          </div>
          <span className={styles.barLabel}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

function StarDisplay({ rating }) {
  return (
    <span className={styles.starRow}>
      {[1,2,3,4,5].map(s => (
        <span key={s} style={{ color: s <= rating ? '#f59e0b' : '#d1d5db' }}>★</span>
      ))}
    </span>
  );
}

/* ─── SHOPIFY-STYLE STORE CUSTOMIZER VIEW ────────────────── */
function StoreCustomizerView() {
  const [activeTab, setActiveTab] = useState('branding');

  // Branding state
  const [storeName, setStoreName] = useState('Next-Gen Eyewear');
  const [logoIcon, setLogoIcon] = useState('👓');
  const [logoUrl, setLogoUrl] = useState('/prada-frames.png');
  const [logoHeight, setLogoHeight] = useState(42);
  const [faviconEmoji, setFaviconEmoji] = useState('🕶️');

  // Text & Content state
  const [announcementText, setAnnouncementText] = useState('🔥 Summer Sale: Up to 20% OFF all Titanium Frames with code EYEWEAR10');
  const [heroTitle, setHeroTitle] = useState('Precision Optical Retail Engineered for Vision');
  const [heroSubtitle, setHeroSubtitle] = useState('Aerospace-grade titanium frames, digital blue-cut filters & custom optical lens glazing.');
  const [heroCtaText, setHeroCtaText] = useState('Explore Catalog →');

  // Banner state
  const [heroBgPreset, setHeroBgPreset] = useState('/premium_glasses_display.png');
  const [promo1Title, setPromo1Title] = useState('Titanium Eyeglasses Collection');
  const [promo1Sub, setPromo1Sub] = useState('Ultra-lightweight 12g frames with anti-reflective lenses');
  const [promo1Img, setPromo1Img] = useState('/prada-frames.png');

  const [promo2Title, setPromo2Title] = useState('Polarized Sunglasses Series');
  const [promo2Sub, setPromo2Sub] = useState('100% UV400 mineral glass protection');
  const [promo2Img, setPromo2Img] = useState('/persol-sunglasses.png');

  // Theme Colors
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [accentColor, setAccentColor] = useState('#6366f1');

  const [publishNotify, setPublishNotify] = useState(false);

  function handlePublishTheme() {
    setPublishNotify(true);
    setTimeout(() => setPublishNotify(false), 3000);
  }

  function handleLogoFileUpload(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoUrl(ev.target.result);
    reader.readAsDataURL(file);
  }

  function handleFaviconUpload(file) {
    if (!file) return;
    setFaviconEmoji('🖼️ Logo File Uploaded');
  }

  function handleBannerUpload(file, setter) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => setter(ev.target.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.view}>
      {/* HEADER & PUBLISH BAR */}
      <div className={styles.customizerHeader}>
        <div>
          <h2 className={styles.engineTitle}>🎨 Shopify-Style Theme & Banner Customizer</h2>
          <p className={styles.engineSub}>Upload store logo, edit copy, configure favicons, and manage promotional hero banners live.</p>
        </div>
        <button className={styles.saveEngineBtn} onClick={handlePublishTheme}>
          ⚡ Publish Theme & Live Sync
        </button>
      </div>

      {publishNotify && (
        <div className={styles.notifyBanner}>
          🎉 Live Storefront Theme updated successfully! Logo, copy, vectors & banners published.
        </div>
      )}

      {/* CUSTOMIZER TABS */}
      <div className={styles.tabRow}>
        {[
          { id: 'branding', label: '🖼️ Logo, Favicon & SVG Vectors' },
          { id: 'content', label: '✍️ Text & Copy Editor' },
          { id: 'banners', label: '🖼️ Hero & Promo Banners' },
          { id: 'styling', label: '🎨 Palette & Theme Styling' },
        ].map(t => (
          <button
            key={t.id}
            className={`${styles.tabBtn} ${activeTab === t.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: BRANDING & MEDIA ASSETS */}
      {activeTab === 'branding' && (
        <div className={styles.customizerGrid}>
          {/* Logo Editor */}
          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <h3>1. Store Logo & SVG Vector Uploader</h3>
            </div>
            <div className={styles.cardPad}>
              <div className={styles.formGroup}>
                <label>Store Brand Name Text</label>
                <input type="text" value={storeName} onChange={e => setStoreName(e.target.value)} className={styles.adminInput} />
              </div>

              <div className={styles.formRow2} style={{ marginTop: '1rem' }}>
                <div className={styles.formGroup}>
                  <label>Logo Icon / Vector Emoji</label>
                  <input type="text" value={logoIcon} onChange={e => setLogoIcon(e.target.value)} className={styles.adminInput} />
                </div>
                <div className={styles.formGroup}>
                  <label>Logo Height Scale ({logoHeight}px)</label>
                  <input type="range" min="24" max="72" value={logoHeight} onChange={e => setLogoHeight(e.target.value)} className={styles.rangeSlider} />
                </div>
              </div>

              {/* Upload Dropzone */}
              <div
                className={styles.uploadDropzone}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <input
                  type="file"
                  accept="image/*,.svg"
                  onChange={e => handleLogoFileUpload(e.target.files[0])}
                  className={styles.fileInputOverlay}
                />
                <span className={styles.dropzoneIcon}>📁</span>
                <p><strong>Upload Vector Logo (.SVG, .PNG, .WEBP)</strong></p>
                <span className={styles.dropzoneSub}>
                  {logoUrl ? '✅ Logo Loaded (Click to replace)' : 'Drag & drop or browse logo image file'}
                </span>
              </div>

              {/* Live Logo Preview Box */}
              <div className={styles.logoPreviewCard}>
                <span className={styles.previewLabel}>LIVE HEADER PREVIEW:</span>
                <div className={styles.headerPreviewBar}>
                  <span style={{ fontSize: `${logoHeight * 0.75}px` }}>{logoIcon}</span>
                  <span className={styles.previewStoreName}>{storeName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Favicon & Vector Assets */}
          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <h3>2. Favicon & Vector Graphics Slot</h3>
            </div>
            <div className={styles.cardPad}>
              <div className={styles.formGroup}>
                <label>Browser Favicon Symbol / Emoji</label>
                <input type="text" value={faviconEmoji} onChange={e => setFaviconEmoji(e.target.value)} className={styles.adminInput} />
              </div>

              <div className={styles.uploadDropzone} style={{ marginTop: '1rem', position: 'relative', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/x-icon,image/png,image/svg+xml"
                  onChange={e => handleFaviconUpload(e.target.files[0])}
                  className={styles.fileInputOverlay}
                />
                <span className={styles.dropzoneIcon}>🌐</span>
                <p><strong>Upload .ICO / .PNG Favicon (32x32)</strong></p>
              </div>

              <div className={styles.faviconPreviewRow}>
                <span className={styles.favTabPreview}>
                  <span className={styles.favIconBox}>{faviconEmoji}</span>
                  {storeName} — Next-Gen Eyewear Storefront
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TEXT & COPY EDITOR */}
      {activeTab === 'content' && (
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Storefront Text, Titles & Announcement Bar Copy</h3>
          </div>
          <div className={styles.cardPad}>
            <div className={styles.formGroup}>
              <label>Top Announcement Bar Banner Text</label>
              <input type="text" value={announcementText} onChange={e => setAnnouncementText(e.target.value)} className={styles.adminInput} />
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label>Hero Main Title</label>
              <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className={styles.adminInput} />
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label>Hero Subtitle Description</label>
              <textarea value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} rows={3} className={styles.adminTextarea} />
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
              <label>Hero Call-to-Action Button Label</label>
              <input type="text" value={heroCtaText} onChange={e => setHeroCtaText(e.target.value)} className={styles.adminInput} style={{ maxWidth: '300px' }} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HERO & PROMO BANNERS */}
      {activeTab === 'banners' && (
        <div className={styles.customizerGrid}>
          {/* Main Hero Background */}
          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <h3>Main Hero Display Background Banner</h3>
            </div>
            <div className={styles.cardPad}>
              <div className={styles.formGroup}>
                <label>Selected Background Asset Image</label>
                <select value={heroBgPreset} onChange={e => setHeroBgPreset(e.target.value)} className={styles.adminSelect}>
                  <option value="/premium_glasses_display.png">Preset 1: Premium Optics Display Showcase</option>
                  <option value="/prada-frames.png">Preset 2: Prada Wire Frame Spotlight</option>
                  <option value="/persol-sunglasses.png">Preset 3: Persol Calligrapher Edition</option>
                </select>
              </div>

              {/* Banner Upload */}
              <div className={styles.uploadDropzone} style={{ marginTop: '0.75rem', marginBottom: '1rem', position: 'relative', cursor: 'pointer' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => handleBannerUpload(e.target.files[0], setHeroBgPreset)}
                  className={styles.fileInputOverlay}
                />
                <span className={styles.dropzoneIcon}>🖼️</span>
                <p><strong>Upload Custom Hero Background Image</strong></p>
                <span className={styles.dropzoneSub}>Click or drop image to replace main hero banner</span>
              </div>

              <div className={styles.bannerPreviewBox} style={{ backgroundImage: `url(${heroBgPreset})` }}>
                <div className={styles.bannerOverlayContent}>
                  <h3>{heroTitle}</h3>
                  <p>{heroSubtitle}</p>
                  <button className={styles.bannerCtaBtn}>{heroCtaText}</button>
                </div>
              </div>
            </div>
          </div>

          {/* Promo Card Banners */}
          <div className={styles.tableCard}>
            <div className={styles.cardHeader}>
              <h3>Promotional Spotlight Card Banners</h3>
            </div>
            <div className={styles.cardPad}>
              {/* Promo 1 */}
              <div className={styles.promoEditorBox}>
                <h4>Promo Banner 1</h4>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input type="text" value={promo1Title} onChange={e => setPromo1Title(e.target.value)} className={styles.adminInput} />
                </div>
                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                  <label>Subtitle</label>
                  <input type="text" value={promo1Sub} onChange={e => setPromo1Sub(e.target.value)} className={styles.adminInput} />
                </div>
              </div>

              {/* Promo 2 */}
              <div className={styles.promoEditorBox} style={{ marginTop: '1rem' }}>
                <h4>Promo Banner 2</h4>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input type="text" value={promo2Title} onChange={e => setPromo2Title(e.target.value)} className={styles.adminInput} />
                </div>
                <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                  <label>Subtitle</label>
                  <input type="text" value={promo2Sub} onChange={e => setPromo2Sub(e.target.value)} className={styles.adminInput} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: PALETTE & STYLING */}
      {activeTab === 'styling' && (
        <div className={styles.tableCard}>
          <div className={styles.cardHeader}>
            <h3>Brand Theme Palette & Typography Settings</h3>
          </div>
          <div className={styles.cardPad}>
            <div className={styles.formRow2}>
              <div className={styles.formGroup}>
                <label>Primary Brand Accent Color</label>
                <div className={styles.colorPickRow}>
                  <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className={styles.colorPickerInput} />
                  <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className={styles.adminInput} />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Secondary Accent Color</label>
                <div className={styles.colorPickRow}>
                  <input type="color" value={accentColor} onChange={e => setAccentColor(e.target.value)} className={styles.colorPickerInput} />
                  <input type="text" value={accentColor} onChange={e => setAccentColor(e.target.value)} className={styles.adminInput} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── STORE ATTRIBUTES & BRANDS VIEW ─────────────────────── */
function StoreAttributesView() {
  const [brands, setBrands] = useState(INITIAL_BRANDS);
  const [swatches, setSwatches] = useState(INITIAL_SWATCHES);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);

  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCountry, setNewBrandCountry] = useState('Italy 🇮🇹');
  const [newBrandMargin, setNewBrandMargin] = useState('45%');

  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#6366f1');

  function handleAddBrand(e) {
    e.preventDefault();
    if (!newBrandName) return;
    setBrands(prev => [
      { id: Date.now(), name: newBrandName, country: newBrandCountry, margin: newBrandMargin, productsCount: 0, status: 'Active' },
      ...prev,
    ]);
    setShowAddBrandModal(false);
    setNewBrandName('');
  }

  function handleAddSwatch(e) {
    e.preventDefault();
    if (!newColorName) return;
    setSwatches(prev => [...prev, { name: newColorName, hex: newColorHex }]);
    setNewColorName('');
  }

  function handleDeleteBrand(id) {
    setBrands(prev => prev.filter(b => b.id !== id));
  }

  return (
    <div className={styles.view}>
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>🏷️ Optical Partner Brands Catalog ({brands.length})</h3>
          <button className={styles.addProductBtn} onClick={() => setShowAddBrandModal(true)}>+ Add Partner Brand</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Brand Name</th>
                <th>Country of Origin</th>
                <th>Profit Margin Target</th>
                <th>Active Products</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map(b => (
                <tr key={b.id}>
                  <td className={styles.productNameCell}><span className={styles.brandPill}>{b.name}</span></td>
                  <td>{b.country}</td>
                  <td><code className={styles.orderId}>{b.margin}</code></td>
                  <td className={styles.centerCell}>{b.productsCount} items</td>
                  <td><span className={styles.statusActive}>{b.status}</span></td>
                  <td>
                    <button className={styles.delBtn} onClick={() => handleDeleteBrand(b.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.midRow}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>🎨 Frame Color Swatches ({swatches.length})</h3>
          </div>
          <div className={styles.swatchList}>
            {swatches.map((s, i) => (
              <div key={i} className={styles.swatchItem}>
                <span className={styles.colorCircle} style={{ background: s.hex }} />
                <div>
                  <p className={styles.swatchName}>{s.name}</p>
                  <code className={styles.swatchHex}>{s.hex}</code>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSwatch} className={styles.addSwatchRow}>
            <input type="text" placeholder="Color Name" value={newColorName} onChange={e => setNewColorName(e.target.value)} className={styles.adminInput} style={{ flex: 1 }} />
            <input type="color" value={newColorHex} onChange={e => setNewColorHex(e.target.value)} className={styles.colorPickerInput} />
            <button type="submit" className={styles.addProductBtn}>+ Add</button>
          </form>
        </div>

        <div className={styles.alertCard}>
          <div className={styles.cardHeader}>
            <h3>👓 Frame Materials Catalog</h3>
          </div>
          <div className={styles.alertList}>
            {[
              { name: 'Aerospace Titanium Metal', desc: 'Ultra-lightweight 12g, hypoallergenic, high tensile strength' },
              { name: 'Italian Mazzucchelli Acetate', desc: 'Hand-cut rich color depth & durable hinge housing' },
              { name: 'TR90 Flexible Polymer', desc: 'Memory shape retention, high impact resistance' },
              { name: 'Stainless Steel Alloy', desc: 'Sleek thin wire structure, corrosion resistant' },
            ].map((m, i) => (
              <div key={i} className={styles.alertItem}>
                <div>
                  <p className={styles.alertName}>{m.name}</p>
                  <p className={styles.alertVariant}>{m.desc}</p>
                </div>
                <span className={styles.statusActive}>Standard</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddBrandModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddBrandModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()} style={{ maxWidth: '480px' }}>
            <div className={styles.modalHeader}>
              <h3>+ Add Optical Partner Brand</h3>
              <button className={styles.modalCloseBtn} onClick={() => setShowAddBrandModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddBrand} className={styles.configForm}>
              <div className={styles.formGroup}>
                <label>Brand Name *</label>
                <input type="text" placeholder="e.g. Oliver Peoples" value={newBrandName} onChange={e => setNewBrandName(e.target.value)} required className={styles.adminInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Country of Origin</label>
                <input type="text" placeholder="Italy 🇮🇹" value={newBrandCountry} onChange={e => setNewBrandCountry(e.target.value)} className={styles.adminInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Target Royalty / Profit Margin</label>
                <input type="text" placeholder="45%" value={newBrandMargin} onChange={e => setNewBrandMargin(e.target.value)} className={styles.adminInput} />
              </div>
              <div className={styles.modalFooter}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowAddBrandModal(false)}>Cancel</button>
                <button type="submit" className={styles.saveProductBtn}>✓ Save Brand</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── LENS ENGINE RULE MANAGER VIEW ─────────────────────── */
function LensEngineView() {
  const [lensRules, setLensRules] = useState(INITIAL_LENS_RULES);
  const [indexRules, setIndexRules] = useState(INITIAL_INDEX_RULES);
  const [coatingRules, setCoatingRules] = useState(INITIAL_COATING_RULES);
  const [savedNotify, setSavedNotify] = useState(false);

  function handlePriceChange(id, newPrice) {
    setLensRules(prev => prev.map(r => r.id === id ? { ...r, basePrice: Number(newPrice) } : r));
  }

  function handleIndexMarkupChange(id, newMarkup) {
    setIndexRules(prev => prev.map(r => r.id === id ? { ...r, markup: Number(newMarkup) } : r));
  }

  function toggleCoating(id) {
    setCoatingRules(prev => prev.map(c => c.id === id ? { ...c, active: !c.active } : c));
  }

  function handleSaveRules() {
    setSavedNotify(true);
    setTimeout(() => setSavedNotify(false), 3000);
  }

  return (
    <div className={styles.view}>
      <div className={styles.lensEngineHeader}>
        <div>
          <h2 className={styles.engineTitle}>🔬 Optical Lens Lab Pricing & Coating Rule Manager</h2>
          <p className={styles.engineSub}>Configure base optical prices, refractive index markup rules, and prescription SPH/CYL thresholds.</p>
        </div>
        <button className={styles.saveEngineBtn} onClick={handleSaveRules}>
          ✓ Save & Deploy Lens Engine Rules
        </button>
      </div>

      {savedNotify && (
        <div className={styles.notifyBanner}>
          🎉 Optical Lens Engine Rules updated successfully! Live catalog synced.
        </div>
      )}

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>1. Lens Category Base Pricing Rules</h3>
          <span className={styles.timeBadge}>Dynamic Rule Engine</span>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Lens Type</th>
                <th>Base Price (Rs)</th>
                <th>Min SPH</th>
                <th>Max SPH</th>
                <th>Max CYL / ADD</th>
                <th>Rule Status</th>
              </tr>
            </thead>
            <tbody>
              {lensRules.map(rule => (
                <tr key={rule.id}>
                  <td className={styles.productNameCell}>{rule.name}</td>
                  <td>
                    <input
                      type="number"
                      value={rule.basePrice}
                      onChange={e => handlePriceChange(rule.id, e.target.value)}
                      className={styles.engineInput}
                    />
                  </td>
                  <td><code>{rule.sphMin}</code></td>
                  <td><code>{rule.sphMax}</code></td>
                  <td><code>{rule.cylMax || rule.addMax || '-'}</code></td>
                  <td>
                    <span className={rule.status ? styles.statusActive : styles.statusDraft}>
                      {rule.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>2. Refractive Index Thinness Markup Matrix</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Refractive Index</th>
                <th>Price Markup (Rs)</th>
                <th>Recommended SPH Range</th>
                <th>Thinness Benefit</th>
              </tr>
            </thead>
            <tbody>
              {indexRules.map(idx => (
                <tr key={idx.id}>
                  <td className={styles.productNameCell}>{idx.indexName}</td>
                  <td>
                    <input
                      type="number"
                      value={idx.markup}
                      onChange={e => handleIndexMarkupChange(idx.id, e.target.value)}
                      className={styles.engineInput}
                    />
                  </td>
                  <td><code>{idx.targetSph}</code></td>
                  <td><span className={styles.brandPill}>{idx.thinness}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>3. Optical Coating & Enhancement Rules</h3>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Coating Name</th>
                <th>Description</th>
                <th>Price Addition (Rs)</th>
                <th>Toggle Status</th>
              </tr>
            </thead>
            <tbody>
              {coatingRules.map(c => (
                <tr key={c.id}>
                  <td className={styles.productNameCell}>{c.name}</td>
                  <td>{c.desc}</td>
                  <td>Rs {c.price.toLocaleString()}</td>
                  <td>
                    <button
                      className={c.active ? styles.toggleOnBtn : styles.toggleOffBtn}
                      onClick={() => toggleCoating(c.id)}
                    >
                      {c.active ? '✓ Enabled' : '✕ Disabled'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── OPTICAL PRODUCT CONFIGURATOR MODAL ────────────────── */
function ProductConfiguratorModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product?.name || '');
  const [brand, setBrand] = useState(product?.brand || 'Prada');
  const [type, setType] = useState(product?.type || 'Frame');
  const [basePrice, setBasePrice] = useState(product?.basePrice || 250);
  const [status, setStatus] = useState(product?.status || 'active');

  const fileInputRef = useRef(null);
  const [productImage, setProductImage] = useState(product?.img || null);
  const [imgFileName, setImgFileName] = useState('');
  const [imgDragOver, setImgDragOver] = useState(false);

  function handleImageFile(file, inputEl) {
    if (!file || !file.type.startsWith('image/')) return;
    setImgFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setProductImage(ev.target.result);
      if (inputEl) inputEl.value = '';
    };
    reader.readAsDataURL(file);
  }

  const [material, setMaterial] = useState('Titanium Metal');
  const [shape, setShape] = useState('Square');
  const [lensWidth, setLensWidth] = useState('54mm');
  const [bridge, setBridge] = useState('18mm');
  const [sphMin, setSphMin] = useState('-10.00');
  const [sphMax, setSphMax] = useState('+6.00');

  const [selectedColors, setSelectedColors] = useState(['Gold', 'Silver']);
  const [selectedSizes, setSelectedSizes] = useState(['Medium (54mm)', 'Large (58mm)']);
  const [generatedVariants, setGeneratedVariants] = useState([]);

  const ALL_COLORS = ['Gold', 'Silver', 'Gunmetal', 'Matte Black', 'Tortoise', 'Havana', 'Clear'];
  const ALL_SIZES = ['Small (50mm)', 'Medium (54mm)', 'Large (58mm)', 'Box of 6', 'Box of 12'];

  function toggleColor(color) {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  }

  function toggleSize(size) {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  }

  function generateMatrix() {
    const matrix = [];
    selectedColors.forEach(c => {
      selectedSizes.forEach(s => {
        matrix.push({
          sku: `${brand.toUpperCase().slice(0,3)}-${c.toUpperCase().slice(0,3)}-${s.slice(0,2)}`,
          color: c,
          size: s,
          stock: 25,
          priceAdjustment: 0,
        });
      });
    });
    setGeneratedVariants(matrix);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!name) return;
    const totalStock = generatedVariants.length
      ? generatedVariants.reduce((a, v) => a + Number(v.stock), 0)
      : product?.stock || 45;

    onSave({
      id: product?.id || Date.now(),
      name,
      brand,
      type,
      basePrice: Number(basePrice),
      status,
      stock: totalStock,
      variants: generatedVariants.length || product?.variants || 4,
      img: productImage || product?.img || '/prada-frames.png',
    });
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3>⚡ {product ? 'Edit Optical Product' : 'Add New Optical Product & Variant Configurator'}</h3>
          <button className={styles.modalCloseBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.configForm}>
          <div className={styles.configSection}>
            <h4 className={styles.configSectionTitle}>1. General Information</h4>

            {/* ── IMAGE UPLOAD ── */}
            <div className={styles.imgUploadSection}>
              <label className={styles.imgUploadLabel}>Product Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => handleImageFile(e.target.files[0], e.target)}
              />
              <div
                className={`${styles.imgDropZone} ${imgDragOver ? styles.imgDropZoneActive : ''} ${productImage ? styles.imgDropZoneHasFile : ''}`}
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setImgDragOver(true); }}
                onDragLeave={() => setImgDragOver(false)}
                onDrop={e => { e.preventDefault(); setImgDragOver(false); handleImageFile(e.dataTransfer.files[0]); }}
              >
                {productImage ? (
                  <div className={styles.imgPreviewWrap}>
                    <img src={productImage} alt="Preview" className={styles.imgPreviewThumb} />
                    <div className={styles.imgPreviewInfo}>
                      <span className={styles.imgPreviewName}>✅ {imgFileName || 'Current image uploaded'}</span>
                      <span className={styles.imgPreviewSize}>Click anywhere to replace image</span>
                    </div>
                    <button
                      type="button"
                      className={styles.imgRemoveBtn}
                      onClick={e => {
                        e.stopPropagation();
                        setProductImage(null);
                        setImgFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      title="Remove image"
                    >✕</button>
                  </div>
                ) : (
                  <div className={styles.imgDropContent}>
                    <span className={styles.imgDropIcon}>🖼️</span>
                    <p className={styles.imgDropTitle}>Drag &amp; drop product image here</p>
                    <p className={styles.imgDropSub}>Supports PNG, JPG, WebP, SVG up to 10MB</p>
                  </div>
                )}
                <button
                  type="button"
                  className={styles.imgBrowseBtn}
                  onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
                >
                  📁 {productImage ? 'Replace Image' : 'Browse Files'}
                </button>
              </div>
            </div>

            <div className={styles.formRow2}>
              <div className={styles.formGroup}>
                <label>Product Name *</label>
                <input type="text" placeholder="e.g. Prada Minimalist Wire Frame" value={name} onChange={e => setName(e.target.value)} required className={styles.adminInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Brand *</label>
                <select value={brand} onChange={e => setBrand(e.target.value)} className={styles.adminSelect}>
                  {['Prada','Ray-Ban','Persol','Tom Ford','Acuvue','CooperVision','Lacoste'].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.formRow3}>
              <div className={styles.formGroup}>
                <label>Category Type</label>
                <select value={type} onChange={e => setType(e.target.value)} className={styles.adminSelect}>
                  <option value="Frame">Frame (Eyeglasses)</option>
                  <option value="Sunglass">Sunglass</option>
                  <option value="Contact Lens">Contact Lens</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Base Price (Rs) *</label>
                <input type="number" value={basePrice} onChange={e => setBasePrice(e.target.value)} className={styles.adminInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)} className={styles.adminSelect}>
                  <option value="active">Active (Published)</option>
                  <option value="draft">Draft (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.configSection}>
            <h4 className={styles.configSectionTitle}>2. Optical Specifications Matrix</h4>
            <div className={styles.formRow4}>
              <div className={styles.formGroup}>
                <label>Material</label>
                <select value={material} onChange={e => setMaterial(e.target.value)} className={styles.adminSelect}>
                  {['Titanium Metal','Italian Acetate','Stainless Steel','TR90 Flexible','Senofilcon A'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Frame Shape</label>
                <select value={shape} onChange={e => setShape(e.target.value)} className={styles.adminSelect}>
                  {['Square','Round','Oval','Cat-Eye','Aviator','Wayfarer'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Lens Width</label>
                <input type="text" value={lensWidth} onChange={e => setLensWidth(e.target.value)} className={styles.adminInput} />
              </div>
              <div className={styles.formGroup}>
                <label>Bridge Size</label>
                <input type="text" value={bridge} onChange={e => setBridge(e.target.value)} className={styles.adminInput} />
              </div>
            </div>

            {type === 'Contact Lens' && (
              <div className={styles.formRow2} style={{ marginTop: '0.75rem' }}>
                <div className={styles.formGroup}>
                  <label>SPH Range (Min to Max)</label>
                  <div className={styles.rangeInputs}>
                    <input type="text" value={sphMin} onChange={e => setSphMin(e.target.value)} className={styles.adminInput} placeholder="-12.00" />
                    <span>to</span>
                    <input type="text" value={sphMax} onChange={e => setSphMax(e.target.value)} className={styles.adminInput} placeholder="+8.00" />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Base Curve Options</label>
                  <input type="text" defaultValue="8.4, 8.6, 8.8" className={styles.adminInput} />
                </div>
              </div>
            )}
          </div>

          <div className={styles.configSection}>
            <div className={styles.sectionTopFlex}>
              <h4 className={styles.configSectionTitle}>3. Optical Variant Matrix Generator</h4>
              <button type="button" className={styles.generateBtn} onClick={generateMatrix}>⚡ Generate Variant Combinations</button>
            </div>

            <div className={styles.optionPicker}>
              <p className={styles.pickerLabel}>Colors:</p>
              <div className={styles.pillGroup}>
                {ALL_COLORS.map(c => (
                  <button type="button" key={c} className={`${styles.pickerPill} ${selectedColors.includes(c) ? styles.pickerActive : ''}`} onClick={() => toggleColor(c)}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.optionPicker}>
              <p className={styles.pickerLabel}>Sizes:</p>
              <div className={styles.pillGroup}>
                {ALL_SIZES.map(s => (
                  <button type="button" key={s} className={`${styles.pickerPill} ${selectedSizes.includes(s) ? styles.pickerActive : ''}`} onClick={() => toggleSize(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {generatedVariants.length > 0 && (
              <div className={styles.matrixTableWrap}>
                <table className={styles.matrixTable}>
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Color</th>
                      <th>Size</th>
                      <th>Initial Stock</th>
                      <th>Price Adjustment</th>
                    </tr>
                  </thead>
                  <tbody>
                    {generatedVariants.map((v, i) => (
                      <tr key={i}>
                        <td><code>{v.sku}</code></td>
                        <td>{v.color}</td>
                        <td>{v.size}</td>
                        <td>
                          <input
                            type="number"
                            value={v.stock}
                            onChange={e => {
                              const val = e.target.value;
                              setGeneratedVariants(prev => prev.map((item, idx) => idx === i ? { ...item, stock: val } : item));
                            }}
                            className={styles.matrixInput}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={v.priceAdjustment}
                            onChange={e => {
                              const val = e.target.value;
                              setGeneratedVariants(prev => prev.map((item, idx) => idx === i ? { ...item, priceAdjustment: val } : item));
                            }}
                            className={styles.matrixInput}
                            placeholder="+0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.saveProductBtn}>✓ Save Product & Sync Catalog</button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── VIEWS ─────────────────────────────────────────────── */
function DashboardView({ products, onAdd, onEdit, onDelete }) {
  const statCards = [
    { label: 'Filtered Revenue', value: 'Rs 54,460', icon: '💰', sub: '▲ 2407.7% vs previous period', subColor: '#22c55e', color: '#3b82f6' },
    { label: 'Filtered Orders', value: '2', icon: '📦', sub: '▲ 33.3% vs previous period', subColor: '#22c55e', color: '#8b5cf6' },
    { label: 'Total Active Products', value: `${products.length}`, icon: '🗃️', sub: 'Manage Catalog →', subColor: '#3b82f6', color: '#f59e0b' },
    { label: 'Partner Brands', value: '30', icon: '🏷️', sub: 'View All Attributes →', subColor: '#3b82f6', color: '#ec4899' },
  ];

  return (
    <div className={styles.view}>
      <div className={styles.statGrid}>
        {statCards.map(card => (
          <div key={card.label} className={styles.statCard}>
            <div className={styles.statTop}>
              <div>
                <p className={styles.statLabel}>{card.label}</p>
                <p className={styles.statValue}>{card.value}</p>
              </div>
              <div className={styles.statIcon} style={{ background: card.color + '22', color: card.color }}>
                {card.icon}
              </div>
            </div>
            <p className={styles.statSub} style={{ color: card.subColor }}>{card.sub}</p>
          </div>
        ))}
      </div>

      <div className={styles.midRow}>
        <div className={styles.chartCard}>
          <div className={styles.cardHeader}>
            <h3>Revenue Overview</h3>
            <span className={styles.timeBadge}>Last 6 Months</span>
          </div>
          <div className={styles.revenueTotal}>
            <span>Rs 271,460</span>
            <span className={styles.growthBadge}>▲ 18.4% MoM</span>
          </div>
          <MiniBarChart data={MONTHLY_REVENUE} labels={MONTHS} />
        </div>

        <div className={styles.alertCard}>
          <div className={styles.cardHeader}>
            <h3>🔴 Low Stock Alerts</h3>
            <button className={styles.alertBtn}>Attend</button>
          </div>
          <div className={styles.alertList}>
            {LOW_STOCK.map((item, i) => (
              <div key={i} className={styles.alertItem}>
                <div>
                  <p className={styles.alertName}>{item.name}</p>
                  <p className={styles.alertVariant}>{item.variant}</p>
                </div>
                <div className={styles.alertRight}>
                  <span className={`${styles.stockBadge} ${item.stock <= 5 ? styles.stockCritical : styles.stockWarning}`}>
                    {item.stock} LEFT
                  </span>
                  <div className={styles.stockBar}>
                    <div className={styles.stockBarFill} style={{ width: `${(item.stock / item.threshold) * 100}%`, background: item.stock <= 5 ? '#ef4444' : '#f59e0b' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>Recently Added Products</h3>
          <button className={styles.addProductBtn} onClick={onAdd}>+ Add Product</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Brand</th>
                <th>Type</th>
                <th>Base Price</th>
                <th>Variants</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id}>
                  <td className={styles.productNameCell}>{p.name}</td>
                  <td><span className={styles.brandPill}>{p.brand}</span></td>
                  <td>{p.type}</td>
                  <td>Rs {p.basePrice.toLocaleString()}</td>
                  <td className={styles.centerCell}>{p.variants}</td>
                  <td className={styles.centerCell}>
                    <span className={p.stock < 10 ? styles.stockLow : styles.stockOk}>{p.stock}</span>
                  </td>
                  <td>
                    <span className={p.status === 'active' ? styles.statusActive : styles.statusDraft}>
                      {p.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.editBtn} onClick={() => onEdit(p)}>✏️</button>
                      <button className={styles.delBtn} onClick={() => onDelete(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersView() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? ORDERS : ORDERS.filter(o => o.status === filter);
  return (
    <div className={styles.view}>
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>All Orders</h3>
          <div className={styles.tabRow}>
            {['all','processing','shipped','delivered','cancelled'].map(s => (
              <button key={s} className={`${styles.tabBtn} ${filter === s ? styles.tabActive : ''}`} onClick={() => setFilter(s)}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Product</th><th>Date</th><th>Total</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><code className={styles.orderId}>{o.id}</code></td>
                  <td>{o.customer}</td>
                  <td>{o.product}</td>
                  <td className={styles.dateCell}>{o.date}</td>
                  <td>Rs {o.total.toLocaleString()}</td>
                  <td><span className={styles[`order_${o.status}`]}>{o.status}</span></td>
                  <td><button className={styles.viewBtn}>View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReviewsView({ reviews, setReviews }) {
  function moderate(id, action) {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  }
  const pending = reviews.filter(r => r.status === 'pending');
  const approved = reviews.filter(r => r.status === 'approved');
  const rejected = reviews.filter(r => r.status === 'rejected');
  return (
    <div className={styles.view}>
      <div className={styles.reviewStats}>
        <div className={styles.reviewStatPill}><span>⏳</span> {pending.length} Pending</div>
        <div className={`${styles.reviewStatPill} ${styles.reviewStatGreen}`}><span>✅</span> {approved.length} Approved</div>
        <div className={`${styles.reviewStatPill} ${styles.reviewStatRed}`}><span>❌</span> {rejected.length} Rejected</div>
      </div>
      <div className={styles.reviewGrid}>
        {reviews.map(r => (
          <div key={r.id} className={`${styles.reviewCard} ${r.status === 'approved' ? styles.reviewApproved : r.status === 'rejected' ? styles.reviewRejected : ''}`}>
            <div className={styles.reviewTop}>
              <div>
                <p className={styles.reviewProduct}>{r.product}</p>
                <StarDisplay rating={r.rating} />
              </div>
              <span className={styles[`rstatus_${r.status}`]}>{r.status}</span>
            </div>
            <p className={styles.reviewText}>&quot;{r.text}&quot;</p>
            <div className={styles.reviewBottom}>
              <span className={styles.reviewMeta}>— {r.customer} · {r.date}</span>
              {r.status === 'pending' && (
                <div className={styles.moderateBtns}>
                  <button className={styles.approveBtn} onClick={() => moderate(r.id, 'approved')}>✓ Approve</button>
                  <button className={styles.rejectBtn} onClick={() => moderate(r.id, 'rejected')}>✕ Reject</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductsView({ products, type, onAdd, onEdit, onDelete }) {
  const filtered = type === 'contacts'
    ? products.filter(p => p.type === 'Contact Lens')
    : products.filter(p => p.type !== 'Contact Lens');
  return (
    <div className={styles.view}>
      <div className={styles.tableCard}>
        <div className={styles.cardHeader}>
          <h3>{type === 'contacts' ? 'Contact Lenses Inventory' : 'Frames & Sunglasses Inventory'}</h3>
          <button className={styles.addProductBtn} onClick={onAdd}>+ Add Product</button>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>Product</th><th>Brand</th><th>Type</th><th>Price</th><th>Variants</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td className={styles.productNameCell}>{p.name}</td>
                  <td><span className={styles.brandPill}>{p.brand}</span></td>
                  <td>{p.type}</td>
                  <td>Rs {p.basePrice.toLocaleString()}</td>
                  <td className={styles.centerCell}>{p.variants}</td>
                  <td className={styles.centerCell}><span className={p.stock < 10 ? styles.stockLow : styles.stockOk}>{p.stock}</span></td>
                  <td><span className={p.status === 'active' ? styles.statusActive : styles.statusDraft}>{p.status}</span></td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.editBtn} onClick={() => onEdit(p)}>✏️</button>
                      <button className={styles.delBtn} onClick={() => onDelete(p.id)}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PlaceholderView({ title }) {
  return (
    <div className={styles.view}>
      <div className={styles.placeholder}>
        <span>🚧</span>
        <h3>{title}</h3>
        <p>This section is under construction. Coming soon!</p>
      </div>
    </div>
  );
}

/* ─── MAIN ADMIN LAYOUT ─────────────────────────────────── */
export default function AdminPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  /* Auth guard — redirect non-admins */
  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.replace('/admin/login');
    }
  }, [user, loading, router]);

  const [activeNav, setActiveNav] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const pageTitle = NAV_ITEMS.find(n => n.key === activeNav)?.label || 'Dashboard';

  /* While loading auth or redirecting, show nothing */
  if (loading || !user || user.role !== 'admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0f1629', color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
          <p>Checking authentication…</p>
        </div>
      </div>
    );
  }

  function handleOpenAddModal() {
    setEditingProduct(null);
    setShowConfigModal(true);
  }

  function handleOpenEditModal(p) {
    setEditingProduct(p);
    setShowConfigModal(true);
  }

  function handleDeleteProduct(id) {
    setProducts(prev => prev.filter(p => p.id !== id));
  }

  function handleSaveProduct(savedProduct) {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === savedProduct.id ? savedProduct : p));
    } else {
      setProducts(prev => [savedProduct, ...prev]);
    }
    setShowConfigModal(false);
    setEditingProduct(null);
  }

  function renderView() {
    switch (activeNav) {
      case 'dashboard': return <DashboardView products={products} onAdd={handleOpenAddModal} onEdit={handleOpenEditModal} onDelete={handleDeleteProduct} />;
      case 'orders': return <OrdersView />;
      case 'customizer': return <StoreCustomizerView />;
      case 'attributes': return <StoreAttributesView />;
      case 'lensengine': return <LensEngineView />;
      case 'reviews': return <ReviewsView reviews={reviews} setReviews={setReviews} />;
      case 'frames': return <ProductsView products={products} type="frames" onAdd={handleOpenAddModal} onEdit={handleOpenEditModal} onDelete={handleDeleteProduct} />;
      case 'contacts': return <ProductsView products={products} type="contacts" onAdd={handleOpenAddModal} onEdit={handleOpenEditModal} onDelete={handleDeleteProduct} />;
      default: return <PlaceholderView title={pageTitle} />;
    }
  }

  return (
    <div className={styles.adminRoot}>
      {/* ── SIDEBAR ── */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>
        <div className={styles.sidebarLogo}>
          <div className={styles.sidebarLogoIcon}>👓</div>
          {sidebarOpen && <span>OPTICS<strong>ADMIN</strong></span>}
        </div>

        <div className={styles.sidebarSection}>
          {sidebarOpen && <p className={styles.sidebarSectionLabel}>CORE ENGINE</p>}
          {NAV_ITEMS.slice(0, 3).map(item => (
            <button
              key={item.key}
              className={`${styles.navItem} ${activeNav === item.key ? styles.navActive : ''}`}
              onClick={() => setActiveNav(item.key)}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && (
                <span className={styles.navLabel}>{item.label}
                  {item.badge && <span className={styles.navBadge}>{item.badge}</span>}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.sidebarSection}>
          {sidebarOpen && <p className={styles.sidebarSectionLabel}>LENS LAB & STORE</p>}
          {NAV_ITEMS.slice(3, 5).map(item => (
            <button key={item.key} className={`${styles.navItem} ${activeNav === item.key ? styles.navActive : ''}`} onClick={() => setActiveNav(item.key)}>
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </div>

        <div className={styles.sidebarSection}>
          {sidebarOpen && <p className={styles.sidebarSectionLabel}>INVENTORY & REVIEWS</p>}
          {NAV_ITEMS.slice(5).map(item => (
            <button key={item.key} className={`${styles.navItem} ${activeNav === item.key ? styles.navActive : ''}`} onClick={() => setActiveNav(item.key)}>
              <span className={styles.navIcon}>{item.icon}</span>
              {sidebarOpen && <span className={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </div>

        <button className={styles.collapseBtn} onClick={() => setSidebarOpen(o => !o)}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className={styles.main}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <h2 className={styles.pageTitle}>ADMIN PANEL</h2>
            <span className={styles.pageSubtitle}>/ {pageTitle}</span>
          </div>
          <div className={styles.topBarRight}>
            <div className={styles.searchAdmin}>
              <span>🔍</span>
              <input type="text" placeholder="Search catalog..." className={styles.searchAdminInput} />
            </div>
            <div className={styles.adminProfile}>
              <div className={styles.profileAvatar}>{user.name?.[0]?.toUpperCase() || 'A'}</div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>{user.name}</span>
                <span className={styles.profileRole}>Super Admin</span>
              </div>
            </div>
            <Link href="/" className={styles.viewStoreBtn}>🔗 View Store</Link>
            <button
              className={styles.adminLogoutBtn}
              onClick={() => { logout(); router.push('/login'); }}
              title="Log out"
            >
              📴 Logout
            </button>
          </div>
        </header>

        {/* Dashboard Header */}
        {activeNav === 'dashboard' && (
          <div className={styles.dashHeader}>
            <div>
              <h3 className={styles.dashTitle}>📊 DASHBOARD OVERVIEW</h3>
              <p className={styles.dashSub}>Welcome back! Analyze your store&apos;s performance.</p>
            </div>
            <div className={styles.dashActions}>
              <span className={styles.dateChip}>📅 {new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</span>
              <button className={styles.addProductBtn} onClick={handleOpenAddModal}>+ Add Product</button>
            </div>
          </div>
        )}

        {/* Scrollable Content */}
        <div className={styles.content}>
          {renderView()}
        </div>
      </div>

      {/* Configurator Modal */}
      {showConfigModal && (
        <ProductConfiguratorModal
          product={editingProduct}
          onClose={() => { setShowConfigModal(false); setEditingProduct(null); }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}
