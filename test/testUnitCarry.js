import Unit1 from '../skeleton/unit1.js';
import Unit2 from '../skeleton/unit2.js';
import Unit3 from '../skeleton/unit3.js';
import CarryBus from '../core/carryBus.js';
import SetSkeleton from '../MorphLogic/setSkeleton.js';
import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import Add from '../MorphLogic/add.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Unit Carry Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 100 and add 11 to get 111',
    setup: { number: 100 },
    action: { number: 11 },
    expected: {
      unit1: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 0 },
      unit2: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 1 },
      unit3: { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 1 },
      numberLength: 3,
      activeUnitTarget: 'u3'
    }
  }
];

tests.forEach((test, index) => {
  console.log(`Test Case ${index + 1}: ${test.description}`);
  try {
    const setSkeleton = new SetSkeleton();
    const keyMaker = new KeyMaker();
    const shiftKey = new ShiftKey();
    const add = new Add(setSkeleton);

    // Set initial skeleton
    setSkeleton.set(test.setup.number);
    let state = setSkeleton.getState();
    console.log(`Initial Skeleton: <${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);

    // Decompose and apply second number
    const key = keyMaker.makeKey(test.action.number);
    const shiftedKey = shiftKey.shift(key, state.numberLength);
    state = add.add(test.action.number, shiftedKey);

    // Log final state
    const skeleton = `<${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`;
    console.log(`Final Skeleton: ${skeleton}`);
    console.log('Result:', {
      unit1: { currentSymbol: state.unit1.currentSymbol, carry: state.unit1.carry, hasCollapsed: state.unit1.hasCollapsed, pushesLength: state.unit1.pushesLength },
      unit2: { currentSymbol: state.unit2.currentSymbol, carry: state.unit2.carry, hasCollapsed: state.unit2.hasCollapsed, pushesLength: state.unit2.pushesLength },
      unit3: { currentSymbol: state.unit3.currentSymbol, carry: state.unit3.carry, hasCollapsed: state.unit3.hasCollapsed, pushesLength: state.unit3.pushesLength },
      numberLength: state.numberLength,
      activeUnitTarget: state.activeUnitTarget
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
      state.unit3.pushesLength === test.expected.unit3.pushesLength &&
      state.numberLength === test.expected.numberLength &&
      state.activeUnitTarget === test.expected.activeUnitTarget;

    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        unit1: { currentSymbol: state.unit1.currentSymbol, carry: state.unit1.carry, hasCollapsed: state.unit1.hasCollapsed, pushesLength: state.unit1.pushesLength },
        unit2: { currentSymbol: state.unit2.currentSymbol, carry: state.unit2.carry, hasCollapsed: state.unit2.hasCollapsed, pushesLength: state.unit2.pushesLength },
        unit3: { currentSymbol: state.unit3.currentSymbol, carry: state.unit3.carry, hasCollapsed: state.unit3.hasCollapsed, pushesLength: state.unit3.pushesLength },
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      })}, Expected: ${JSON.stringify(test.expected)}`);
    }
  } catch (error) {
    console.error(`Test Case ${index + 1} failed:`, error.message);
  }
  console.log('---');
});