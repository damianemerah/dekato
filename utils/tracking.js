import { throttle } from "lodash";
import Queue from "queue";

export const activityQueue = new Queue({
  concurrency: 4,
  autostart: true,
  timeout: 10000,
});

export const trackView = async (userId, productId) => {
  console.log("trackView📁", userId, productId);
  if (!userId) return;
  await trackInteraction(userId, productId, "view");
};

// Track clicks (immediate)
export const trackClick = async (userId, productId) => {
  console.log("clicked📁", userId, productId);
  if (!userId) return;
  await trackInteraction(userId, productId, "click");
};

async function trackInteraction(userId, productId, interactionType) {
  try {
    await fetch("/api/recommendations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        interactionType,
      }),
    });
  } catch (error) {
    console.error(`Error tracking product ${interactionType}:`, error);
  }
}
