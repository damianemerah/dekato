"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAdminStore = void 0;

var _zustand = require("zustand");

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var useAdminStore = (0, _zustand.create)(function (set, get) {
  return {
    variants: [],
    variantOptions: [],
    defaultVariantOptions: [],
    variantIsSaved: true,
    actionType: '',
    editVariantWithId: null,
    optionIsSaved: true,
    productImages: [],
    setOptionIsSaved: function setOptionIsSaved(optionIsSaved) {
      return set({
        optionIsSaved: optionIsSaved
      });
    },
    setVariants: function setVariants(variants) {
      return set({
        variants: variants
      });
    },
    updateVariant: function updateVariant(variantId, newVariant) {
      return set(function (state) {
        var updatedVariants = state.variants.map(function (variant) {
          if (variant.id === variantId) {
            return _objectSpread({}, variant, {}, newVariant);
          }

          return variant;
        });
        return {
          variants: updatedVariants
        };
      });
    },
    addVariant: function addVariant(variant) {
      return set(function (state) {
        return {
          variants: [].concat(_toConsumableArray(state.variants), [variant])
        };
      });
    },
    removeVariant: function removeVariant(id) {
      set(function (state) {
        return {
          variants: state.variants.filter(function (variant) {
            return variant.id !== id;
          })
        };
      });
    },
    setVariantOptions: function setVariantOptions(variantOptions) {
      return set({
        variantOptions: variantOptions
      });
    },
    setDefaultVariantOptions: function setDefaultVariantOptions(defaultVariantOptions) {
      return set({
        defaultVariantOptions: defaultVariantOptions
      });
    },
    addVariantOptions: function addVariantOptions(option) {
      return set(function (state) {
        return {
          variantOptions: [].concat(_toConsumableArray(state.variantOptions), [option])
        };
      });
    },
    updateVariantOptionName: function updateVariantOptionName(id, name) {
      return set(function (state) {
        return {
          variantOptions: state.variantOptions.map(function (option) {
            return option.id === id ? _objectSpread({}, option, {
              name: name
            }) : option;
          })
        };
      });
    },
    updateVariantOptionValues: function updateVariantOptionValues(id, values) {
      return set(function (state) {
        return {
          variantOptions: state.variantOptions.map(function (option) {
            return option.id === id ? _objectSpread({}, option, {
              values: values
            }) : option;
          })
        };
      });
    },
    removeVariantOption: function removeVariantOption(id) {
      return set(function (state) {
        return {
          variantOptions: state.variantOptions.filter(function (opt) {
            return opt.id !== id;
          })
        };
      });
    },
    setActionType: function setActionType(actionType) {
      return set({
        actionType: actionType
      });
    },
    setVariantIsSaved: function setVariantIsSaved(variantIsSaved) {
      return set({
        variantIsSaved: variantIsSaved
      });
    },
    setEditVariantWithId: function setEditVariantWithId(editVariantWithId) {
      return set({
        editVariantWithId: editVariantWithId
      });
    },
    setProductImages: function setProductImages(images) {
      return set({
        productImages: images
      });
    }
  };
});
exports.useAdminStore = useAdminStore;