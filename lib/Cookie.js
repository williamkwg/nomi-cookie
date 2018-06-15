'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _lodash = require('lodash');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cookie = function () {
  function Cookie(name, value, opts) {
    _classCallCheck(this, Cookie);

    (0, _assert.ok)(!!name, 'argumnet name is invalid');
    (0, _assert.ok)(!!value, 'argument value is invalid');
    this.name = name;
    this.value = value;
    this.opts = (0, _lodash.pick)(_extends({}, this._getDefault(), opts), (0, _lodash.keys)(this._getDefault()));
  }
  /**
   * get the default config 
   */


  _createClass(Cookie, [{
    key: '_getDefault',
    value: function _getDefault() {
      return {
        path: '/',
        httpOnly: false,
        secure: false,
        maxAge: -1,
        domain: '',
        size: 4 * 1024,
        sameSite: false,
        overwrite: false, // new added attribute outside of the standard
        comment: '',
        version: 1 // w3c RFC 6265 standard
      };
    }

    /**
     * get the string description of the cookie
     */

  }, {
    key: 'toString',
    value: function toString() {
      if (!this.value) {
        return '';
      }
      return this.name + '=' + this.value;
    }

    /**
     * get the config message of the cookie
     */

  }, {
    key: 'get',
    value: function get() {
      var cookie = this.toString();
      var opts = this.opts;
      if (opts.maxAge && opts.maxAge > 0) {
        opts.expires = new Date(Date.now() + opts.maxAge);
      }
      if (!this.value) {
        option.expires = new Date(0);
      }
      if (opts.expires) {
        cookie += '; expires=' + opts.expires.toUTCString();
      }
      if (opts.sameSite) {
        cookie += '; samesite=' + (opts.sameSite === true ? 'Strict' : opts.sameSite || 'Lax');
      }
      ['path', 'domain', 'secure', 'httpOnly'].forEach(function (opt) {
        if (opts[opt]) {
          cookie += '; ' + opt + '=' + opts[opt];
        }
      });
      return cookie;
    }
  }]);

  return Cookie;
}();

exports.default = Cookie;