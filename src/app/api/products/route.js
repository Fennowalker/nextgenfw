import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Prada Minimalist Wire', brand: 'Prada', type: 'Frame', basePrice: 340, status: 'active', stock: 28, variants: 3, img: '/prada-frames.png' },
  { id: 2, name: 'Persol Calligrapher', brand: 'Persol', type: 'Sunglass', basePrice: 320, status: 'active', stock: 14, variants: 2, img: '/persol-sunglasses.png' },
  { id: 3, name: 'Tom Ford Keyhole', brand: 'Tom Ford', type: 'Frame', basePrice: 310, status: 'active', stock: 19, variants: 2, img: '/tomford-frames.png' },
  { id: 4, name: 'Ray-Ban Aviator Classic', brand: 'Ray-Ban', type: 'Sunglass', basePrice: 175, status: 'active', stock: 67, variants: 5, img: '/rayban-sunglasses.png' },
  { id: 5, name: 'Acuvue Oasys Monthly', brand: 'Acuvue', type: 'Contact Lens', basePrice: 48, status: 'active', stock: 142, variants: 4, img: '/contact-lens-box.png' },
];

/* ── GET /api/products ── */
export async function GET(request) {
  try {
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      return NextResponse.json({ ok: true, products: MOCK_PRODUCTS, source: 'mock_fallback' });
    }

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

    return NextResponse.json({ ok: true, products: products.length ? products : MOCK_PRODUCTS });
  } catch (error) {
    return NextResponse.json({ ok: true, products: MOCK_PRODUCTS, fallback: true, error: error.message });
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

    if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('localhost')) {
      return NextResponse.json({
        ok: true,
        product: { id: Date.now(), name, brand, type, basePrice: parseFloat(basePrice), status, stock, variants, img },
        mode: 'demo',
      });
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
