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
import forbidden from './forbidden';

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

// MUST represent all strings (including object member names) in their minimal-length UTF-8 encoding
// avoiding escape sequences for characters except those otherwise inexpressible in JSON (U+0022 QUOTATION MARK, U+005C REVERSE SOLIDUS, and ASCII control characters U+0000 through U+001F) or UTF-8 (U+D800 through U+DFFF), and
// avoiding escape sequences for combining characters, variation selectors, and other code points that affect preceding characters, and
// using two-character escape sequences where possible for characters that require escaping:
// \b U+0008 BACKSPACE
// \t U+0009 CHARACTER TABULATION ("tab")
// \n U+000A LINE FEED ("newline")
// \f U+000C FORM FEED
// \r U+000D CARRIAGE RETURN
// \" U+0022 QUOTATION MARK
// \\ U+005C REVERSE SOLIDUS ("backslash"), and
// using six-character \u00xx uppercase hexadecimal escape sequences for control characters that require escaping but lack a two-character sequence, and
// using six-character \uDxxx uppercase hexadecimal escape sequences for lone surrogates
export default function(string) {
  if (!forbidden.test(string)) {
    return `"${string}"`;
  }

  let result = '';

  /* eslint-disable no-restricted-syntax */
  for (const char of string) {
    if (forbidden.test(char)) {
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
