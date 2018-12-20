# nomi-cookie

Basic HTTP cookie parser and serializer for HTTP servers.

## Installation

``` bash
$ npm install nomi-cookie --save
```

## API

- getKey
- updateKey
- get
- set

## Usage

The following example uses this module in conjunction with the Node.js core HTTP server
to prompt a user for their name and display it back on future visits.

#### Example

``` javascript

const key = Symbol('nomi-cookie-key');
const ctx = new Koa().ctx;

const Cookie = require('nomi-cookie');
const cookie = new Cookie(ctx, key); 

/**
 * set(key, value, opts);
 * opts: {
 *     path: '/',
 *     httpOnly: false,
 *     secure: false,
 *     encrypt: aes192,
 *     encode: utf8,
 *     outputEncode: hex, 
 *     maxAge: -1,
 *     domain: '',
 *     size: 4 * 1024,
 *     sameSite: false,
 *     overwrite: false, // new added attribute outside of the standard
 *     comment: '',
 *     version: 1 // w3c RFC 6265 standard
 * }
 */

cookie.set('username', 'weiguo.kong', {
  secure: true,
  encrypt: 'aes192'
});

const userName = cookie.get('username', {
  secure: true,
  encrypt: 'aes192'
}); // weiguo.kong

cookie.getKey(); //Symbol('nomi-cookie-key')

```

