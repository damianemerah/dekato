import React from 'react';
import { Resend } from 'resend';
import { WelcomeTemplate } from '@/components/email-template/WelcomeTemplate';
import { PasswordResetTemplate } from '@/components/email-template/PasswordResetTemplate';
import { EmailSubscriptionTemplate } from '@/components/email-template/EmailSubscriptionTemplate';
import { UnsubscribeTemplate } from '@/components/email-template/UnsubscribeTemplate';
import { OrderFulfillTemplate } from '@/components/email-template/OrderFulfillTemplate';
import { OrderReceivedTemplate } from '@/components/email-template/OrderReceivedTemplate';
import { formatToNaira } from '@/app/utils/getFunc';

const resend = new Resend(process.env.RESEND_API_KEY);

class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstname || 'Customer';
    this.url = url;
    this.from = `Dekato <${process.env.EMAIL_FROM}>`;
  }

  async sendEmail(ReactComponent, subject) {
    const { data, error } = await resend.emails.send({
      from: this.from,
      to: this.to,
      subject,
      react: ReactComponent,
    });

    if (error) {
      throw new Error(`Email sending failed: ${error.message}`);
    }

    return data;
  }

  async sendWelcome() {
    const subject = 'Welcome to Dekato';
    const template = React.createElement(WelcomeTemplate, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    return await this.sendEmail(template, subject);
  }

  async emailSubscription() {
    const subject = 'Confirm your subscription';
    const template = React.createElement(EmailSubscriptionTemplate, {
      firstName: this.firstName,
      subject,
    });

    return await this.sendEmail(template, subject);
  }

  async unsubscribeEmail() {
    const subject = 'Unsubscribe from notification';
    const template = React.createElement(UnsubscribeTemplate, {
      firstName: this.firstName,
      subject,
      feedbackMessage: encodeURIComponent(
        `Hello, I have a feedback for Dekato Outfit.`
      ),
    });

    return await this.sendEmail(template, subject);
  }

  async sendPasswordReset() {
    const subject = 'Your password reset token (valid for only 10 minutes)';
    const template = React.createElement(PasswordResetTemplate, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    return await this.sendEmail(template, subject);
  }

  async sendOrderFulfillment(order) {
    const subject = 'Your Order Has Been Fulfilled';
    const template = React.createElement(OrderFulfillTemplate, {
      firstName: this.firstName,
      subject,
      order,
      formatToNaira,
    });

    return await this.sendEmail(template, subject);
  }

  async sendOrderReceived(order) {
    const subject = 'Your Order Has Been Received';
    const template = React.createElement(OrderReceivedTemplate, {
      firstName: this.firstName,
      subject,
      order,
      formatToNaira,
    });

    return await this.sendEmail(template, subject);
  }
}

export default Email;
