"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleFormData = void 0;

var _errorClass = _interopRequireDefault(require("@/app/utils/errorClass"));

var _s3Func = require("@/app/lib/s3Func");

var _category = _interopRequireDefault(require("@/models/category"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var handleFormData = function handleFormData(formData, Model, id) {
  var productName, obj, imagesToUpload, videosToUpload, bannerToUpload, variantsFilesToUpload, filesToDelete, existingProd, uploadedImageNames, uploadedVideoNames, uploadedBannerNames;
  return regeneratorRuntime.async(function handleFormData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          productName = formData.get('name') || 'untitled';
          obj = {
            image: [],
            video: [],
            banner: [],
            category: [],
            campaign: [],
            variant: [],
            tag: []
          };
          imagesToUpload = [];
          videosToUpload = [];
          bannerToUpload = [];
          variantsFilesToUpload = [];
          filesToDelete = [];
          validateFormData(formData);
          processFormEntries(formData, obj, imagesToUpload, videosToUpload, bannerToUpload, variantsFilesToUpload);

          if (!(Model && id)) {
            _context.next = 13;
            break;
          }

          _context.next = 12;
          return regeneratorRuntime.awrap(findExistingProduct(Model, id));

        case 12:
          existingProd = _context.sent;

        case 13:
          if (!existingProd) {
            _context.next = 16;
            break;
          }

          _context.next = 16;
          return regeneratorRuntime.awrap(handleExistingFiles(existingProd, obj, filesToDelete));

        case 16:
          _context.next = 18;
          return regeneratorRuntime.awrap(uploadNewFiles(imagesToUpload, 'image', productName));

        case 18:
          uploadedImageNames = _context.sent;
          _context.next = 21;
          return regeneratorRuntime.awrap(uploadNewFiles(videosToUpload, 'video', productName));

        case 21:
          uploadedVideoNames = _context.sent;
          _context.next = 24;
          return regeneratorRuntime.awrap(uploadNewFiles(bannerToUpload, 'banner', productName));

        case 24:
          uploadedBannerNames = _context.sent;
          updateObjWithUploadedFiles(obj, uploadedImageNames, 'image');
          updateObjWithUploadedFiles(obj, uploadedVideoNames, 'video');
          updateObjWithUploadedFiles(obj, uploadedBannerNames, 'banner');
          _context.next = 30;
          return regeneratorRuntime.awrap(handleVariantImages(obj, variantsFilesToUpload));

        case 30:
          if (Model === _category["default"]) {
            obj.parent = obj.parent || null;
          }

          delete obj.file;
          return _context.abrupt("return", obj);

        case 33:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.handleFormData = handleFormData;

function validateFormData(formData) {
  var status = formData.get('status');
  var images = formData.getAll('image');
  var videos = formData.getAll('video');
  var banners = formData.getAll('banner');

  if (status === 'active') {
    if (!formData.get('category')) {
      throw new _errorClass["default"]('Category is required', 400);
    }

    if (images.length === 0 && videos.length === 0 && banners.length === 0) {
      throw new _errorClass["default"]('Please upload image, video, or banner', 400);
    }
  }
}

function processFormEntries(formData, obj, imagesToUpload, videosToUpload, bannerToUpload, variantsFilesToUpload) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = formData.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _step$value = _slicedToArray(_step.value, 2),
          key = _step$value[0],
          value = _step$value[1];

      if (key.startsWith('variantData')) {
        processVariantData(obj, key, value);
      } else if (key.startsWith('variantImage')) {
        processVariantImage(obj, variantsFilesToUpload, key, value);
      } else if (key === 'category') {
        obj.category.push(value);
      } else if (key === 'campaign') {
        obj.campaign.push(value);
      } else if (key === 'image') {
        processMediaFile(obj, imagesToUpload, key, value);
      } else if (key === 'tag') {
        obj.tag.push(value);
      } else if (key === 'video') {
        processMediaFile(obj, videosToUpload, key, value);
      } else if (key === 'banner') {
        processMediaFile(obj, bannerToUpload, key, value);
      } else {
        obj[key] = value;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function processVariantData(obj, key, value) {
  var index = key.match(/\d+/)[0];
  var data = JSON.parse(value);
  var options = data.options;
  var labelEntries = Object.entries(data).filter(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        key = _ref2[0];

    return key.endsWith('_label');
  });
  var optionType = labelEntries.map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        value = _ref4[1];

    return {
      labelId: value,
      label: key.replace('_label', '')
    };
  });
  obj.variant[index] = _objectSpread({}, obj.variant[index], {
    options: options,
    optionType: optionType
  }, data);
}

function processVariantImage(obj, variantsFilesToUpload, key, value) {
  var index = key.match(/\d+/)[0];

  if (typeof value === 'string') {
    obj.variant[index] = _objectSpread({}, obj.variant[index], {
      image: value
    });
  }

  variantsFilesToUpload[index] = value;
}

function processMediaFile(obj, filesToUpload, key, file) {
  if (typeof file === 'string') {
    obj[key].push(file);
  } else if (file.size > 0) {
    filesToUpload.push(file);
  }
}

function findExistingProduct(Model, id) {
  var existingProds, existingProd;
  return regeneratorRuntime.async(function findExistingProduct$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          if (!Array.isArray(id)) {
            _context2.next = 9;
            break;
          }

          _context2.next = 3;
          return regeneratorRuntime.awrap(Model.find({
            _id: {
              $in: id
            }
          }));

        case 3:
          existingProds = _context2.sent;

          if (!(existingProds.length !== id.length)) {
            _context2.next = 6;
            break;
          }

          throw new _errorClass["default"]("One or more ".concat(Model.modelName, "s not found"), 404);

        case 6:
          return _context2.abrupt("return", existingProds);

        case 9:
          _context2.next = 11;
          return regeneratorRuntime.awrap(Model.findById(id));

        case 11:
          existingProd = _context2.sent;

          if (existingProd) {
            _context2.next = 14;
            break;
          }

          throw new _errorClass["default"]("".concat(Model.modelName, " not found"), 404);

        case 14:
          return _context2.abrupt("return", existingProd);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function handleExistingFiles(existingProd, obj, filesToDelete) {
  var imagesToDelete, videosToDelete, bannersToDelete;
  return regeneratorRuntime.async(function handleExistingFiles$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          imagesToDelete = existingProd.image.filter(function (img) {
            return !obj.image.includes(img);
          });
          videosToDelete = existingProd.video ? existingProd.video.filter(function (vid) {
            return !obj.video.includes(vid);
          }) : [];
          bannersToDelete = existingProd.banner ? existingProd.banner.filter(function (ban) {
            return !obj.banner.includes(ban);
          }) : [];
          filesToDelete.push.apply(filesToDelete, _toConsumableArray(imagesToDelete).concat(_toConsumableArray(videosToDelete), _toConsumableArray(bannersToDelete)));

          if (!(filesToDelete.length > 0)) {
            _context3.next = 7;
            break;
          }

          _context3.next = 7;
          return regeneratorRuntime.awrap((0, _s3Func.deleteFiles)(filesToDelete));

        case 7:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function uploadNewFiles(filesToUpload, fileType, productName) {
  var files;
  return regeneratorRuntime.async(function uploadNewFiles$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (!(filesToUpload.length > 0)) {
            _context4.next = 6;
            break;
          }

          _context4.next = 3;
          return regeneratorRuntime.awrap((0, _s3Func.uploadFiles)(filesToUpload, fileType, productName));

        case 3:
          _context4.t0 = _context4.sent;
          _context4.next = 7;
          break;

        case 6:
          _context4.t0 = [];

        case 7:
          files = _context4.t0;
          return _context4.abrupt("return", files);

        case 9:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function updateObjWithUploadedFiles(obj, uploadedFileNames, fileType) {
  var _obj$fileType;

  (_obj$fileType = obj[fileType]).push.apply(_obj$fileType, _toConsumableArray(uploadedFileNames));
}

function handleVariantImages(obj, variantsFilesToUpload) {
  var variantImages;
  return regeneratorRuntime.async(function handleVariantImages$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(Promise.all(variantsFilesToUpload.map(function _callee(file) {
            return regeneratorRuntime.async(function _callee$(_context5) {
              while (1) {
                switch (_context5.prev = _context5.next) {
                  case 0:
                    if (!(file.size > 0)) {
                      _context5.next = 4;
                      break;
                    }

                    _context5.next = 3;
                    return regeneratorRuntime.awrap((0, _s3Func.uploadFiles)([file], 'variant'));

                  case 3:
                    return _context5.abrupt("return", _context5.sent);

                  case 4:
                  case "end":
                    return _context5.stop();
                }
              }
            });
          })));

        case 2:
          variantImages = _context6.sent;
          obj.variant = obj.variant.map(function (variant, index) {
            if (variantImages[index]) {
              return _objectSpread({}, variant, {
                image: variantImages[index][0]
              });
            }

            return variant;
          });

        case 4:
        case "end":
          return _context6.stop();
      }
    }
  });
}