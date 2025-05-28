import SetSkeleton from '../MorphLogic/setSkeleton.js';
import Pull from '../MorphLogic/pull.js';
import { morphInit } from '../core/morphInit.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('NUEROM PROTOCOL - SNAP PULL TEST KIT');

const tests = [
  {
    description: 'Subtract 1 LSD from skeleton 100, expect 99 using pull',
    operation: { currentSkeleton: 100, subtract: 1 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[9], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[9], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
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
      
      // Initialize skeleton with pull units
      const { skeleton, key } = await morphInit(test.operation.subtract, test.operation.currentSkeleton, 'pull');
      await skeleton.set(test.operation.currentSkeleton);
      const setState = skeleton.getState();
      const initialSkeleton = `<${setState.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${setState.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
      console.log(`Skeleton: ${initialSkeleton}`);
      
      // Apply subtraction
      const pull = new Pull(skeleton);
      const state = await pull.pull(test.operation.subtract);
      
      const skeletonDisplay = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
      console.log(`Final Skeleton: ${skeletonDisplay}`);
      
      console.log('Result:', {
        units: state.units.map(unit => ({
          currentSymbol: unit.currentSymbol,
          carry: unit.carry,
          hasCollapsed: unit.hasCollapsed,
          pushesLength: unit.pushesLength || 0
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
          (unit.pushesLength || 0) === test.expected.units[i].pushesLength
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
            pushesLength: unit.pushesLength || 0
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