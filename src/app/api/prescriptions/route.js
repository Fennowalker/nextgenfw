import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_PRESCRIPTIONS = [
  {
    id: '1',
    title: 'Daily Glasses (Dr. Farooq)',
    doctor: 'Dr. M. Farooq (Aga Khan Hospital)',
    date: '2026-05-14',
    isPrimary: true,
    odSph: '-2.50', odCyl: '-0.75', odAxis: '180', odAdd: '+1.50',
    osSph: '-2.25', osCyl: '-0.50', osAxis: '175', osAdd: '+1.50',
    pd: '63mm',
    notes: 'Anti-reflective coating recommended for computer work.',
  },
  {
    id: '2',
    title: 'Contact Lens Prescription',
    doctor: 'Dr. Ayesha Malik',
    date: '2026-01-20',
    isPrimary: false,
    odSph: '-2.25', odCyl: 'Plano', odAxis: '-', odAdd: '-',
    osSph: '-2.00', osCyl: 'Plano', osAxis: '-', osAdd: '-',
    pd: '63mm',
    notes: 'Acuvue Oasys monthly disposition lenses.',
  },
];

/* ── GET /api/prescriptions ── */
export async function GET(request) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      return NextResponse.json({ ok: true, prescriptions: MOCK_PRESCRIPTIONS, source: 'mock_fallback' });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const prescriptions = await db.prescription.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, prescriptions: prescriptions.length ? prescriptions : MOCK_PRESCRIPTIONS });
  } catch (error) {
    return NextResponse.json({ ok: true, prescriptions: MOCK_PRESCRIPTIONS, fallback: true, error: error.message });
  }
}

/* ── POST /api/prescriptions ── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, title, doctor, date, isPrimary, odSph, odCyl, odAxis, odAdd, osSph, osCyl, osAxis, osAdd, pd, notes, fileUrl } = body;

    if (!title) {
      return NextResponse.json({ ok: false, error: 'Missing prescription title' }, { status: 400 });
    }

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      return NextResponse.json({
        ok: true,
        prescription: { id: String(Date.now()), userId, title, doctor, date, isPrimary, odSph, odCyl, odAxis, odAdd, osSph, osCyl, osAxis, osAdd, pd, notes, fileUrl },
        mode: 'demo',
      });
    }

    const prescription = await db.prescription.create({
      data: {
        userId: userId || 'demo-user-id',
        title,
        doctor: doctor || 'Self / Unspecified',
        date: date || new Date().toISOString().split('T')[0],
        isPrimary: Boolean(isPrimary),
        odSph: odSph || '0.00',
        odCyl: odCyl || '0.00',
        odAxis: odAxis || '-',
        odAdd: odAdd || null,
        osSph: osSph || '0.00',
        osCyl: osCyl || '0.00',
        osAxis: osAxis || '-',
        osAdd: osAdd || null,
        pd: pd || '63mm',
        notes: notes || null,
        fileUrl: fileUrl || null,
      },
    });

    return NextResponse.json({ ok: true, prescription });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
