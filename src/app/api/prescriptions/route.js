import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* ── GET /api/prescriptions ── */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    const prescriptions = await db.prescription.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, prescriptions });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

/* ── POST /api/prescriptions ── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, title, doctor, date, isPrimary, odSph, odCyl, odAxis, odAdd, osSph, osCyl, osAxis, osAdd, pd, notes, fileUrl } = body;

    if (!userId || !title) {
      return NextResponse.json({ ok: false, error: 'Missing userId or prescription title' }, { status: 400 });
    }

    const prescription = await db.prescription.create({
      data: {
        userId,
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
