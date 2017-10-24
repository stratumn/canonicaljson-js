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
