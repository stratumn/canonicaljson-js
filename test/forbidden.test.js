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
import forbidden from '../src/forbidden';

const unmatched = {
  '\u0020\u0021\u0023\u0024\u0025\u0026\u0027\u0028\u0029\u002A\u002B\u002C\u002D\u002E\u002F\u0030\u0031\u0032\u0033\u0034\u0035\u0036\u0037\u0038\u0039\u003A\u003B\u003C\u003D\u003E\u003F\u0040\u0041\u0042\u0043\u0044\u0045\u0046\u0047\u0048\u0049\u004A\u004B\u004C\u004D\u004E\u004F\u0050\u0051\u0052\u0053\u0054\u0055\u0056\u0057\u0058\u0059\u005A\u005B\u005D\u005E\u005F\u0060\u0061\u0062\u0063\u0064\u0065\u0066\u0067\u0068\u0069\u006A\u006B\u006C\u006D\u006E\u006F\u0070\u0071\u0072\u0073\u0074\u0075\u0076\u0077\u0078\u0079\u007A\u007B\u007C\u007D\u007E':
    'printable ASCII',
  '\u0020': 'U+0020 SPACE',
  A: 'U+0041 LATIN CAPITAL LETTER A',
  '\u007F': 'U+007F DELETE',
  '\u0080': 'U+0080 PADDING CHARACTER',
  Å: 'U+00C5 LATIN CAPITAL LETTER A WITH RING ABOVE',
  Å: 'composition—U+0041 LATIN CAPITAL LETTER A + U+030A COMBINING RING ABOVE',
  Å: 'U+212B ANGSTROM SIGN',
  ế: 'U+1EBF LATIN SMALL LETTER E WITH CIRCUMFLEX AND ACUTE',
  ế:
    'composition—U+00EA LATIN SMALL LETTER E WITH CIRCUMFLEX + U+0301 COMBINING ACUTE ACCENT',
  ế:
    'composition—U+0065 LATIN SMALL LETTER E + U+0302 COMBINING CIRCUMFLEX ACCENT + U+0301 COMBINING ACUTE ACCENT',
  é̂:
    'composition—U+0065 LATIN SMALL LETTER E + U+0301 COMBINING ACUTE ACCENT + U+0302 COMBINING CIRCUMFLEX ACCENT',
  '\u2190': 'U+2190 LEFTWARDS ARROW',
  ﬁ: 'U+FB01 LATIN SMALL LIGATURE FI',
  '\uD834\uDF06': 'surrogate pair—U+1D306 TETRAGRAM FOR CENTRE'
};

const matched = {
  '\u0008': 'U+0008 BACKSPACE',
  '\u0009': 'U+0009 CHARACTER TABULATION',
  '\u000A': 'U+000A LINE FEED',
  '\u000C': 'U+000C FORM FEED',
  '\u000D': 'U+000D CARRIAGE RETURN',
  '\u0022': 'U+0022 QUOTATION MARK',
  '\u005C': 'U+005C REVERSE SOLIDUS',
  '\u0000': 'U+0000 NULL',
  '\u0001': 'U+0001 START OF HEADING',
  '\u0002': 'U+0002 START OF TEXT',
  '\u0003': 'U+0003 END OF TEXT',
  '\u0004': 'U+0004 END OF TRANSMISSION',
  '\u0005': 'U+0005 ENQUIRY',
  '\u0006': 'U+0006 ACKNOWLEDGE',
  '\u0007': 'U+0007 BELL',
  '\u000b': 'U+000B LINE TABULATION',
  '\u000e': 'U+000E SHIFT OUT',
  '\u000f': 'U+000F SHIFT IN',
  '\u0010': 'U+0010 DATA LINK ESCAPE',
  '\u0011': 'U+0011 DEVICE CONTROL ONE',
  '\u0012': 'U+0012 DEVICE CONTROL TWO',
  '\u0013': 'U+0013 DEVICE CONTROL THREE',
  '\u0014': 'U+0014 DEVICE CONTROL FOUR',
  '\u0015': 'U+0015 NEGATIVE ACKNOWLEDGE',
  '\u0016': 'U+0016 SYNCHRONOUS IDLE',
  '\u0017': 'U+0017 END OF TRANSMISSION BLOCK',
  '\u0018': 'U+0018 CANCEL',
  '\u0019': 'U+0019 END OF MEDIUM',
  '\u001a': 'U+001A SUBSTITUTE',
  '\u001b': 'U+001B ESCAPE',
  '\u001c': 'U+001C INFORMATION SEPARATOR FOUR',
  '\u001d': 'U+001D INFORMATION SEPARATOR THREE',
  '\u001e': 'U+001E INFORMATION SEPARATOR TWO',
  '\u001f': 'U+001F INFORMATION SEPARATOR ONE'
};

Object.keys(unmatched).forEach(string => {
  test(`does not match ${unmatched[string]}`, () => {
    expect(forbidden.test(string)).toBeFalsy();
  });
});

Object.keys(matched).forEach(string => {
  test(`matches ${matched[string]}`, () => {
    expect(forbidden.test(string)).toBeTruthy();
  });
});
