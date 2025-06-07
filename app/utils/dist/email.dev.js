"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

var _resend = require("resend");

var _WelcomeTemplate = require("@/components/email-template/WelcomeTemplate");

var _PasswordResetTemplate = require("@/components/email-template/PasswordResetTemplate");

var _EmailSubscriptionTemplate = require("@/components/email-template/EmailSubscriptionTemplate");

var _UnsubscribeTemplate = require("@/components/email-template/UnsubscribeTemplate");

var _OrderFulfillTemplate = require("@/components/email-template/OrderFulfillTemplate");

var _OrderReceivedTemplate = require("@/components/email-template/OrderReceivedTemplate");

var _getFunc = require("@/app/utils/getFunc");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var resend = new _resend.Resend(process.env.RESEND_API_KEY);

var Email =
/*#__PURE__*/
function () {
  function Email(user, url) {
    _classCallCheck(this, Email);

    this.to = user.email;
    this.firstName = user.firstname || 'Customer';
    this.url = url;
    this.from = "Dekato <".concat(process.env.EMAIL_FROM, ">");
  }

  _createClass(Email, [{
    key: "sendEmail",
    value: function sendEmail(ReactComponent, subject) {
      var _ref, data, error;

      return regeneratorRuntime.async(function sendEmail$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(resend.emails.send({
                from: this.from,
                to: this.to,
                subject: subject,
                react: ReactComponent
              }));

            case 2:
              _ref = _context.sent;
              data = _ref.data;
              error = _ref.error;

              if (!error) {
                _context.next = 7;
                break;
              }

              throw new Error("Email sending failed: ".concat(error.message));

            case 7:
              return _context.abrupt("return", data);

            case 8:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendWelcome",
    value: function sendWelcome() {
      var subject, template;
      return regeneratorRuntime.async(function sendWelcome$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              subject = 'Welcome to Dekato';
              template = _react["default"].createElement(_WelcomeTemplate.WelcomeTemplate, {
                firstName: this.firstName,
                url: this.url,
                subject: subject
              });
              _context2.next = 4;
              return regeneratorRuntime.awrap(this.sendEmail(template, subject));

            case 4:
              return _context2.abrupt("return", _context2.sent);

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "emailSubscription",
    value: function emailSubscription() {
      var subject, template;
      return regeneratorRuntime.async(function emailSubscription$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              subject = 'Confirm your subscription';
              template = _react["default"].createElement(_EmailSubscriptionTemplate.EmailSubscriptionTemplate, {
                firstName: this.firstName,
                subject: subject
              });
              _context3.next = 4;
              return regeneratorRuntime.awrap(this.sendEmail(template, subject));

            case 4:
              return _context3.abrupt("return", _context3.sent);

            case 5:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "unsubscribeEmail",
    value: function unsubscribeEmail() {
      var subject, template;
      return regeneratorRuntime.async(function unsubscribeEmail$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              subject = 'Unsubscribe from notification';
              template = _react["default"].createElement(_UnsubscribeTemplate.UnsubscribeTemplate, {
                firstName: this.firstName,
                subject: subject,
                feedbackMessage: encodeURIComponent("Hello, I have a feedback for Dekato Outfit.")
              });
              _context4.next = 4;
              return regeneratorRuntime.awrap(this.sendEmail(template, subject));

            case 4:
              return _context4.abrupt("return", _context4.sent);

            case 5:
            case "end":
              return _context4.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendPasswordReset",
    value: function sendPasswordReset() {
      var subject, template;
      return regeneratorRuntime.async(function sendPasswordReset$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              subject = 'Your password reset token (valid for only 10 minutes)';
              template = _react["default"].createElement(_PasswordResetTemplate.PasswordResetTemplate, {
                firstName: this.firstName,
                url: this.url,
                subject: subject
              });
              _context5.next = 4;
              return regeneratorRuntime.awrap(this.sendEmail(template, subject));

            case 4:
              return _context5.abrupt("return", _context5.sent);

            case 5:
            case "end":
              return _context5.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendOrderFulfillment",
    value: function sendOrderFulfillment(order) {
      var subject, template;
      return regeneratorRuntime.async(function sendOrderFulfillment$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              subject = 'Your Order Has Been Fulfilled';
              template = _react["default"].createElement(_OrderFulfillTemplate.OrderFulfillTemplate, {
                firstName: this.firstName,
                subject: subject,
                order: order,
                formatToNaira: _getFunc.formatToNaira
              });
              _context6.next = 4;
              return regeneratorRuntime.awrap(this.sendEmail(template, subject));

            case 4:
              return _context6.abrupt("return", _context6.sent);

            case 5:
            case "end":
              return _context6.stop();
          }
        }
      }, null, this);
    }
  }, {
    key: "sendOrderReceived",
    value: function sendOrderReceived(order) {
      var subject, template;
      return regeneratorRuntime.async(function sendOrderReceived$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              subject = 'Your Order Has Been Received';
              template = _react["default"].createElement(_OrderReceivedTemplate.OrderReceivedTemplate, {
                firstName: this.firstName,
                subject: subject,
                order: order,
                formatToNaira: _getFunc.formatToNaira
              });
              _context7.next = 4;
              return regeneratorRuntime.awrap(this.sendEmail(template, subject));

            case 4:
              return _context7.abrupt("return", _context7.sent);

            case 5:
            case "end":
              return _context7.stop();
          }
        }
      }, null, this);
    }
  }]);

  return Email;
}();

var _default = Email;
exports["default"] = _default;