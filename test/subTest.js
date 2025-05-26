import SetSkeleton from '../MorphLogic/setSkeleton.js';
import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import Pull from '../MorphLogic/pull.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Subtraction Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 9 and pull 3 to reach 6',
    operation: { a: 9, b: 3 },
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[6], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit2: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit3: { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
      numberLength: 1,
      activeUnitTarget: 'u1'
    }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log('Starting skeleton set');
      
      const setSkeleton = new SetSkeleton();
      const keyMaker = new KeyMaker();
      const shiftKey = new ShiftKey();
      const pull = new Pull(setSkeleton);
      
      // Await async set
      const setState = await setSkeleton.set(test.operation.a);
      const setLength = test.operation.a.toString().length;
      let state = setState;
      let skeleton = `<${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`;
      console.log(`Initial Skeleton: ${skeleton}`);
      
      // Generate and shift key
      const originalKey = keyMaker.makeKey(test.operation.b);
      const shiftedKey = shiftKey.shift(originalKey, setLength);
      
      // Apply shifted key with PULL
      state = pull.pull(test.operation.b, shiftedKey);
      
      // Log final skeleton
      skeleton = `<${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`;
      console.log(`Final Skeleton: ${skeleton}`);
      
      console.log('Result:', {
        unit1: {
          currentSymbol: state.units[0].currentSymbol,
          carry: state.units[0].carry,
          hasCollapsed: state.units[0].hasCollapsed,
          pushesLength: state.units[0].pushesLength
        },
        unit2: {
          currentSymbol: state.units[1].currentSymbol,
          carry: state.units[1].carry,
          hasCollapsed: state.units[1].hasCollapsed,
          pushesLength: state.units[1].pushesLength
        },
        unit3: {
          currentSymbol: state.units[2].currentSymbol,
          carry: state.units[2].carry,
          hasCollapsed: state.units[2].hasCollapsed,
          pushesLength: state.units[2].pushesLength
        },
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      });
      console.log('Expected:', test.expected);
      
      const passed = 
        state.units[0].currentSymbol === test.expected.unit1.currentSymbol &&
        state.units[0].carry === test.expected.unit1.carry &&
        state.units[0].hasCollapsed === test.expected.unit1.hasCollapsed &&
        state.units[0].pushesLength === test.expected.unit1.pushesLength &&
        state.units[1].currentSymbol === test.expected.unit2.currentSymbol &&
        state.units[1].carry === test.expected.unit2.carry &&
        state.units[1].hasCollapsed === test.expected.unit2.hasCollapsed &&
        state.units[1].pushesLength === test.expected.unit2.pushesLength &&
        state.units[2].currentSymbol === test.expected.unit3.currentSymbol &&
        state.units[2].carry === test.expected.unit3.carry &&
        state.units[2].hasCollapsed === test.expected.unit3.hasCollapsed &&
        state.units[2].pushesLength === test.expected.unit3.pushesLength &&
        state.numberLength === test.expected.numberLength &&
        state.activeUnitTarget === test.expected.activeUnitTarget;
      
      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`Mismatch: Got ${JSON.stringify({
          unit1: {
            currentSymbol: state.units[0].currentSymbol,
            carry: state.units[0].carry,
            hasCollapsed: state.units[0].hasCollapsed,
            pushesLength: state.units[0].pushesLength
          },
          unit2: {
            currentSymbol: state.units[1].currentSymbol,
            carry: state.units[1].carry,
            hasCollapsed: state.units[1].hasCollapsed,
            pushesLength: state.units[1].pushesLength
          },
          unit3: {
            currentSymbol: state.units[2].currentSymbol,
            carry: state.units[2].carry,
            hasCollapsed: state.units[2].hasCollapsed,
            pushesLength: state.units[2].pushesLength
          },
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