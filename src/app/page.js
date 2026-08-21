'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useAuth } from './context/AuthContext';

/* ─── DATA ─────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1, name: 'Prada Minimalist Wire', brand: 'Prada', price: 340,
    category: 'Eyeglasses', gender: 'Unisex', material: 'Metal',
    tag: 'Premium', img: '/prada-frames.png', colors: ['#c5a47e','#c0c0c0'],
    rating: 4.8, reviews: 128,
  },
  {
    id: 2, name: 'Persol Calligrapher', brand: 'Persol', price: 320,
    category: 'Sunglasses', gender: 'Men', material: 'Acetate',
    tag: 'Classic', img: '/persol-sunglasses.png', colors: ['#8b5e3c','#1a1a1a'],
    rating: 4.9, reviews: 214,
  },
  {
    id: 3, name: 'Tom Ford Keyhole', brand: 'Tom Ford', price: 310,
    category: 'Eyeglasses', gender: 'Men', material: 'Acetate',
    tag: 'Modern', img: '/tomford-frames.png', colors: ['#1a1a1a','#3d2b1f'],
    rating: 4.7, reviews: 97,
  },
  {
    id: 4, name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', price: 175,
    category: 'Sunglasses', gender: 'Unisex', material: 'Metal',
    tag: 'Bestseller', img: '/rayban-sunglasses.png', colors: ['#c5a47e','#2d4a1e'],
    rating: 4.9, reviews: 1820,
  },
  {
    id: 5, name: 'Acuvue Oasys Monthly', brand: 'Acuvue', price: 48,
    category: 'Contact Lenses', gender: 'Unisex', material: 'Silicone Hydrogel',
    tag: 'Top Rated', img: '/contact-lens-box.png', colors: ['#3b82f6'],
    rating: 4.8, reviews: 3412, isLens: true,
  },
  {
    id: 6, name: 'Lacoste L2908 Oval', brand: 'Lacoste', price: 195,
    category: 'Eyeglasses', gender: 'Women', material: 'Metal',
    tag: 'New', img: '/prada-frames.png', colors: ['#d4af37','#e8c9a0'],
    rating: 4.6, reviews: 53,
  },
];

const BRANDS = ['Prada', 'Persol', 'Tom Ford', 'Ray-Ban', 'Lacoste', 'Montblanc', 'Gucci', 'Boss'];
const CATEGORIES = ['Eyeglasses', 'Sunglasses', 'Contact Lenses'];
const GENDERS = ['Men', 'Women', 'Unisex'];
const MATERIALS = ['Metal', 'Acetate', 'Silicone Hydrogel'];

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
      <span className={styles.ratingNum}>{rating}</span>
    </div>
  );
}

function ProductCard({ product, onAddToCart, inCart }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`${styles.productCard} ${hovered ? styles.cardHovered : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={styles.cardImgWrap}>
        <Link href={`/product/${product.id}`}>
          <Image src={product.img} alt={product.name} width={400} height={280} className={styles.cardImg} />
        </Link>
        <span className={`${styles.tag} ${styles[`tag${product.tag.replace(/\s/g,'')}`]}`}>{product.tag}</span>
        {hovered && (
          <div className={styles.cardOverlay}>
            <Link href={`/product/${product.id}`} className={styles.quickViewBtn}>Quick View</Link>
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <div className={styles.cardMeta}>
          <span className={styles.cardBrand}>{product.brand}</span>
          <div className={styles.swatches}>
            {product.colors.map((c, i) => (
              <span key={i} className={styles.swatch} style={{ backgroundColor: c }} />
            ))}
          </div>
        </div>
        <h4 className={styles.cardName}>{product.name}</h4>
        <StarRating rating={product.rating} />
        <p className={styles.reviewCount}>({product.reviews} reviews)</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>Rs {product.price.toLocaleString()}</span>
          <button
            className={inCart ? styles.addedBtn : styles.addToCartBtn}
            onClick={() => onAddToCart(product)}
          >
            {inCart ? '✓ Added' : '+ Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ cart, onClose, onRemove }) {
  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  return (
    <div className={styles.cartOverlay} onClick={onClose}>
      <div className={styles.cartDrawer} onClick={e => e.stopPropagation()}>
        <div className={styles.cartHeader}>
          <h3>Your Cart</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>
        {cart.length === 0 ? (
          <div className={styles.emptyCart}>
            <span>🛒</span>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cart.map(item => (
                <div key={item.id} className={styles.cartItem}>
                  <Image src={item.img} alt={item.name} width={64} height={64} className={styles.cartImg} />
                  <div className={styles.cartItemInfo}>
                    <p className={styles.cartItemName}>{item.name}</p>
                    <p className={styles.cartItemPrice}>Rs {item.price.toLocaleString()} × {item.qty}</p>
                  </div>
                  <button className={styles.removeBtn} onClick={() => onRemove(item.id)}>✕</button>
                </div>
              ))}
            </div>
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span>Total</span>
                <strong>Rs {total.toLocaleString()}</strong>
              </div>
              <Link href="/checkout" className={`${styles.checkoutBtn} btn-primary`}>Proceed to Checkout →</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── MAIN PAGE ────────────────────────────────────────── */
export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [filters, setFilters] = useState({ category: [], gender: [], material: [] });
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  const cartCount = cart.reduce((a, i) => a + i.qty, 0);

  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }

  function toggleFilter(group, value) {
    setFilters(prev => {
      const arr = prev[group];
      return { ...prev, [group]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value] };
    });
  }

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.brand.toLowerCase().includes(search.toLowerCase())) return false;
      if (filters.category.length && !filters.category.includes(p.category)) return false;
      if (filters.gender.length && !filters.gender.includes(p.gender)) return false;
      if (filters.material.length && !filters.material.includes(p.material)) return false;
      return true;
    });
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [search, filters, sort]);

  return (
    <div className={styles.wrapper}>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className={styles.announcementBar}>
        <span>🚴 60-min delivery available in Noida &amp; Greater Noida. Order before 8 PM.</span>
      </div>

      {/* ── HEADER ── */}
      <header className={`${styles.header} glass-panel`}>
        <div className={`container ${styles.headerContent}`}>
          <div className={styles.logo}>
            <img src="/fenno-walker-logo.svg" alt="Fenno Walker" height="38" className={styles.logoImg} />
          </div>
          <nav className={styles.nav}>
            {['Eyeglasses','Sunglasses','Contact Lenses'].map(item => (
              <a key={item} href="#catalog">{item}</a>
            ))}
            <Link href="/calculator">🔬 Rx Calculator</Link>
            <Link href="/track">🚚 Track Order</Link>
            <a href="#catalog" className={styles.saleLink}>🔥 Sale</a>
          </nav>
          <div className={styles.actions}>
            <div className={styles.searchBar}>
              <span className={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Link href="/account" className={styles.iconBtn} title="My Rx Vault &amp; Account">👤</Link>
            {user?.role === 'admin' && (
              <Link href="/admin" className={styles.iconBtn} title="Admin Panel">⚡</Link>
            )}
            {user && (
              <div className={styles.userChip}>
                <span className={styles.userAvatar}>{user.name?.[0]?.toUpperCase() || '?'}</span>
                <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                <button
                  className={styles.logoutBtn}
                  onClick={() => { logout(); router.refresh(); }}
                  title="Log out"
                >↩</button>
              </div>
            )}
            <button className={styles.iconBtn} title="Wishlist">♡</button>
            <button
              className={`${styles.cartBtn} btn-primary`}
              onClick={() => setCartOpen(true)}
            >
              🛒 Cart {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroText}>
            <span className={styles.heroBadge}>✨ New Summer Collection 2026</span>
            <h2>See the World Clearly.<br/><span className={styles.heroAccent}>Look Amazing</span> Doing It.</h2>
            <p>Enterprise-grade optical retail experience. Discover our exclusive collection crafted for your unique style — precision lenses meets unparalleled design.</p>
            <div className={styles.heroButtons}>
              <a href="#catalog"><button className="btn-primary hover-scale">Shop Collection →</button></a>
              <button className={`btn-secondary hover-scale`}>Book Eye Exam</button>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}><strong>10K+</strong><span>Products</span></div>
              <div className={styles.heroStat}><strong>30+</strong><span>Brands</span></div>
              <div className={styles.heroStat}><strong>50K+</strong><span>Customers</span></div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroBubble1}></div>
            <div className={styles.heroBubble2}></div>
            <Image
              src="/hero-glasses.png"
              alt="Premium Eyewear Display"
              width={600} height={500}
              className={`${styles.heroImg}`}
              priority
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES BAR ── */}
      <section className={styles.features}>
        <div className={`container ${styles.featuresGrid}`}>
          {[
            { icon: '🚚', title: 'Fast Shipping', desc: 'All over the globe' },
            { icon: '🔄', title: '30-Day Returns', desc: 'No questions asked' },
            { icon: '🛡️', title: '1-Year Warranty', desc: 'Guaranteed frame quality' },
            { icon: '👨‍⚕️', title: 'Expert Opticians', desc: 'Verified prescription lenses' },
          ].map(f => (
            <div key={f.title} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BRANDS MARQUEE ── */}
      <section className={styles.brandsSection}>
        <div className={`container ${styles.brandsHeader}`}>
          <p className={styles.brandsLabel}>Partner Brands</p>
        </div>
        <div className={styles.marqueeWrap}>
          <div className={styles.marquee}>
            {[...BRANDS, ...BRANDS].map((b, i) => (
              <span key={i} className={styles.brandChip}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATALOG ── */}
      <section id="catalog" className={styles.catalogSection}>
        <div className="container">
          <div className={styles.catalogLayout}>
            {/* SIDEBAR */}
            <aside className={`${styles.sidebar} glass-panel`}>
              <h3 className={styles.filterTitle}>Filter & Sort</h3>

              {[
                { label: 'Category', key: 'category', options: CATEGORIES },
                { label: 'Gender', key: 'gender', options: GENDERS },
                { label: 'Material', key: 'material', options: MATERIALS },
              ].map(group => (
                <div key={group.key} className={styles.filterGroup}>
                  <p className={styles.filterGroupLabel}>{group.label}</p>
                  {group.options.map(opt => (
                    <label key={opt} className={styles.filterOpt}>
                      <input
                        type="checkbox"
                        checked={filters[group.key].includes(opt)}
                        onChange={() => toggleFilter(group.key, opt)}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              ))}

              {(filters.category.length || filters.gender.length || filters.material.length) ? (
                <button
                  className={styles.clearBtn}
                  onClick={() => setFilters({ category: [], gender: [], material: [] })}
                >
                  Clear All Filters
                </button>
              ) : null}
            </aside>

            {/* PRODUCT GRID */}
            <div className={styles.catalogMain}>
              <div className={styles.catalogToolbar}>
                <p className={styles.resultsCount}>Showing {filtered.length} of {PRODUCTS.length} results</p>
                <div className={styles.sortWrap}>
                  <label>Sort by:</label>
                  <select value={sort} onChange={e => setSort(e.target.value)} className={styles.sortSelect}>
                    <option value="featured">Featured</option>
                    <option value="rating">Top Rated</option>
                    <option value="price-asc">Price: Low → High</option>
                    <option value="price-desc">Price: High → Low</option>
                  </select>
                </div>
              </div>

              {filtered.length === 0 ? (
                <div className={styles.emptyState}>
                  <span>🔍</span>
                  <p>No products match your filters.</p>
                  <button className="btn-secondary" onClick={() => { setFilters({ category: [], gender: [], material: [] }); setSearch(''); }}>Reset</button>
                </div>
              ) : (
                <div className={styles.productGrid}>
                  {filtered.map(p => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      onAddToCart={addToCart}
                      inCart={cart.some(c => c.id === p.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT LENS ENGINE CTA ── */}
      <section className={styles.lensCta}>
        <div className={`container ${styles.lensCtaInner} glass-panel`}>
          <div>
            <span className={styles.lensCtaBadge}>Rx Engine</span>
            <h2>The Contact Lens Engine</h2>
            <p>Input your prescription (SPH, CYL, BC, DIA) and we&apos;ll find your perfect match. Volume discounts applied automatically.</p>
            <div className={styles.rxInputRow}>
              {['SPH', 'CYL', 'Base Curve', 'Diameter'].map(param => (
                <div key={param} className={styles.rxField}>
                  <label>{param}</label>
                  <input type="number" placeholder="0.00" className={styles.rxInput} step="0.25" />
                </div>
              ))}
              <button className="btn-primary">Find My Lenses →</button>
            </div>
          </div>
          <div className={styles.lensCtaImage}>
            <Image src="/contact-lens-box.png" alt="Contact Lenses" width={280} height={220} className={styles.lensImg} />
            <div className={styles.volumePricingCard}>
              <p className={styles.vpTitle}>📦 Volume Pricing</p>
              <p>Buy 2 boxes → Save 5%</p>
              <p>Buy 4 boxes → Save 10%</p>
              <p>Buy 6+ boxes → Save 15%</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={`container ${styles.footerGrid}`}>
          <div className={styles.footerBrand}>
            <img src="/fenno-walker-logo.svg" alt="Fenno Walker" height="48" className={styles.footerLogoImg} />
            <p className={styles.footerTagline}>Premium Eyewear & Optical Studio<br/>Venice Mall, Greater Noida · Noida · Delhi NCR</p>
            <div className={styles.footerContact}>
              <a href="mailto:fennowalker@gmail.com">✉️ fennowalker@gmail.com</a>
              <a href="tel:+919560552337">📞 +91 9560552337</a>
            </div>
          </div>
          <div className={styles.footerLinks}>
            <h4>Shop</h4>
            <a href="#catalog">Eyeglasses</a>
            <a href="#catalog">Sunglasses</a>
            <a href="#catalog">Contact Lenses</a>
            <a href="#">Upload Prescription</a>
            <Link href="/track">Track My Order</Link>
          </div>
          <div className={styles.footerLinks}>
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Store Locator</a>
            <a href="#">FAQ</a>
            <a href="mailto:fennowalker@gmail.com">Contact Us</a>
          </div>
          <div className={styles.footerLinks}>
            <h4>Policies</h4>
            <a href="#">14-Day Return Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Privacy Policy</a>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>🚴 60-min delivery available in Noida &amp; Greater Noida. Order before 8 PM.</p>
          <p>© 2026 Fenno Walker. All rights reserved.</p>
        </div>
      </footer>

      {/* ── CART DRAWER ── */}
      {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onRemove={removeFromCart} />}
    </div>
  );
}
