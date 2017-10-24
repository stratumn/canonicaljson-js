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

import toCodePoint from './toCodePoint';

/* eslint-disable no-control-regex */
const escapable = /^[\u0022\u005c\u0000-\u001F\ud800-\udfff]$/;
/* eslint-enable */

const meta = {
  // table of character substitutions
  '\b': '\\b',
  '\t': '\\t',
  '\n': '\\n',
  '\f': '\\f',
  '\r': '\\r',
  '"': '\\"',
  '\\': '\\\\'
};

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.
export default function(string) {
  let result = '';

  /* eslint-disable no-restricted-syntax */
  for (const char of string) {
    if (escapable.test(char)) {
      const c = meta[char];
      if (c) {
        result += c;
      } else {
        result += `\\u${toCodePoint(char, 4)}`;
      }
    } else {
      result += char;
    }
  }
  return `"${result}"`;
}
