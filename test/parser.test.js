import Parser from '../src/parser';

function testMalformed(input) {
  it('shows classic JSON.parse throws', () => {
    expect(() => {
      JSON.parse(input);
    }).toThrow();
  });

  it('shows our implementation throws', () => {
    expect(() => {
      new Parser(input).parse();
    }).toThrow();
  });
}

describe('Sanity check', () => {
  const input = '{"a":"b"}';

  const obj = new Parser(input).parse();
  expect(obj.a).toBe('b');
});

describe('Malformed rejection: invalid character', () => {
  const input = '{"malformed":"foo	bar"}';

  testMalformed(input);
});

describe('Malformed rejection: leading zero number', () => {
  const input = '{"malformed":042}';

  testMalformed(input);
});

describe('Malformed rejection: partial fraction number', () => {
  const input = '{"malformed":0.}';

  testMalformed(input);
});

describe('Malformed rejection: invalid string unicode escape', () => {
  const input = '{"malformed":"\\u004g"}';

  testMalformed(input);
});
