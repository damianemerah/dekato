import { throttle } from 'lodash';
import { trackProductInteractionSA } from '@/app/action/recommendationAction';

export const trackView = async (userId, productId) => {
  await trackInteraction(userId, productId, 'view');
};

// Track clicks
export const trackClick = async (userId, productId) => {
  await trackInteraction(userId, productId, 'click');
};

async function trackInteraction(userId, productId, interactionType) {
  try {
    const result = await trackProductInteractionSA(productId, interactionType);
    if (!result.success) {
      console.warn(`Failed to track ${interactionType}:`, result.message);
    }
  } catch (error) {
    console.error(`Error tracking product ${interactionType}:`, error);
  }
}
