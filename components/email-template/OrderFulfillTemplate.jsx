import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Button,
  Hr,
  Preview,
} from '@react-email/components';

export const OrderFulfillTemplate = ({ firstName, order, formatToNaira }) => (
  <Html>
    <Head />
    <Preview>Your Dekato Order is On Its Way! 🚚✨</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>📦 DEKATO</Text>
          <Text style={subtitle}>Order Fulfilled</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {firstName}! 👋</Text>

          <Section style={celebrationBox}>
            <Text style={celebrationIcon}>🎉</Text>
            <Text style={celebrationText}>
              Your order has been fulfilled successfully!
            </Text>
          </Section>

          {order.shippingMethod === 'delivery' ? (
            <Text style={mainText}>
              Great news! Your fashion items are now ready and on their way to
              you. Here are the details of your fulfilled order:
            </Text>
          ) : (
            <Text style={mainText}>
              Great news! Your fashion items are now ready for pickup. Here are
              the details of your fulfilled order:
            </Text>
          )}

          {/* Order Details */}
          <Section style={orderSection}>
            <Text style={orderTitle}>📋 Order Details</Text>

            {order.product.map((item, index) => (
              <div key={index} style={productItem}>
                <div style={productInfo}>
                  <Text style={productName}>{item.name}</Text>
                  <Text style={productDetails}>
                    Quantity: {item.quantity} | Price:{' '}
                    {formatToNaira(item.price * item.quantity)}
                  </Text>
                </div>
              </div>
            ))}

            <div style={totalSection}>
              <Text style={totalLabel}>Total:</Text>
              <Text style={totalValue}>{formatToNaira(order.total)}</Text>
            </div>
          </Section>

          {/* Shipping Information */}
          <Section style={shippingSection}>
            <Text style={shippingTitle}>🚚 Shipping Information</Text>

            <div style={shippingItem}>
              <Text style={shippingLabel}>Shipping Method: </Text>
              <Text style={shippingValue}>{order.shippingMethod}</Text>
            </div>

            {order.shippingMethod === 'delivery' && (
              <>
                {order.tracking && (
                  <div style={shippingItem}>
                    <Text style={shippingLabel}>Tracking Number: </Text>
                    <Text style={trackingNumber}>{order.tracking}</Text>
                  </div>
                )}

                {order.carrier && (
                  <div style={shippingItem}>
                    <Text style={shippingLabel}>Carrier: </Text>
                    <Text style={shippingValue}>{order.carrier}</Text>
                  </div>
                )}

                {order.trackingLink && (
                  <Section style={trackingSection}>
                    <Text style={trackingText}>
                      Track your order in real-time:
                    </Text>
                    <Button href={order.trackingLink} style={trackButton}>
                      🔍 Track Package
                    </Button>
                  </Section>
                )}
              </>
            )}
          </Section>

          <Text style={helpText}>
            Have questions about your order? Our customer service team is here
            to help! Reach out anytime for assistance. 💬
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Happy Shopping! 🛍️
            <br />
            <em>- Your friends at Dekato Store</em>
          </Text>
          <Text style={address}>
            📍 30A Oseni Street, Anthony Village
            <br />
            Opposite GTB, Lagos, Nigeria
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

// Styles
const main = {
  backgroundColor: '#f8fafc',
  fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0',
  maxWidth: '600px',
};

const header = {
  textAlign: 'center',
  padding: '40px 20px',
  background: 'linear-gradient(135deg, #9f7aea 0%, #667eea 100%)',
  borderRadius: '12px 12px 0 0',
};

const logo = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px 0',
  letterSpacing: '1px',
};

const subtitle = {
  fontSize: '14px',
  color: '#e9d8fd',
  margin: '0',
  fontWeight: '500',
};

const content = {
  backgroundColor: '#ffffff',
  padding: '40px',
  borderRadius: '0 0 12px 12px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
};

const greeting = {
  fontSize: '24px',
  fontWeight: '600',
  color: '#1a202c',
  margin: '0 0 20px 0',
  textAlign: 'center',
};

const celebrationBox = {
  backgroundColor: '#f0fff4',
  border: '2px solid #9ae6b4',
  borderRadius: '8px',
  padding: '25px',
  textAlign: 'center',
  margin: '25px 0',
};

const celebrationIcon = {
  fontSize: '32px',
  margin: '0 0 10px 0',
};

const celebrationText = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#22543d',
  margin: '0',
};

const mainText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2d3748',
  margin: '25px 0',
  textAlign: 'center',
};

const orderSection = {
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const orderTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 20px 0',
  textAlign: 'center',
};

const productItem = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '6px',
  padding: '15px',
  margin: '10px 0',
};

const productInfo = {
  textAlign: 'left',
};

const productName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 5px 0',
};

const productDetails = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0',
};

const shippingSection = {
  backgroundColor: '#ebf8ff',
  border: '1px solid #90cdf4',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const shippingTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2c5282',
  margin: '0 0 15px 0',
  textAlign: 'center',
};

const shippingItem = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  margin: '10px 0',
  padding: '8px 0',
  borderBottom: '1px solid #bee3f8',
};

const shippingLabel = {
  fontSize: '14px',
  color: '#2d3748',
  fontWeight: '500',
  margin: '0',
};

const shippingValue = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0',
  textTransform: 'capitalize',
};

const trackingNumber = {
  fontSize: '14px',
  color: '#2c5282',
  fontWeight: '600',
  margin: '0',
  fontFamily: 'monospace',
};

const trackingSection = {
  textAlign: 'center',
  margin: '15px 0',
  padding: '15px',
  backgroundColor: '#f7fafc',
  borderRadius: '6px',
};

const trackingText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0 0 10px 0',
};

const trackButton = {
  backgroundColor: '#4299e1',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  display: 'inline-block',
};

const helpText = {
  fontSize: '14px',
  lineHeight: '1.6',
  color: '#718096',
  textAlign: 'center',
  margin: '30px 0 0 0',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '40px 0',
};

const footer = {
  textAlign: 'center',
  padding: '20px',
};

const footerText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0 0 15px 0',
};

const address = {
  fontSize: '12px',
  color: '#718096',
  margin: '0',
  lineHeight: '1.4',
};

const totalSection = {
  backgroundColor: '#edf2f7',
  borderRadius: '6px',
  padding: '15px',
  marginTop: '20px',
  display: 'flex',
  gap: '10px',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const totalLabel = {
  fontSize: '16px',
  fontWeight: '700',
  color: '#2d3748',
  margin: '0',
};

const totalValue = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#38a169',
  margin: '0',
};
