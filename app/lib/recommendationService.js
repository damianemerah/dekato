import Product from '@/models/product';
import UserActivity from '@/models/userActivity';
import Order from '@/models/order';

export const recommendationService = {
  async getPersonalizedRecommendations(userId, limit = 4) {
    try {
      // Get user activity and recently purchased products
      const [userActivity, orders] = await Promise.all([
        UserActivity.findOne({ userId })
          .populate('recentlyViewed.productId', 'category')
          .select('recentlyViewed naughtyList')
          .sort({
            'recentlyViewed.clickCount': -1,
            'recentlyViewed.lastClicked': -1,
          }),
        Order.find({ userId, paymentRef: { $ne: null, $exists: true } })
          .populate('product.productId', '_id')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

      // Get IDs of purchased products and naughty list to exclude them
      const purchasedProductIds =
        orders
          ?.flatMap((order) =>
            order.product.map((item) => item.productId?._id.toString())
          )
          .filter(Boolean) || [];

      const naughtyListIds = userActivity?.naughtyList || [];
      const excludeIds = [...purchasedProductIds, ...naughtyListIds];

      // Collect and weight category IDs based on interactions
      const categoryWeights = new Map();

      // Weight categories from clicked products more heavily
      userActivity?.recentlyViewed.forEach((view) => {
        view.productId?.category?.forEach((cat) => {
          const catId = cat.toString();
          const weight = view.clickCount * 2 + 1; // Clicks count double
          categoryWeights.set(
            catId,
            (categoryWeights.get(catId) || 0) + weight
          );
        });
      });

      if (categoryWeights.size === 0) {
        return await Product.find({
          status: 'active',
          _id: { $nin: excludeIds },
        })
          .sort({ purchaseCount: -1, viewCount: -1 })
          .limit(limit)
          .populate('category', 'name slug')
          .lean();
      }

      // Sort categories by weight
      const sortedCategories = Array.from(categoryWeights.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([id]) => id);

      // Get recommendations prioritizing higher weighted categories
      // and excluding purchased products and naughty list
      const recommendations = await Product.find({
        category: { $in: sortedCategories },
        status: 'active',
        _id: { $nin: excludeIds },
      })
        .sort({ purchaseCount: -1, viewCount: -1 })
        .limit(limit * 2) // Get extra results for diversity
        .populate('category', 'name slug')
        .lean({ virtuals: true });

      // Diversify results across categories
      const diversifiedResults = this.diversifyResults(recommendations, limit);
      return diversifiedResults;
    } catch (error) {
      console.error('Error getting personalized recommendations:', error);
      return [];
    }
  },

  diversifyResults(products, limit) {
    const categoryMap = new Map();
    const result = [];

    for (const product of products) {
      if (result.length >= limit) break;

      const categoryId =
        product.category[product.category.length - 1]?._id.toString();
      if (!categoryId) continue;

      const categoryCount = categoryMap.get(categoryId) || 0;
      if (categoryCount < 2) {
        // Max 2 products per category
        result.push(product);
        categoryMap.set(categoryId, categoryCount + 1);
      }
    }

    return result;
  },

  async trackProductInteraction(userId, productId, interactionType = 'view') {
    try {
      const updates = {};
      if (interactionType === 'view') {
        updates.$inc = { viewCount: 1 };
      } else if (interactionType === 'purchase') {
        updates.$inc = { purchaseCount: 1 };
      }

      // Update product metrics
      await Product.findByIdAndUpdate(productId, updates);

      const now = new Date();

      if (interactionType === 'view' || interactionType === 'click') {
        // First remove the product if it exists in recentlyViewed
        await UserActivity.findOneAndUpdate(
          { userId },
          {
            $pull: {
              recentlyViewed: { productId: productId },
            },
          }
        );

        // Then add the new interaction at the end
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
    } catch (error) {
      console.error('Error tracking product interaction:', error);
    }
  },
  async addToNaughtyList(userId, productId) {
    await UserActivity.findOneAndUpdate(
      { userId },
      { $push: { naughtyList: productId } }
    );
  },

  async getTrendingProducts(userId, limit = 8) {
    try {
      // Get user naughty list if userId exists to exclude those products
      const userActivity = userId
        ? await UserActivity.findOne({ userId }).select('naughtyList')
        : null;

      // Construct query for trending products
      const query = {
        status: 'active',
        purchaseCount: { $gt: 0 },
      };

      // Exclude products in user's naughty list if it exists
      if (userActivity?.naughtyList?.length > 0) {
        query._id = { $nin: userActivity.naughtyList };
      }

      // Find trending products ordered by purchase count and view count
      const products = await Product.find(query)
        .sort({ purchaseCount: -1, viewCount: -1 })
        .limit(limit)
        .populate('category', 'name slug')
        .lean({ virtuals: true });

      return products;
    } catch (error) {
      console.error('Error getting trending products:', error);
      return [];
    }
  },
};
