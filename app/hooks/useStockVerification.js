'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { verifyCartItemsAvailability } from '@/app/action/cartAction';
import { useUserStore } from '@/app/store/store';

export function useStockVerification(cartData = null, refreshInterval = 60000) {
  const [stockStatus, setStockStatus] = useState({
    isVerifying: false,
    valid: true,
    unavailableItems: [],
    lowStockItems: [],
  });
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Verify when cart data changes or on interval
  useEffect(() => {
    if (!user?.id) return;

    // Verify stock when cart data changes
    if (cartData) {
      verifyStock();
    }

    // Set up periodic verification
    const intervalId = setInterval(verifyStock, refreshInterval);

    return () => clearInterval(intervalId);
  }, [user?.id, cartData, refreshInterval]);

  async function verifyStock() {
    if (!user?.id || stockStatus.isVerifying) return;

    try {
      setStockStatus((prev) => ({ ...prev, isVerifying: true }));

      const result = await verifyCartItemsAvailability(user.id);

      setStockStatus({
        isVerifying: false,
        valid: result.unavailableItems?.length === 0,
        unavailableItems: result.unavailableItems || [],
        lowStockItems: result.lowStockItems || [],
      });

      // Show toast notification for unavailable items
      if (result.unavailableItems?.length > 0) {
        toast.error(
          `${result.unavailableItems.length} item(s) in your cart are no longer available in the requested quantity.`,
          {
            duration: 6000,
            action: {
              label: 'View',
              onClick: () => router.push('/cart'),
            },
          }
        );
      }

      // Show toast notification for low stock items
      if (
        result.lowStockItems?.length > 0 &&
        result.unavailableItems?.length === 0
      ) {
        toast.warning(
          `${result.lowStockItems.length} item(s) in your cart are low in stock.`,
          {
            duration: 4000,
          }
        );
      }
    } catch (error) {
      console.error('Error verifying stock:', error);
      setStockStatus((prev) => ({ ...prev, isVerifying: false }));
    }
  }

  return stockStatus;
}
