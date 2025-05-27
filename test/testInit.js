import { morphInit } from '../core/morphInit.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME MorphInit Test Suite ---');

const tests = [
  {
    description: 'morphInit with new number 100 and current skeleton 50',
    operation: { newNumber: 100, currentSkeletonNumber: 50 },
    expected: {
      skeletonState: {
        units: [
          { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 0 },
          { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
          { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
          { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
          { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
          { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
        ],
        numberLength: 3,
        activeUnitTarget: 'u3'
      },
      key: {
        number: 50,
        length: 2,
        targetLength: 3,
        push: ['U1:null', 'U2:5', 'U3:0'],
        view: ['⊙', '■', '⚙'],
        targetUnit: 'u3'
      }
    }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      const { skeleton, key } = await morphInit(test.operation.newNumber, test.operation.currentSkeletonNumber);
      const state = skeleton.getState();
      
      const skeletonDisplay = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊉⊉⊉>`;
      console.log(`Final Skeleton: ${skeletonDisplay}`);
      console.log(`Final Key: ${JSON.stringify(key)}`);
      
      console.log('Result:', {
        skeletonState: {
          units: state.units.map(unit => ({
            currentSymbol: unit.currentSymbol,
            carry: unit.carry,
            hasCollapsed: unit.hasCollapsed,
            pushesLength: unit.pushesLength
          })),
          numberLength: state.numberLength,
          activeUnitTarget: state.activeUnitTarget
        },
        key
      });
      console.log('Expected:', test.expected);
      
      const passed = 
        state.units.every((unit, i) => 
          unit.currentSymbol === test.expected.skeletonState.units[i].currentSymbol &&
          unit.carry === test.expected.skeletonState.units[i].carry &&
          unit.hasCollapsed === test.expected.skeletonState.units[i].hasCollapsed &&
          unit.pushesLength === test.expected.skeletonState.units[i].pushesLength
        ) &&
        state.numberLength === test.expected.skeletonState.numberLength &&
        state.activeUnitTarget === test.expected.skeletonState.activeUnitTarget &&
        key.number === test.expected.key.number &&
        key.length === test.expected.key.length &&
        key.targetLength === test.expected.key.targetLength &&
        key.push.every((p, i) => p === test.expected.key.push[i]) &&
        key.view.every((v, i) => v === test.expected.key.view[i]) &&
        key.targetUnit === test.expected.key.targetUnit;
      
      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`Mismatch: Got ${JSON.stringify({
          skeletonState: {
            units: state.units.map(unit => ({
              currentSymbol: unit.currentSymbol,
              carry: unit.carry,
              hasCollapsed: unit.hasCollapsed,
              pushesLength: unit.pushesLength
            })),
            numberLength: state.numberLength,
            activeUnitTarget: state.activeUnitTarget
          },
          key
        })}, Expected: ${JSON.stringify(test.expected)}`);
      }
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();