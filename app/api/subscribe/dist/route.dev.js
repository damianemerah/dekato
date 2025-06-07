"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET = GET;

var _server = require("next/server");

var _subscription = require("@/models/subscription");

var _mongoConnection = _interopRequireDefault(require("@/app/lib/mongoConnection"));

var _email = _interopRequireDefault(require("@/app/utils/email"));

var _cache = require("next/cache");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// UNUSED
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
function GET(req) {
  var searchParams, email, subscription;
  return regeneratorRuntime.async(function GET$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          searchParams = req.nextUrl.searchParams;
          email = searchParams.get('email');
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap((0, _mongoConnection["default"])());

        case 5:
          if (!email) {
            _context.next = 10;
            break;
          }

          _context.next = 8;
          return regeneratorRuntime.awrap(_subscription.EmailSubscription.findOne({
            email: email
          }));

        case 8:
          subscription = _context.sent;
          return _context.abrupt("return", _server.NextResponse.json({
            success: true,
            subscription: {
              email: subscription.email,
              status: subscription.status,
              gender: subscription.gender
            }
          }, {
            status: 200
          }));

        case 10:
          return _context.abrupt("return", _server.NextResponse.json({
            success: false,
            message: 'Invalid request'
          }));

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](2);
          return _context.abrupt("return", _server.NextResponse.json({
            success: false,
            message: 'Error processing request'
          }, {
            status: 500
          }));

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 13]]);
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