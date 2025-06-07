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

export const PasswordResetTemplate = ({ firstName, url }) => (
  <Html>
    <Head />
    <Preview>Reset Your Dekato Password - Quick & Secure</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>🔐 DEKATO</Text>
          <Text style={subtitle}>Account Security</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {firstName},</Text>

          <Text style={mainText}>
            We received a request to reset your password. No worries - it
            happens to the best of us! 😊
          </Text>

          <Section style={alertBox}>
            <Text style={alertIcon}>⚠️</Text>
            <Text style={alertText}>
              For your security, this link will expire in{' '}
              <strong>10 minutes</strong>
            </Text>
          </Section>

          <Text style={instructions}>
            Click the button below to create a new password. If you did not
            request this reset, you can safely ignore this email - your account
            remains secure.
          </Text>

          {/* Reset Button */}
          <Section style={buttonSection}>
            <Button href={url} style={resetButton}>
              🔑 Reset My Password
            </Button>
          </Section>

          {/* Alternative Link */}
          <Section style={linkSection}>
            <Text style={linkText}>
              Button not working? Copy and paste this link:
            </Text>
            <Text style={linkUrl}>{url}</Text>
          </Section>

          {/* Security Tips */}
          <Section style={tipsSection}>
            <Text style={tipsTitle}>🛡️ Security Tips</Text>
            <div style={tipsList}>
              <Text style={tipItem}>• Use a strong, unique password</Text>
              <Text style={tipItem}>
                • Never share your password with anyone
              </Text>
              <Text style={tipItem}>• Consider using a password manager</Text>
            </div>
          </Section>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Stay secure with Dekato 🔒
            <br />
            Questions? Contact our support team anytime.
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
  background: 'linear-gradient(135deg, #e53e3e 0%, #ff6b6b 100%)',
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
  color: '#fed7d7',
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
};

const mainText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2d3748',
  margin: '0 0 25px 0',
};

const alertBox = {
  backgroundColor: '#fef5e7',
  border: '2px solid #f6ad55',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center',
  margin: '25px 0',
};

const alertIcon = {
  fontSize: '24px',
  margin: '0 0 10px 0',
};

const alertText = {
  fontSize: '14px',
  color: '#c05621',
  margin: '0',
  fontWeight: '500',
};

const instructions = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '25px 0 30px 0',
};

const buttonSection = {
  textAlign: 'center',
  margin: '30px 0',
};

const resetButton = {
  backgroundColor: '#e53e3e',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 4px 6px rgba(229, 62, 62, 0.3)',
};

const linkSection = {
  backgroundColor: '#f7fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '30px 0',
};

const linkText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0 0 10px 0',
  textAlign: 'center',
};

const linkUrl = {
  fontSize: '12px',
  color: '#667eea',
  wordBreak: 'break-all',
  textAlign: 'center',
  margin: '0',
  fontFamily: 'monospace',
  backgroundColor: '#edf2f7',
  padding: '8px',
  borderRadius: '4px',
};

const tipsSection = {
  backgroundColor: '#f0fff4',
  border: '1px solid #9ae6b4',
  borderRadius: '8px',
  padding: '20px',
  margin: '30px 0',
};

const tipsTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#22543d',
  margin: '0 0 15px 0',
  textAlign: 'center',
};

const tipsList = {
  margin: '0',
};

const tipItem = {
  fontSize: '14px',
  color: '#2f855a',
  margin: '0 0 8px 0',
  lineHeight: '1.5',
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
