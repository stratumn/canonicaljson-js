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
import stringify from '../src/stringify';

const obj = {
  a: 12,
  b: '123'
};

test('stringifies an object', () => {
  expect(stringify(obj)).toBe('{"a":12,"b":"123"}');
});

test('indents with the space parameter as a number', () => {
  expect(stringify(obj, undefined, 2)).toBe(`{
  "a": 12,
  "b": "123"
}`);
});

test('indents with the space parameter as a string', () => {
  expect(stringify(obj, undefined, 'jj')).toBe(`{
jj"a": 12,
jj"b": "123"
}`);
});

test('rejects bad replacer', () => {
  expect(() => {
    stringify(obj, 'blah');
  }).toThrowError();
});

test("calls replacer when it's a function", () => {
  expect(
    stringify(obj, (holder, key, val) => {
      if (key === 'a') {
        return val * 2;
      }
      return val;
    })
  ).toBe('{"a":24,"b":"123"}');
});

test("stringifies only the keys specified by replacer when it's an array", () => {
  expect(stringify(obj, ['a'])).toBe('{"a":12}');
});
