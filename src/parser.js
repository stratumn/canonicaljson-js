/*
  Copyright 2017 Stratumn SAS. All rights reserved.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import BigNumber from 'bignumber.js';
import forbidden from './forbidden';

const escapee = {
  '"': '"',
  '\\': '\\',
  '/': '/',
  b: '\b',
  f: '\f',
  n: '\n',
  r: '\r',
  t: '\t'
};

// This is a class that can parse a JSON text, producing a JavaScript
// data structure. It is a simple, recursive descent parser. It does not use
// eval or regular expressions, so it can be used as a model for implementing
// a JSON parser in other languages.
export default class Parser {
  constructor(source, reviver) {
    this.text = `${source}`;
    this.at = 0;
    this.ch = ' ';
    this.reviver = reviver;
  }

  error(m) {
    return new Error(
      JSON.stringify({
        name: 'SyntaxError',
        message: m,
        at: this.at,
        text: this.text,
        context: this.chars.slice(this.at - 5, this.at + 5).join()
      })
    );
  }

  next(c) {
    // If a c parameter is provided, verify that it matches the current character.
    if (c && c !== this.ch) {
      throw this.error(`Expected '${c}' instead of '${this.ch}'`);
    }

    // Get the next character. When there are no more characters,
    // return the empty string.
    this.ch = this.chars[this.at];
    this.at += 1;
    return this.ch;
  }

  // Parses a number value.
  number() {
    let string = '';

    if (this.ch === '-') {
      string = '-';
      this.next('-');
    }

    while (this.ch >= '0' && this.ch <= '9') {
      string += this.ch;
      this.next();
    }
    if (this.ch === '.') {
      string += '.';
      this.next();
      if (this.ch >= '0' && this.ch <= '9') {
        string += this.ch;
      } else {
        throw this.error('Bad number: partial fraction number');
      }

      while (this.next() && this.ch >= '0' && this.ch <= '9') {
        string += this.ch;
      }
    }
    if (this.ch === 'e' || this.ch === 'E') {
      string += this.ch;
      this.next();
      if (this.ch === '-' || this.ch === '+') {
        string += this.ch;
        this.next();
      }
      while (this.ch >= '0' && this.ch <= '9') {
        string += this.ch;
        this.next();
      }
    }
    if (string.match(/^-?0\d/)) {
      throw this.error('Bad number: leading zero');
    }

    if (string.length > 15 || string.toUpperCase().indexOf('E') >= 0) {
      return new BigNumber(string);
    }
    return +string;
  }

  // Parses a string value.
  string() {
    let string = '';

    // When parsing for string values, we must look for " and \ characters.
    if (this.ch === '"') {
      while (this.next()) {
        if (this.ch === '"') {
          this.next();
          return string;
        }
        if (this.ch === '\\') {
          this.next();
          if (this.ch === 'u') {
            let uffff = 0;
            for (let i = 0; i < 4; i += 1) {
              const hex = parseInt(this.next(), 16);
              if (!Number.isFinite(hex)) {
                throw this.error('Bad unicode code point');
              }
              uffff = uffff * 16 + hex;
            }
            string += String.fromCodePoint(uffff);
          } else if (typeof escapee[this.ch] === 'string') {
            string += escapee[this.ch];
          } else {
            break;
          }
        } else if (this.ch.match(forbidden)) {
          break;
        } else {
          string += this.ch;
        }
      }
    }
    throw this.error('Bad string');
  }

  // Skips whitespace.
  white() {
    while (this.ch && this.ch <= ' ') {
      this.next();
    }
  }

  // true, false, or null.
  word() {
    switch (this.ch) {
      case 't':
        this.next('t');
        this.next('r');
        this.next('u');
        this.next('e');
        return true;
      case 'f':
        this.next('f');
        this.next('a');
        this.next('l');
        this.next('s');
        this.next('e');
        return false;
      case 'n':
        this.next('n');
        this.next('u');
        this.next('l');
        this.next('l');
        return null;
      default:
        throw this.error(`Unexpected '${this.ch}'`);
    }
  }

  // Parses an array value.
  array() {
    const array = [];

    if (this.ch === '[') {
      this.next('[');
      this.white();
      if (this.ch === ']') {
        this.next(']');
        return array; // empty array
      }
      while (this.ch) {
        array.push(this.value());
        this.white();
        if (this.ch === ']') {
          this.next(']');
          return array;
        }
        this.next(',');
        this.white();
      }
    }
    throw this.error('Bad array');
  }

  // Parses an object value.
  object() {
    let key;
    const object = {};

    if (this.ch === '{') {
      this.next('{');
      this.white();
      if (this.ch === '}') {
        this.next('}');
        return object; // empty object
      }
      while (this.ch) {
        key = this.string();
        this.white();
        this.next(':');
        if (Object.hasOwnProperty.call(object, key)) {
          throw this.error(`Duplicate key "${key}"`);
        }
        object[key] = this.value();
        this.white();
        if (this.ch === '}') {
          this.next('}');
          return object;
        }
        this.next(',');
        this.white();
      }
    }
    throw this.error('Bad object');
  }

  // Parses a JSON value. It could be an object, an array, a string, a number,
  // or a word.
  value() {
    this.white();
    switch (this.ch) {
      case '{':
        return this.object();
      case '[':
        return this.array();
      case '"':
        return this.string();
      case '-':
        return this.number();
      default:
        return this.ch >= '0' && this.ch <= '9' ? this.number() : this.word();
    }
  }

  parse() {
    this.chars = [...this.text];
    const result = this.value();
    this.white();
    if (this.ch) {
      throw this.error('Syntax error');
    }

    // If there is a reviver function, we recursively walk the new structure,
    // passing each name/value pair to the reviver function for possible
    // transformation, starting with a temporary root object that holds the result
    // in an empty key. If there is not a reviver function, we simply return the
    // result.
    return typeof this.reviver === 'function'
      ? (function walk(holder, key) {
          let v;
          const value = holder[key];
          if (value && typeof value === 'object') {
            Object.keys(value).forEach(k => {
              v = walk(value, k);
              if (v !== undefined) {
                value[k] = v;
              } else {
                delete value[k];
              }
            });
          }
          return this.reviver.call(holder, key, value);
        })({ '': result }, '')
      : result;
  }
}
