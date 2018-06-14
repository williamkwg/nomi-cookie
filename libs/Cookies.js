'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
/**
 * @author weiguo.kong
 * @description manage cookies for nomi framework
 * @api get(name, [opts])  set(name, value, [opts])  getkey() updateKey()
 */


var _assert = require('assert');

var _Cookie = require('./Cookie');

var _Cookie2 = _interopRequireDefault(_Cookie);

var _crypto = require('crypto');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var KEYS = Symbol('nomi-cookie-keys');
var encrypt_method = 'aes192';
var outputEncode = 'hex';
var inputEncode = 'utf8';

var Cookies = function () {
  function Cookies(ctx, keys) {
    _classCallCheck(this, Cookies);

    (0, _assert.ok)(ctx && ctx.request && ctx.response, 'argument ctx is invalid');
    keys = keys || KEYS;
    this.ctx = ctx;
    this.keys = keys;
  }

  /**
   * @api getKey()
   * @description get the key  
   * @public
   */
  // use keys to encrypt the cookie


  _createClass(Cookies, [{
    key: 'getkey',
    value: function getkey() {
      return this.keys;
    }

    /**
     * @api get(name, [option])
     * @description get cookie according to name
     * @public
     */

  }, {
    key: 'get',
    value: function get(name, opts) {
      opts = opts || {};
      var cookie = this._getCookie();
      if (!cookie) {
        return '';
      }
      var reg = this._getPattern(name);
      var match = cookie.match(reg);
      if (!match || match.length < 2) {
        return '';
      }
      var value = match[1];
      if (!opts.encrypt) {
        return value;
      }
      var key = this.getkey();
      var result = this._decrypt(value, _extends({ key: key, outputEncode: outputEncode }, opts));
      return result.toString();
    }

    /**
     * @api set(name, value, [options])
     * @description set cookie
     * @param {*} name 
     * @param {*} value 
     * @param {*} opts 
     * @public
     */

  }, {
    key: 'set',
    value: function set(name, value, opts) {
      // get the current cookie collection
      var cookies = this._getCookies();
      var key = this.getkey();
      opts = opts || {};
      // when user agent not set attribute secure , reset the attribute secure to ctx.secure
      opts.secure = opts.secure === false ? false : opts.secure || this.ctx.secure;

      var _opts = opts,
          encode = _opts.encode,
          options = _objectWithoutProperties(_opts, ['encode']);
      // when user agent set attribute encrypt , encrypt the value of cookie use the encryption algorithm named aes192


      if (opts.encrypt && value) {
        value = this._encrypt(value, { key: key, outputEncode: outputEncode, encode: encode });
      }
      // new a cookie object according to the options
      var cookie = new _Cookie2.default(name, value, options);
      this.ctx.cookies.request.headers.cookie += cookie.get();
      this._setCookies(this._addCookie(cookies, cookie)); //set cookies of the current response
      return this; // return the instance of Cookies class
    }

    /**
     * @api update the key 
     * @description update key 
     * @param {*} key 
     * @public
     */

  }, {
    key: 'updateKey',
    value: function updateKey(key) {
      this.key = key;
    }

    /**
     * @description set cookies for response
     * @param {*} cookies 
     */

  }, {
    key: '_setCookies',
    value: function _setCookies(cookies) {
      this.ctx.res.setHeader('Set-Cookie', cookies);
    }

    /**
     * @description get the cookies of the current response 
     */

  }, {
    key: '_getCookies',
    value: function _getCookies() {
      var cookies = this.ctx.response.get('Set-Cookie') || [];
      if (!Array.isArray(cookies)) {
        cookies = [cookies];
      }
      return cookies;
    }

    /**
     * @description get the cookie of the current request
     */

  }, {
    key: '_getCookie',
    value: function _getCookie() {
      return this.ctx.request.get('cookie') || '';
    }

    /**
     * @description push cookie to cookies
     * @param {*} cookies 
     * @param {*} cookie 
     */

  }, {
    key: '_addCookie',
    value: function _addCookie(cookies, cookie) {
      if (cookie.opts.overwrite) {
        cookies = cookies.filter(function (c) {
          return !c.startsWith(cookie.name + '=');
        });
      }
      cookies.push(cookie.get());
      return cookies;
    }

    /**
     * @description encrypt the value of cookie according to options
     * @param {*} value 
     * @param {*} opts 
     */

  }, {
    key: '_encrypt',
    value: function _encrypt(value, opts) {
      var key = opts.key,
          outputEncode = opts.outputEncode,
          encode = opts.encode;

      key = key || this.getkey();
      encode = encode || inputEncode;
      var cipher = (0, _crypto.createCipher)(encrypt_method, key);
      var encryptData = cipher.update(value, encode, outputEncode);
      encryptData += cipher.final(outputEncode);
      return encryptData;
    }

    /**
     * @description decrypt the value of cookie according to options
     * @param {*} value 
     * @param {*} opts 
     */

  }, {
    key: '_decrypt',
    value: function _decrypt(value, opts) {
      var key = opts.key,
          outputEncode = opts.outputEncode,
          encode = opts.encode;

      key = key || this.getkey();
      encode = encode || inputEncode;
      var decipher = (0, _crypto.createDecipher)(encrypt_method, key);
      var decryptData = decipher.update(value, outputEncode, encode);
      decryptData += decipher.final(encode);
      return decryptData;
    }

    /**
     * @description generate regexp pattern according to name
     */

  }, {
    key: '_getPattern',
    value: function _getPattern(name) {
      return new RegExp('(?:^;?)*\\s*' + name.replace(/[-][{}()*+?.,\\^$|#\s]/g, '\\$&') + '=([^;]*)');
    }
  }]);

  return Cookies;
}();

exports.default = Cookies;