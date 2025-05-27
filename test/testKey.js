import KeyMaker from '../key/keyMaker.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Key Maker Test Suite ---');

const tests = [
  {
    description: 'Generate key for 100,000',
    number: 100000,
    expected: {
      number: 100000,
      length: 6,
      push: ['U1:1', 'U2:0', 'U3:0', 'U4:0', 'U5:0', 'U6:0'],
      view: [SYMBOL_SEQUENCE[1], SYMBOL_SEQUENCE[0], SYMBOL_SEQUENCE[0], SYMBOL_SEQUENCE[0], SYMBOL_SEQUENCE[0], SYMBOL_SEQUENCE[0]]
    }
  },
  {
    description: 'Generate key for 555,555',
    number: 555555,
    expected: {
      number: 555555,
      length: 6,
      push: ['U1:5', 'U2:5', 'U3:5', 'U4:5', 'U5:5', 'U6:5'],
      view: [SYMBOL_SEQUENCE[5], SYMBOL_SEQUENCE[5], SYMBOL_SEQUENCE[5], SYMBOL_SEQUENCE[5], SYMBOL_SEQUENCE[5], SYMBOL_SEQUENCE[5]]
    }
  },
  {
    description: 'Generate key for 2,846',
    number: 2846,
    expected: {
      number: 2846,
      length: 4,
      push: ['U1:2', 'U2:8', 'U3:4', 'U4:6', 'U5:null', 'U6:null'],
      view: [SYMBOL_SEQUENCE[2], SYMBOL_SEQUENCE[8], SYMBOL_SEQUENCE[4], SYMBOL_SEQUENCE[6], VOID_SYMBOL, VOID_SYMBOL]
    }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  
  try {
    const keyMaker = new KeyMaker();
    const key = keyMaker.makeKey(test.number);
    
    console.log(`Result: KEY:${key.number} LENGTH:${key.length} PUSH[${key.push.join(' ')}] VIEW:${key.view.join('|')}`);
    
    const passed = 
      key.number === test.expected.number &&
      key.length === test.expected.length &&
      key.push.every((p, i) => p === test.expected.push[i]) &&
      key.view.every((v, i) => v === test.expected.view[i]);
    
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        number: key.number,
        length: key.length,
        push: key.push,
        view: key.view
      })}, Expected: ${JSON.stringify(test.expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});