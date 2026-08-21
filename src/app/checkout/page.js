'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './checkout.module.css';

/* ─── MOCK CART ─────────────────────────────────────────── */
const MOCK_CART = [
  { id: 1, name: 'Prada Minimalist Wire Frame', brand: 'Prada', img: '/prada-frames.png', color: 'Gold', size: 'Medium (54mm)', price: 340, qty: 1 },
  { id: 4, name: 'Ray-Ban Aviator Classic G-15', brand: 'Ray-Ban', img: '/rayban-sunglasses.png', color: 'Gold/G-15', size: 'Medium (58mm)', price: 175, qty: 2 },
  { id: 5, name: 'Acuvue Oasys Monthly', brand: 'Acuvue', img: '/contact-lens-box.png', color: 'Clear', size: 'Box of 6', price: 48, qty: 6, discount: 0.15 },
];

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Delivery', desc: '5–7 business days', price: 0, badge: 'Free' },
  { id: 'express', label: 'Express Delivery', desc: '2–3 business days', price: 250 },
  { id: 'overnight', label: 'Overnight Delivery', desc: 'Next business day', price: 599, badge: 'Fastest' },
];

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirmation'];

/* ─── HELPERS ────────────────────────────────────────────── */
function genOrderId() {
  return '#ORD-' + Math.floor(8800 + Math.random() * 200);
}

function formatPrice(n) {
  return 'Rs ' + n.toLocaleString();
}

function itemTotal(item) {
  const base = item.price * item.qty;
  return item.discount ? base * (1 - item.discount) : base;
}

/* ─── STEP INDICATOR ────────────────────────────────────── */
function StepBar({ current }) {
  return (
    <div className={styles.stepBar}>
      {STEPS.map((s, i) => (
        <div key={s} className={styles.stepWrap}>
          <div className={`${styles.stepCircle} ${i < current ? styles.stepDone : i === current ? styles.stepActive : styles.stepFuture}`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`${styles.stepLabel} ${i === current ? styles.stepLabelActive : ''}`}>{s}</span>
          {i < STEPS.length - 1 && <div className={`${styles.stepLine} ${i < current ? styles.stepLineDone : ''}`} />}
        </div>
      ))}
    </div>
  );
}

/* ─── ORDER SUMMARY SIDEBAR ─────────────────────────────── */
function OrderSummary({ cart, shipping, coupon, onCoupon, couponVal, setCouponVal, couponApplied }) {
  const subtotal = cart.reduce((a, i) => a + itemTotal(i), 0);
  const discount = cart.reduce((a, i) => i.discount ? a + i.price * i.qty * i.discount : a, 0);
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shipping)?.price || 0;
  const couponDiscount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - couponDiscount;

  return (
    <aside className={`${styles.summary} glass-panel`}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>

      <div className={styles.summaryItems}>
        {cart.map(item => (
          <div key={item.id} className={styles.summaryItem}>
            <div className={styles.summaryImgWrap}>
              <Image src={item.img} alt={item.name} width={56} height={56} className={styles.summaryImg} />
              <span className={styles.qtyBadge}>{item.qty}</span>
            </div>
            <div className={styles.summaryItemInfo}>
              <p className={styles.summaryItemName}>{item.name}</p>
              <p className={styles.summaryItemMeta}>{item.color} · {item.size}</p>
              {item.discount && <span className={styles.discountTag}>−{Math.round(item.discount * 100)}% applied</span>}
            </div>
            <span className={styles.summaryItemPrice}>{formatPrice(Math.round(itemTotal(item)))}</span>
          </div>
        ))}
      </div>

      {/* Coupon */}
      <div className={styles.couponRow}>
        <input
          type="text"
          placeholder="Promo code"
          value={couponVal}
          onChange={e => setCouponVal(e.target.value.toUpperCase())}
          className={styles.couponInput}
        />
        <button className={styles.couponBtn} onClick={onCoupon}>Apply</button>
      </div>
      {couponApplied && <p className={styles.couponSuccess}>✓ Code EYEWEAR10 applied — 10% off!</p>}

      <div className={styles.summaryCalc}>
        <div className={styles.calcRow}><span>Subtotal</span><span>{formatPrice(Math.round(subtotal))}</span></div>
        {discount > 0 && <div className={`${styles.calcRow} ${styles.calcGreen}`}><span>Volume Discount</span><span>−{formatPrice(Math.round(discount))}</span></div>}
        {couponApplied && <div className={`${styles.calcRow} ${styles.calcGreen}`}><span>Promo (10%)</span><span>−{formatPrice(Math.round(couponDiscount))}</span></div>}
        <div className={styles.calcRow}><span>Shipping</span><span>{shippingCost === 0 ? <span className={styles.freeTag}>Free</span> : formatPrice(shippingCost)}</span></div>
        <div className={`${styles.calcRow} ${styles.calcTotal}`}><strong>Total</strong><strong>{formatPrice(Math.round(total))}</strong></div>
      </div>

      <div className={styles.secureNote}>
        <span>🔒</span> Secure checkout — 256-bit SSL encrypted
      </div>
    </aside>
  );
}

/* ─── STEP 1: CART REVIEW ────────────────────────────────── */
function StepCartReview({ cart, setCart, onNext }) {
  function changeQty(id, delta) {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  }
  function removeItem(id) {
    setCart(prev => prev.filter(i => i.id !== id));
  }
  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Review Your Cart</h2>
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <span>🛒</span>
          <p>Your cart is empty.</p>
          <Link href="/" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className={styles.cartTable}>
          {cart.map(item => (
            <div key={item.id} className={styles.cartRow}>
              <Image src={item.img} alt={item.name} width={80} height={80} className={styles.cartRowImg} />
              <div className={styles.cartRowInfo}>
                <p className={styles.cartRowBrand}>{item.brand}</p>
                <p className={styles.cartRowName}>{item.name}</p>
                <p className={styles.cartRowMeta}>{item.color} · {item.size}</p>
                {item.discount && (
                  <span className={styles.discountTag}>Volume discount −{Math.round(item.discount * 100)}%</span>
                )}
              </div>
              <div className={styles.cartRowQty}>
                <button className={styles.qtyBtn} onClick={() => changeQty(item.id, -1)}>−</button>
                <span>{item.qty}</span>
                <button className={styles.qtyBtn} onClick={() => changeQty(item.id, 1)}>+</button>
              </div>
              <div className={styles.cartRowPrice}>
                {item.discount && <s className={styles.strikePx}>{formatPrice(item.price * item.qty)}</s>}
                <strong>{formatPrice(Math.round(itemTotal(item)))}</strong>
              </div>
              <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
            </div>
          ))}
        </div>
      )}
      <div className={styles.stepNav}>
        <Link href="/" className={`${styles.backBtn} btn-secondary`}>← Continue Shopping</Link>
        <button className="btn-primary" onClick={onNext} disabled={cart.length === 0}>
          Proceed to Shipping →
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 2: SHIPPING ──────────────────────────────────── */
function StepShipping({ shipping, setShipping, form, setForm, onNext, onBack }) {
  const fields = [
    { id: 'firstName', label: 'First Name', placeholder: 'Ahmed', half: true },
    { id: 'lastName', label: 'Last Name', placeholder: 'Khan', half: true },
    { id: 'email', label: 'Email Address', placeholder: 'ahmed@example.com', type: 'email', half: false },
    { id: 'phone', label: 'Phone Number', placeholder: '+92 300 0000000', type: 'tel', half: false },
    { id: 'address', label: 'Street Address', placeholder: '123 Main Street, Gulshan-e-Iqbal', half: false },
    { id: 'city', label: 'City', placeholder: 'Karachi', half: true },
    { id: 'province', label: 'Province', placeholder: 'Sindh', half: true },
    { id: 'postalCode', label: 'Postal Code', placeholder: '75300', half: true },
    { id: 'country', label: 'Country', placeholder: 'Pakistan', half: true },
  ];

  const isValid = form.firstName && form.lastName && form.email && form.phone && form.address && form.city;

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Shipping Information</h2>
      <div className={styles.formGrid}>
        {fields.map(f => (
          <div key={f.id} className={`${styles.formField} ${f.half ? styles.half : ''}`}>
            <label className={styles.label}>{f.label}</label>
            <input
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={form[f.id] || ''}
              onChange={e => setForm(p => ({ ...p, [f.id]: e.target.value }))}
              className={styles.input}
            />
          </div>
        ))}
      </div>

      <h3 className={styles.sectionTitle}>Delivery Method</h3>
      <div className={styles.shippingOptions}>
        {SHIPPING_OPTIONS.map(opt => (
          <label key={opt.id} className={`${styles.shippingOpt} ${shipping === opt.id ? styles.shippingSelected : ''}`}>
            <input type="radio" name="shipping" value={opt.id} checked={shipping === opt.id} onChange={() => setShipping(opt.id)} className={styles.radioHidden} />
            <div className={styles.shippingRadio} />
            <div className={styles.shippingInfo}>
              <div className={styles.shippingTop}>
                <span className={styles.shippingLabel}>{opt.label}</span>
                {opt.badge && <span className={styles.shippingBadge}>{opt.badge}</span>}
              </div>
              <span className={styles.shippingDesc}>{opt.desc}</span>
            </div>
            <span className={styles.shippingPrice}>{opt.price === 0 ? 'Free' : formatPrice(opt.price)}</span>
          </label>
        ))}
      </div>

      <div className={styles.stepNav}>
        <button className={`${styles.backBtn} btn-secondary`} onClick={onBack}>← Back</button>
        <button className="btn-primary" onClick={onNext} disabled={!isValid}>
          Continue to Payment →
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 3: PAYMENT ────────────────────────────────────── */
function StepPayment({ onNext, onBack }) {
  const [method, setMethod] = useState('card');
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);
  const [focused, setFocused] = useState('');

  function formatCard(v) { return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); }
  function formatExpiry(v) { const d = v.replace(/\D/g, '').slice(0, 4); return d.length > 2 ? d.slice(0,2) + '/' + d.slice(2) : d; }

  function handlePay() {
    setProcessing(true);
    setTimeout(() => { setProcessing(false); onNext(); }, 2200);
  }

  const cardLast4 = card.number.replace(/\s/g, '').slice(-4) || '••••';
  const isCard = method === 'card';
  const canPay = method !== 'card' || (card.number.replace(/\s/g,'').length === 16 && card.name && card.expiry.length === 5 && card.cvv.length === 3);

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>Payment</h2>

      {/* Method Tabs */}
      <div className={styles.payMethods}>
        {[{id:'card',icon:'💳',label:'Card'},{id:'bank',icon:'🏦',label:'Bank Transfer'},{id:'cod',icon:'💵',label:'Cash on Delivery'}].map(m => (
          <button key={m.id} className={`${styles.payMethodBtn} ${method === m.id ? styles.payMethodActive : ''}`} onClick={() => setMethod(m.id)}>
            <span>{m.icon}</span> {m.label}
          </button>
        ))}
      </div>

      {/* Credit Card UI */}
      {isCard && (
        <>
          {/* Card Visual */}
          <div className={`${styles.cardVisual} ${focused === 'cvv' ? styles.cardFlipped : ''}`}>
            <div className={styles.cardFront}>
              <div className={styles.cardChip}>▬</div>
              <div className={styles.cardNumber}>{card.number || '•••• •••• •••• ••••'}</div>
              <div className={styles.cardBottom}>
                <div>
                  <p className={styles.cardFieldLabel}>Cardholder</p>
                  <p className={styles.cardFieldVal}>{card.name || 'YOUR NAME'}</p>
                </div>
                <div>
                  <p className={styles.cardFieldLabel}>Expires</p>
                  <p className={styles.cardFieldVal}>{card.expiry || 'MM/YY'}</p>
                </div>
                <div className={styles.cardLogo}>VISA</div>
              </div>
            </div>
            <div className={styles.cardBack}>
              <div className={styles.cardStripe}></div>
              <div className={styles.cardCvvRow}>
                <span className={styles.cardCvvLabel}>CVV</span>
                <span className={styles.cardCvvVal}>{card.cvv || '•••'}</span>
              </div>
            </div>
          </div>

          {/* Card Inputs */}
          <div className={styles.cardForm}>
            <div className={styles.formField}>
              <label className={styles.label}>Card Number</label>
              <input className={styles.input} placeholder="1234 5678 9012 3456"
                value={card.number}
                onChange={e => setCard(c => ({...c, number: formatCard(e.target.value)}))}
                onFocus={() => setFocused('number')} onBlur={() => setFocused('')}
                maxLength={19}
              />
            </div>
            <div className={styles.formField}>
              <label className={styles.label}>Cardholder Name</label>
              <input className={styles.input} placeholder="Ahmed Khan"
                value={card.name}
                onChange={e => setCard(c => ({...c, name: e.target.value.toUpperCase()}))}
                onFocus={() => setFocused('name')} onBlur={() => setFocused('')}
              />
            </div>
            <div className={styles.formRow}>
              <div className={styles.formField}>
                <label className={styles.label}>Expiry Date</label>
                <input className={styles.input} placeholder="MM/YY"
                  value={card.expiry}
                  onChange={e => setCard(c => ({...c, expiry: formatExpiry(e.target.value)}))}
                  onFocus={() => setFocused('expiry')} onBlur={() => setFocused('')}
                  maxLength={5}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.label}>CVV</label>
                <input className={styles.input} placeholder="123" type="password"
                  value={card.cvv}
                  onChange={e => setCard(c => ({...c, cvv: e.target.value.replace(/\D/g,'').slice(0,3)}))}
                  onFocus={() => setFocused('cvv')} onBlur={() => setFocused('')}
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {method === 'bank' && (
        <div className={styles.altPayInfo}>
          <div className={styles.bankDetails}>
            <h4>Bank Transfer Details</h4>
            <div className={styles.bankRow}><span>Bank</span><strong>HBL Pakistan</strong></div>
            <div className={styles.bankRow}><span>Account Title</span><strong>Next-Gen Eyewear Pvt Ltd</strong></div>
            <div className={styles.bankRow}><span>Account No.</span><strong>0123-4567890-01</strong></div>
            <div className={styles.bankRow}><span>IBAN</span><strong>PK36HABB0000123456780101</strong></div>
            <p className={styles.bankNote}>⚠️ Please use your Order ID as the payment reference. Your order will be processed within 1–2 business days after payment confirmation.</p>
          </div>
        </div>
      )}

      {method === 'cod' && (
        <div className={styles.altPayInfo}>
          <div className={styles.codInfo}>
            <span className={styles.codIcon}>💵</span>
            <div>
              <h4>Cash on Delivery</h4>
              <p>Pay when your order arrives at your doorstep. A Rs 150 COD handling fee applies. Available for orders under Rs 25,000.</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.stepNav}>
        <button className={`${styles.backBtn} btn-secondary`} onClick={onBack}>← Back</button>
        <button
          className={`${styles.payBtn} ${processing ? styles.payProcessing : ''}`}
          onClick={handlePay}
          disabled={!canPay || processing}
        >
          {processing ? (
            <><span className={styles.spinner}></span> Processing…</>
          ) : (
            '🔒 Place Order & Pay'
          )}
        </button>
      </div>
    </div>
  );
}

/* ─── STEP 4: CONFIRMATION ───────────────────────────────── */
function StepConfirmation({ cart, form, shipping }) {
  const orderId = useRef(genOrderId()).current;
  const orderDate = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' });
  const subtotal = cart.reduce((a, i) => a + itemTotal(i), 0);
  const shippingCost = SHIPPING_OPTIONS.find(s => s.id === shipping)?.price || 0;
  const total = subtotal + shippingCost;
  const shippingOpt = SHIPPING_OPTIONS.find(s => s.id === shipping);

  return (
    <div className={styles.stepContent}>
      {/* Success Header */}
      <div className={styles.successHeader}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Order Confirmed!</h2>
        <p className={styles.successSub}>Thank you, <strong>{form.firstName || 'Valued Customer'}</strong>! Your order has been placed successfully.</p>
      </div>

      {/* Invoice Card */}
      <div className={`${styles.invoice} glass-panel`} id="invoice">
        {/* Invoice Header */}
        <div className={styles.invoiceHeader}>
          <div className={styles.invoiceBrand}>
            <span className={styles.invoiceLogo}>👓</span>
            <div>
              <strong>Next-Gen Eyewear</strong>
              <p>enterprise-grade optical retail</p>
            </div>
          </div>
          <div className={styles.invoiceMeta}>
            <div className={styles.invoiceMetaRow}><span>Invoice No.</span><strong>{orderId}</strong></div>
            <div className={styles.invoiceMetaRow}><span>Date</span><strong>{orderDate}</strong></div>
            <div className={styles.invoiceMetaRow}><span>Status</span><span className={styles.paidBadge}>PAID</span></div>
          </div>
        </div>

        {/* Addresses */}
        <div className={styles.invoiceAddresses}>
          <div>
            <p className={styles.invoiceAddrLabel}>Bill To / Ship To</p>
            <p className={styles.invoiceAddrName}>{form.firstName} {form.lastName}</p>
            <p>{form.address}</p>
            <p>{form.city}, {form.province} {form.postalCode}</p>
            <p>{form.country}</p>
            <p>{form.email}</p>
            <p>{form.phone}</p>
          </div>
          <div>
            <p className={styles.invoiceAddrLabel}>Delivery</p>
            <p className={styles.invoiceAddrName}>{shippingOpt?.label}</p>
            <p className={styles.invoiceAddrDesc}>{shippingOpt?.desc}</p>
            <p className={styles.invoiceAddrLabel} style={{marginTop:'1rem'}}>Estimated Arrival</p>
            <p className={styles.invoiceAddrName}>
              {new Date(Date.now() + (shipping === 'standard' ? 7 : shipping === 'express' ? 3 : 1) * 86400000)
                .toLocaleDateString('en-GB', { day:'2-digit', month:'long', year:'numeric' })}
            </p>
          </div>
        </div>

        {/* Line Items */}
        <table className={styles.invoiceTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Color / Size</th>
              <th className={styles.tcenter}>Qty</th>
              <th className={styles.tcenter}>Unit Price</th>
              <th className={styles.tright}>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td>
                  <p className={styles.invoiceItemName}>{item.name}</p>
                  <p className={styles.invoiceItemBrand}>{item.brand}</p>
                </td>
                <td>{item.color} · {item.size}</td>
                <td className={styles.tcenter}>{item.qty}</td>
                <td className={styles.tcenter}>
                  {item.discount ? (
                    <span>{formatPrice(Math.round(item.price * (1 - item.discount)))} <s className={styles.strikeSmall}>{formatPrice(item.price)}</s></span>
                  ) : formatPrice(item.price)}
                </td>
                <td className={styles.tright}>{formatPrice(Math.round(itemTotal(item)))}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan={4} className={styles.tright}>Subtotal</td><td className={styles.tright}>{formatPrice(Math.round(subtotal))}</td></tr>
            <tr><td colSpan={4} className={styles.tright}>Shipping ({shippingOpt?.label})</td><td className={styles.tright}>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</td></tr>
            <tr className={styles.invoiceTotalRow}><td colSpan={4} className={styles.tright}><strong>Total Paid</strong></td><td className={styles.tright}><strong>{formatPrice(Math.round(total))}</strong></td></tr>
          </tfoot>
        </table>

        <p className={styles.invoiceFooter}>Thank you for choosing Next-Gen Eyewear. For queries, contact support@nextgeneyewear.pk · www.nextgeneyewear.pk</p>
      </div>

      {/* Actions */}
      <div className={styles.confirmActions}>
        <button className="btn-secondary" onClick={() => window.print()}>🖨️ Print Invoice</button>
        <Link href="/" className="btn-primary">Continue Shopping →</Link>
        <Link href="/admin" className={styles.adminLink}>View in Admin →</Link>
      </div>

      {/* Progress Tracker */}
      <div className={styles.trackCard}>
        <h3>📦 Order Tracking</h3>
        <div className={styles.trackSteps}>
          {['Order Placed','Processing','Dispatched','Out for Delivery','Delivered'].map((s, i) => (
            <div key={s} className={styles.trackStep}>
              <div className={`${styles.trackCircle} ${i <= 1 ? styles.trackDone : styles.trackPending}`}>
                {i <= 1 ? '✓' : '○'}
              </div>
              <span className={`${styles.trackLabel} ${i <= 1 ? styles.trackLabelDone : ''}`}>{s}</span>
              {i < 4 && <div className={`${styles.trackLine} ${i < 1 ? styles.trackLineDone : ''}`} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN CHECKOUT ──────────────────────────────────────── */
export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [cart, setCart] = useState(MOCK_CART);
  const [shipping, setShipping] = useState('standard');
  const [form, setForm] = useState({});
  const [couponVal, setCouponVal] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  /* Load user's actual added cart items from localStorage */
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fenno_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  /* Save cart state when items change */
  useEffect(() => {
    try {
      localStorage.setItem('fenno_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  function applyCoupon() {
    if (couponVal === 'EYEWEAR10') setCouponApplied(true);
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={`${styles.header} glass-panel`}>
        <div className={`container ${styles.headerInner}`}>
          <Link href="/" className={styles.logo}>
            <span>👓</span>
            <span>Next-Gen<strong>Eyewear</strong></span>
          </Link>
          <StepBar current={step} />
          <div className={styles.secureTag}>🔒 Secure Checkout</div>
        </div>
      </header>

      {/* Body */}
      <div className={`container ${styles.body}`}>
        <div className={styles.mainArea}>
          {step === 0 && <StepCartReview cart={cart} setCart={setCart} onNext={() => setStep(1)} />}
          {step === 1 && <StepShipping shipping={shipping} setShipping={setShipping} form={form} setForm={setForm} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
          {step === 2 && <StepPayment onNext={() => setStep(3)} onBack={() => setStep(1)} />}
          {step === 3 && <StepConfirmation cart={cart} form={form} shipping={shipping} />}
        </div>

        {step < 3 && (
          <OrderSummary
            cart={cart}
            shipping={shipping}
            couponVal={couponVal}
            setCouponVal={setCouponVal}
            onCoupon={applyCoupon}
            couponApplied={couponApplied}
          />
        )}
      </div>
    </div>
  );
}
