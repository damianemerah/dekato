import Product from '@/models/product';
import dbConnect from '@/app/lib/mongoConnection';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const now = new Date();

    await dbConnect();

    const products = await Product.find({ discountDuration: { $lte: now } });

    for (const product of products) {
      product.discount = 0;
      product.discountPrice = 0;
      product.discountDuration = undefined;

      if (product.variant && Array.isArray(product.variant)) {
        product.variant.forEach((variant) => {
          variant.discountPrice = 0;
        });
      }

      await product.save();
    }

    return NextResponse.json(
      { message: 'Discounts reset successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error resetting expired discounts:', error);
    return NextResponse.json(
      { error: 'Error resetting expired discounts' },
      { status: 500 }
    );
  }
}
