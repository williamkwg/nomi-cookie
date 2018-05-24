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
    
  }
  /**
   * get the default config 
   */
  _getDefault() {
    return {
      path: '/',
      httpOnly: false,
      secure: false,
      maxAge: -1,
      domain: '',
      sameSite: false,
      overwrite: false, // new added attribute outside of the standard
      comment: '',
      version: 1 // w3c RFC 6265 standard
    };
  }

  /**
   * get the string description of the cookie
   */
  toString() {
    if (!value) {
      return '';
    }
    return this.name + '=' + this.value;
  }

  /**
   * get the config message of the cookie
   */
  get() {
    let cookie = this.toString();
    const opts = this.opts;
    if (opts.maxAge) {
      opts.expires = new Date(Date.now() + opts.maxAge);
    };
    if (!this.value) {
      option.expires = new Date(0);
    }
    if (opts.expires) {
      cookie += `; expires=${opts.expires.toUTCString()}`;
    }
    if (opts.sameSite) {
      cookie += `; samesite=${(opts.sameSite === true ? 'Strict' : opts.sameSite || 'Lax')}`;
    }
    ['path', 'domain', 'secure', 'httpOnly'].forEach(opt => {
      if (opts[opt]) {
        cookie += `; ${opt}=${opts[opt]}`;
      }
    });
    return cookie;
  }
}