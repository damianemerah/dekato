import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Preview,
} from '@react-email/components';

export const EmailSubscriptionTemplate = ({ firstName }) => (
  <Html>
    <Head />
    <Preview>Welcome to Dekato Newsletter - Fashion Updates Await!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>📧 DEKATO</Text>
          <Text style={subtitle}>Newsletter Subscription</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {firstName}! 👋</Text>

          <Section style={celebrationBox}>
            <Text style={celebrationIcon}>🎉</Text>
            <Text style={celebrationText}>Welcome to Dekato Newsletter!</Text>
          </Section>

          <Text style={mainText}>
            You have successfully joined our exclusive fashion community! Get
            ready for:
          </Text>

          {/* Benefits List */}
          <Section style={benefitsSection}>
            <div style={benefitItem}>
              <Text style={benefitIcon}>🔥</Text>
              <Text style={benefitText}>
                Early access to flash sales & limited collections
              </Text>
            </div>
            <div style={benefitItem}>
              <Text style={benefitIcon}>👗</Text>
              <Text style={benefitText}>
                Personalized style recommendations
              </Text>
            </div>
            <div style={benefitItem}>
              <Text style={benefitIcon}>💰</Text>
              <Text style={benefitText}>
                Exclusive discount codes & special offers
              </Text>
            </div>
            <div style={benefitItem}>
              <Text style={benefitIcon}>📱</Text>
              <Text style={benefitText}>
                Fashion tips from our style experts
              </Text>
            </div>
          </Section>

          <Text style={thankYou}>
            Thank you for subscribing! We promise to keep you updated with only
            the most exciting fashion trends, exclusive deals, and insider news.
          </Text>

          <Section style={expectationBox}>
            <Text style={expectationTitle}>What to expect:</Text>
            <Text style={expectationText}>
              • Weekly fashion updates every Friday
              <br />
              • Monthly exclusive member sales
              <br />
              • Seasonal trend reports
              <br />• Birthday surprises & special treats
            </Text>
          </Section>

          <Text style={lookForward}>
            We look forward to keeping you stylish and in-the-know! 💫
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Happy Shopping! 🛍️
            <br />
            <em>- The Dekato Fashion Team</em>
          </Text>
          <Text style={address}>
            📍 30A Oseni Street, Anthony Village
            <br />
            Opposite GTB, Lagos, Nigeria
          </Text>
          <Text style={unsubscribe}>
            Want to update your preferences?{' '}
            <a href="#" style={link}>
              Manage subscription
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
  background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
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
  color: '#c6f6d5',
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

const benefitsSection = {
  margin: '30px 0',
};

const benefitItem = {
  display: 'flex',
  alignItems: 'center',
  margin: '15px 0',
  padding: '15px',
  backgroundColor: '#f7fafc',
  borderRadius: '8px',
  borderLeft: '4px solid #48bb78',
};

const benefitIcon = {
  fontSize: '20px',
  marginRight: '15px',
  minWidth: '30px',
};

const benefitText = {
  fontSize: '14px',
  color: '#2d3748',
  margin: '0',
  lineHeight: '1.5',
  flex: '1',
};

const thankYou = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '25px 0',
  textAlign: 'center',
};

const expectationBox = {
  backgroundColor: '#edf2f7',
  padding: '20px',
  borderRadius: '8px',
  margin: '25px 0',
};

const expectationTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 10px 0',
  textAlign: 'center',
};

const expectationText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0',
  lineHeight: '1.6',
  textAlign: 'center',
};

const lookForward = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#48bb78',
  margin: '25px 0',
  textAlign: 'center',
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
  color: '#48bb78',
  textDecoration: 'underline',
};
