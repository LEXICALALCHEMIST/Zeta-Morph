import SetSkeleton from '../MorphLogic/setSkeleton.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Set Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 100,000',
    number: 100000,
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 }
      ],
      numberLength: 6,
      activeUnitTarget: 'u6'
    }
  },
  {
    description: 'Set skeleton to 555,555',
    number: 555555,
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 }
      ],
      numberLength: 6,
      activeUnitTarget: 'u6'
    }
  },
  {
    description: 'Set skeleton to 2,846',
    number: 2846,
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[2], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[8], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[4], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[6], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
      ],
      numberLength: 4,
      activeUnitTarget: 'u4'
    }
  }
];

console.log('Test suite initialized, running tests...');

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log('Starting skeleton set');
      
      const setSkeleton = new SetSkeleton();
      
      const state = await setSkeleton.set(test.number);
      
      const skeleton = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
      console.log(`Final Skeleton: ${skeleton}`);
      
      console.log('Result:', {
        units: state.units.map(unit => ({
          currentSymbol: unit.currentSymbol,
          carry: unit.carry,
          hasCollapsed: unit.hasCollapsed,
          pushesLength: unit.pushesLength
        })),
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      });
      console.log('Expected:', test.expected);
      
      const passed = 
        state.units.every((unit, i) => 
          unit.currentSymbol === test.expected.units[i].currentSymbol &&
          unit.carry === test.expected.units[i].carry &&
          unit.hasCollapsed === test.expected.units[i].hasCollapsed &&
          unit.pushesLength === test.expected.units[i].pushesLength
        ) &&
        state.numberLength === test.expected.numberLength &&
        state.activeUnitTarget === test.expected.activeUnitTarget;
      
      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`Mismatch: Got ${JSON.stringify({
          units: state.units.map(unit => ({
            currentSymbol: unit.currentSymbol,
            carry: unit.carry,
            hasCollapsed: unit.hasCollapsed,
            pushesLength: unit.pushesLength
          })),
          numberLength: state.numberLength,
          activeUnitTarget: state.activeUnitTarget
        })}, Expected: ${JSON.stringify(test.expected)}`);
      }
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();