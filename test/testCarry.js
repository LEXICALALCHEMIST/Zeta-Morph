import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PushModule from '../MorphLogic/PushModule.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - CARRY TEST');

const tests = [
  {
    description: 'Set skeleton to 190 and push 10 (test carry propagation)',
    operation: { initialSkeleton: 190, pushValue: 10 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[2] },  // U1: ○ (2)
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
  },
  {
    description: 'Set skeleton to 1005 and push 5 (test carry propagation)',
    operation: { initialSkeleton: 1005, pushValue: 5 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[1] },  // U1: ● (1)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U2: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[1] },  // U3: ● (1)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U4: ⚙ (0)
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
    description: 'Set skeleton to 100155 and push 5 (test carry propagation)',
    operation: { initialSkeleton: 100155, pushValue: 5 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[1] },  // U1: ● (1)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U2: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U3: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[1] },  // U4: ● (1)
        { currentSymbol: SYMBOL_SEQUENCE[6] },  // U5: • (6)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U6: ⚙ (0)
        { currentSymbol: VOID_SYMBOL },         // U7: ⊙
        { currentSymbol: VOID_SYMBOL },         // U8: ⊙
        { currentSymbol: VOID_SYMBOL },         // U9: ⊙
        { currentSymbol: VOID_SYMBOL },         // U10: ⊙
        { currentSymbol: VOID_SYMBOL },         // U11: ⊙
        { currentSymbol: VOID_SYMBOL }          // U12: ⊙
      ],
      numberLength: 6,
      activeUnitTarget: 'u6'
    }
  },
  {
    description: 'Set skeleton to 199999 and push 1 (test multiple carry propagation)',
    operation: { initialSkeleton: 199999, pushValue: 1 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[2] },  // U1: ○ (2)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U2: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U3: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U4: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U5: ⚙ (0)
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U6: ⚙ (0)
        { currentSymbol: VOID_SYMBOL },         // U7: ⊙
        { currentSymbol: VOID_SYMBOL },         // U8: ⊙
        { currentSymbol: VOID_SYMBOL },         // U9: ⊙
        { currentSymbol: VOID_SYMBOL },         // U10: ⊙
        { currentSymbol: VOID_SYMBOL },         // U11: ⊙
        { currentSymbol: VOID_SYMBOL }          // U12: ⊙
      ],
      numberLength: 6,
      activeUnitTarget: 'u6'
    }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
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