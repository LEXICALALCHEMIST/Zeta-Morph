// testExpand.js
// Located in ZetaMorph/test/

import SetSkeleton from '../MorphLogic/setSkeleton.js';
import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import Add from '../MorphLogic/add.js';
import { SYMBOL_SEQUENCE } from '../core/sacred9.js';

console.log('--- ZLME Expand Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 99 and stack 1 to reach 100',
    operation: { a: 99, b: 1 }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  
  try {
    // Define expected inside test case with hardcoded ⊙
    const expected = {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit2: { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit3: { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
      numberLength: 3,
      activeUnitTarget: 'u3'
    };
    
    console.log('Starting skeleton set');
    
    const setSkeleton = new SetSkeleton();
    const keyMaker = new KeyMaker();
    const shiftKey = new ShiftKey();
    const add = new Add(setSkeleton);
    
    // Set initial skeleton
    const setState = setSkeleton.set(test.operation.a);
    const setLength = test.operation.a.toString().length;
    let state = setState;
    let skeleton = `<${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`;
    console.log(`Initial Skeleton: ${skeleton}`);
    
    // Generate and shift key
    const originalKey = keyMaker.makeKey(test.operation.b);
    const shiftedKey = shiftKey.shift(originalKey, setLength);
    
    // Apply shifted key
    state = add.add(test.operation.b, shiftedKey);
    
    // Log final skeleton
    skeleton = `<${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`;
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
      },
      numberLength: state.numberLength,
      activeUnitTarget: state.activeUnitTarget
    });
    console.log('Expected:', expected);
    
    const passed = 
      state.unit1.currentSymbol === expected.unit1.currentSymbol &&
      state.unit1.carry === expected.unit1.carry &&
      state.unit1.hasCollapsed === expected.unit1.hasCollapsed &&
      state.unit1.pushesLength === expected.unit1.pushesLength &&
      state.unit2.currentSymbol === expected.unit2.currentSymbol &&
      state.unit2.carry === expected.unit2.carry &&
      state.unit2.hasCollapsed === expected.unit2.hasCollapsed &&
      state.unit2.pushesLength === expected.unit2.pushesLength &&
      state.unit3.currentSymbol === expected.unit3.currentSymbol &&
      state.unit3.carry === expected.unit3.carry &&
      state.unit3.hasCollapsed === expected.unit3.hasCollapsed &&
      state.unit3.pushesLength === expected.unit3.pushesLength &&
      state.numberLength === expected.numberLength &&
      state.activeUnitTarget === expected.activeUnitTarget;
    
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
        },
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      })}, Expected: ${JSON.stringify(expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});