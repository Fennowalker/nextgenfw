import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

/* ── GET /api/products ── */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');

    const where = {};
    if (category) where.category = category;
    if (brand) where.brand = brand;

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ ok: true, products });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}

/* ── POST /api/products ── */
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, brand, type, basePrice, status, stock, variants, img } = body;

    if (!name || !brand || !basePrice) {
      return NextResponse.json({ ok: false, error: 'Missing required fields' }, { status: 400 });
    }

    const product = await db.product.create({
      data: {
        name,
        brand,
        type: type || 'Frame',
        basePrice: parseFloat(basePrice),
        status: status || 'active',
        stock: parseInt(stock) || 50,
        variants: parseInt(variants) || 4,
        img: img || null,
      },
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
