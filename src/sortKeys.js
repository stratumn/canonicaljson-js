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

// MUST order the members of all objects lexicographically by the UCS (Unicode Character Set) code points of their names
// - preserving and utilizing the code points in U+D800 through U+DFFF (inclusive) for all lone surrogates
export default function(keyA, keyB) {
  if (keyA === keyB) return 0;

  const keyAchars = [...keyA];
  const keyBchars = [...keyB];

  if (keyAchars.length === 0 && keyBchars.length === 0) {
    return 0;
  }

  let result = -1;

  keyAchars.some((aChar, index) => {
    const bChar = keyBchars[index];
    if (!bChar) {
      result = 1;
      return true;
    }
    if (aChar.codePointAt(0) !== bChar.codePointAt(0)) {
      result = toCodePoint(aChar, 8).localeCompare(toCodePoint(bChar, 8));
      return true;
    }
    return false;
  });

  return result;
}
