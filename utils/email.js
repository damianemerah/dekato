import nodemail from "nodemailer";
import { htmlToText } from "html-to-text";

module.exports = class Email {
  constructor(user) {
    this.to = user.email;
    this.from = `Dekato Store <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // Sendgrid
      return nodemail.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        auth: {
          user: process.env.EMAIL_FROM,
          pass: process.env.APP_PASSWORD,
        },
      });
    }

    return nodemail.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  async send(subject) {
    // 1) Render HTML based on a pug template
    const html =
      "<p>Hello world!</p><img src='https://th.bing.com/th/id/R.7f015e168dbd0dc35e9ba74e8afc2415?rik=0zAoMKHho1cqQQ&pid=ImgRaw&r=0' alt='nft frog'>";

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: "Hello world!",
      text: htmlToText(html),
      subject,
      html,
      attachments: [
        {
          filename: "AI-OIG.jpeg",
          path: "./public/AI-OIG.jpeg",
          contentTypr: "image/jpeg",
        },
      ],
    };

    // 3) Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
    console.log("Email sent🔥🔥🔥");
  }

  async sendWelcome() {
    await this.send("Hello world, welcome!");
  }
};
