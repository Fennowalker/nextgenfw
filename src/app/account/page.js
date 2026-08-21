'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './account.module.css';
import { useAuth } from '../context/AuthContext';

/* ─── INITIAL MOCK DATA ─────────────────────────────────── */
const MOCK_PROFILE = {
  name: 'Ahmed Khan',
  email: 'ahmed.khan@example.com',
  phone: '+92 300 1234567',
  memberSince: 'March 2024',
  vipStatus: 'Gold Vision VIP',
  points: 1250,
  avatar: 'AK',
};

const INITIAL_PRESCRIPTIONS = [
  {
    id: 1,
    title: 'Daily Glasses (Dr. Farooq)',
    doctor: 'Dr. M. Farooq (Aga Khan Hospital)',
    date: '2026-05-14',
    isPrimary: true,
    od: { sph: '-2.50', cyl: '-0.75', axis: '180', add: '+1.50' },
    os: { sph: '-2.25', cyl: '-0.50', axis: '175', add: '+1.50' },
    pd: '63mm',
    notes: 'Anti-reflective coating recommended for computer work.',
  },
  {
    id: 2,
    title: 'Contact Lens Prescription',
    doctor: 'Dr. Ayesha Malik',
    date: '2026-01-20',
    isPrimary: false,
    od: { sph: '-2.25', cyl: 'Plano', axis: '-', bc: '8.6', dia: '14.2' },
    os: { sph: '-2.00', cyl: 'Plano', axis: '-', bc: '8.6', dia: '14.2' },
    pd: '63mm',
    notes: 'Acuvue Oasys monthly disposition lenses.',
  },
];

const ORDER_HISTORY = [
  {
    id: '#ORD-8821',
    date: '2026-08-20',
    status: 'Delivered',
    total: 340,
    items: [
      { name: 'Prada Minimalist Wire Frame', color: 'Gold', size: 'Medium (54mm)', price: 340, qty: 1, img: '/prada-frames.png' },
    ],
    tracking: 'LHR-9981244',
  },
  {
    id: '#ORD-8804',
    date: '2026-06-12',
    status: 'Delivered',
    total: 288,
    items: [
      { name: 'Acuvue Oasys Monthly (Box of 6)', color: 'Clear', size: 'Box of 6', price: 48, qty: 6, img: '/contact-lens-box.png' },
    ],
    tracking: 'KHI-4412901',
  },
];

const INITIAL_SUBSCRIPTIONS = [
  {
    id: 1,
    product: 'Acuvue Oasys Monthly (Box of 6)',
    frequency: 'Every 3 Months',
    nextShipDate: '2026-09-15',
    status: 'Active',
    price: 96,
    img: '/contact-lens-box.png',
  },
];

/* ─── MAIN ACCOUNT PAGE ─────────────────────────────────── */
export default function AccountPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('prescriptions');

  /* Merge real session data into mock profile */
  const [profile, setProfile] = useState({
    ...MOCK_PROFILE,
    name: user?.name || MOCK_PROFILE.name,
    email: user?.email || MOCK_PROFILE.email,
    avatar: (user?.name?.[0] || 'A').toUpperCase(),
  });

  /* Sync profile when auth loads */
  useEffect(() => {
    if (user) {
      setProfile(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        avatar: (user.name?.[0] || 'A').toUpperCase(),
      }));
    }
  }, [user]);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [subscriptions, setSubscriptions] = useState(INITIAL_SUBSCRIPTIONS);
  const [showAddRxModal, setShowAddRxModal] = useState(false);

  /* ── Redirect to /login if unauthenticated ── */
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  // New Rx Form State
  const [newRx, setNewRx] = useState({
    title: '',
    doctor: '',
    pd: '',
    notes: '',
    odSph: '', odCyl: '', odAxis: '', odAdd: '',
    osSph: '', osCyl: '', osAxis: '', osAdd: '',
  });

  function handleSetPrimaryRx(id) {
    setPrescriptions(prev => prev.map(rx => ({ ...rx, isPrimary: rx.id === id })));
  }

  function handleDeleteRx(id) {
    setPrescriptions(prev => prev.filter(rx => rx.id !== id));
  }

  function handleAddRxSubmit(e) {
    e.preventDefault();
    if (!newRx.title) return;
    const created = {
      id: Date.now(),
      title: newRx.title,
      doctor: newRx.doctor || 'Self / Unspecified',
      date: new Date().toISOString().split('T')[0],
      isPrimary: prescriptions.length === 0,
      od: { sph: newRx.odSph || '0.00', cyl: newRx.odCyl || '0.00', axis: newRx.odAxis || '-', add: newRx.odAdd || '-' },
      os: { sph: newRx.osSph || '0.00', cyl: newRx.osCyl || '0.00', axis: newRx.osAxis || '-', add: newRx.osAdd || '-' },
      pd: newRx.pd ? `${newRx.pd}mm` : '63mm',
      notes: newRx.notes || 'No special instructions',
    };
    setPrescriptions(prev => [created, ...prev]);
    setShowAddRxModal(false);
    setNewRx({ title: '', doctor: '', pd: '', notes: '', odSph: '', odCyl: '', odAxis: '', odAdd: '', osSph: '', osCyl: '', osAxis: '', osAdd: '' });
  }

  function toggleSubStatus(id) {
    setSubscriptions(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'Active' ? 'Paused' : 'Active' } : s));
  }

  return (
    <div className={styles.accountPage}>
      {/* ── HEADER NAVIGATION / BREADCRUMB ── */}
      <header className={styles.topNav}>
        <div className="container">
          <div className={styles.topNavInner}>
            <Link href="/" className={styles.logo}>
              <span>👓</span> Fenno<strong>Walker</strong>
            </Link>
            <div className={styles.navRight}>
              <Link href="/" className={styles.storeLink}>🏬 Return to Store</Link>
              {user?.role === 'admin' && (
                <Link href="/admin" className={styles.adminBadge}>⚡ Admin Dashboard</Link>
              )}
              <button className={styles.logoutBtn} onClick={() => { logout(); router.push('/login'); }}>
                ↩ Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── PROFILE BANNER ── */}
      <section className={styles.profileBanner}>
        <div className="container">
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>{profile.avatar}</div>
            <div className={styles.profileInfo}>
              <div className={styles.profileNameRow}>
                <h1 className={styles.profileName}>{profile.name}</h1>
                <span className={styles.vipBadge}>✨ {profile.vipStatus}</span>
              </div>
              <p className={styles.profileMeta}>{profile.email} · {profile.phone} · Member since {profile.memberSince}</p>
            </div>
            <div className={styles.rewardsCard}>
              <span className={styles.rewardsIcon}>🎁</span>
              <div>
                <p className={styles.rewardsTitle}>Vision Rewards Points</p>
                <p className={styles.rewardsVal}>{profile.points} Points</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT & TABS ── */}
      <main className="container">
        <div className={styles.tabLayout}>
          {/* Sidebar Nav */}
          <aside className={styles.tabSidebar}>
            {[
              { id: 'prescriptions', icon: '📜', label: 'My Prescription Vault', count: prescriptions.length },
              { id: 'orders', icon: '📦', label: 'Order History & Re-order', count: ORDER_HISTORY.length },
              { id: 'subscriptions', icon: '🔄', label: 'Lens Subscriptions', count: subscriptions.length },
              { id: 'settings', icon: '⚙️', label: 'Account Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`${styles.tabBtn} ${activeTab === tab.id ? styles.tabActive : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabText}>{tab.label}</span>
                {tab.count !== undefined && <span className={styles.tabBadge}>{tab.count}</span>}
              </button>
            ))}
          </aside>

          {/* Tab Body */}
          <div className={styles.tabBody}>
            {/* ── TAB 1: PRESCRIPTIONS VAULT ── */}
            {activeTab === 'prescriptions' && (
              <div className={styles.viewSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>📜 Prescription (Rx) Vault</h2>
                    <p className={styles.sectionSub}>Store and manage your verified optical prescriptions for 1-click ordering.</p>
                  </div>
                  <button className="btn-primary" onClick={() => setShowAddRxModal(true)}>+ Add New Prescription</button>
                </div>

                <div className={styles.rxGrid}>
                  {prescriptions.map(rx => (
                    <div key={rx.id} className={`${styles.rxCard} ${rx.isPrimary ? styles.rxPrimary : ''}`}>
                      <div className={styles.rxCardHeader}>
                        <div>
                          <div className={styles.rxTitleRow}>
                            <h3 className={styles.rxTitle}>{rx.title}</h3>
                            {rx.isPrimary && <span className={styles.primaryBadge}>Primary Rx</span>}
                          </div>
                          <p className={styles.rxDoctor}>{rx.doctor} · Issued {rx.date}</p>
                        </div>
                        <div className={styles.rxActions}>
                          {!rx.isPrimary && (
                            <button className={styles.setPrimaryBtn} onClick={() => handleSetPrimaryRx(rx.id)}>Set Primary</button>
                          )}
                          <button className={styles.deleteRxBtn} onClick={() => handleDeleteRx(rx.id)}>🗑️</button>
                        </div>
                      </div>

                      {/* Optical Measurements Matrix Table */}
                      <div className={styles.rxMatrixWrap}>
                        <table className={styles.rxMatrixTable}>
                          <thead>
                            <tr>
                              <th>Eye</th>
                              <th>SPH (Sphere)</th>
                              <th>CYL (Cylinder)</th>
                              <th>AXIS</th>
                              <th>ADD (Bifocal)</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong className={styles.eyeLabel}>Right (OD)</strong></td>
                              <td><code className={styles.rxVal}>{rx.od.sph}</code></td>
                              <td><code className={styles.rxVal}>{rx.od.cyl}</code></td>
                              <td><code className={styles.rxVal}>{rx.od.axis}</code></td>
                              <td><code className={styles.rxVal}>{rx.od.add || '-'}</code></td>
                            </tr>
                            <tr>
                              <td><strong className={styles.eyeLabel}>Left (OS)</strong></td>
                              <td><code className={styles.rxVal}>{rx.os.sph}</code></td>
                              <td><code className={styles.rxVal}>{rx.os.cyl}</code></td>
                              <td><code className={styles.rxVal}>{rx.os.axis}</code></td>
                              <td><code className={styles.rxVal}>{rx.os.add || '-'}</code></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className={styles.rxCardFooter}>
                        <div className={styles.pdTag}>Pupillary Distance (PD): <strong>{rx.pd}</strong></div>
                        <p className={styles.rxNotes}><strong>Notes:</strong> {rx.notes}</p>
                        <Link href="/#catalog" className={`${styles.useRxBtn} btn-secondary`}>🛒 Shop Glasses with this Rx →</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 2: ORDER HISTORY ── */}
            {activeTab === 'orders' && (
              <div className={styles.viewSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>📦 Order History & Re-order</h2>
                    <p className={styles.sectionSub}>Track your recent orders and re-order lenses with a single click.</p>
                  </div>
                </div>

                <div className={styles.orderList}>
                  {ORDER_HISTORY.map(order => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderTop}>
                        <div>
                          <span className={styles.orderNum}>{order.id}</span>
                          <span className={styles.orderDate}>Placed on {order.date}</span>
                        </div>
                        <div className={styles.orderStatusRow}>
                          <span className={styles.statusDelivered}>✓ {order.status}</span>
                          <span className={styles.orderPrice}>Rs {order.total.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className={styles.orderItems}>
                        {order.items.map((item, idx) => (
                          <div key={idx} className={styles.orderItem}>
                            <Image src={item.img} alt={item.name} width={64} height={64} className={styles.orderImg} />
                            <div className={styles.orderItemDetails}>
                              <p className={styles.orderItemName}>{item.name}</p>
                              <p className={styles.orderItemMeta}>{item.color} · {item.size} · Qty: {item.qty}</p>
                            </div>
                            <Link href="/checkout" className={`${styles.reorderBtn} btn-secondary`}>🔁 Re-order</Link>
                          </div>
                        ))}
                      </div>

                      <div className={styles.orderBottom}>
                        <span className={styles.trackingNo}>🚚 Tracking: <code>{order.tracking}</code></span>
                        <Link href="/checkout" className={styles.invoiceBtn}>📄 View Receipt & Invoice</Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 3: SUBSCRIPTIONS ── */}
            {activeTab === 'subscriptions' && (
              <div className={styles.viewSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>🔄 Contact Lens Subscriptions</h2>
                    <p className={styles.sectionSub}>Automated lens refills delivered directly to your doorstep.</p>
                  </div>
                </div>

                <div className={styles.subList}>
                  {subscriptions.map(sub => (
                    <div key={sub.id} className={styles.subCard}>
                      <Image src={sub.img} alt={sub.product} width={80} height={80} className={styles.subImg} />
                      <div className={styles.subInfo}>
                        <div className={styles.subTitleRow}>
                          <h3 className={styles.subTitle}>{sub.product}</h3>
                          <span className={sub.status === 'Active' ? styles.subActiveBadge : styles.subPausedBadge}>
                            {sub.status}
                          </span>
                        </div>
                        <p className={styles.subMeta}>Schedule: <strong>{sub.frequency}</strong> · Next shipment: <strong>{sub.nextShipDate}</strong></p>
                        <p className={styles.subPrice}>Rs {sub.price.toLocaleString()} / refill</p>
                      </div>
                      <div className={styles.subActions}>
                        <button
                          className={sub.status === 'Active' ? styles.pauseBtn : styles.resumeBtn}
                          onClick={() => toggleSubStatus(sub.id)}
                        >
                          {sub.status === 'Active' ? '⏸️ Pause Auto-Refill' : '▶️ Resume Auto-Refill'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TAB 4: SETTINGS ── */}
            {activeTab === 'settings' && (
              <div className={styles.viewSection}>
                <div className={styles.sectionHeader}>
                  <div>
                    <h2 className={styles.sectionTitle}>⚙️ Account Settings</h2>
                    <p className={styles.sectionSub}>Update your contact info and default shipping address.</p>
                  </div>
                </div>

                <form className={styles.settingsForm} onSubmit={e => { e.preventDefault(); alert('Profile updated successfully!'); }}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Full Name</label>
                      <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Email Address</label>
                      <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className={styles.input} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Phone Number</label>
                      <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Default City</label>
                      <input type="text" defaultValue="Karachi" className={styles.input} />
                    </div>
                  </div>
                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Save Changes</button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ── ADD NEW PRESCRIPTION MODAL ── */}
      {showAddRxModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAddRxModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add New Optical Prescription</h3>
              <button className={styles.closeBtn} onClick={() => setShowAddRxModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddRxSubmit} className={styles.modalForm}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Prescription Title *</label>
                  <input type="text" placeholder="e.g. Work Glasses 2026" value={newRx.title} onChange={e => setNewRx({...newRx, title: e.target.value})} required className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Optometrist / Hospital</label>
                  <input type="text" placeholder="e.g. Dr. Farooq (Aga Khan)" value={newRx.doctor} onChange={e => setNewRx({...newRx, doctor: e.target.value})} className={styles.input} />
                </div>
              </div>

              {/* Right Eye OD */}
              <h4 className={styles.eyeSectionTitle}>👁️ Right Eye (OD)</h4>
              <div className={styles.formRow4}>
                <div className={styles.formGroup}><label>SPH</label><input type="text" placeholder="-2.50" value={newRx.odSph} onChange={e => setNewRx({...newRx, odSph: e.target.value})} className={styles.input} /></div>
                <div className={styles.formGroup}><label>CYL</label><input type="text" placeholder="-0.75" value={newRx.odCyl} onChange={e => setNewRx({...newRx, odCyl: e.target.value})} className={styles.input} /></div>
                <div className={styles.formGroup}><label>AXIS</label><input type="text" placeholder="180" value={newRx.odAxis} onChange={e => setNewRx({...newRx, odAxis: e.target.value})} className={styles.input} /></div>
                <div className={styles.formGroup}><label>ADD</label><input type="text" placeholder="+1.50" value={newRx.odAdd} onChange={e => setNewRx({...newRx, odAdd: e.target.value})} className={styles.input} /></div>
              </div>

              {/* Left Eye OS */}
              <h4 className={styles.eyeSectionTitle}>👁️ Left Eye (OS)</h4>
              <div className={styles.formRow4}>
                <div className={styles.formGroup}><label>SPH</label><input type="text" placeholder="-2.25" value={newRx.osSph} onChange={e => setNewRx({...newRx, osSph: e.target.value})} className={styles.input} /></div>
                <div className={styles.formGroup}><label>CYL</label><input type="text" placeholder="-0.50" value={newRx.osCyl} onChange={e => setNewRx({...newRx, osCyl: e.target.value})} className={styles.input} /></div>
                <div className={styles.formGroup}><label>AXIS</label><input type="text" placeholder="175" value={newRx.osAxis} onChange={e => setNewRx({...newRx, osAxis: e.target.value})} className={styles.input} /></div>
                <div className={styles.formGroup}><label>ADD</label><input type="text" placeholder="+1.50" value={newRx.osAdd} onChange={e => setNewRx({...newRx, osAdd: e.target.value})} className={styles.input} /></div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Pupillary Distance (PD in mm)</label>
                  <input type="text" placeholder="63" value={newRx.pd} onChange={e => setNewRx({...newRx, pd: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label>Doctor Notes / Instructions</label>
                  <input type="text" placeholder="e.g. Progressive blue-blocker lenses" value={newRx.notes} onChange={e => setNewRx({...newRx, notes: e.target.value})} className={styles.input} />
                </div>
              </div>

              {/* Upload Rx Slip Document */}
              <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                <label>Upload Optometrist Prescription Slip / Doctor Note</label>
                <div style={{ position: 'relative', border: '2px dashed var(--border-light)', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-primary)' }}>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                    onChange={e => {
                      const file = e.target.files[0];
                      if (file) {
                        setNewRx(prev => ({ ...prev, rxFile: file.name }));
                      }
                    }}
                  />
                  <span>📄 {newRx.rxFile ? `Selected: ${newRx.rxFile}` : 'Click or drop Doctor Rx Slip (JPG, PNG, PDF)'}</span>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddRxModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
