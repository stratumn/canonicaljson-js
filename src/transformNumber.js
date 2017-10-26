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

const emptyFractionalPart = /^(-?\d+)(E-\d+)$/;

function addNonEmptySignificandFractionalPart(dec) {
  const match = dec.match(emptyFractionalPart);
  if (match) {
    return `${match[1]}.0${match[2]}`;
  }
  return dec;
}

// MUST represent all integer numbers (those with a zero-valued fractional part)
// without a leading minus sign when the value is zero, and
// without a decimal point, and
// without an exponent
//
// MUST represent all non-integer numbers in exponential notation
// including a nonzero single-digit significand integer part, and
// including a nonempty significand fractional part, and
// including no trailing zeroes in the significand fractional part (other than as part of a ".0" required to satisfy the preceding point), and
// including a capital "E", and
// including no plus sign in the exponent, and
// including no insignificant leading zeroes in the exponent
export default function(value) {
  const val = new BigNumber(value);
  if (val.isInteger()) {
    return val.toFixed();
  }

  return addNonEmptySignificandFractionalPart(
    val
      .toExponential()
      .toUpperCase()
      .replace('+', '')
  );
}
