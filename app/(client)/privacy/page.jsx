"use client";

import React, { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href").slice(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      });
    });
  }, []);

  return (
    <div className="prose prose-slate mx-auto max-w-3xl px-4 py-6">
      <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
        PRIVACY POLICY
      </h1>
      <p className="mb-4 text-sm text-gray-600">
        Last updated December 02, 2024
      </p>
      <p className="mb-4 text-gray-700">
        This Privacy Notice for <strong>Dekato Outfit</strong> (
        <i>&apos;we&apos;, &apos;us&apos;, or &apos;our&apos;</i>), describes
        how and why we might access, collect, store, use, and/or share (
        <i>&apos;process&apos;</i>) your personal information when you use our
        services (<i>&apos;Services&apos;</i>), including when you:
      </p>
      <ul className="mb-4 list-disc pl-6 text-gray-700">
        <li>
          Visit our website at{" "}
          <a
            href="http://www.dekato.ng"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.dekato.ng
          </a>
          , or any website of ours that links to this Privacy Notice.
        </li>
        <li>
          Use Dekato Outfit, an e-commerce website where you can order products
          from the app.
        </li>
        <li>
          Engage with us in other related ways, including any sales, marketing,
          or events.
        </li>
      </ul>
      <p className="mb-6 text-gray-700">
        <strong>Questions or concerns?</strong> Reading this Privacy Notice will
        help you understand your privacy rights and choices. If you do not agree
        with our policies and practices, please do not use our Services. If you
        still have any questions or concerns, please contact us at{" "}
        <a
          href="mailto:dekatooutfits@gmail.com"
          className="text-blue-600 underline transition-colors hover:text-blue-800"
        >
          dekatooutfits@gmail.com
        </a>
        .
      </p>

      {/* Table of Contents */}
      <h2
        id="table-of-contents"
        className="mb-4 text-2xl font-semibold text-gray-900"
      >
        TABLE OF CONTENTS
      </h2>
      <ul className="mb-6 list-decimal pl-6 text-gray-700">
        <li>
          <a
            href="#information-we-collect"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            WHAT INFORMATION DO WE COLLECT?
          </a>
        </li>
        <li>
          <a
            href="#how-we-process"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            HOW DO WE PROCESS YOUR INFORMATION?
          </a>
        </li>
        <li>
          <a
            href="#sharing-information"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
          </a>
        </li>
        <li>
          <a
            href="#data-retention"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            HOW LONG DO WE KEEP YOUR INFORMATION?
          </a>
        </li>
        <li>
          <a
            href="#your-rights"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            WHAT ARE YOUR PRIVACY RIGHTS?
          </a>
        </li>
        <li>
          <a
            href="#policy-updates"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            DO WE MAKE UPDATES TO THIS NOTICE?
          </a>
        </li>
        <li>
          <a
            href="#contact-us"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
          </a>
        </li>
        <li>
          <a
            href="#data-review"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
          >
            HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
          </a>
        </li>
      </ul>
      {/* Information We Collect Section */}
      <section id="information-we-collect" className="mb-8">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">
          1. WHAT INFORMATION DO WE COLLECT?
        </h2>

        <h3 className="mb-2 text-xl font-medium text-gray-800">
          Personal information you disclose to us
        </h3>

        <p className="mb-4 italic text-gray-600">
          In Short: We collect personal information that you provide to us.
        </p>

        <p className="mb-4 text-gray-700">
          We collect personal information that you voluntarily provide to us
          when you register on the Services, express an interest in obtaining
          information about us or our products and Services, when you
          participate in activities on the Services, or otherwise when you
          contact us.
        </p>

        <p className="mb-2 text-gray-700">
          <strong>Personal Information Provided by You.</strong> The personal
          information that we collect depends on the context of your
          interactions with us and the Services, the choices you make, and the
          products and features you use. The personal information we collect may
          include the following:
        </p>

        <ul className="mb-4 list-disc pl-8 text-gray-700">
          <li>names</li>
          <li>phone numbers</li>
          <li>email addresses</li>
          <li>mailing addresses</li>
          <li>passwords</li>
          <li>contact preferences</li>
          <li>contact or authentication data</li>
          <li>billing addresses</li>
          <li>debit/credit card numbers</li>
        </ul>

        <h3 className="mb-2 text-xl font-medium text-gray-800">
          Sensitive Information
        </h3>
        <p className="mb-4 text-gray-700">
          When necessary, with your consent or as otherwise permitted by
          applicable law, we process the following categories of sensitive
          information:
        </p>
        <ul className="mb-4 list-disc pl-8 text-gray-700">
          <li>financial data</li>
        </ul>

        <h3 className="mb-2 text-xl font-medium text-gray-800">Payment Data</h3>
        <p className="mb-4 text-gray-700">
          We may collect data necessary to process your payment if you choose to
          make purchases, such as your payment instrument number, and the
          security code associated with your payment instrument. All payment
          data is handled and stored by Paystack. You may find their privacy
          notice link(s) here:
          <a
            href="https://paystack.com/privacy/merchant"
            className="ml-1 text-blue-600 underline transition-colors hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://paystack.com/privacy/merchant
          </a>
        </p>

        <h3 className="mb-2 text-xl font-medium text-gray-800">Google API</h3>
        <p className="mb-4 text-gray-700">
          Our use of Information received from Google APIs will adhere to{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy#limited-use"
            className="text-blue-600 underline transition-colors hover:text-blue-800"
            target="_blank"
            rel="noopener noreferrer"
          >
            Limited Use requirements
          </a>
          .
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="how-we-process"
        >
          2. HOW DO WE PROCESS YOUR INFORMATION?
        </h2>

        <p className="mb-4 italic text-gray-600">
          In Short: We process your information to provide, improve, and
          administer our Services, communicate with you, for security and fraud
          prevention, and to comply with law. We may also process your
          information for other purposes with your consent.
        </p>

        <p className="mb-4 text-gray-700">
          We process your personal information for a variety of reasons,
          depending on how you interact with our Services, including:
        </p>

        <ul className="mb-4 list-disc pl-8 text-gray-700">
          <li className="mb-2">
            <span className="font-medium">
              To facilitate account creation and authentication and otherwise
              manage user accounts.
            </span>{" "}
            We may process your information so you can create and log in to your
            account, as well as keep your account in working order.
          </li>

          <li className="mb-2">
            <span className="font-medium">
              To deliver and facilitate delivery of services to the user.
            </span>{" "}
            We may process your information to provide you with the requested
            service.
          </li>

          <li className="mb-2">
            <span className="font-medium">
              To respond to user inquiries/offer support to users.
            </span>{" "}
            We may process your information to respond to your inquiries and
            solve any potential issues you might have with the requested
            service.
          </li>

          <li className="mb-2">
            <span className="font-medium">
              To send administrative information to you.
            </span>{" "}
            We may process your information to send you details about our
            products and services, changes to our terms and policies, and other
            similar information.
          </li>

          <li className="mb-2">
            <span className="font-medium">
              To fulfil and manage your orders.
            </span>{" "}
            We may process your information to fulfil and manage your orders,
            payments, returns, and exchanges made through the Services.
          </li>

          <li className="mb-2">
            <span className="font-medium">To request feedback.</span> We may
            process your information when necessary to request feedback and to
            contact you about your use of our Services.
          </li>

          <li className="mb-2">
            <span className="font-medium">
              To send you marketing and promotional communications.
            </span>{" "}
            We may process the personal information you send to us for our
            marketing purposes, if this is in accordance with your marketing
            preferences. You can opt out of our marketing emails at any time.
            For more information, see &quot;WHAT ARE YOUR PRIVACY RIGHTS?&quot;
            below.
          </li>
        </ul>
      </section>
      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="sharing-information"
        >
          3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?
        </h2>

        <p className="mb-4 italic text-gray-600">
          In Short: We do not share your personal information with any third
          parties.
        </p>

        <p className="mb-4 text-gray-700">
          We take your privacy seriously and do not share your personal
          information with any third parties or external organizations. All
          information collected is used solely by us to provide and improve our
          Services.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="data-retention"
        >
          4. HOW LONG DO WE KEEP YOUR INFORMATION?
        </h2>

        <p className="mb-4 italic text-gray-600">
          In Short: We keep your information for as long as necessary to fulfill
          the purposes outlined in this Privacy Notice unless otherwise required
          by law.
        </p>

        <p className="mb-4 text-gray-700">
          We will only keep your personal information for as long as it is
          necessary for the purposes set out in this Privacy Notice, unless a
          longer retention period is required or permitted by law (such as tax,
          accounting, or other legal requirements). No purpose in this notice
          will require us keeping your personal information for longer than the
          period of time in which users have an account with us.
        </p>

        <p className="mb-4 text-gray-700">
          When we have no ongoing legitimate business need to process your
          personal information, we will either delete or anonymize such
          information, or, if this is not possible (for example, because your
          personal information has been stored in backup archives), then we will
          securely store your personal information and isolate it from any
          further processing until deletion is possible.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="your-rights"
        >
          5. WHAT ARE YOUR PRIVACY RIGHTS?
        </h2>

        <p className="mb-4 italic text-gray-600">
          In Short: You may review, change, or terminate your account at any
          time, depending on your country, province, or state residence.
        </p>

        <p className="mb-4 text-gray-700">
          Withdrawing your consent: If we are relying on your consent to process
          your personal information, which may be express and/or implied consent
          depending on the applicable law, you have the right to withdraw your
          consent at any time. You can withdraw your consent at any time by
          contacting us by using the contact details provided in the section
          &quot;HOW CAN YOU CONTACT US ABOUT THIS NOTICE?&quot;
        </p>

        <p className="mb-4 text-gray-700">
          However, please note that this will not affect the lawfulness of the
          processing before its withdrawal nor, when applicable law allows, will
          it affect the processing of your personal information conducted in
          reliance on lawful processing grounds other than consent.
        </p>

        <p className="mb-4 text-gray-700">
          Opting out of marketing and promotional communications: You can
          unsubscribe from our marketing and promotional communications at any
          time by clicking on the unsubscribe link in the emails that we send,
          unsubscribing from our website, or by contacting us using the details
          provided in the section &quot;HOW CAN YOU CONTACT US ABOUT THIS
          NOTICE?&quot; below. You will then be removed from the marketing
          lists. However, we may still communicate with you — for example, to
          send you service-related messages that are necessary for the
          administration and use of your account, to respond to service
          requests, or for other non-marketing purposes.
        </p>

        <h3 className="mb-4 text-xl font-semibold text-gray-800">
          Account Information
        </h3>

        <p className="mb-4 text-gray-700">
          If you would at any time like to review or change the information in
          your account or terminate your account, you can:
        </p>

        <ul className="mb-4 list-disc pl-6 text-gray-700">
          <li>Log in to your account settings and update your user account.</li>
          <li>Contact us using the contact information provided.</li>
        </ul>

        <p className="mb-4 text-gray-700">
          Upon your request to terminate your account, we will deactivate or
          delete your account and information from our active databases.
          However, we may retain some information in our files to prevent fraud,
          troubleshoot problems, assist with any investigations, enforce our
          legal terms and/or comply with applicable legal requirements.
        </p>

        <p className="mb-4 text-gray-700">
          If you have questions or comments about your privacy rights, you may
          email us at dekatooutfits@gmail.com.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="policy-updates"
        >
          6. DO WE MAKE UPDATES TO THIS NOTICE?
        </h2>

        <p className="mb-4 text-gray-700">
          <i>In Short:</i> Yes, we will update this notice as necessary to stay
          compliant with relevant laws.
        </p>

        <p className="mb-4 text-gray-700">
          We may update this Privacy Notice from time to time. The updated
          version will be indicated by an updated &apos;Revised&apos; date at
          the top of this Privacy Notice. If we make material changes to this
          Privacy Notice, we may notify you either by prominently posting a
          notice of such changes or by directly sending you a notification. We
          encourage you to review this Privacy Notice frequently to be informed
          of how we are protecting your information.
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="contact-us"
        >
          7. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?
        </h2>

        <p className="mb-4 text-gray-700">
          If you have questions or comments about this notice, you may email us
          at dekatooutfits@gmail.com or contact us by post at:
        </p>

        <p className="mb-4 text-gray-700">
          Dekato Outfit
          <br />
          30A Oseni Street, Anthony Opposite GTBank, Lagos,
          <br />
          Lagos
          <br />
          Nigeria
        </p>
      </section>

      <section className="mb-8">
        <h2
          className="mb-4 text-2xl font-semibold text-gray-900"
          id="data-review"
        >
          8. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?
        </h2>

        <p className="mb-4 text-gray-700">
          Based on the applicable laws of your country, you may have the right
          to request access to the personal information we collect from you,
          details about how we have processed it, correct inaccuracies, or
          delete your personal information. You may also have the right to
          withdraw your consent to our processing of your personal information.
          These rights may be limited in some circumstances by applicable law.
          To request to review, update, or delete your personal information,
          please fill out and submit a data subject access request.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
