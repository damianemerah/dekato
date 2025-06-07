"use strict";
'use server';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.subscribeUser = subscribeUser;
exports.updateSubscription = updateSubscription;
exports.unsubscribeUser = unsubscribeUser;
exports.getSubscriptionStatus = getSubscriptionStatus;

var _subscription = require("@/models/subscription");

var _mongoConnection = _interopRequireDefault(require("@/app/lib/mongoConnection"));

var _email = _interopRequireDefault(require("@/app/utils/email"));

var _cache = require("next/cache");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * Subscribe a user to the newsletter
 */
function subscribeUser(prevState, formData) {
  var email, gender, existingSubscription, subscription, url, emailObj;
  return regeneratorRuntime.async(function subscribeUser$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = formData.get('newsletter');
          gender = formData.get('gender') || 'both';
          console.log(email, gender, 'formData', formData);
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap((0, _mongoConnection["default"])());

        case 6:
          if (email) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", {
            success: false,
            message: 'Please provide a valid email address'
          });

        case 8:
          _context.next = 10;
          return regeneratorRuntime.awrap(_subscription.EmailSubscription.findOne({
            email: email
          }));

        case 10:
          existingSubscription = _context.sent;

          if (!existingSubscription) {
            _context.next = 19;
            break;
          }

          // Reactivate subscription
          existingSubscription.status = 'subscribed';
          existingSubscription.confirmedAt = new Date();
          existingSubscription.gender = gender;
          _context.next = 17;
          return regeneratorRuntime.awrap(existingSubscription.save());

        case 17:
          _context.next = 22;
          break;

        case 19:
          // Create new subscription
          subscription = new _subscription.EmailSubscription({
            email: email,
            gender: gender,
            status: 'subscribed'
          });
          _context.next = 22;
          return regeneratorRuntime.awrap(subscription.save());

        case 22:
          _context.prev = 22;
          url = "".concat(process.env.NEXTAUTH_URL);
          emailObj = new _email["default"]({
            email: email
          }, url);
          _context.next = 27;
          return regeneratorRuntime.awrap(emailObj.emailSubscription());

        case 27:
          _context.next = 32;
          break;

        case 29:
          _context.prev = 29;
          _context.t0 = _context["catch"](22);
          console.error('Error sending confirmation email:', _context.t0); // Don't fail the subscription if email fails

        case 32:
          (0, _cache.revalidateTag)('emailSubscription');
          return _context.abrupt("return", {
            success: true,
            message: 'Subscription successful'
          });

        case 36:
          _context.prev = 36;
          _context.t1 = _context["catch"](3);
          console.error('Subscription error:', _context.t1);
          return _context.abrupt("return", {
            success: false,
            message: 'Error processing subscription'
          });

        case 40:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 36], [22, 29]]);
}
/**
 * Update a user's subscription preferences
 */


function updateSubscription(email, status, gender) {
  var subscription, url, emailObj;
  return regeneratorRuntime.async(function updateSubscription$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _context2.next = 3;
          return regeneratorRuntime.awrap((0, _mongoConnection["default"])());

        case 3:
          if (email) {
            _context2.next = 5;
            break;
          }

          return _context2.abrupt("return", {
            success: false,
            message: 'Email is required'
          });

        case 5:
          _context2.next = 7;
          return regeneratorRuntime.awrap(_subscription.EmailSubscription.findOne({
            email: email
          }));

        case 7:
          subscription = _context2.sent;

          if (subscription) {
            _context2.next = 14;
            break;
          }

          _context2.next = 11;
          return regeneratorRuntime.awrap(_subscription.EmailSubscription.create({
            email: email,
            gender: gender,
            status: status
          }));

        case 11:
          subscription = _context2.sent;
          _context2.next = 18;
          break;

        case 14:
          subscription.status = status;
          subscription.gender = gender;
          _context2.next = 18;
          return regeneratorRuntime.awrap(subscription.save());

        case 18:
          _context2.prev = 18;
          url = "".concat(process.env.NEXTAUTH_URL);
          emailObj = new _email["default"]({
            email: email
          }, url);
          _context2.next = 23;
          return regeneratorRuntime.awrap(emailObj.emailSubscription());

        case 23:
          _context2.next = 28;
          break;

        case 25:
          _context2.prev = 25;
          _context2.t0 = _context2["catch"](18);
          console.error('Error sending confirmation email:', _context2.t0); // Don't fail the subscription if email fails

        case 28:
          (0, _cache.revalidateTag)('emailSubscription');
          return _context2.abrupt("return", {
            success: true,
            message: status === 'subscribed' ? 'Successfully updated newsletter preferences' : 'Successfully unsubscribed from newsletter',
            subscription: {
              email: subscription.email,
              status: subscription.status,
              gender: subscription.gender
            }
          });

        case 32:
          _context2.prev = 32;
          _context2.t1 = _context2["catch"](0);
          console.error('Subscription update error:', _context2.t1);
          return _context2.abrupt("return", {
            success: false,
            message: 'Error updating subscription'
          });

        case 36:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 32], [18, 25]]);
}
/**
 * Unsubscribe a user from the newsletter
 */


function unsubscribeUser(email) {
  var subscription, url, emailObj;
  return regeneratorRuntime.async(function unsubscribeUser$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _context3.next = 3;
          return regeneratorRuntime.awrap((0, _mongoConnection["default"])());

        case 3:
          if (email) {
            _context3.next = 5;
            break;
          }

          return _context3.abrupt("return", {
            success: false,
            message: 'Email is required'
          });

        case 5:
          _context3.next = 7;
          return regeneratorRuntime.awrap(_subscription.EmailSubscription.findOne({
            email: email
          }));

        case 7:
          subscription = _context3.sent;

          if (!subscription) {
            _context3.next = 13;
            break;
          }

          subscription.unsubscribedAt = new Date();
          subscription.status = 'unsubscribed';
          _context3.next = 13;
          return regeneratorRuntime.awrap(subscription.save());

        case 13:
          _context3.prev = 13;
          url = "".concat(process.env.NEXTAUTH_URL);
          emailObj = new _email["default"]({
            email: email
          }, url);
          _context3.next = 18;
          return regeneratorRuntime.awrap(emailObj.unsubscribeEmail());

        case 18:
          _context3.next = 23;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](13);
          console.error('Error sending confirmation email:', _context3.t0); // Don't fail the unsubscription if email fails

        case 23:
          (0, _cache.revalidateTag)('emailSubscription');
          return _context3.abrupt("return", {
            success: true,
            message: 'Successfully unsubscribed from newsletter'
          });

        case 27:
          _context3.prev = 27;
          _context3.t1 = _context3["catch"](0);
          console.error('Error unsubscribing:', _context3.t1);
          return _context3.abrupt("return", {
            success: false,
            message: 'Error processing unsubscription'
          });

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 27], [13, 20]]);
}
/**
 * Get a user's subscription status
 */


function getSubscriptionStatus(email) {
  var subscription;
  return regeneratorRuntime.async(function getSubscriptionStatus$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _mongoConnection["default"])());

        case 3:
          if (email) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", {
            success: false,
            message: 'Email is required'
          });

        case 5:
          _context4.next = 7;
          return regeneratorRuntime.awrap(_subscription.EmailSubscription.findOne({
            email: email
          }));

        case 7:
          subscription = _context4.sent;

          if (subscription) {
            _context4.next = 10;
            break;
          }

          return _context4.abrupt("return", {
            success: true,
            subscription: null
          });

        case 10:
          return _context4.abrupt("return", {
            success: true,
            subscription: {
              email: subscription.email,
              status: subscription.status,
              gender: subscription.gender
            }
          });

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          console.error('Error fetching subscription:', _context4.t0);
          return _context4.abrupt("return", {
            success: false,
            message: 'Error fetching subscription'
          });

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
}