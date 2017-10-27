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

const valid = [
  {
    input: 'false',
    expect: false,
    desc: 'false'
  },
  {
    input: 'null',
    expect: null,
    desc: 'null'
  },
  {
    input: 'true',
    expect: true,
    desc: 'true'
  },
  {
    input: '100E+100',
    expect: new BigNumber('100e100'),
    desc: 'big integers'
  },
  {
    input: '-1',
    expect: -1,
    desc: 'negative integers'
  },
  {
    input: '1.21e1',
    expect: new BigNumber('12.1'),
    desc: 'decimal numbers'
  },
  {
    input: '"\\ufb01"',
    expect: 'ﬁ',
    desc: 'unicode encoded characters'
  },
  {
    input: '"\\b"',
    expect: '\b',
    desc: 'short escaped characters'
  },
  {
    input: '[]',
    expect: [],
    desc: 'empty arrays'
  },
  {
    input: '["a", 1, true]',
    expect: ['a', 1, true],
    desc: 'arrays'
  }
];

valid.forEach(obj => {
  test(`interprets  correctly ${obj.desc}}`, () => {
    expect(parse(`{"a": ${obj.input}}`).a).toEqual(obj.expect);
  });
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
  },
  {
    input: 'nul',
    desc: 'incomplete nul'
  },
  {
    input: 'undefined',
    desc: 'undefined'
  },
  {
    input: '"a"}',
    desc: 'additional character'
  }
];

malformed.forEach(obj => {
  describe(`Malformed rejection: ${obj.desc}`, () => {
    testMalformed(`{"malformed": ${obj.input}}`);
  });
});

test('calls the reviver function', () => {
  expect(
    parse('{ "a": 12 }', (holder, key, value) => {
      if (key === 'a') {
        return value * 2;
      }
      return value;
    })
  ).toEqual({ a: 24 });
});
