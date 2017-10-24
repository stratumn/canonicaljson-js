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
