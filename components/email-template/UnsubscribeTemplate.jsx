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
import { bizInfo } from '@/app/resources/contents';

export const UnsubscribeTemplate = ({ firstName, feedbackMessage }) => (
  <Html>
    <Head />
    <Preview>
      You&apos;ve been unsubscribed from Dekato - We&apos;ll miss you!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logo}>💔 DEKATO</Text>
          <Text style={subtitle}>Unsubscribed</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>Hi {firstName},</Text>

          <Section style={sadBox}>
            <Text style={sadIcon}>😢</Text>
            <Text style={sadText}>We&apos;re sorry to see you go!</Text>
          </Section>

          <Text style={mainText}>
            You have been successfully unsubscribed from Dekato&apos;s
            newsletter. Your inbox will no longer receive our fashion updates
            and promotional emails.
          </Text>

          {/* Important Notice */}
          <Section style={noticeBox}>
            <Text style={noticeIcon}>📧</Text>
            <Text style={noticeTitle}>Important Notice</Text>
            <Text style={noticeText}>
              You may still receive important account-related emails such as:
            </Text>
            <div style={noticeList}>
              <Text style={noticeItem}>
                • Order confirmations & shipping updates
              </Text>
              <Text style={noticeItem}>
                • Password reset & security notifications
              </Text>
              <Text style={noticeItem}>• Account activity alerts</Text>
              <Text style={noticeItem}>• Legal & policy updates</Text>
            </div>
          </Section>

          <Text style={changeText}>
            Changed your mind? You can always resubscribe through your account
            settings or by visiting our website anytime.
          </Text>

          {/* Resubscribe Button */}
          <Section style={buttonSection}>
            <Button
              href={`${process.env.NEXT_PUBLIC_URL}/account/newsletter`}
              style={resubscribeButton}
            >
              💌 Resubscribe to Newsletter
            </Button>
          </Section>

          {/* Feedback Section */}
          <Section style={feedbackBox}>
            <Text style={feedbackTitle}>Help Us Improve</Text>
            <Text style={feedbackText}>
              We&apos;d love to know how we can do better. Your feedback helps
              us create content that our customers truly value.
            </Text>
            <Button
              href={`https://wa.me/${bizInfo.whatsapp}?text=${feedbackMessage}`}
              style={feedbackButton}
            >
              Share Feedback
            </Button>
          </Section>

          <Text style={thankYou}>
            Thank you for being part of our fashion community. We hope to serve
            you again in the future! ✨
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Until we meet again! 👋
            <br />
            <em>- The Dekato Team</em>
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
  background: 'linear-gradient(135deg, #a0aec0 0%, #718096 100%)',
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
  color: '#e2e8f0',
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

const sadBox = {
  backgroundColor: '#fef5e7',
  border: '2px solid #f6ad55',
  borderRadius: '8px',
  padding: '25px',
  textAlign: 'center',
  margin: '25px 0',
};

const sadIcon = {
  fontSize: '32px',
  margin: '0 0 10px 0',
};

const sadText = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#c05621',
  margin: '0',
};

const mainText = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#2d3748',
  margin: '25px 0',
};

const noticeBox = {
  backgroundColor: '#ebf8ff',
  border: '1px solid #90cdf4',
  borderRadius: '8px',
  padding: '20px',
  margin: '25px 0',
};

const noticeIcon = {
  fontSize: '24px',
  textAlign: 'center',
  margin: '0 0 10px 0',
  display: 'block',
};

const noticeTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2c5282',
  margin: '0 0 10px 0',
  textAlign: 'center',
};

const noticeText = {
  fontSize: '14px',
  color: '#2d3748',
  margin: '0 0 15px 0',
  textAlign: 'center',
};

const noticeList = {
  margin: '0',
};

const noticeItem = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0 0 5px 0',
  lineHeight: '1.5',
};

const changeText = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '25px 0',
  textAlign: 'center',
};

const buttonSection = {
  textAlign: 'center',
  margin: '30px 0',
};

const resubscribeButton = {
  backgroundColor: '#48bb78',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  padding: '16px 32px',
  borderRadius: '8px',
  display: 'inline-block',
  boxShadow: '0 4px 6px rgba(72, 187, 120, 0.3)',
};

const feedbackBox = {
  backgroundColor: '#f7fafc',
  padding: '20px',
  borderRadius: '8px',
  margin: '25px 0',
  textAlign: 'center',
};

const feedbackTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#2d3748',
  margin: '0 0 10px 0',
};

const feedbackText = {
  fontSize: '14px',
  color: '#4a5568',
  margin: '0 0 15px 0',
  lineHeight: '1.5',
};

const feedbackButton = {
  backgroundColor: '#667eea',
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: '500',
  textDecoration: 'none',
  padding: '12px 24px',
  borderRadius: '6px',
  display: 'inline-block',
};

const thankYou = {
  fontSize: '15px',
  lineHeight: '1.6',
  color: '#4a5568',
  margin: '25px 0',
  textAlign: 'center',
  fontStyle: 'italic',
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
