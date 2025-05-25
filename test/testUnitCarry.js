// testUnitCarry.js
// Located in ZetaMorph/test/

import Unit1 from '../skeleton/unit1.js';
import Unit2 from '../skeleton/unit2.js';
import Unit3 from '../skeleton/unit3.js';
import CarryBus from '../core/carryBus.js';
import Add from '../MorphLogic/add.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Unit Carry Test Suite ---');

const tests = [
  {
    description: 'Push Unit1 9 times to reach 9',
    pushes: { unit1: 9 },
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[9], carry: 0, hasCollapsed: false, pushesLength: 9 },
      unit2: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit3: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
    }
  },
  {
    description: 'Push Unit1 10 times to collapse and carry to Unit2 (10)',
    pushes: { unit1: 10 },
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 1, hasCollapsed: true, pushesLength: 0 },
      unit2: { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 1 },
      unit3: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
    }
  },
  {
    description: 'Start at 30, add 11 to reach 41 using Add',
    operation: { a: 30, b: 11 },
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[4], carry: 0, hasCollapsed: false, pushesLength: 1 },
      unit2: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 1, hasCollapsed: true, pushesLength: 1 },
      unit3: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
    }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  
  try {
    const unit1 = new Unit1();
    const unit2 = new Unit2();
    const unit3 = new Unit3();
    const carryBus = new CarryBus();
    
    // Log initial skeleton
    let unit1State = unit1.getState();
    let unit2State = unit2.getState();
    let unit3State = { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushes: [] };
    console.log(`Initial Skeleton: <${unit1State.currentSymbol}${unit2State.currentSymbol}${unit3State.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
    
    // Handle test case
    if (test.operation) {
      // Test addition using Add
      const add = new Add();
      const result = add.execute(test.operation.a, test.operation.b);
      unit1State = result.unit1;
      unit2State = result.unit2;
      unit3State = result.unit3;
    } else {
      // Original push-based tests
      console.log('Pushing Unit1:');
      for (let i = 0; i < test.pushes.unit1; i++) {
        unit1.push(1, carryBus);
        unit1State = unit1.getState();
        unit2State = unit2.getState();
        console.log(`Unit1 Push ${i + 1}: <${unit1State.currentSymbol}${unit2State.currentSymbol}${unit3State.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
        if (carryBus.carryValue > 0) {
          const { carryValue, carryTarget } = carryBus.flushCarry();
          if (carryTarget === 'Unit2') {
            unit2.push(carryValue, carryBus);
            unit2State = unit2.getState();
            console.log(`Carry applied to Unit2: ${carryValue}, Skeleton: <${unit1State.currentSymbol}${unit2State.currentSymbol}${unit3State.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
          }
        }
      }
    }
    
    const skeleton = `<${unit1State.currentSymbol}${unit2State.currentSymbol}${unit3State.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`;
    console.log(`Final Skeleton: ${skeleton}`);
    
    console.log('Result:', {
      unit1: {
        currentSymbol: unit1State.currentSymbol,
        carry: unit1State.carry,
        hasCollapsed: unit1State.hasCollapsed,
        pushesLength: unit1State.pushesLength
      },
      unit2: {
        currentSymbol: unit2State.currentSymbol,
        carry: unit2State.carry,
        hasCollapsed: unit2State.hasCollapsed,
        pushesLength: unit2State.pushesLength
      },
      unit3: {
        currentSymbol: unit3State.currentSymbol,
        carry: unit3State.carry,
        hasCollapsed: unit3State.hasCollapsed,
        pushesLength: unit3State.pushesLength
      }
    });
    console.log('Expected:', test.expected);
    
    const passed = 
      unit1State.currentSymbol === test.expected.unit1.currentSymbol &&
      unit1State.carry === test.expected.unit1.carry &&
      unit1State.hasCollapsed === test.expected.unit1.hasCollapsed &&
      unit1State.pushesLength === test.expected.unit1.pushesLength &&
      unit2State.currentSymbol === test.expected.unit2.currentSymbol &&
      unit2State.carry === test.expected.unit2.carry &&
      unit2State.hasCollapsed === test.expected.unit2.hasCollapsed &&
      unit2State.pushesLength === test.expected.unit2.pushesLength &&
      unit3State.currentSymbol === test.expected.unit3.currentSymbol &&
      unit3State.carry === test.expected.unit3.carry &&
      unit3State.hasCollapsed === test.expected.unit3.hasCollapsed &&
      unit3State.pushesLength === test.expected.unit3.pushesLength;
    
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        unit1: {
          currentSymbol: unit1State.currentSymbol,
          carry: unit1State.carry,
          hasCollapsed: unit1State.hasCollapsed,
          pushesLength: unit1State.pushesLength
        },
        unit2: {
          currentSymbol: unit2State.currentSymbol,
          carry: unit2State.carry,
          hasCollapsed: unit2State.hasCollapsed,
          pushesLength: unit2State.pushesLength
        },
        unit3: {
          currentSymbol: unit3State.currentSymbol,
          carry: unit3State.carry,
          hasCollapsed: unit3State.hasCollapsed,
          pushesLength: unit3State.pushesLength
        }
      })}, Expected: ${JSON.stringify(test.expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});