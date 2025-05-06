'use client';

import { memo } from 'react';
import { Card, CardContent } from '@/app/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';

const ProductDetailsSections = memo(function ProductDetailsSections({
  product,
}) {
  // Create sections based on available product data
  const sections = [
    {
      id: 'product-details',
      title: 'Product Details',
      content: (
        <div className="text-sm sm:text-base">
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>
      ),
    },
    {
      id: 'delivery-returns',
      title: 'Delivery & Returns',
      content: (
        <div className="text-sm sm:text-base">
          <p>We deliver your order within 1-2 business days.</p>
          <p className="mt-2">
            Easy returns available within 14 days of delivery.
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Free shipping on orders over ₦20,000</li>
            <li>Lagos: 1-2 business days</li>
            <li>Other states: 3-7 business days</li>
            <li>Returns accepted with original packaging</li>
          </ul>
        </div>
      ),
    },
  ];

  // Add care instructions section if available
  if (product.care) {
    sections.push({
      id: 'care',
      title: 'Care Instructions',
      content: (
        <div className="text-sm sm:text-base">
          <div dangerouslySetInnerHTML={{ __html: product.care }} />
        </div>
      ),
    });
  }

  // Add size guide if this is apparel
  if (
    product.category?.some((cat) =>
      ['clothing', 'apparel', 'shoes', 'dresses'].includes(
        cat.name?.toLowerCase()
      )
    )
  ) {
    sections.push({
      id: 'size-guide',
      title: 'Size Guide',
      content: (
        <div className="text-sm sm:text-base">
          <p className="mt-2">
            Please refer to the size chart to find your best fit:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Small: UK 6-8 / US 2-4</li>
            <li>Medium: UK 10-12 / US 6-8</li>
            <li>Large: UK 14-16 / US 10-12</li>
            <li>X-Large: UK 18-20 / US 14-16</li>
          </ul>
          <p className="mt-2">
            If you&apos;re between sizes, we recommend sizing up for a more
            comfortable fit.
          </p>
        </div>
      ),
    });
  }

  return (
    <Card className="mt-6 border-0 shadow-none">
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {sections.map((section) => (
            <AccordionItem
              key={section.id}
              value={section.id}
              className="border-b"
            >
              <AccordionTrigger className="flex justify-between px-2 py-4 font-medium text-gray-800 sm:px-0">
                <span>{section.title}</span>
              </AccordionTrigger>
              <AccordionContent className="px-2 pb-6 text-gray-700 sm:px-0">
                <div className="max-w-full overflow-visible">
                  {section.content}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
});

export default ProductDetailsSections;
