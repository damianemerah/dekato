import { NextResponse } from 'next/server';
import Product from '@/models/product';
import Category from '@/models/category';
import UserActivity from '@/models/userActivity';
import dbConnect from '@/app/lib/mongoConnection';
import { recommendationService } from '@/app/lib/recommendationService';
import { auth } from '@/app/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    await dbConnect();
    const searchParams = req.nextUrl.searchParams;
    const category = searchParams.get('category');
    const limit = searchParams.get('limit') || 4;
    const productId = searchParams.get('productId');
    const type = searchParams.get('type');
    const session = await auth();
    const userId = session?.user?.id;

    let products = [];

    if (productId && type === 'similar') {
      // Get similar products for a specific product
      const product = await Product.findById(productId);
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }
      const userActivity = await UserActivity.findOne({ userId }).select(
        'naughtyList'
      );

      products = await product.findSimilarProducts(
        userActivity,
        parseInt(limit, 10)
      );
    } else if (userId && type === 'personalized') {
      // Get personalized recommendations
      products = await recommendationService.getPersonalizedRecommendations(
        userId,
        parseInt(limit, 10)
      );
    } else {
      // Fallback to category-based or general recommendations
      let filter = { status: 'active' };

      if (category) {
        const categoryDoc = await Category.findOne({ slug: category }).select(
          '_id'
        );
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        }
      }

      products = await Product.find(filter)
        .sort({ purchaseCount: -1, viewCount: -1, createdAt: -1 })
        .limit(parseInt(limit, 10))
        .populate('category', 'name slug')
        .lean();
    }

    // Format the response data
    const formattedProducts = products.map((product) => {
      const { _id, ...rest } = product;
      return {
        id: _id.toString(),
        ...rest,
        category: product.category?.map((cat) => ({
          id: cat._id.toString(),
          name: cat.name,
          slug: cat.slug,
        })),
      };
    });

    return NextResponse.json({
      products: formattedProducts,
      isPersonalized: !!userId,
      total: formattedProducts.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error fetching recommendations' },
      { status: 500 }
    );
  }
}

// Note: The POST and PATCH handlers have been replaced by Server Actions:
// - trackProductInteractionSA in recommendationAction.js
// - addToNaughtyListSA in recommendationAction.js
