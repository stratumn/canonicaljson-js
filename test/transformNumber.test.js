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
import { BigDecimal } from 'bigdecimal';
import Big from 'big.js';
import Decimal from 'decimal.js';
import transformNumber from '../src/transformNumber';

function testTransformNumber(from, to) {
  expect(transformNumber(new BigNumber(from))).toBe(to);
}

test('represents all integers without a leading minus sign when the value is zero', () => {
  testTransformNumber(0, '0');
});

test('represents all integers without a decimal point, and without an exponent', () => {
  testTransformNumber('99999999999999999999999', '99999999999999999999999');

  testTransformNumber(
    '179.931348623159077293051907890247336179769789423065727343008115773267580550096313270847732240753602112011387987139335765878976881441662249474306394741243777678934248654852763022196012460941194530829520850057688381506823424628814739131105408272371633505106845862982399472459479716304835356329624224137217e306',
    '179931348623159077293051907890247336179769789423065727343008115773267580550096313270847732240753602112011387987139335765878976881441662249474306394741243777678934248654852763022196012460941194530829520850057688381506823424628814739131105408272371633505106845862982399472459479716304835356329624224137217000000'
  );
});

test('represents non negative zero', () => {
  ['0e0', '0.0', '0.00', '0.00e00', '-0'].forEach(n => {
    testTransformNumber(n, '0');
  });
});

test('represents all non-integers numbers in exponential notation', () => {
  testTransformNumber('11.1', '1.11E1');
});

test('adds a nonempty significand fractional part', () => {
  testTransformNumber('0.1', '1.0E-1');
});

test('is compatible with BigDecimal', () => {
  expect(transformNumber(new BigDecimal('1.11'))).toBe('1.11E0');
});

test('is compatible with big.js', () => {
  expect(transformNumber(new Big('123.4567'))).toBe('1.234567E2');
});

test('is compatible with decimal.js', () => {
  expect(transformNumber(new Decimal('123.4567'))).toBe('1.234567E2');
});
