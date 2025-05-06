import { NextResponse } from "next/server";
import { EmailSubscription } from "@/models/subscription";
import dbConnect from "@/app/lib/mongoConnection";
import Email from "@/app/lib/email";
import { revalidateTag, revalidatePath } from "next/cache";

// These handlers have been migrated to Server Actions in app/action/subscriptionAction.js
// They are preserved here for reference, but should be considered deprecated.

/*
export async function POST(req) {
  try {
    await dbConnect();
    const { email, gender = 'both' } = await req.json();

    // Input validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide a valid email address',
        },
        { status: 400 }
      );
    }

    // Check for existing subscription
    const existingSubscription = await EmailSubscription.findOne({ email });

    if (existingSubscription) {
      // Reactivate subscription
      existingSubscription.status = 'subscribed';
      existingSubscription.confirmedAt = new Date();
      existingSubscription.gender = gender;
      await existingSubscription.save();
    } else {
      // Create new subscription
      const subscription = new EmailSubscription({
        email,
        gender,
        status: 'subscribed',
      });

      await subscription.save();
    }
    try {
      const url = `${process.env.NEXTAUTH_URL}`;
      const emailObj = new Email({ email }, url);
      await emailObj.emailSubscription();
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't fail the subscription if email fails
    }
    revalidateTag('emailSubscription');
    return NextResponse.json(
      {
        success: true,
        message: 'Subscription successful',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error processing subscription',
      },
      { status: 500 }
    );
  }
}
*/

// The GET handler is kept active as it's used for data retrieval, not state changes
export async function GET(req) {
  const { searchParams } = req.nextUrl;
  const email = searchParams.get("email");

  try {
    await dbConnect();
    if (email) {
      const subscription = await EmailSubscription.findOne({ email });

      return NextResponse.json(
        {
          success: true,
          subscription: {
            email: subscription.email,
            status: subscription.status,
            gender: subscription.gender,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ success: false, message: "Invalid request" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error processing request" },
      { status: 500 }
    );
  }
}

/*
export async function PATCH(req) {
  try {
    await dbConnect();
    const { email, status, gender } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email is required',
        },
        { status: 400 }
      );
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
      console.error('Error sending confirmation email:', error);
      // Don't fail the subscription if email fails
    }

    revalidateTag('emailSubscription');

    return NextResponse.json({
      success: true,
      message:
        status === 'subscribed'
          ? 'Successfully updated newsletter preferences'
          : 'Successfully unsubscribed from newsletter',
      subscription: {
        email: subscription.email,
        status: subscription.status,
        gender: subscription.gender,
      },
    });
  } catch (error) {
    console.error('Subscription update error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating subscription',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { email } = await req.json();

    const subscription = await EmailSubscription.findOne({ email });

    if (subscription) {
      subscription.unsubscribedAt = new Date();
      subscription.status = 'unsubscribed';

      await subscription.save();
    }

    try {
      const url = `${process.env.NEXTAUTH_URL}`;
      const emailObj = new Email({ email }, url);
      await emailObj.unsubscribeEmail();
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't fail the subscription if email fails
    }

    revalidateTag('emailSubscription');

    return NextResponse.json({
      success: true,
      message: 'Subscription deleted',
    });
  } catch (error) {
    console.error('Error deleting subscription:', error);
  }
}
*/
