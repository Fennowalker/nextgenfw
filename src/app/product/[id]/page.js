'use client';
import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './product.module.css';

/* ─── SHARED DATA ───────────────────────────────────────── */
const PRODUCTS = {
  1: {
    id: 1, name: 'Prada Minimalist Wire Frame', brand: 'Prada',
    price: 340, salePrice: null,
    category: 'Eyeglasses', gender: 'Unisex', material: 'Titanium Metal',
    tag: 'Premium', img: '/prada-frames.png',
    gallery: ['/prada-frames.png', '/tomford-frames.png', '/rayban-sunglasses.png'],
    description: `The Prada Minimalist Wire Frame redefines understated elegance. Crafted from aerospace-grade titanium, these frames are feather-light at just 12g while providing exceptional durability. The iconic thin wire silhouette pairs seamlessly with business and casual attire.`,
    features: ['Aerospace-grade titanium', 'Spring-hinge temples', 'Anti-reflective lens coating', 'UV400 protection', 'Adjustable nose pads', 'Includes premium case & cloth'],
    colors: [
      { name: 'Gold', hex: '#c5a47e' },
      { name: 'Silver', hex: '#c0c0c0' },
      { name: 'Gunmetal', hex: '#4a4a4a' },
    ],
    sizes: ['Small (50mm)', 'Medium (54mm)', 'Large (58mm)'],
    rating: 4.8, reviewCount: 128,
    isFrame: true,
    specifications: { 'Frame Width': '140mm', 'Lens Width': '54mm', 'Bridge': '18mm', 'Temple Length': '145mm', 'Weight': '12g', 'Lens Material': 'CR-39' },
  },
  2: {
    id: 2, name: 'Persol Calligrapher Edition', brand: 'Persol',
    price: 370, salePrice: 320,
    category: 'Sunglasses', gender: 'Men', material: 'Acetate',
    tag: 'Classic', img: '/persol-sunglasses.png',
    gallery: ['/persol-sunglasses.png', '/rayban-sunglasses.png', '/prada-frames.png'],
    description: `A collaboration between Persol and master calligrapher Luca Barcellona, this limited-edition frame features the iconic Supreme Arrow hinge mechanism and hand-cut acetate plates. Each frame is individually numbered and includes a certificate of authenticity.`,
    features: ['Supreme Arrow hinge mechanism', 'Hand-cut Italian acetate', 'Mineral glass lenses', 'Polarized UV400 protection', 'Individually numbered', 'Certificate of authenticity'],
    colors: [
      { name: 'Tortoise', hex: '#8b5e3c' },
      { name: 'Havana', hex: '#5c3317' },
    ],
    sizes: ['Standard (52mm)', 'Large (55mm)'],
    rating: 4.9, reviewCount: 214,
    isFrame: true,
    specifications: { 'Frame Width': '138mm', 'Lens Width': '52mm', 'Bridge': '19mm', 'Temple Length': '140mm', 'Weight': '28g', 'Lens Material': 'Mineral Glass' },
  },
  3: {
    id: 3, name: 'Tom Ford Keyhole Bridge', brand: 'Tom Ford',
    price: 310, salePrice: null,
    category: 'Eyeglasses', gender: 'Men', material: 'Acetate',
    tag: 'Modern', img: '/tomford-frames.png',
    gallery: ['/tomford-frames.png', '/prada-frames.png', '/persol-sunglasses.png'],
    description: `Tom Ford's signature keyhole bridge design makes a bold statement in Italian-made Mazzucchelli acetate. The oversized square shape offers broad lens coverage and a contemporary edge that defines the modern gentleman's wardrobe.`,
    features: ['Italian Mazzucchelli acetate', 'Signature TF logo hinges', 'Spring hinges for comfort', 'Includes Tom Ford case', 'Anti-scratch lens coating', 'Blue-light filtering available'],
    colors: [
      { name: 'Matte Black', hex: '#1a1a1a' },
      { name: 'Dark Havana', hex: '#3d2b1f' },
    ],
    sizes: ['Medium (54mm)', 'Large (57mm)'],
    rating: 4.7, reviewCount: 97,
    isFrame: true,
    specifications: { 'Frame Width': '143mm', 'Lens Width': '54mm', 'Bridge': '17mm', 'Temple Length': '145mm', 'Weight': '32g', 'Lens Material': 'CR-39' },
  },
  4: {
    id: 4, name: 'Ray-Ban Aviator Classic G-15', brand: 'Ray-Ban',
    price: 175, salePrice: null,
    category: 'Sunglasses', gender: 'Unisex', material: 'Metal',
    tag: 'Bestseller', img: '/rayban-sunglasses.png',
    gallery: ['/rayban-sunglasses.png', '/persol-sunglasses.png', '/tomford-frames.png'],
    description: `The original aviator since 1937. The Ray-Ban RB3025 Aviator Large Metal with classic G-15 lenses remains the world's best-selling sunglass frame. Worn by icons, built for everyone — from fighter pilots to film stars.`,
    features: ['Classic G-15 crystal lenses', 'Gold-plated metal frame', '100% UV protection', 'Adjustable nose pads', 'Bayonet temple design', 'Includes Ray-Ban case & cloth'],
    colors: [
      { name: 'Gold/G-15', hex: '#c5a47e' },
      { name: 'Silver/Blue', hex: '#708090' },
      { name: 'Black/Gray', hex: '#2c2c2c' },
    ],
    sizes: ['Small (55mm)', 'Medium (58mm)', 'Large (62mm)'],
    rating: 4.9, reviewCount: 1820,
    isFrame: true,
    specifications: { 'Frame Width': '137mm', 'Lens Width': '58mm', 'Bridge': '14mm', 'Temple Length': '135mm', 'Weight': '16g', 'Lens Material': 'Crystal' },
  },
  5: {
    id: 5, name: 'Acuvue Oasys Monthly', brand: 'Acuvue',
    price: 48, salePrice: null,
    category: 'Contact Lenses', gender: 'Unisex', material: 'Senofilcon A',
    tag: 'Top Rated', img: '/contact-lens-box.png',
    gallery: ['/contact-lens-box.png', '/contact-lens-box.png', '/contact-lens-box.png'],
    description: `Acuvue Oasys with Hydraclear Plus technology provides all-day moisture for even the driest eyes. The silicone hydrogel material allows up to 98% oxygen transmission, keeping your eyes white and healthy throughout the day.`,
    features: ['Hydraclear Plus technology', '98% oxygen transmission', 'UV blocking (Class 1)', 'Quarterly wear cycle', 'Suitable for dry eyes', 'Astigmatism variant available'],
    colors: [{ name: 'Clear', hex: '#e0f2fe' }],
    sizes: ['Box of 6', 'Box of 12'],
    rating: 4.8, reviewCount: 3412,
    isLens: true,
    sphRange: [-12.00, +8.00], bcOptions: ['8.4', '8.8'], diaOptions: ['14.0'],
    specifications: { 'Material': 'Senofilcon A', 'Water Content': '38%', 'Oxygen Dk/t': '147', 'Modality': 'Monthly', 'UV Blocking': 'Class 1', 'Diameter': '14.0mm' },
  },
};

const SAMPLE_REVIEWS = [
  { id: 1, author: 'Ahmed K.', rating: 5, date: '2026-08-10', title: 'Absolutely perfect!', text: 'I have been wearing glasses for 15 years and these are by far the best frames I have owned. The weight is barely noticeable and they stay in place all day. Highly recommend.', verified: true },
  { id: 2, author: 'Sara M.', rating: 5, date: '2026-08-05', title: 'Worth every penny', text: 'Quality is exceptional. The titanium is genuinely lightweight and the finish is flawless. Getting compliments every day.', verified: true },
  { id: 3, author: 'Usman A.', rating: 4, date: '2026-07-28', title: 'Great frame, sizing runs large', text: 'Beautiful frame but the medium fit like a large on me. Would suggest going one size smaller than you normally would. Otherwise perfect.', verified: true },
  { id: 4, author: 'Fatima N.', rating: 5, date: '2026-07-15', title: 'Stunning craftsmanship', text: 'The spring hinges are so smooth. These look and feel far more expensive than they are. The case is also a premium touch.', verified: false },
];

const RELATED = [1, 3, 4].map(id => PRODUCTS[id]);

const FACE_MODELS = [
  { id: 'oval', name: 'Oval Face Shape', fitNote: '98% Match — Highly versatile for square frames.', avatar: '👤 Model A (Oval)' },
  { id: 'round', name: 'Round Face Shape', fitNote: '95% Match — Angular frames add structure.', avatar: '👤 Model B (Round)' },
  { id: 'square', name: 'Square Face Shape', fitNote: '92% Match — Softens strong jawlines.', avatar: '👤 Model C (Square)' },
  { id: 'heart', name: 'Heart Face Shape', fitNote: '96% Match — Balances wider forehead.', avatar: '👤 Model D (Heart)' },
];

/* ─── VIRTUAL TRY-ON & FIT SIMULATOR MODAL ───────────────── */
function VirtualTryOnModal({ product, onClose }) {
  const [selectedFace, setSelectedFace] = useState('oval');
  const [scale, setScale] = useState(100);
  const [offsetY, setOffsetY] = useState(0);
  const [pd, setPd] = useState(64);
  const [frameColor, setFrameColor] = useState(product.colors[0]?.name || 'Gold');
  const [snapped, setSnapped] = useState(false);

  const faceObj = FACE_MODELS.find(f => f.id === selectedFace);

  function handleSnapPhoto() {
    setSnapped(true);
    setTimeout(() => setSnapped(false), 2500);
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.tryOnModalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3>🕶️ Virtual Fitting Room & AI Face Shape Simulator</h3>
            <p className={styles.modalSubHeader}>Live frame overlay preview, Pupillary Distance (PD) aligner & face shape analyzer.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.tryOnModalBody}>
          {/* Virtual Stage Viewport */}
          <div className={styles.viewportStage}>
            {/* Simulated Face Canvas */}
            <div className={styles.faceCanvas}>
              <div className={styles.faceGraphic}>
                <div className={styles.eyeLine}>
                  <div className={styles.eyePupil} />
                  <div className={styles.eyePupil} />
                </div>
                <div className={styles.noseBridge} />
                <div className={styles.mouthLine} />
              </div>

              {/* Dynamic Frame Overlay */}
              <div
                className={styles.frameOverlayWrap}
                style={{
                  transform: `scale(${scale / 100}) translateY(${offsetY}px)`,
                }}
              >
                <Image
                  src={product.img}
                  alt={product.name}
                  width={340}
                  height={220}
                  className={styles.overlayFrameImg}
                />
              </div>

              {/* PD Measurement Ruler Guide Overlay */}
              <div className={styles.pdRulerGuide}>
                <div className={styles.pdRulerLine} style={{ width: `${pd * 2.8}px` }}>
                  <span className={styles.pdCap}>|</span>
                  <span className={styles.pdValLabel}>{pd} mm PD</span>
                  <span className={styles.pdCap}>|</span>
                </div>
              </div>
            </div>

            {/* AI Fit Recommendation Box */}
            <div className={styles.aiFitCard}>
              <span className={styles.aiSparkleIcon}>✨ AI Fit Analysis</span>
              <h4>{product.name}</h4>
              <p className={styles.aiFitMatch}>{faceObj.fitNote}</p>
              <div className={styles.matchScorePill}>98% Recommendation Score</div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className={styles.tryOnControls}>
            {/* Model Selector */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Select Face Shape Model:</label>
              <div className={styles.modelGrid}>
                {FACE_MODELS.map(m => (
                  <button
                    key={m.id}
                    className={`${styles.modelBtn} ${selectedFace === m.id ? styles.modelActive : ''}`}
                    onClick={() => setSelectedFace(m.id)}
                  >
                    {m.avatar}
                  </button>
                ))}
              </div>
            </div>

            {/* Frame Swatch Selector */}
            <div className={styles.controlGroup}>
              <label className={styles.controlLabel}>Frame Color Tint:</label>
              <div className={styles.colorPillRow}>
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    className={`${styles.colorPill} ${frameColor === c.name ? styles.colorPillActive : ''}`}
                    onClick={() => setFrameColor(c.name)}
                  >
                    <span className={styles.colorDot} style={{ background: c.hex }} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale & Alignment Sliders */}
            <div className={styles.sliderGrid}>
              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Frame Scale ({scale}%):</label>
                <input
                  type="range"
                  min="80"
                  max="120"
                  value={scale}
                  onChange={e => setScale(e.target.value)}
                  className={styles.rangeSlider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Vertical Fit Adjustment ({offsetY}px):</label>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={offsetY}
                  onChange={e => setOffsetY(e.target.value)}
                  className={styles.rangeSlider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.controlLabel}>Pupillary Distance Ruler ({pd}mm):</label>
                <input
                  type="range"
                  min="58"
                  max="72"
                  value={pd}
                  onChange={e => setPd(e.target.value)}
                  className={styles.rangeSlider}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className={styles.modalFooterSummary}>
          <button className="btn-secondary" onClick={handleSnapPhoto}>
            {snapped ? '📸 Saved Preview Snap!' : '📷 Snap & Save Look'}
          </button>
          <button className="btn-primary" onClick={onClose}>
            ✓ Complete Fitting & Return to Frame →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── LENS CUSTOMIZER CONFIG OPTIONS ────────────────────── */
const LENS_TYPES = [
  { id: 'nonrx', label: 'Clear Fashion Lenses', desc: 'No prescription, non-corrective lenses', price: 0, icon: '👓' },
  { id: 'single', label: 'Single Vision', desc: 'Distance, Reading, or Computer use', price: 1200, icon: '👁️' },
  { id: 'progressive', label: 'Progressive No-Line', desc: 'Distance + Intermediate + Reading in one', price: 3500, icon: '🔬', badge: 'Popular' },
  { id: 'bluecut', label: 'Digital Blue-Cut', desc: 'Blocks 99% harmful blue light from screens', price: 2200, icon: '💻' },
];

const LENS_INDEXES = [
  { id: '1.56', label: '1.56 Standard Thin', desc: 'Ideal for SPH -2.00 to +2.00', price: 0 },
  { id: '1.61', label: '1.61 Super Thin', desc: '30% thinner, ideal for SPH -4.00 to +4.00', price: 1800, badge: 'Recommended' },
  { id: '1.67', label: '1.67 Ultra Thin', desc: '45% thinner, ideal for high prescriptions SPH > -4.00', price: 3200 },
  { id: '1.74', label: '1.74 Extreme Thin', desc: 'Maximum thinness & lightness for high SPH', price: 5500 },
];

const COATING_OPTIONS = [
  { id: 'ar', label: 'Anti-Reflective & Hydrophobic', desc: 'Eliminates glare, smudges & water spots', price: 800 },
  { id: 'transitions', label: 'Transitions Signature Gen 8', desc: 'Auto-darkens in sunlight, clear indoors', price: 2800, badge: 'Adaptive' },
  { id: 'polarized', label: 'Polarized Sun Tint', desc: 'Reduces glare from roads & water surfaces', price: 2400 },
];

/* ─── ADVANCED LENS CUSTOMIZER MODAL ─────────────────────── */
function LensCustomizerModal({ framePrice, onClose, onApplyCustomization }) {
  const [lensType, setLensType] = useState('single');
  const [rxSource, setRxSource] = useState('vault');
  const [lensIndex, setLensIndex] = useState('1.61');
  const [selectedCoatings, setSelectedCoatings] = useState(['ar']);

  const [odSph, setOdSph] = useState('-2.50');
  const [odCyl, setOdCyl] = useState('-0.75');
  const [odAxis, setOdAxis] = useState('180');
  const [osSph, setOsSph] = useState('-2.25');
  const [osCyl, setOsCyl] = useState('-0.50');
  const [osAxis, setOsAxis] = useState('175');
  const [pd, setPd] = useState('63');

  function toggleCoating(cId) {
    setSelectedCoatings(prev => prev.includes(cId) ? prev.filter(id => id !== cId) : [...prev, cId]);
  }

  const lensTypeObj = LENS_TYPES.find(t => t.id === lensType);
  const lensIndexObj = LENS_INDEXES.find(i => i.id === lensIndex);
  const coatingExtra = selectedCoatings.reduce((acc, cId) => acc + (COATING_OPTIONS.find(c => c.id === cId)?.price || 0), 0);

  const lensTotalCost = (lensTypeObj?.price || 0) + (lensIndexObj?.price || 0) + coatingExtra;
  const grandTotal = framePrice + lensTotalCost;

  function handleSave() {
    onApplyCustomization({
      lensType: lensTypeObj.label,
      lensIndex: lensIndexObj.label,
      coatings: selectedCoatings.map(cId => COATING_OPTIONS.find(c => c.id === cId).label),
      rxSummary: rxSource === 'vault' ? 'Dr. Farooq Saved Rx (OD -2.50 / OS -2.25)' : `OD ${odSph}/${odCyl} | OS ${osSph}/${osCyl} | PD ${pd}mm`,
      lensCost: lensTotalCost,
      grandTotal,
    });
    onClose();
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.lensModalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <h3>🔬 Optical Lens & Coating Customizer Engine</h3>
            <p className={styles.modalSubHeader}>Bespoke lens fitting with precision refractive indices & premium optical coatings.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.lensModalBody}>
          <div className={styles.customStep}>
            <h4 className={styles.stepHeader}>Step 1: Choose Your Lens Type</h4>
            <div className={styles.lensTypeGrid}>
              {LENS_TYPES.map(type => (
                <div
                  key={type.id}
                  className={`${styles.lensTypeCard} ${lensType === type.id ? styles.cardSelected : ''}`}
                  onClick={() => setLensType(type.id)}
                >
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardIcon}>{type.icon}</span>
                    {type.badge && <span className={styles.cardBadge}>{type.badge}</span>}
                  </div>
                  <h5 className={styles.cardTitle}>{type.label}</h5>
                  <p className={styles.cardDesc}>{type.desc}</p>
                  <span className={styles.cardPrice}>
                    {type.price === 0 ? 'Included (Free)' : `+Rs ${type.price.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {lensType !== 'nonrx' && (
            <div className={styles.customStep}>
              <h4 className={styles.stepHeader}>Step 2: Provide Your Optical Prescription</h4>
              <div className={styles.rxSourceRow}>
                {[
                  { id: 'vault', label: '📜 Use Saved Rx from Vault (Recommended)', desc: 'Dr. Farooq Saved Rx (OD -2.50 / OS -2.25)' },
                  { id: 'manual', label: '✍️ Enter Rx Manually', desc: 'Input SPH, CYL, AXIS & PD' },
                  { id: 'later', label: '📩 Send Prescription Later', desc: 'Email / WhatsApp photo after checkout' },
                ].map(src => (
                  <div
                    key={src.id}
                    className={`${styles.rxSourceCard} ${rxSource === src.id ? styles.cardSelected : ''}`}
                    onClick={() => setRxSource(src.id)}
                  >
                    <strong>{src.label}</strong>
                    <p>{src.desc}</p>
                  </div>
                ))}
              </div>

              {rxSource === 'manual' && (
                <div className={styles.manualRxBox}>
                  <div className={styles.rxRowGroup}>
                    <label>Right Eye (OD):</label>
                    <input type="text" value={odSph} onChange={e => setOdSph(e.target.value)} placeholder="SPH -2.50" className={styles.miniRxInput} />
                    <input type="text" value={odCyl} onChange={e => setOdCyl(e.target.value)} placeholder="CYL -0.75" className={styles.miniRxInput} />
                    <input type="text" value={odAxis} onChange={e => setOdAxis(e.target.value)} placeholder="AXIS 180" className={styles.miniRxInput} />
                  </div>
                  <div className={styles.rxRowGroup}>
                    <label>Left Eye (OS):</label>
                    <input type="text" value={osSph} onChange={e => setOsSph(e.target.value)} placeholder="SPH -2.25" className={styles.miniRxInput} />
                    <input type="text" value={osCyl} onChange={e => setOsCyl(e.target.value)} placeholder="CYL -0.50" className={styles.miniRxInput} />
                    <input type="text" value={osAxis} onChange={e => setOsAxis(e.target.value)} placeholder="AXIS 175" className={styles.miniRxInput} />
                  </div>
                  <div className={styles.rxRowGroup}>
                    <label>Pupillary Distance (PD):</label>
                    <input type="text" value={pd} onChange={e => setPd(e.target.value)} placeholder="63mm" className={styles.miniRxInput} />
                  </div>
                </div>
              )}
            </div>
          )}

          <div className={styles.customStep}>
            <h4 className={styles.stepHeader}>Step 3: Select Lens Thinness & Refractive Index</h4>
            <div className={styles.indexGrid}>
              {LENS_INDEXES.map(idx => (
                <div
                  key={idx.id}
                  className={`${styles.indexCard} ${lensIndex === idx.id ? styles.cardSelected : ''}`}
                  onClick={() => setLensIndex(idx.id)}
                >
                  <div className={styles.cardTopRow}>
                    <strong>{idx.label}</strong>
                    {idx.badge && <span className={styles.cardBadgeGreen}>{idx.badge}</span>}
                  </div>
                  <p className={styles.cardDesc}>{idx.desc}</p>
                  <span className={styles.cardPrice}>
                    {idx.price === 0 ? 'Standard (Included)' : `+Rs ${idx.price.toLocaleString()}`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.customStep}>
            <h4 className={styles.stepHeader}>Step 4: Premium Coatings & Tint Enhancements</h4>
            <div className={styles.coatingGrid}>
              {COATING_OPTIONS.map(c => (
                <div
                  key={c.id}
                  className={`${styles.coatingCard} ${selectedCoatings.includes(c.id) ? styles.cardSelected : ''}`}
                  onClick={() => toggleCoating(c.id)}
                >
                  <div className={styles.cardTopRow}>
                    <div className={styles.chkWrap}>
                      <input type="checkbox" checked={selectedCoatings.includes(c.id)} readOnly />
                      <strong>{c.label}</strong>
                    </div>
                    {c.badge && <span className={styles.cardBadgeBlue}>{c.badge}</span>}
                  </div>
                  <p className={styles.cardDesc}>{c.desc}</p>
                  <span className={styles.cardPrice}>+Rs {c.price.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.modalFooterSummary}>
          <div className={styles.summaryBreakdown}>
            <div className={styles.breakdownCol}>
              <span className={styles.breakdownLabel}>Frame: <strong>Rs {framePrice.toLocaleString()}</strong></span>
              <span className={styles.breakdownLabel}>Lens Package: <strong>+Rs {lensTotalCost.toLocaleString()}</strong></span>
            </div>
            <div className={styles.totalCol}>
              <span>Grand Total:</span>
              <strong className={styles.grandPrice}>Rs {grandTotal.toLocaleString()}</strong>
            </div>
          </div>
          <button className="btn-primary" onClick={handleSave}>
            ✓ Save Lens Package & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── STAR RATING INPUT ─────────────────────────────────── */
function StarInput({ value, onChange }) {
  const [hover, setHover] = useState(0);
  return (
    <div className={styles.starInput}>
      {[1,2,3,4,5].map(s => (
        <span
          key={s}
          className={s <= (hover || value) ? styles.starOn : styles.starOff}
          onMouseEnter={() => setHover(s)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(s)}
        >★</span>
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div className={styles.ratingBarRow}>
      <span className={styles.ratingBarLabel}>{stars}★</span>
      <div className={styles.ratingBarTrack}>
        <div className={styles.ratingBarFill} style={{ width: `${pct}%` }} />
      </div>
      <span className={styles.ratingBarCount}>{count}</span>
    </div>
  );
}

/* ─── MAIN PAGE ─────────────────────────────────────────── */
export default function ProductPage({ params }) {
  const { id } = use(params);
  const product = PRODUCTS[parseInt(id)] || PRODUCTS[1];

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState(0);
  const [activeImg, setActiveImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [wishlist, setWishlist] = useState(false);

  // Modals
  const [showLensModal, setShowLensModal] = useState(false);
  const [showTryOnModal, setShowTryOnModal] = useState(false);
  const [customLensPackage, setCustomLensPackage] = useState(null);

  const [rxSph, setRxSph] = useState('');
  const [rxCyl, setRxCyl] = useState('');
  const [rxBc, setRxBc] = useState('');
  const [rxDia, setRxDia] = useState('');

  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [newReview, setNewReview] = useState({ rating: 0, title: '', text: '', author: '' });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const currentPrice = product.salePrice || product.price;
  const finalUnitPrice = customLensPackage ? customLensPackage.grandTotal : currentPrice;

  const getVolumePrice = () => {
    if (qty >= 6) return (currentPrice * qty * 0.85).toFixed(2);
    if (qty >= 4) return (currentPrice * qty * 0.90).toFixed(2);
    if (qty >= 2) return (currentPrice * qty * 0.95).toFixed(2);
    return (currentPrice * qty).toFixed(2);
  };
  const getDiscount = () => {
    if (qty >= 6) return '15% off';
    if (qty >= 4) return '10% off';
    if (qty >= 2) return '5% off';
    return null;
  };

  function handleAddToCart() {
    setAddedToCart(true);
    try {
      const saved = localStorage.getItem('fenno_cart');
      const currentCart = saved ? JSON.parse(saved) : [];
      const itemPrice = customLensPackage ? currentPrice + customLensPackage.price : currentPrice;
      const cartItem = {
        id: product.id,
        name: product.name,
        price: itemPrice,
        qty: qty,
        img: product.img,
        color: selectedColor,
        size: selectedSize,
      };
      const existing = currentCart.find(i => i.id === product.id && i.color === selectedColor && i.size === selectedSize);
      const nextCart = existing
        ? currentCart.map(i => i === existing ? { ...i, qty: i.qty + qty } : i)
        : [...currentCart, cartItem];
      localStorage.setItem('fenno_cart', JSON.stringify(nextCart));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to sync product to cart:', e);
    }
    setTimeout(() => setAddedToCart(false), 2500);
  }

  function handleSubmitReview(e) {
    e.preventDefault();
    if (!newReview.rating || !newReview.text || !newReview.author) return;
    setReviews(prev => [{
      id: prev.length + 1,
      author: newReview.author,
      rating: newReview.rating,
      date: new Date().toISOString().split('T')[0],
      title: newReview.title || 'My Review',
      text: newReview.text,
      verified: false,
    }, ...prev]);
    setReviewSubmitted(true);
    setNewReview({ rating: 0, title: '', text: '', author: '' });
  }

  const totalRatings = reviews.length;
  const ratingDist = [5,4,3,2,1].map(s => ({ stars: s, count: reviews.filter(r => r.rating === s).length }));

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumbWrap}>
        <div className="container">
          <nav className={styles.breadcrumb}>
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/#catalog">{product.category}</Link>
            <span>›</span>
            <span>{product.brand}</span>
            <span>›</span>
            <span className={styles.breadActive}>{product.name}</span>
          </nav>
        </div>
      </div>

      <section className={styles.productMain}>
        <div className="container">
          <div className={styles.productLayout}>
            {/* Gallery */}
            <div className={styles.gallery}>
              <div className={styles.thumbnailCol}>
                {product.gallery.map((src, i) => (
                  <button
                    key={i}
                    className={`${styles.thumbnail} ${activeImg === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <Image src={src} alt={`View ${i+1}`} width={80} height={60} className={styles.thumbImg} />
                  </button>
                ))}
              </div>
              <div className={styles.mainImgWrap}>
                <Image
                  src={product.gallery[activeImg]}
                  alt={product.name}
                  width={600} height={480}
                  className={styles.mainImg}
                  priority
                />
                <button
                  className={`${styles.wishlistBtn} ${wishlist ? styles.wishlistActive : ''}`}
                  onClick={() => setWishlist(w => !w)}
                  aria-label="Add to wishlist"
                >
                  {wishlist ? '♥' : '♡'}
                </button>
                {product.salePrice && (
                  <div className={styles.saleBadge}>SALE</div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.infoHeader}>
                <span className={styles.brandLabel}>{product.brand}</span>
                <span className={`${styles.tagChip} ${styles[`tag_${product.tag.replace(/\s/g,'')}`]}`}>{product.tag}</span>
              </div>
              <h1 className={styles.productName}>{product.name}</h1>

              <div className={styles.ratingSummary}>
                <div className={styles.stars}>
                  {[1,2,3,4,5].map(s => (
                    <span key={s} style={{ color: s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db', fontSize:'1.1rem' }}>★</span>
                  ))}
                </div>
                <span className={styles.ratingNum}>{product.rating}</span>
                <button className={styles.reviewLink} onClick={() => setActiveTab('reviews')}>
                  ({product.reviewCount} reviews)
                </button>
              </div>

              <div className={styles.priceRow}>
                {product.salePrice ? (
                  <>
                    <span className={styles.salePrice}>Rs {finalUnitPrice.toLocaleString()}</span>
                    <span className={styles.originalPrice}>Rs {product.price.toLocaleString()}</span>
                    <span className={styles.saveBadge}>Save Rs {(product.price - product.salePrice).toLocaleString()}</span>
                  </>
                ) : (
                  <span className={styles.price}>Rs {finalUnitPrice.toLocaleString()}</span>
                )}
              </div>

              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Color: <strong>{product.colors[selectedColor].name}</strong></p>
                <div className={styles.colorRow}>
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      className={`${styles.colorBtn} ${selectedColor === i ? styles.colorActive : ''}`}
                      style={{ background: c.hex }}
                      onClick={() => setSelectedColor(i)}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Size:</p>
                <div className={styles.sizeRow}>
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      className={`${styles.sizeBtn} ${selectedSize === i ? styles.sizeActive : ''}`}
                      onClick={() => setSelectedSize(i)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* VIRTUAL TRY-ON & LENS LAB BUTTONS FOR FRAMES */}
              {product.isFrame && (
                <div className={styles.labRowFlex}>
                  <button className={styles.tryOnBtn} onClick={() => setShowTryOnModal(true)}>
                    🕶️ Virtual Try-On & Fit Simulator
                  </button>

                  <div className={styles.lensLabBanner}>
                    <div className={styles.lensLabBannerText}>
                      <span className={styles.lensLabIcon}>🔬</span>
                      <div>
                        <strong>Optical Lens & Coating Customizer</strong>
                        <p>Single Vision, Progressive, Blue-Cut & Transitions</p>
                      </div>
                    </div>
                    <button className={styles.customizeLensBtn} onClick={() => setShowLensModal(true)}>
                      {customLensPackage ? '✏️ Edit Lens Package' : '+ Add Prescription Lenses'}
                    </button>

                    {customLensPackage && (
                      <div className={styles.customSummaryBox}>
                        <p><strong>Package:</strong> {customLensPackage.lensType} ({customLensPackage.lensIndex})</p>
                        <p><strong>Coatings:</strong> {customLensPackage.coatings.join(', ') || 'Standard'}</p>
                        <p><strong>Rx:</strong> {customLensPackage.rxSummary}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {product.isLens && (
                <div className={styles.rxSection}>
                  <p className={styles.optionLabel}>🔬 Your Prescription (Rx)</p>
                  <div className={styles.rxGrid}>
                    {[
                      { label: 'SPH', val: rxSph, set: setRxSph, placeholder: '0.00', step: '0.25' },
                      { label: 'CYL', val: rxCyl, set: setRxCyl, placeholder: '0.00', step: '0.25' },
                      { label: 'Base Curve', val: rxBc, set: setRxBc, placeholder: '8.4' },
                      { label: 'Diameter', val: rxDia, set: setRxDia, placeholder: '14.0' },
                    ].map(f => (
                      <div key={f.label} className={styles.rxField}>
                        <label className={styles.rxLabel}>{f.label}</label>
                        <input
                          type="number"
                          value={f.val}
                          onChange={e => f.set(e.target.value)}
                          placeholder={f.placeholder}
                          step={f.step || '0.1'}
                          className={styles.rxInput}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.optionGroup}>
                <p className={styles.optionLabel}>Quantity{product.isLens && getDiscount() ? <span className={styles.discountBadge}> — {getDiscount()}</span> : null}:</p>
                <div className={styles.qtyRow}>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className={styles.qtyVal}>{qty}</span>
                  <button className={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
                  {product.isLens && (
                    <span className={styles.volumeHint}>
                      {qty < 2 ? 'Buy 2+ for 5% off' : qty < 4 ? 'Buy 4+ for 10% off' : qty < 6 ? 'Buy 6+ for 15% off' : '🎉 Max discount applied!'}
                    </span>
                  )}
                </div>
              </div>

              {product.isLens && (
                <div className={styles.lensTotal}>
                  <span>Total:</span>
                  <strong>Rs {getVolumePrice()}</strong>
                  {getDiscount() && <span className={styles.savedLabel}>You save Rs {((product.price * qty) - parseFloat(getVolumePrice())).toFixed(2)}</span>}
                </div>
              )}

              <div className={styles.actionRow}>
                <button
                  className={`${styles.addCartBtn} ${addedToCart ? styles.addedCart : ''}`}
                  onClick={handleAddToCart}
                >
                  {addedToCart ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                </button>
                <Link href="/checkout" className={styles.buyNowBtn}>Buy Now →</Link>
              </div>

              <div className={styles.trustRow}>
                <span>🚚 Free shipping over Rs 5,000</span>
                <span>🔄 30-day returns</span>
                <span>🛡️ 1-year warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABS ── */}
      <section className={styles.tabSection}>
        <div className="container">
          <div className={styles.tabNav}>
            {['description','specifications','reviews'].map(tab => (
              <button
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className={styles.tabContent}>
              <div className={styles.descLayout}>
                <div>
                  <p className={styles.descText}>{product.description}</p>
                  <h3 className={styles.featuresTitle}>What&apos;s Included</h3>
                  <ul className={styles.featureList}>
                    {product.features.map((f, i) => (
                      <li key={i} className={styles.featureItem}><span>✓</span> {f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className={styles.tabContent}>
              <div className={styles.specGrid}>
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className={styles.specRow}>
                    <span className={styles.specKey}>{k}</span>
                    <span className={styles.specVal}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className={styles.tabContent}>
              <div className={styles.reviewLayout}>
                <div className={styles.reviewSummary}>
                  <div className={styles.ratingBig}>{product.rating}</div>
                  <div className={styles.stars}>
                    {[1,2,3,4,5].map(s => (
                      <span key={s} style={{ color: s <= Math.round(product.rating) ? '#f59e0b' : '#d1d5db', fontSize:'1.4rem' }}>★</span>
                    ))}
                  </div>
                  <p className={styles.reviewCountLabel}>Based on {product.reviewCount} reviews</p>
                  <div className={styles.ratingBars}>
                    {ratingDist.map(r => (
                      <RatingBar key={r.stars} stars={r.stars} count={r.count} total={totalRatings} />
                    ))}
                  </div>
                </div>

                <div className={styles.reviewMain}>
                  {!reviewSubmitted ? (
                    <form className={`${styles.reviewForm} glass-panel`} onSubmit={handleSubmitReview}>
                      <h3>Write a Review</h3>
                      <div className={styles.reviewFormRow}>
                        <div className={styles.reviewFormField}>
                          <label>Your Rating *</label>
                          <StarInput value={newReview.rating} onChange={v => setNewReview(r => ({...r, rating: v}))} />
                        </div>
                        <div className={styles.reviewFormField}>
                          <label>Your Name *</label>
                          <input
                            type="text" placeholder="e.g. Ahmed K."
                            value={newReview.author}
                            onChange={e => setNewReview(r => ({...r, author: e.target.value}))}
                            className={styles.reviewInput}
                          />
                        </div>
                      </div>
                      <div className={styles.reviewFormField}>
                        <label>Review Title</label>
                        <input
                          type="text" placeholder="Summarize your experience"
                          value={newReview.title}
                          onChange={e => setNewReview(r => ({...r, title: e.target.value}))}
                          className={styles.reviewInput}
                        />
                      </div>
                      <div className={styles.reviewFormField}>
                        <label>Your Review *</label>
                        <textarea
                          placeholder="Share your experience with this product..."
                          value={newReview.text}
                          onChange={e => setNewReview(r => ({...r, text: e.target.value}))}
                          className={styles.reviewTextarea}
                          rows={4}
                        />
                      </div>
                      <button type="submit" className="btn-primary">Submit Review</button>
                    </form>
                  ) : (
                    <div className={`${styles.reviewThanks} glass-panel`}>
                      <span>🎉</span>
                      <p>Thank you! Your review has been submitted for moderation.</p>
                    </div>
                  )}

                  <div className={styles.reviewCards}>
                    {reviews.map(r => (
                      <div key={r.id} className={styles.reviewCard}>
                        <div className={styles.reviewTop}>
                          <div className={styles.reviewAuthorWrap}>
                            <div className={styles.reviewAvatar}>{r.author.charAt(0)}</div>
                            <div>
                              <p className={styles.reviewAuthor}>
                                {r.author}
                                {r.verified && <span className={styles.verifiedBadge}>✓ Verified Buyer</span>}
                              </p>
                              <p className={styles.reviewDate}>{r.date}</p>
                            </div>
                          </div>
                          <div className={styles.stars}>
                            {[1,2,3,4,5].map(s => (
                              <span key={s} style={{ color: s <= r.rating ? '#f59e0b' : '#d1d5db' }}>★</span>
                            ))}
                          </div>
                        </div>
                        <p className={styles.reviewTitle}>{r.title}</p>
                        <p className={styles.reviewBody}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── RELATED PRODUCTS ── */}
      <section className={styles.relatedSection}>
        <div className="container">
          <h2 className={styles.relatedTitle}>You May Also Like</h2>
          <div className={styles.relatedGrid}>
            {RELATED.filter(p => p.id !== product.id).slice(0, 3).map(p => (
              <Link key={p.id} href={`/product/${p.id}`} className={styles.relatedCard}>
                <Image src={p.img} alt={p.name} width={300} height={200} className={styles.relatedImg} />
                <div className={styles.relatedInfo}>
                  <span className={styles.relatedBrand}>{p.brand}</span>
                  <p className={styles.relatedName}>{p.name}</p>
                  <strong className={styles.relatedPrice}>Rs {p.price.toLocaleString()}</strong>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lens Customizer Modal */}
      {showLensModal && (
        <LensCustomizerModal
          framePrice={currentPrice}
          onClose={() => setShowLensModal(false)}
          onApplyCustomization={setCustomLensPackage}
        />
      )}

      {/* Virtual Try-On Modal */}
      {showTryOnModal && (
        <VirtualTryOnModal
          product={product}
          onClose={() => setShowTryOnModal(false)}
        />
      )}
    </div>
  );
}
