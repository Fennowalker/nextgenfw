'use client';
import { useState } from 'react';
import Link from 'next/link';
import styles from './calculator.module.css';

export default function CalculatorPage() {
  // Tool 1: Transposition State
  const [transSph, setTransSph] = useState(-2.50);
  const [transCyl, setTransCyl] = useState(-0.75);
  const [transAxis, setTransAxis] = useState(180);

  // Tool 2: Vertex Distance State (Glasses to Contacts)
  const [glassesSph, setGlassesSph] = useState(-5.00);
  const [vertexMm, setVertexMm] = useState(12);

  // Tool 3: Focal Distance State
  const [addPower, setAddPower] = useState(2.00);

  /* ─── TRANSPOSITION LOGIC ─── */
  const newSph = (parseFloat(transSph) + parseFloat(transCyl)).toFixed(2);
  const newCyl = (-parseFloat(transCyl)).toFixed(2);
  let newAxis = parseInt(transAxis);
  if (!isNaN(newAxis)) {
    if (newAxis <= 90) newAxis += 90;
    else newAxis -= 90;
  } else {
    newAxis = 90;
  }

  /* ─── VERTEX COMPENSATION LOGIC ─── */
  // F_cl = F_g / (1 - d * F_g)
  const fGlasses = parseFloat(glassesSph);
  const dMeters = parseFloat(vertexMm) / 1000;
  const contactSph = (fGlasses / (1 - dMeters * fGlasses)).toFixed(2);
  const powerDiff = (contactSph - fGlasses).toFixed(2);

  /* ─── FOCAL DISTANCE LOGIC ─── */
  const focalCm = addPower > 0 ? (100 / parseFloat(addPower)).toFixed(1) : 'Infinite';
  const focalInches = addPower > 0 ? (39.37 / parseFloat(addPower)).toFixed(1) : 'Infinite';

  return (
    <div className={styles.calcPage}>
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
      <section className={styles.heroBanner}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className={styles.badge}>🔬 Optical Lab Utility</span>
            <h1 className={styles.heroTitle}>Interactive Optical Prescription Transposition Calculator</h1>
            <p className={styles.heroSub}>Professional refractive formulas for SPH/CYL transposition, vertex distance compensation, and focal range calculations.</p>
          </div>
        </div>
      </section>

      {/* ── MAIN TOOLS GRID ── */}
      <main className="container">
        <div className={styles.toolsGrid}>
          {/* TOOL 1: SPH/CYL TRANSPOSITION */}
          <div className={styles.toolCard}>
            <div className={styles.toolHeader}>
              <span className={styles.toolIcon}>🔄</span>
              <div>
                <h3 className={styles.toolTitle}>1. Plus / Minus Cylinder Transposition</h3>
                <p className={styles.toolSub}>Converts optical prescriptions between Plus-Cylinder and Minus-Cylinder formats.</p>
              </div>
            </div>

            <div className={styles.inputsRow3}>
              <div className={styles.fieldGroup}>
                <label>SPH (Sphere)</label>
                <input
                  type="number"
                  step="0.25"
                  value={transSph}
                  onChange={e => setTransSph(e.target.value)}
                  className={styles.calcInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>CYL (Cylinder)</label>
                <input
                  type="number"
                  step="0.25"
                  value={transCyl}
                  onChange={e => setTransCyl(e.target.value)}
                  className={styles.calcInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>AXIS (1° - 180°)</label>
                <input
                  type="number"
                  min="1"
                  max="180"
                  value={transAxis}
                  onChange={e => setTransAxis(e.target.value)}
                  className={styles.calcInput}
                />
              </div>
            </div>

            <div className={styles.resultBox}>
              <span className={styles.resultLabel}>Transposed Prescription Result:</span>
              <div className={styles.rxFormulaBadge}>
                <code>SPH: {newSph > 0 ? `+${newSph}` : newSph}</code>
                <code>CYL: {newCyl > 0 ? `+${newCyl}` : newCyl}</code>
                <code>AXIS: {newAxis}°</code>
              </div>
              <p className={styles.formulaNote}>Formula: New SPH = SPH + CYL | New CYL = −(CYL) | New AXIS = AXIS ± 90°</p>
            </div>
          </div>

          {/* TOOL 2: VERTEX DISTANCE (GLASSES TO CONTACTS) */}
          <div className={styles.toolCard}>
            <div className={styles.toolHeader}>
              <span className={styles.toolIcon}>👁️</span>
              <div>
                <h3 className={styles.toolTitle}>2. Vertex Distance Compensation (Glasses ➔ Contacts)</h3>
                <p className={styles.toolSub}>Calculates power shift when moving lenses from 12mm spectacle distance to contact lens 0mm BVD.</p>
              </div>
            </div>

            <div className={styles.inputsRow2}>
              <div className={styles.fieldGroup}>
                <label>Eyeglass SPH Power (Diopters)</label>
                <input
                  type="number"
                  step="0.25"
                  value={glassesSph}
                  onChange={e => setGlassesSph(e.target.value)}
                  className={styles.calcInput}
                />
              </div>
              <div className={styles.fieldGroup}>
                <label>Back Vertex Distance (mm)</label>
                <input
                  type="number"
                  value={vertexMm}
                  onChange={e => setVertexMm(e.target.value)}
                  className={styles.calcInput}
                />
              </div>
            </div>

            <div className={styles.resultBox}>
              <span className={styles.resultLabel}>Equivalent Contact Lens Power:</span>
              <div className={styles.rxFormulaBadge}>
                <code>Contact Lens SPH: {contactSph > 0 ? `+${contactSph}` : contactSph} D</code>
                <span className={styles.diffPill}>Power Adjustment: {powerDiff > 0 ? `+${powerDiff}` : powerDiff} D</span>
              </div>
              <p className={styles.formulaNote}>Formula: Fc = Fg / (1 − d × Fg) where d = {vertexMm}mm spectacle distance.</p>
            </div>
          </div>

          {/* TOOL 3: PROGRESSIVE FOCAL DISTANCE */}
          <div className={styles.toolCard}>
            <div className={styles.toolHeader}>
              <span className={styles.toolIcon}>📏</span>
              <div>
                <h3 className={styles.toolTitle}>3. Reading & Near Vision Focal Distance Calculator</h3>
                <p className={styles.toolSub}>Determines precise working distance for reading glasses based on ADD power.</p>
              </div>
            </div>

            <div className={styles.inputsRow1}>
              <div className={styles.fieldGroup}>
                <label>Reading ADD Power (+1.00 D to +3.50 D)</label>
                <input
                  type="number"
                  step="0.25"
                  min="0.5"
                  max="4.0"
                  value={addPower}
                  onChange={e => setAddPower(e.target.value)}
                  className={styles.calcInput}
                />
              </div>
            </div>

            <div className={styles.resultBox}>
              <span className={styles.resultLabel}>Ideal Working Focal Distance:</span>
              <div className={styles.rxFormulaBadge}>
                <code>{focalCm} cm</code>
                <code>{focalInches} inches</code>
              </div>
              <p className={styles.formulaNote}>Formula: Focal Distance = 100 / ADD Power (in cm)</p>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className={styles.calcFooterActions}>
          <button className="btn-secondary" onClick={() => window.print()}>🖨️ Print Transposition Sheet</button>
          <Link href="/#catalog" className="btn-primary">🛒 Shop Lenses with Converted Rx →</Link>
        </div>
      </main>
    </div>
  );
}
