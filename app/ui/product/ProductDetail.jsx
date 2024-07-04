import { inter } from "@/font";

export default function ProductDetail() {
  return (
    <div>
      <div className="p-10 bg-slate-100">
        <h3 className="font-bold text-2xl mb-4 border-b-2 pb-2">Details</h3>
        <div className="flex text-sm">
          <div className="flex flex-col mb-4 gap-4 mr-10">
            <div>
              <h4 className="mb-2 font-bold">About Product</h4>
              <p className={`${inter.className}`}>
                Cool off this summer in the Mini Ruffle Smocked Tank Top from
                our very own LA Hearts. This tank features a smocked body,
                adjustable straps, scoop neckline, ruffled hems, and a cropped
                fit.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-bold">Advantages</h4>
              <ul className={`${inter.className}`}>
                <li>Smocked body</li>
                <li>Adjustable straps</li>
                <li>Scoop neckline</li>
                <li>Ruffled hems</li>
                <li>Cropped fit</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-bold">Product Details</h4>
              <ul className={`${inter.className}`}>
                <li>Model is wearing a size small</li>
                <li>100% rayon</li>
                <li>Machine washable</li>
                <li>Imported</li>
              </ul>
            </div>
          </div>
          <div>
            <h4 className="mb-2 font-bold">Shipping</h4>
            <p className={`${inter.className}`}>
              SHIPPING We offer Free Standard Shipping for all orders over $75
              to the 50 states and the District of Columbia. The minimum order
              value must be $75 before taxes, shipping and handling. Shipping
              fees are non-refundable.
            </p>
            <p className={`${inter.className}`}>
              Please allow up to 2 business days (excluding weekends, holidays,
              and sale days) to process your order.
            </p>
            <p className={`${inter.className}`}>
              Free standard shipping on all orders over $50
            </p>
          </div>
        </div>
      </div>
      <div className="mt-1">
        <div className="py-4 px-10 bg-slate-100">
          <h3>Other Information</h3>
        </div>
        <div className="py-4 px-10 bg-slate-100 mt-1">
          <h3>Other Information</h3>
        </div>
      </div>
    </div>
  );
}
