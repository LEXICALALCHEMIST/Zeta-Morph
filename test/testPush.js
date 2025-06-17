import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PushModule from '../MorphLogic/PushModule.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';
import weaver from '../utils/weaver.js';

console.log('NUEROM PROTOCOL - PUSH TEST');

const tests = [
  {
    description: 'Set skeleton to 500 and push 50 (with carry propagation)',
    operation: { initialSkeleton: 500, pushValue: 50 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[5] },  // U1: ■ (5)
        { currentSymbol: SYMBOL_SEQUENCE[5] },  // U2: ■ (5)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U3: ⚙ (0)
        { currentSymbol: VOID_SYMBOL },         // U4: ⊙
        { currentSymbol: VOID_SYMBOL },         // U5: ⊙
        { currentSymbol: VOID_SYMBOL },         // U6: ⊙
        { currentSymbol: VOID_SYMBOL },         // U7: ⊙
        { currentSymbol: VOID_SYMBOL },         // U8: ⊙
        { currentSymbol: VOID_SYMBOL },         // U9: ⊙
        { currentSymbol: VOID_SYMBOL },         // U10: ⊙
        { currentSymbol: VOID_SYMBOL },         // U11: ⊙
        { currentSymbol: VOID_SYMBOL }          // U12: ⊙
      ],
      numberLength: 3,
      activeUnitTarget: 'u3'
    }
  },
  {
    description: 'Set skeleton to 5059 and push 12 (test carry propagation, no expansion)',
    operation: { initialSkeleton: 5059, pushValue: 12 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[5] },  // U1: ■ (5)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U2: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[7] },  // U3: ¥ (7)
        { currentSymbol: SYMBOL_SEQUENCE[1] },  // U4: ● (1)
        { currentSymbol: VOID_SYMBOL },         // U5: ⊙
        { currentSymbol: VOID_SYMBOL },         // U6: ⊙
        { currentSymbol: VOID_SYMBOL },         // U7: ⊙
        { currentSymbol: VOID_SYMBOL },         // U8: ⊙
        { currentSymbol: VOID_SYMBOL },         // U9: ⊙
        { currentSymbol: VOID_SYMBOL },         // U10: ⊙
        { currentSymbol: VOID_SYMBOL },         // U11: ⊙
        { currentSymbol: VOID_SYMBOL }          // U12: ⊙
      ],
      numberLength: 4,
      activeUnitTarget: 'u4'
    }
  },
  {
    description: 'Set skeleton to 99 and push 1 (test U1 snapshot expansion)',
    operation: { initialSkeleton: 99, pushValue: 1 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[1] },  // U1: ● (1)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U2: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U3: ⚙ (0)
        { currentSymbol: VOID_SYMBOL },         // U4: ⊙
        { currentSymbol: VOID_SYMBOL },         // U5: ⊙
        { currentSymbol: VOID_SYMBOL },         // U6: ⊙
        { currentSymbol: VOID_SYMBOL },         // U7: ⊙
        { currentSymbol: VOID_SYMBOL },         // U8: ⊙
        { currentSymbol: VOID_SYMBOL },         // U9: ⊙
        { currentSymbol: VOID_SYMBOL },         // U10: ⊙
        { currentSymbol: VOID_SYMBOL },         // U11: ⊙
        { currentSymbol: VOID_SYMBOL }          // U12: ⊙
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
      // Reset Weaver POM for this test case
      weaver.reset();
      
      console.log('Starting push operation');
      
      // Initialize skeleton
      const skeleton = new SkeletonInitializer();
      await skeleton.set(test.operation.initialSkeleton, true); // Push operation
      
      // Apply push
      const pushModule = new PushModule(skeleton);
      const state = await pushModule.push(test.operation.pushValue);
      
      // Assert expected state
      const passed = 
        state.units.every((unit, i) => 
          unit.currentSymbol === test.expected.units[i].currentSymbol
        ) &&
        state.numberLength === test.expected.numberLength &&
        state.activeUnitTarget === test.expected.activeUnitTarget;
      
      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`Mismatch: Got ${JSON.stringify({
          units: state.units.map(unit => ({ currentSymbol: unit.currentSymbol })),
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