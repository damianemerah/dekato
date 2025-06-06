"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _synonyms = require("@/app/utils/synonyms");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var APIFeatures =
/*#__PURE__*/
function () {
  function APIFeatures(query, queryString) {
    _classCallCheck(this, APIFeatures);

    this.query = query;
    this.queryString = queryString;
  }

  _createClass(APIFeatures, [{
    key: "filter",
    value: function filter() {
      // Filtering
      var queryObj = _objectSpread({}, this.queryString);

      var excludedFields = ['page', 'sort', 'limit', 'fields', 'q'];
      excludedFields.forEach(function (el) {
        return delete queryObj[el];
      });
      this.query = this.query.find(queryObj);
      return this;
    }
  }, {
    key: "search",
    value: function search() {
      if (this.queryString.q == null) {
        return this;
      }

      var rawQuery = this.queryString.q.trim();

      if (rawQuery === '') {
        this.query = this.query.find({
          _id: null
        });
        return this;
      } // Optionally expand synonyms here if you want
      // Use MongoDB text search


      this.query = this.query.find({
        $text: {
          $search: rawQuery
        }
      }).sort({
        score: {
          $meta: 'textScore'
        }
      }).select({
        score: {
          $meta: 'textScore'
        }
      });
      return this;
    }
  }, {
    key: "sort",
    value: function sort() {
      if (this.queryString.sort) {
        var sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      } else {
        this.query = this.query.sort('-createdAt');
      }

      return this;
    }
  }, {
    key: "limitFields",
    value: function limitFields() {
      if (this.queryString.fields) {
        var fields = this.queryString.fields.split(',').join(' ');
        this.query = this.query.select(fields);
      } else {
        this.query = this.query.select('-__v');
      }

      return this;
    }
  }, {
    key: "paginate",
    value: function paginate() {
      var page = this.queryString.page * 1 || 1;
      var limit = this.queryString.limit * 1 || 100;
      var skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
  }]);

  return APIFeatures;
}();

var _default = APIFeatures;
exports["default"] = _default;