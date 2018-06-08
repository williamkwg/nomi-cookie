
/**
 * @author weiguo.kong
 * @description manage cookies for nomi framework
 * @api get(name, [opts])  set(name, value, [opts])  getkey() updateKey()
 */
import { ok } from 'assert';
import Cookie from './Cookie';
import { createCipher, createDecipher }  from 'crypto';
const KEYS = Symbol('nomi-cookie-keys');
const encrypt_method = 'aes192';
const outputEncode = 'hex';
const inputEncode = 'utf8';

export default class Cookies {

  keys; // use keys to encrypt the cookie
  ctx;

  constructor(ctx, keys) {
    ok(ctx && ctx.request && ctx.response, `argument ctx is invalid`);
    keys = keys || KEYS;
    this.ctx = ctx;
    this.keys = keys;
  }

  /**
   * @api getKey()
   * @description get the key  
   * @public
   */
  getkey() {
    return this.keys;
  }

  /**
   * @api get(name, [option])
   * @description get cookie according to name
   * @public
   */
  get(name, opts) {
    opts = opts || {};
    const cookie = this._getCookie();
    if (!cookie) {
      return '';
    }
    const reg = this._getPattern(name);
    const match = cookie.match(reg);
    if (!match || match.length < 2) {
      return '';
    }
    let value = match[1];
    if (!opts.encrypt) {
      return value;
    }
    const key = this.getkey();
    const result = this._decrypt(value, { key, outputEncode, ...opts });
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
  set(name, value, opts) {
    // get the current cookie collection
    const cookies = this._getCookies();
    const key = this.getkey();
    opts = opts || {};
    // when user agent not set attribute secure , reset the attribute secure to ctx.secure
    opts.secure = (opts.secure === false) ? false : (opts.secure || this.ctx.secure);
    const { encode, ...options } = opts;
    // when user agent set attribute encrypt , encrypt the value of cookie use the encryption algorithm named aes192
    if (opts.encrypt && value) {
      value = this._encrypt(value, { key, outputEncode, encode });
    }
    // new a cookie object according to the options
    const cookie = new Cookie(name, value, options);
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
  updateKey(key) {
    this.key = key;
  }


  /**
   * @description set cookies for response
   * @param {*} cookies 
   */
  _setCookies(cookies) {
    this.ctx.res.setHeader('Set-Cookie', cookies);
  }

  /**
   * @description get the cookies of the current response 
   */
  _getCookies() {
    let cookies = this.ctx.response.get('Set-Cookie') || [];
    if (!Array.isArray(cookies)) {
      cookies = [cookies];
    }
    return cookies;
  }

  /**
   * @description get the cookie of the current request
   */
  _getCookie() {
    return this.ctx.request.get('cookie') || '';
  }

  /**
   * @description push cookie to cookies
   * @param {*} cookies 
   * @param {*} cookie 
   */
  _addCookie(cookies, cookie) {
    if (cookie.opts.overwrite) {
      cookies = cookies.filter(c => !c.startsWith(cookie.name + '='));
    }
    cookies.push(cookie.get());
    return cookies;
  }

  /**
   * @description encrypt the value of cookie according to options
   * @param {*} value 
   * @param {*} opts 
   */
  _encrypt(value, opts) {
    let { key, outputEncode, encode } = opts;
    key = key || this.getkey();
    encode = encode || inputEncode;
    const cipher = createCipher(encrypt_method, key);
    let encryptData = cipher.update(value, encode, outputEncode);
    encryptData += cipher.final(outputEncode);
    return encryptData;
  }

  /**
   * @description decrypt the value of cookie according to options
   * @param {*} value 
   * @param {*} opts 
   */
  _decrypt(value, opts) {
    let { key, outputEncode, encode } = opts;
    key = key || this.getkey();
    encode = encode || inputEncode;
    const decipher = createDecipher(encrypt_method, key);
    let decryptData = decipher.update(value, outputEncode, encode);
    decryptData += decipher.final(encode);
    return decryptData;
  }

  /**
   * @description generate regexp pattern according to name
   */
  _getPattern(name) {
    return new RegExp(`(?:^;?)*\\s*${name.replace(/[-][{}()*+?.,\\^$|#\s]/g, '\\$&')}=([^;]*)`);
  }
}