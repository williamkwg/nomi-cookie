import { ok } from 'assert';
import { pick, keys } from 'lodash';
export default class Cookie {

  name;
  value;
  opts;

  constructor(name, value, opts) {
    ok(!!name, `argumnet name is invalid`);
    ok(!!value, `argument value is invalid`);
    this.name = name;
    this.value = value;
    this.opts = pick({ ...this._getDefault(), ...opts }, keys(this._getDefault()));
    !value && (this.opts.expires = new Date(0));
  }

  _getDefault() {
    return merged = {
      path: '/',
      httpOnly: true,
      secure: false,
      maxAge: -1,
      domain: '.',
      expires: 0,
      size: 0,
      sameSite: false,
      comment: '',
      version: 1 // w3c RFC 6265 standard
    };
  }

  toString() {
    return this.name + '=' + this.value;
  }

  get() {
    let cookie = this.toString();
    const opts = this.opts;
    if (opts.maxAge) {
      opts.expires = new Date(Date.now() + opts.maxAge);
    };
    if (opts.path) {
      cookie += '; path=' + opts.path;
    }
    if (opts.expires) {
      cookie += '; expires=' + opts.expires.toUTCString();
    }
    if (opts.domain) {
      cookie += '; domain=' + opts.domain;
    }
    if (opts.sameSite) {
      cookie += '; samesite=' + (opts.sameSite === true ? 'strict' : opts.sameSite.toLowerCase());
    }
    if (opts.secure) {
      cookie += '; secure=' + opts.secure;
    }
    if (opts.httpOnly) {
      cookie += '; httponly=' + opts.httpOnly;
    };
    return cookie;
  }
}