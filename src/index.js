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

/*
The original version of this code is taken from Mirko Kiefer's canonical-json:
https://github.com/mirkokiefer/canonical-json/blob/master/index.js
Modifications were made to conform to the canonicaljson spec.
*/

import { parse } from 'json-bigint';
import Transformer from './transformer';

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.
const stringify = function stringify(value, replacer, space) {
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
};

module.exports = {
  stringify,
  parse
};
