'use server';

import { cache } from 'react';
import { cookies } from 'next/headers';
import { auth } from '@/app/lib/auth';
import dbConnect from '@/app/lib/mongoConnection';
import Product from '@/models/product';
import Category from '@/models/category';
import UserActivity from '@/models/userActivity';
import { recommendationService } from '@/app/lib/recommendationService';
import { restrictTo } from '@/app/utils/checkPermission';
import { revalidateTag } from 'next/cache';

// Cache recommendations using React's cache
export const getRecommendations = cache(
  async (type, categorySlug, productId, limit = 8) => {
    await dbConnect();
    const session = await auth();
    const userId = session?.user?.id;

    let products = [];

    if (productId && type === 'similar') {
      // Get similar products for a specific product
      const product = await Product.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }

      const userActivity = userId
        ? await UserActivity.findOne({ userId }).select('naughtyList')
        : null;

      products = await product.findSimilarProducts(
        userActivity,
        Number.parseInt(limit, 10)
      );
    } else if (userId && type === 'personalized') {
      // Get personalized recommendations
      products = await recommendationService.getPersonalizedRecommendations(
        userId,
        Number.parseInt(limit, 10)
      );
    } else {
      // Fallback to category-based or general recommendations
      const filter = { status: 'active' };

      if (categorySlug) {
        const categoryDoc = await Category.findOne({
          slug: categorySlug,
        }).select('_id');
        if (categoryDoc) {
          filter.category = categoryDoc._id;
        }
      }

      products = await Product.find(filter)
        .sort({ purchaseCount: -1, viewCount: -1, createdAt: -1 })
        .limit(Number.parseInt(limit, 10))
        .populate('category', 'name slug')
        .lean();
    }

    // Format the response data
    return products.map((product) => {
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
  }
);

// Server Action for tracking product interactions
export async function trackProductInteractionSA(
  productId,
  interactionType = 'view'
) {
  // No restrictTo to allow anonymous tracking if desired
  try {
    await dbConnect();
    // Get session if needed
    const session = await auth();

    if (!session?.user) {
      // Skip tracking for anonymous users but don't error
      console.log('Anonymous user interaction, skipping tracking.');
      return { success: true, message: 'Anonymous interaction skipped.' };
    }

    const userId = session.user.id;

    if (!productId) {
      throw new Error('Product ID is required');
    }

    if (!['view', 'purchase', 'click'].includes(interactionType)) {
      throw new Error(
        "Invalid interaction type. Must be 'view', 'click' or 'purchase'"
      );
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Update view count if applicable
    const updates = {};
    if (interactionType === 'view') updates.$inc = { viewCount: 1 };

    await Product.findByIdAndUpdate(productId, updates);

    const now = new Date();
    if (interactionType === 'view' || interactionType === 'click') {
      // Remove product from recentlyViewed if it exists (to avoid duplicates)
      await UserActivity.findOneAndUpdate(
        { userId },
        { $pull: { recentlyViewed: { productId: productId } } }
      );

      // Add to recentlyViewed with updated info
      const updateData = {
        $push: {
          recentlyViewed: {
            $each: [
              {
                productId,
                viewedAt: now,
                clickCount: interactionType === 'click' ? 1 : 0,
                lastClicked: interactionType === 'click' ? now : null,
              },
            ],
            $slice: -20, // Keep only the last 20 items
          },
        },
        $set: { lastInteraction: now },
      };

      await UserActivity.findOneAndUpdate({ userId }, updateData, {
        upsert: true,
      });
    }

    return {
      success: true,
      message: `Interaction '${interactionType}' tracked.`,
    };
  } catch (error) {
    console.error(`Error tracking interaction (SA):`, error);
    // Don't necessarily throw; tracking failure shouldn't break UI
    return { success: false, message: error.message || 'Tracking failed.' };
  }
}

// Server Action for adding product to naughty list
export async function addToNaughtyListSA(productId) {
  await restrictTo('user', 'admin');

  try {
    await dbConnect();
    const session = await auth();
    const userId = session.user.id;

    if (!productId) {
      throw new Error('Product ID is required');
    }

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Add to naughty list
    await recommendationService.addToNaughtyList(userId, productId);

    // Revalidate recommendations if needed
    revalidateTag(`recommendations-${userId}`);

    return { success: true, message: 'Product hidden from recommendations.' };
  } catch (error) {
    console.error(`Error adding to naughty list (SA):`, error);
    return {
      success: false,
      message: error.message || 'Failed to hide product.',
    };
  }
}

// Get recommended products for the home page with proper fetch caching
export async function getHomeRecommendations() {
  // Get selected category from cookie
  const cookieStore = cookies();
  const selectedCategory =
    cookieStore.get('selected-category')?.value || 'women';

  // Get user session
  const session = await auth();
  const userId = session?.user?.id;

  // Determine recommendation type
  const type = userId ? 'personalized' : 'general';

  // Get recommendations
  return getRecommendations(type, selectedCategory);
}
