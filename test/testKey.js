// testKey.js
// Located in ZetaMorph/test/

import KeyMaker from '../key/keyMaker.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Key Maker Test Suite ---');

const tests = [
  {
    description: 'Generate key for 100',
    number: 100,
    expected: {
      number: 100,
      length: 3,
      push: ['U1:1', 'U2:0', 'U3:0'],
      view: [SYMBOL_SEQUENCE[1], SYMBOL_SEQUENCE[0], SYMBOL_SEQUENCE[0]]
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