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

export const WelcomeTemplate = ({ firstName, url }) => (
  <Html>
    <Head />
    <Preview>Welcome to Dekato - Your Fashion Journey Begins!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header Section */}
        <Section style={header}>
          <Text style={logo}>DEKATO</Text>
          <Text style={tagline}>Fashion Forward</Text>
        </Section>

        {/* Welcome Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {firstName}! 👋</Text>

          <Text style={welcomeText}>
            Welcome to <strong>Dekato</strong>, we&apos;re absolutely thrilled
            to have you join our fashion family! 🎉✨
          </Text>

          <Text style={description}>
            You&apos;ve just stepped into a world of cutting-edge fashion,
            exclusive deals, and personalized style recommendations. We&apos;re
            not just a store - we&apos;re your fashion companion on this
            incredible journey.
          </Text>

          {/* Feature highlights */}
          <Section style={featuresSection}>
            <Text style={featuresTitle}>What makes us special?</Text>
            <div style={featureGrid}>
              <div style={featureItem}>
                <Text style={featureIcon}>🛍️</Text>
                <Text style={featureText}>Curated Collections</Text>
              </div>
              <div style={featureItem}>
                <Text style={featureIcon}>⚡</Text>
                <Text style={featureText}>Lightning Fast Delivery</Text>
              </div>
              <div style={featureItem}>
                <Text style={featureIcon}>💎</Text>
                <Text style={featureText}>Premium Quality</Text>
              </div>
            </div>
          </Section>

          {/* CTA Button */}
          <Section style={buttonSection}>
            <Button href={url} style={button}>
              Complete Your Profile
            </Button>
          </Section>

          <Text style={helpText}>
            Need help getting started? Our style experts are here to help you
            find the perfect look. Don&apos;t hesitate to reach out - we&apos;re
            just one click away! 💬
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            With love from the Dekato Team 💜
            <br />
            <em>Your Style, Our Passion</em>
          </Text>
          <Text style={address}>
            📍 30A Oseni Street, Anthony Village
            <br />
            Opposite GTB, Lagos, Nigeria
          </Text>
          <Text style={unsubscribe}>
            Don&apos;t want these emails?{' '}
            <a href="#" style={link}>
              Unsubscribe
            </a>
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
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '12px 12px 0 0',
};

const logo = {
  fontSize: '32px',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 8px 0',
  letterSpacing: '2px',
};

const tagline = {
  fontSize: '14px',
  color: '#e2e8f0',
  margin: '0',
  fontStyle: 'italic',
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
};

const welcomeText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2d3748',
  margin: '0 0 20px 0',
};

const description = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '0 0 30px 0',
};

const featuresSection = {
  backgroundColor: '#f7fafc',
  padding: '25px',
  borderRadius: '8px',
  margin: '30px 0',
};

const featuresTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#2d3748',
  textAlign: 'center',
  margin: '0 0 20px 0',
};

const featureGrid = {
  display: 'flex',
  justifyContent: 'space-around',
  flexWrap: 'wrap',
  gap: '20px',
};

const featureItem = {
  textAlign: 'center',
  flex: '1',
  minWidth: '120px',
};

const featureIcon = {
  fontSize: '24px',
  margin: '0 0 8px 0',
};

const featureText = {
  fontSize: '14px',
  fontWeight: '500',
  color: '#4a5568',
  margin: '0',
};

const buttonSection = {
  textAlign: 'center',
  margin: '40px 0',
};

const button = {
  backgroundColor: '#667eea',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 4px 6px rgba(102, 126, 234, 0.3)',
  transition: 'all 0.2s ease',
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
  margin: '0 0 15px 0',
  lineHeight: '1.4',
};

const unsubscribe = {
  fontSize: '12px',
  color: '#a0aec0',
  margin: '0',
};

const link = {
  color: '#667eea',
  textDecoration: 'underline',
};
