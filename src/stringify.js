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

import transformString from './transformString';
import transformNumber from './transformNumber';
import sortKeys from './sortKeys';
import join from './join';

function isBigNumber(value) {
  return value && value.constructor && value.constructor.name === 'BigNumber';
}

class Transformer {
  constructor(gap, indent, replacer) {
    this.gap = gap;
    this.indent = indent;
    this.replacer = replacer;
  }

  /**
 * Produces a string from holder[key].
 * @param {*} key
 * @param {*} holder
 */
  transform(key, holder) {
    const mind = this.gap;

    let value = holder[key];

    // If the value has a toJSON method, call it to obtain a replacement value.
    if (
      value &&
      typeof value === 'object' &&
      typeof value.toJSON === 'function' &&
      !isBigNumber(value)
    ) {
      value = value.toJSON(key);
    }

    // If we were called with a replacer function, then call the replacer to
    // obtain a replacement value.
    if (typeof this.replacer === 'function') {
      value = this.replacer.call(null, holder, key, value);
    }

    // What happens next depends on the value's type.
    switch (typeof value) {
      case 'string':
        return transformString(value);

      case 'number':
        return transformNumber(value);

      // undefined value must be treated the same way as a null value
      // since the serialization must be consistent across languages
      case 'undefined':
        return 'null';

      case 'boolean':
      case 'null':
        // If the value is a boolean or null, convert it to a string. Note:
        // typeof null does not produce 'null'. The case is included here in
        // the remote chance that this gets fixed someday.
        return String(value);

      // If the type is 'object', we might be dealing with an object or an array or
      // null.

      case 'object': {
        // Due to a specification blunder in ECMAScript, typeof null is 'object',
        // so watch out for that case.
        if (!value) {
          return 'null';
        }

        if (isBigNumber(value)) {
          return transformNumber(value);
        }

        // Make an array to hold the partial results of stringifying this object value.
        const partial = [];

        this.gap += this.indent;

        // Is the value an array?
        if (Array.isArray(value)) {
          // The value is an array. Stringify every element. Use null as a placeholder
          // for non-JSON values.
          value.forEach((_, i) => {
            partial.push(this.transform(i, value) || 'null');
          });

          // Join all of the elements together, separated with commas, and wrap them in
          // brackets.
          const v = join(partial, '[]', this.gap, mind);

          this.gap = mind;
          return v;
        }

        // If the replacer is an array, use it to select the members to be stringified.
        if (this.replacer && typeof this.replacer === 'object') {
          this.replacer.forEach(rep => {
            if (typeof rep === 'string') {
              const v = this.transform(rep, value);
              if (v) {
                partial.push(this.format(rep, v));
              }
            }
          });
        } else {
          // Otherwise, iterate through all of the keys in the object.
          const keysSorted = Object.keys(value).sort(sortKeys);
          keysSorted.forEach(k => {
            if (Object.prototype.hasOwnProperty.call(value, k)) {
              const v = this.transform(k, value);
              if (v) {
                partial.push(this.format(k, v));
              }
            }
          });
        }

        // Join all of the member texts together, separated with commas,
        // and wrap them in braces.
        const v = join(partial, '{}', this.gap, mind);
        this.gap = mind;
        return v;
      }
      default:
        throw new Error(`Unexpected object type: ${typeof value}`);
    }
  }

  format(key, value) {
    return transformString(key) + (this.gap ? ': ' : ':') + value;
  }
}

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.
export default function stringify(value, replacer, space) {
  const gap = '';
  let indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.
  if (typeof space === 'number') {
    indent = ' '.repeat(space);

    // If the space parameter is a string, it will be used as the indent string.
  } else if (typeof space === 'string') {
    indent = space;
  }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.
  if (
    replacer &&
    typeof replacer !== 'function' &&
    (typeof replacer !== 'object' || typeof replacer.length !== 'number')
  ) {
    throw new Error('JSON.stringify');
  }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.
  return new Transformer(gap, indent, replacer).transform('', { '': value });
}
