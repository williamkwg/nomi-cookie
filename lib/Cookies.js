
/**
 * @author weiguo.kong
 * @description manage cookies for nomi framework
 * @api get(name, [opts])  set(name, value, [opts])  keys()
 */
import { ok } from 'assert';
import Cookie from './Cookie';
import { createCipher }  from 'crypto';
const KEYS = Symbol('nomi-cookie-keys');
const encrypt_method = 'aes192';
const outputEncode = 'hex';
export default class Cookies {
  keys;
  ctx;
  constructor(ctx, keys) {
    ok(ctx && ctx.request && ctx.response, `argument ctx is invalid`);
    keys = keys || KEYS;
    this.ctx = ctx;
    this.keys = keys;
  }
  keys() {
    return this.keys;
  }
  set(name, value, opts) {
    opts = opts || {};
    opts.secure = (opts.secure === false) ? false : (opts.secure || this.ctx.secure);
    const { encode, ...options } = opts;
    const key = this.keys();
    if (opts.encrypt && value) {
      value = this._encrypt(value, { key, outputEncode, encode });
    }
    new Cookie(name, value, options);
  }
  _encrypt(value, opts) {
    const { key, outputEncode, encode } = opts;
    const cipher = createCipher(encrypt_method, key || this.keys());
    let encryptData = cipher.update(value, encode, outputEncode);
    encryptData += cipher.final(outputEncoding);
    return encryptData;
  }
}