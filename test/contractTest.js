import SetSkeleton from '../MorphLogic/setSkeleton.js';
import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import Pull from '../MorphLogic/pull.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Contract Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 100 and pull 1 to reach 99',
    operation: { a: 100, b: 1 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[9], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[9], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
      ],
      numberLength: 2,
      activeUnitTarget: 'u2'
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
      
      const setState = await setSkeleton.set(test.operation.a);
      const setLength = test.operation.a.toString().length;
      let state = setState;
      console.log(`Set State: ${JSON.stringify({
        units: state.units.map(u => u.currentSymbol),
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      })}`);
      let skeleton = `<${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`;
      console.log(`Initial Skeleton: ${skeleton}`);
      
      const originalKey = keyMaker.makeKey(test.operation.b);
      console.log(`Original Key: ${JSON.stringify(originalKey)}`);
      const shiftedKey = shiftKey.shift(originalKey, setLength);
      console.log(`Shifted Key: ${JSON.stringify(shiftedKey)}`);
      
      console.log('Initiating PULL operation');
      state = pull.pull(test.operation.b, shiftedKey);
      console.log(`Post-Pull State: ${JSON.stringify({
        units: state.units.map(u => u.currentSymbol),
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      })}`);
      
      skeleton = `<${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`;
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