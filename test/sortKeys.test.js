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
import sortKeys from '../src/sortKeys';
import toCodePoint from '../src/toCodePoint';

test('abcd is after abc', () => {
  expect(sortKeys('abcd', 'abc')).toBeGreaterThan(0);
});

test('abc is the same as abc', () => {
  expect(sortKeys('abc', 'abc')).toBe(0);
});

function toCodePointOrEmpty(char) {
  if (char.length > 0) {
    return toCodePoint(char, 4);
  }
  return '<empty>';
}

const sortedTestKeys = [
  '',
  '\u0000',
  '\u0001',
  '\t',
  '\u001F',
  ' ',
  '"',
  'A',
  'Å',
  '\\',
  'deep',
  'é̂',
  'ế',
  '',
  '',
  'Å',
  'ế',
  '́',
  '̂',
  '̇',
  '̊',
  'ế',
  'Å',
  '←',
  '\uD800',
  '\uD800\uDBFF',
  '\uDBFF',
  '\uDC00',
  '\uDC00\uDBFF',
  '\uDC00\uDFFF',
  '\uDFFF',
  'ﬁ',
  '�',
  '𐀀',
  '𝌆'
];

sortedTestKeys.forEach((keyA, indexA) => {
  sortedTestKeys.slice(indexA + 1).forEach((keyB, indexB) => {
    test(`${toCodePointOrEmpty(keyA)}-${indexA} is before ${toCodePointOrEmpty(
      keyB
    )}-${indexB}`, () => {
      expect(sortKeys(keyA, keyB)).toBeLessThan(0);
    });
  });
});
