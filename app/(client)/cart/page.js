import { auth } from '@/app/lib/auth';
import { getCart } from '@/app/action/cartAction';
import CartContents from '@/app/components/cart/cart-contents';

export default async function CartPage() {
  // Fetch user session server-side
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch initial cart data if user is logged in
  let initialCartData = null;
  if (userId) {
    try {
      initialCartData = await getCart(userId);
    } catch (error) {
      console.error('Error fetching initial cart data:', error);
      // Errors will be handled in the client component
    }
  }

  // Pass the initial data to the client component
  return <CartContents initialCartData={initialCartData} />;
}
