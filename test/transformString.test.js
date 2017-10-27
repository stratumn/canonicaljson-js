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

import transformString from '../src/transformString';

test('does not transforms regular string', () => {
  expect(transformString('a')).toBe('"a"');
});

test('transforms meta strings', () => {
  expect(transformString('\b')).toBe('"\\b"');
});

test('transforms meta strings in longer strings', () => {
  expect(transformString('\tbcd\n')).toBe('"\\tbcd\\n"');
});

test('does not transform surrogate pairs', () => {
  expect(transformString('𝌆')).toBe('"𝌆"');
});

test('does not transform combining characters', () => {
  expect(transformString('ế')).toBe('"ế"');
});

test('escapes lone surrogate', () => {
  expect(transformString('\u001B')).toBe('"\\u001B"');
});

test('does not escape two high surrogates', () => {
  expect(transformString('\uD800\uDBFF')).toBe('"\\uD800\\uDBFF"');
});
