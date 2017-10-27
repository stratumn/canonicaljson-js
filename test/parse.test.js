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
import parse from '../src/parse';

function testMalformed(input) {
  it('shows classic JSON.parse throws', () => {
    expect(() => {
      JSON.parse(input);
    }).toThrow();
  });

  it('shows our implementation throws', () => {
    expect(() => {
      parse(input);
    }).toThrow();
  });
}

test('Sanity check', () => {
  const input = '{"a":"b"}';

  const obj = parse(input);
  expect(obj.a).toBe('b');
});

test('interprets short escaped characters correctly', () => {
  expect(parse('{"a": "\\b"}').a).toBe('\b');
});

const malformed = [
  {
    input: '"foo	bar"',
    desc: 'invalid character'
  },
  {
    input: '042',
    desc: 'leading zero number'
  },
  {
    input: '0.',
    desc: 'partial fraction number'
  },
  {
    input: '"\\u004g"',
    desc: 'invalid string unicode escape'
  },
  {
    input: 'tru',
    desc: 'incomplete true boolean'
  },
  {
    input: 'fal',
    desc: 'incomplete false boolean'
  }
];

malformed.forEach(obj => {
  describe(`Malformed rejection: ${obj.desc}`, () => {
    testMalformed(`{"malformed": ${obj.input}}`);
  });
});
