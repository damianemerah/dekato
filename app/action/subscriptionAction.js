"use server";

import { EmailSubscription } from "@/models/subscription";
import dbConnect from "@/app/lib/mongoConnection";
import Email from "@/app/lib/email";
import { revalidateTag } from "next/cache";
import { auth } from "@/app/lib/auth";

/**
 * Subscribe a user to the newsletter
 */
export async function subscribeUser(email, gender = "both") {
  try {
    await dbConnect();

    // Input validation
    if (!email) {
      return {
        success: false,
        message: "Please provide a valid email address",
      };
    }

    // Check for existing subscription
    const existingSubscription = await EmailSubscription.findOne({ email });

    if (existingSubscription) {
      // Reactivate subscription
      existingSubscription.status = "subscribed";
      existingSubscription.confirmedAt = new Date();
      existingSubscription.gender = gender;
      await existingSubscription.save();
    } else {
      // Create new subscription
      const subscription = new EmailSubscription({
        email,
        gender,
        status: "subscribed",
      });

      await subscription.save();
    }

    try {
      const url = `${process.env.NEXTAUTH_URL}`;
      const emailObj = new Email({ email }, url);
      await emailObj.emailSubscription();
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      // Don't fail the subscription if email fails
    }

    revalidateTag("emailSubscription");

    return {
      success: true,
      message: "Subscription successful",
    };
  } catch (error) {
    console.error("Subscription error:", error);
    return {
      success: false,
      message: "Error processing subscription",
    };
  }
}

/**
 * Update a user's subscription preferences
 */
export async function updateSubscription(email, status, gender) {
  try {
    await dbConnect();

    // Validate email
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    let subscription = await EmailSubscription.findOne({ email });

    if (!subscription) {
      subscription = await EmailSubscription.create({
        email,
        gender,
        status,
      });
    } else {
      subscription.status = status;
      subscription.gender = gender;
      await subscription.save();
    }

    try {
      const url = `${process.env.NEXTAUTH_URL}`;
      const emailObj = new Email({ email }, url);
      await emailObj.emailSubscription();
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      // Don't fail the subscription if email fails
    }

    revalidateTag("emailSubscription");

    return {
      success: true,
      message:
        status === "subscribed"
          ? "Successfully updated newsletter preferences"
          : "Successfully unsubscribed from newsletter",
      subscription: {
        email: subscription.email,
        status: subscription.status,
        gender: subscription.gender,
      },
    };
  } catch (error) {
    console.error("Subscription update error:", error);
    return {
      success: false,
      message: "Error updating subscription",
    };
  }
}

/**
 * Unsubscribe a user from the newsletter
 */
export async function unsubscribeUser(email) {
  try {
    await dbConnect();

    // Validate email
    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    const subscription = await EmailSubscription.findOne({ email });

    if (subscription) {
      subscription.unsubscribedAt = new Date();
      subscription.status = "unsubscribed";

      await subscription.save();
    }

    try {
      const url = `${process.env.NEXTAUTH_URL}`;
      const emailObj = new Email({ email }, url);
      await emailObj.unsubscribeEmail();
    } catch (error) {
      console.error("Error sending confirmation email:", error);
      // Don't fail the unsubscription if email fails
    }

    revalidateTag("emailSubscription");

    return {
      success: true,
      message: "Successfully unsubscribed from newsletter",
    };
  } catch (error) {
    console.error("Error unsubscribing:", error);
    return {
      success: false,
      message: "Error processing unsubscription",
    };
  }
}

/**
 * Get a user's subscription status
 */
export async function getSubscriptionStatus(email) {
  try {
    await dbConnect();

    if (!email) {
      return {
        success: false,
        message: "Email is required",
      };
    }

    const subscription = await EmailSubscription.findOne({ email });

    if (!subscription) {
      return {
        success: true,
        subscription: null,
      };
    }

    return {
      success: true,
      subscription: {
        email: subscription.email,
        status: subscription.status,
        gender: subscription.gender,
      },
    };
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return {
      success: false,
      message: "Error fetching subscription",
    };
  }
}
