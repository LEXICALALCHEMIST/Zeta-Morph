// testSet.js
// Located in ZetaMorph/test/

import SetSkeleton from '../MorphLogic/setSkeleton.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Skeleton Set Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 5',
    number: 5,
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit2: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit3: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
    }
  },
  {
    description: 'Set skeleton to 43',
    number: 43,
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[3], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit2: { currentSymbol: SYMBOL_SEQUENCE[4], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit3: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
    }
  },
  {
    description: 'Set skeleton to 221',
    number: 221,
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit2: { currentSymbol: SYMBOL_SEQUENCE[2], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit3: { currentSymbol: SYMBOL_SEQUENCE[2], carry: 0, hasCollapsed: false, pushesLength: 0 }
    }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  
  try {
    const setSkeleton = new SetSkeleton();
    const state = setSkeleton.set(test.number);
    
    const skeleton = `<${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`;
    console.log(`Final Skeleton: ${skeleton}`);
    
    console.log('Result:', {
      unit1: {
        currentSymbol: state.unit1.currentSymbol,
        carry: state.unit1.carry,
        hasCollapsed: state.unit1.hasCollapsed,
        pushesLength: state.unit1.pushesLength
      },
      unit2: {
        currentSymbol: state.unit2.currentSymbol,
        carry: state.unit2.carry,
        hasCollapsed: state.unit2.hasCollapsed,
        pushesLength: state.unit2.pushesLength
      },
      unit3: {
        currentSymbol: state.unit3.currentSymbol,
        carry: state.unit3.carry,
        hasCollapsed: state.unit3.hasCollapsed,
        pushesLength: state.unit3.pushesLength
      }
    });
    console.log('Expected:', test.expected);
    
    const passed = 
      state.unit1.currentSymbol === test.expected.unit1.currentSymbol &&
      state.unit1.carry === test.expected.unit1.carry &&
      state.unit1.hasCollapsed === test.expected.unit1.hasCollapsed &&
      state.unit1.pushesLength === test.expected.unit1.pushesLength &&
      state.unit2.currentSymbol === test.expected.unit2.currentSymbol &&
      state.unit2.carry === test.expected.unit2.carry &&
      state.unit2.hasCollapsed === test.expected.unit2.hasCollapsed &&
      state.unit2.pushesLength === test.expected.unit2.pushesLength &&
      state.unit3.currentSymbol === test.expected.unit3.currentSymbol &&
      state.unit3.carry === test.expected.unit3.carry &&
      state.unit3.hasCollapsed === test.expected.unit3.hasCollapsed &&
      state.unit3.pushesLength === test.expected.unit3.pushesLength;
    
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        unit1: {
          currentSymbol: state.unit1.currentSymbol,
          carry: state.unit1.carry,
          hasCollapsed: state.unit1.hasCollapsed,
          pushesLength: state.unit1.pushesLength
        },
        unit2: {
          currentSymbol: state.unit2.currentSymbol,
          carry: state.unit2.carry,
          hasCollapsed: state.unit2.hasCollapsed,
          pushesLength: state.unit2.pushesLength
        },
        unit3: {
          currentSymbol: state.unit3.currentSymbol,
          carry: state.unit3.carry,
          hasCollapsed: state.unit3.hasCollapsed,
          pushesLength: state.unit3.pushesLength
        }
      })}, Expected: ${JSON.stringify(test.expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});