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

export const OrderReceivedTemplate = ({ firstName, order, formatToNaira }) => (
  <Html>
    <Head />
    <Preview>Your Dekato Order Has Been Received! 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>📦 DEKATO</Text>
          <Text style={subtitle}>Order Received</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {firstName}! 👋</Text>

          <Section style={celebrationBox}>
            <Text style={celebrationIcon}>🎉</Text>
            <Text style={celebrationText}>
              Thank you for your order! We&apos;ve received it and it&apos;s
              being processed.
            </Text>
          </Section>

          {order.shippingMethod === 'delivery' ? (
            <Text style={mainText}>
              We&apos;re excited to let you know that your order has been
              successfully received and is now being prepared for shipment. Here
              are the details of your recent purchase:
            </Text>
          ) : (
            <Text style={mainText}>
              We&apos;re excited to let you know that your order has been
              successfully received and is now being prepared for pickup. Here
              are the details of your recent purchase:
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
              <Text style={totalLabel}>Total: </Text>
              <Text style={totalValue}>{formatToNaira(order.total)}</Text>
            </div>
          </Section>

          {/* Shipping Information (simplified for initial receipt) */}
          <Section style={shippingSection}>
            <Text style={shippingTitle}>📦 Delivery Information</Text>

            <div style={shippingItem}>
              <Text style={shippingLabel}>Shipping Method: </Text>
              <Text style={shippingValue}>{order.shippingMethod}</Text>
            </div>

            {order.shippingMethod === 'delivery' && order.address && (
              <div style={shippingItem}>
                <Text style={shippingLabel}>Delivery Address: </Text>
                <Text style={shippingValue}>
                  {order.address.address}, {order.address.city},{' '}
                  {order.address.state}, {order.address.postalCode}
                </Text>
              </div>
            )}

            {order.shippingMethod === 'pickup' && (
              <div style={shippingItem}>
                <Text style={shippingLabel}>Pickup Location:</Text>
                <Text style={shippingValue}>
                  Dekato Store - [Store Address Here]
                </Text>
              </div>
            )}

            <Text style={trackingText}>
              You will receive another email with tracking information once your
              order has been shipped.
            </Text>
          </Section>

          <Text style={helpText}>
            In the meantime, if you have any questions or need further
            assistance, please don&apos;t hesitate to contact our customer
            service team. 💬
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Thank you for choosing Dekato Store! ✨
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

// Styles (These are mostly copied from OrderFulfillTemplate and can be adjusted)
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
  background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)', // Slightly different purple
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
  backgroundColor: '#e0f2f7',
  border: '2px solid #a7d9ed',
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
  color: '#2b6cb0',
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

const totalSection = {
  backgroundColor: '#edf2f7',
  borderRadius: '6px',
  padding: '15px',
  gap: '10px',
  marginTop: '20px',
  display: 'flex',
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
  alignItems: 'flex-start', // Align items to the start for multi-line address
  margin: '10px 0',
  padding: '8px 0',
  borderBottom: '1px solid #bee3f8',
  gap: '10px',
};

const shippingLabel = {
  fontSize: '14px',
  color: '#2d3748',
  fontWeight: '500',
  margin: '0',
  flexBasis: '40%', // Give label some fixed width
};

const shippingValue = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0',
  textAlign: 'right',
  flexBasis: '60%', // Allow value to take remaining width
};

const trackingText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '15px 0 0 0',
  textAlign: 'center',
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
