import useSWR from "swr";
import { getUserOrders } from "@/app/action/orderAction";

export default function useOrders(userId, limit = 3) {
  const {
    data: orders,
    error,
    isLoading,
  } = useSWR(userId ? `orders-${userId}` : null, async () => {
    return getUserOrders(userId);
  });

  return {
    orders,
    isLoading,
    isError: error,
  };
}
