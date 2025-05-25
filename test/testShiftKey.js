// testShiftKey.js
// Located in ZetaMorph/test/

import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Shift Key Test Suite ---');

const tests = [
  {
    description: 'Shift key 19 for targetLength 3',
    number: 19,
    targetLength: 3,
    expected: {
      number: 19,
      length: 2,
      targetLength: 3,
      push: ['U1:null', 'U2:1', 'U3:9'],
      view: [VOID_SYMBOL, SYMBOL_SEQUENCE[1], SYMBOL_SEQUENCE[9]],
      targetUnit: 'u3'
    }
  },
  {
    description: 'Shift key 19 for targetLength 2',
    number: 19,
    targetLength: 2,
    expected: {
      number: 19,
      length: 2,
      targetLength: 2,
      push: ['U1:1', 'U2:9', 'U3:null'],
      view: [SYMBOL_SEQUENCE[1], SYMBOL_SEQUENCE[9], VOID_SYMBOL],
      targetUnit: 'u2'
    }
  },
  {
    description: 'Shift key 9 for targetLength 3',
    number: 9,
    targetLength: 3,
    expected: {
      number: 9,
      length: 1,
      targetLength: 3,
      push: ['U1:null', 'U2:null', 'U3:9'],
      view: [VOID_SYMBOL, VOID_SYMBOL, SYMBOL_SEQUENCE[9]],
      targetUnit: 'u3'
    }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  
  try {
    const keyMaker = new KeyMaker();
    const shiftKey = new ShiftKey();
    
    // Generate original key
    const originalKey = keyMaker.makeKey(test.number);
    
    // Shift key
    const shiftedKey = shiftKey.shift(originalKey, test.targetLength);
    
    console.log(`Result: KEY:${shiftedKey.number} LENGTH:${shiftedKey.length} TARGET_LENGTH:${shiftedKey.targetLength} PUSH[${shiftedKey.push.join(' ')}] VIEW:${shiftedKey.view.join('|')}`);
    
    const passed = 
      shiftedKey.number === test.expected.number &&
      shiftedKey.length === test.expected.length &&
      shiftedKey.targetLength === test.expected.targetLength &&
      shiftedKey.push.every((p, i) => p === test.expected.push[i]) &&
      shiftedKey.view.every((v, i) => v === test.expected.view[i]) &&
      shiftedKey.targetUnit === test.expected.targetUnit;
    
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        number: shiftedKey.number,
        length: shiftedKey.length,
        targetLength: shiftedKey.targetLength,
        push: shiftedKey.push,
        view: shiftedKey.view,
        targetUnit: shiftedKey.targetUnit
      })}, Expected: ${JSON.stringify(test.expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});