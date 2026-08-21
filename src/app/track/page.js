'use client';
import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './track.module.css';

/* ─── MOCK ORDER TRACKING DATABASE ───────────────────────── */
const TRACKING_DATA = {
  'ORD-8821': {
    orderId: '#ORD-8821',
    customerName: 'Ahmed Khan',
    datePlaced: '2026-08-20',
    estDelivery: '2026-08-23',
    courier: 'TCS Express',
    trackingNumber: 'TCS-998124401',
    statusStep: 3, // 0: Placed, 1: Glazing/Lab, 2: QC Passed, 3: Dispatched, 4: Delivered
    statusText: 'Dispatched & In Transit',
    items: [
      { name: 'Prada Minimalist Wire Frame', brand: 'Prada', color: 'Gold', size: 'Medium (54mm)', price: 340, qty: 1, img: '/prada-frames.png' },
    ],
    shippingAddress: '123 Main Street, Gulshan-e-Iqbal, Block 4, Karachi, Pakistan',
    timeline: [
      { status: 'Out for Delivery', date: '2026-08-23 09:15 AM', desc: 'Courier driver assigned. Package is on the delivery vehicle.', done: false },
      { status: 'Arrived at Local Courier Hub', date: '2026-08-21 04:30 AM', desc: 'Package arrived at Karachi Main Distribution Facility.', done: true },
      { status: 'Dispatched via Courier', date: '2026-08-20 06:45 PM', desc: 'Package handed over to TCS Express. Tracking ID activated.', done: true },
      { status: 'Optical QC Inspection Passed', date: '2026-08-20 02:15 PM', desc: 'Passed focal alignment, UV400 protection, and frame tension verification.', done: true },
      { status: 'Optical Lab Glazing Completed', date: '2026-08-20 11:30 AM', desc: 'Lenses edged, coated with Anti-Reflective layer & mounted to titanium frame.', done: true },
      { status: 'Order Placed & Verified', date: '2026-08-20 09:00 AM', desc: 'Prescription verified against Dr. Farooq record. Payment authorized.', done: true },
    ],
  },
  'ORD-8804': {
    orderId: '#ORD-8804',
    customerName: 'Ahmed Khan',
    datePlaced: '2026-06-12',
    estDelivery: '2026-06-14',
    courier: 'Leopard Courier',
    trackingNumber: 'LPD-441290199',
    statusStep: 4,
    statusText: 'Delivered',
    items: [
      { name: 'Acuvue Oasys Monthly (Box of 6)', brand: 'Acuvue', color: 'Clear', size: 'Box of 6', price: 48, qty: 6, img: '/contact-lens-box.png' },
    ],
    shippingAddress: '123 Main Street, Gulshan-e-Iqbal, Block 4, Karachi, Pakistan',
    timeline: [
      { status: 'Delivered to Recipient', date: '2026-06-14 02:30 PM', desc: 'Signed for by Ahmed Khan.', done: true },
      { status: 'Out for Delivery', date: '2026-06-14 09:00 AM', desc: 'Courier driver assigned.', done: true },
      { status: 'Dispatched via Courier', date: '2026-06-12 05:00 PM', desc: 'Handed over to Leopard Courier.', done: true },
      { status: 'Order Verified', date: '2026-06-12 10:00 AM', desc: 'Payment confirmed.', done: true },
    ],
  },
};

const STAGES = [
  'Order Verified',
  'Optical Lab Glazing',
  'QC Passed',
  'In Transit',
  'Delivered',
];

export default function TrackPage({ searchParams }) {
  const resolvedSearchParams = use(searchParams);
  const initialId = (resolvedSearchParams?.id || 'ORD-8821').replace('#', '').toUpperCase();

  const [inputQuery, setInputQuery] = useState(initialId);
  const [activeOrder, setActiveOrder] = useState(TRACKING_DATA[initialId] || TRACKING_DATA['ORD-8821']);
  const [searched, setSearched] = useState(false);

  function handleSearch(e) {
    e.preventDefault();
    const cleanKey = inputQuery.trim().replace('#', '').toUpperCase();
    const found = TRACKING_DATA[cleanKey];
    if (found) {
      setActiveOrder(found);
      setSearched(true);
    } else {
      alert(`Order "${inputQuery}" not found. Try searching for #ORD-8821 or #ORD-8804.`);
    }
  }

  return (
    <div className={styles.trackPage}>
      {/* ── HEADER NAVIGATION ── */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerInner}>
            <Link href="/" className={styles.logo}>
              <img src="/fenno-walker-logo.svg" alt="FENNO WALKER" height="28" style={{ width: '170px', maxWidth: '170px', objectFit: 'contain' }} />
            </Link>
            <div className={styles.navRight}>
              <Link href="/account" className={styles.navLink}>📜 My Rx Vault</Link>
              <Link href="/admin" className={styles.navAdmin}>⚡ Admin Dashboard</Link>
            </div>
          </div>
        </div>
      </header>

      {/* ── HERO LOOKUP BANNER ── */}
      <section className={styles.searchBanner}>
        <div className="container">
          <div className={styles.searchBannerContent}>
            <h1 className={styles.bannerTitle}>🚚 Live Courier Order Tracker</h1>
            <p className={styles.bannerSub}>Track your optical order from precision lab glazing to doorstep delivery.</p>

            <form onSubmit={handleSearch} className={styles.searchBox}>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>🔍</span>
                <input
                  type="text"
                  placeholder="Enter Order ID (e.g. ORD-8821 or ORD-8804)"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  className={styles.searchInput}
                />
              </div>
              <button type="submit" className={styles.searchBtn}>Track Order →</button>
            </form>
          </div>
        </div>
      </section>

      {/* ── MAIN TRACKING DASHBOARD ── */}
      <main className="container">
        <div className={styles.trackLayout}>
          {/* Main Status & Timeline */}
          <div className={styles.mainCol}>
            {/* Status Card Header */}
            <div className={styles.statusCard}>
              <div className={styles.statusTopRow}>
                <div>
                  <span className={styles.orderIdBadge}>{activeOrder.orderId}</span>
                  <h2 className={styles.statusHeading}>{activeOrder.statusText}</h2>
                  <p className={styles.placedMeta}>Placed on {activeOrder.datePlaced} · Est. Delivery: <strong>{activeOrder.estDelivery}</strong></p>
                </div>
                <div className={styles.courierPill}>
                  <span>🚚 {activeOrder.courier}</span>
                  <code>{activeOrder.trackingNumber}</code>
                </div>
              </div>

              {/* Progress Bar Stepper */}
              <div className={styles.stepperContainer}>
                {STAGES.map((stage, idx) => (
                  <div key={stage} className={styles.stepItem}>
                    <div className={`${styles.stepCircle} ${idx < activeOrder.statusStep ? styles.stepComplete : idx === activeOrder.statusStep ? styles.stepCurrent : styles.stepPending}`}>
                      {idx < activeOrder.statusStep ? '✓' : idx + 1}
                    </div>
                    <span className={`${styles.stepLabel} ${idx <= activeOrder.statusStep ? styles.labelActive : ''}`}>{stage}</span>
                    {idx < STAGES.length - 1 && (
                      <div className={`${styles.stepLine} ${idx < activeOrder.statusStep ? styles.lineComplete : ''}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Activity Timeline */}
            <div className={styles.timelineCard}>
              <h3 className={styles.cardSectionTitle}>⏱️ Detailed Shipping & Lab Activity Log</h3>
              <div className={styles.timelineList}>
                {activeOrder.timeline.map((event, i) => (
                  <div key={i} className={`${styles.timelineItem} ${event.done ? styles.eventDone : styles.eventPending}`}>
                    <div className={styles.timelineMarker}>
                      <div className={styles.markerDot} />
                      {i < activeOrder.timeline.length - 1 && <div className={styles.markerLine} />}
                    </div>
                    <div className={styles.eventContent}>
                      <div className={styles.eventTop}>
                        <h4 className={styles.eventStatus}>{event.status}</h4>
                        <span className={styles.eventDate}>{event.date}</span>
                      </div>
                      <p className={styles.eventDesc}>{event.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <aside className={styles.sideCol}>
            {/* Courier Info */}
            <div className={styles.sideCard}>
              <h4 className={styles.sideTitle}>📦 Courier & Delivery Info</h4>
              <div className={styles.sideRow}><span>Partner</span><strong>{activeOrder.courier}</strong></div>
              <div className={styles.sideRow}><span>Tracking ID</span><code className={styles.codeText}>{activeOrder.trackingNumber}</code></div>
              <div className={styles.sideRow}><span>Est. Delivery</span><strong>{activeOrder.estDelivery}</strong></div>
              <div className={styles.sideRow}><span>Recipient</span><strong>{activeOrder.customerName}</strong></div>
              <div className={styles.addressBox}>
                <span>📍 Shipping Address:</span>
                <p>{activeOrder.shippingAddress}</p>
              </div>
              <button className={styles.sideActionBtn} onClick={() => alert('Support helpline: +92 21 111-123-456')}>
                📞 Contact Courier Support
              </button>
            </div>

            {/* Package Contents */}
            <div className={styles.sideCard}>
              <h4 className={styles.sideTitle}>🛍️ Package Contents ({activeOrder.items.length})</h4>
              <div className={styles.itemsList}>
                {activeOrder.items.map((item, idx) => (
                  <div key={idx} className={styles.itemRow}>
                    <Image src={item.img} alt={item.name} width={56} height={56} className={styles.itemImg} />
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemMeta}>{item.color} · {item.size}</p>
                      <span className={styles.itemPrice}>Rs {item.price.toLocaleString()} × {item.qty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
