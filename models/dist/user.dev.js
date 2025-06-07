"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _validator = _interopRequireDefault(require("validator"));

var _crypto = _interopRequireDefault(require("crypto"));

var _order = _interopRequireDefault(require("./order.js"));

var _product = _interopRequireDefault(require("@/models/product"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var mongooseLeanVirtuals = require('mongoose-lean-virtuals');

var userSchema = new _mongoose["default"].Schema({
  firstname: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your first name']
  },
  lastname: {
    type: String,
    trim: true,
    required: [true, 'Please tell us your last name']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [_validator["default"].isEmail, 'Please provide a valid email'],
    trim: true
  },
  emailVerified: {
    type: Boolean,
    "default": false
  },
  subscription: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'EmailSubscription'
  },
  role: {
    type: String,
    "enum": ['user', 'admin'],
    "default": 'user',
    required: true
  },
  wishlist: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: 'Product'
  }],
  password: {
    type: String,
    select: false
  },
  orderCount: {
    type: Number,
    "default": 0
  },
  amountSpent: {
    type: Number,
    "default": 0,
    set: function set(value) {
      // Ensure the value is a valid number
      return isNaN(value) ? 0 : Math.round(value);
    }
  },
  passwordConfirm: {
    type: String,
    validate: {
      validator: function validator(el) {
        return el === this.password;
      },
      message: 'Passwords do not match'
    }
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  verificationToken: String,
  verificationTokenExpires: Date,
  createdAt: {
    type: Date,
    "default": Date.now,
    immutable: true
  },
  active: {
    type: Boolean,
    "default": true,
    select: false
  } // address: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }],

}, {
  timestamps: true,
  toJSON: {
    virtuals: true
  },
  toObject: {
    virtuals: true
  }
}); // userSchema.index({ email: 1 });

userSchema.pre(/^find/, function (next) {
  this.find({
    active: {
      $ne: false
    }
  });
  next();
});
userSchema.pre('save', function _callee(next) {
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          if (this.isModified('password')) {
            _context.next = 2;
            break;
          }

          return _context.abrupt("return", next());

        case 2:
          if (!(this.password !== this.passwordConfirm)) {
            _context.next = 4;
            break;
          }

          throw new Error('Passwords do not match');

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(_bcryptjs["default"].hash(this.password, 12));

        case 6:
          this.password = _context.sent;
          // Remove passwordConfirm field since we don't need to store it
          this.passwordConfirm = undefined;
          next();

        case 9:
        case "end":
          return _context.stop();
      }
    }
  }, null, this);
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next(); // Ensure JWT issued after password change

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = function _callee2(candidatePassword, userPassword) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(_bcryptjs["default"].compare(candidatePassword, userPassword));

        case 2:
          return _context2.abrupt("return", _context2.sent);

        case 3:
        case "end":
          return _context2.stop();
      }
    }
  });
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    var changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); // Check if password was changed after token was issued

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  var resetToken = _crypto["default"].randomBytes(32).toString('hex');

  this.passwordResetToken = _crypto["default"].createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

userSchema.methods.addToWishlist = function (productId) {
  if (!this.wishlist.includes(productId) && _mongoose["default"].Types.ObjectId.isValid(productId)) {
    this.wishlist.addToSet(productId);
  }

  return this.save({
    validateBeforeSave: false
  });
};

userSchema.plugin(mongooseLeanVirtuals);

var User = _mongoose["default"].models.User || _mongoose["default"].model('User', userSchema);

var _default = User;
exports["default"] = _default;