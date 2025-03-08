import { Shield, Truck, CreditCard, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'All products meet our high quality standards',
  },
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On all orders above ₦15,000',
  },
  {
    icon: CreditCard,
    title: 'Secure Payment',
    description: 'Multiple secure payment options',
  },
  {
    icon: HeadphonesIcon,
    title: 'Customer Support',
    description: 'Available Mon-Sat, 8am-8pm',
  },
];

export default function FeatureGrid() {
  return (
    <section className="bg-muted py-10">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="flex flex-col items-center rounded-lg bg-background p-6 text-center shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-4 rounded-full bg-primary/10 p-3">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-oswald mb-2 text-lg font-medium">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
