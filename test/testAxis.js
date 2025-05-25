// testAxisCarry.js
// Located in ZetaMorph/test/

import Axis1 from '../skeleton/axis/axis1.js';
import Axis2 from '../skeleton/axis/axis2.js';
import CarryBus from '../core/carryBus.js';
import { SYMBOL_SEQUENCE } from '../core/sacred9.js';

console.log('--- ZLME Axis Carry Test Suite ---');

const tests = [
  {
    description: 'Push Axis1 10 times to collapse and carry to Axis2',
    pushes: 10,
    expected: {
      axis1: { symbol: '*', carry: 1, hasCollapsed: true, pushesLength: 0 },
      axis2: { symbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 1 }
    }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  
  try {
    const axis1 = new Axis1();
    const axis2 = new Axis2();
    const carryBus = new CarryBus();
    
    // Push Axis1 one at a time to simulate 10–19
    for (let i = 0; i < test.pushes; i++) {
      axis1.push(1, carryBus);
      if (carryBus.carryValue > 0) {
        const { carryValue, carryTarget } = carryBus.flushCarry();
        if (carryTarget === 'Axis2') {
          axis2.push(carryValue, carryBus);
          console.log(`Carry applied to Axis2: ${carryValue}`); // Debug log
        }
      }
    }
    
    const axis1State = axis1.getState();
    const axis2State = axis2.getState();
    
    console.log('Result:', {
      axis1: {
        symbol: axis1State.currentSymbol,
        carry: axis1State.carry,
        hasCollapsed: axis1State.hasCollapsed,
        pushesLength: axis1State.pushes.length
      },
      axis2: {
        symbol: axis2State.currentSymbol,
        carry: axis2State.carry,
        hasCollapsed: axis2State.hasCollapsed,
        pushesLength: axis2State.pushes.length
      }
    });
    console.log('Expected:', test.expected);
    
    const passed = 
      axis1State.currentSymbol === test.expected.axis1.symbol &&
      axis1State.carry === test.expected.axis1.carry &&
      axis1State.hasCollapsed === test.expected.axis1.hasCollapsed &&
      axis1State.pushes.length === test.expected.axis1.pushesLength &&
      axis2State.currentSymbol === test.expected.axis2.symbol &&
      axis2State.carry === test.expected.axis2.carry &&
      axis2State.hasCollapsed === test.expected.axis2.hasCollapsed &&
      axis2State.pushes.length === test.expected.axis2.pushesLength;
    
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        axis1: {
          symbol: axis1State.currentSymbol,
          carry: axis1State.carry,
          hasCollapsed: axis1State.hasCollapsed,
          pushesLength: axis1State.pushes.length
        },
        axis2: {
          symbol: axis2State.currentSymbol,
          carry: axis2State.carry,
          hasCollapsed: axis2State.hasCollapsed,
          pushesLength: axis2State.pushes.length
        }
      })}, Expected ${JSON.stringify(test.expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});