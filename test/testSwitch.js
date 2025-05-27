import SetSkeleton from '../MorphLogic/setSkeleton.js';
import Add from '../MorphLogic/add.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('--- ZLME Add Switch Test Suite ---');

const tests = [
  {
    description: 'Set skeleton to 50 and stack 100 to reach 150 with morphInit',
    operation: { a: 50, b: 100 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[1], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[5], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 },
        { currentSymbol: VOID_SYMBOL, carry: 0, hasCollapsed: false, pushesLength: 0 }
      ],
      numberLength: 3,
      activeUnitTarget: 'u3'
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
      const add = new Add(setSkeleton);
      
      const setState = await setSkeleton.set(test.operation.a);
      const initialSkeleton = `<${setState.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${setState.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊉⊉⊉>`;
      console.log(`Initial Skeleton: ${initialSkeleton}`);
      
      const state = await add.add(test.operation.b);
      
      const skeleton = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊉⊉⊉>`;
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