import nodemail from "nodemailer";
import { htmlToText } from "html-to-text";
import pug from "pug";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
const path = require("path");

//AWS-SES

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstname || "Customer";
    this.url = url;
    this.from = `Dekato <${process.env.EMAIL_FROM}>`;
  }

  async sendEmail(template, subject) {
    const html = pug.renderFile(
      path.join(process.cwd(), "utils", "emailTemplate", `${template}.pug`),
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );

    const params = {
      Destination: {
        ToAddresses: [this.to],
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: html,
          },
          Text: {
            Charset: "UTF-8",
            Data: htmlToText(html),
          },
        },
        Subject: {
          Charset: "UTF-8",
          Data: subject,
        },
      },
      Source: process.env.EMAIL_FROM,
      ReplyToAddresses: [],
    };

    try {
      const client = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY,
          secretAccessKey: process.env.S3_SECRET_KEY,
        },
      });
      const command = new SendEmailCommand(params);
      const response = await client.send(command);
    } catch (err) {
      console.error(err);
    }
  }

  async sendWelcome() {
    await this.sendEmail("welcome", "Welcome to Dekato");
  }

  async sendPasswordReset() {
    await this.sendEmail(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
