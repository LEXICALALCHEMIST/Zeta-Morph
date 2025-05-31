import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PullModule from '../MorphLogic/PullModule.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - PULL TEST');

const tests = [
  {
    description: 'Set skeleton to 9 and pull 3 (test pull operation)',
    operation: { initialSkeleton: 9, pullValue: 3 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[6] },  // U1: • (6)
        { currentSymbol: VOID_SYMBOL },         // U2: ⊙
        { currentSymbol: VOID_SYMBOL },         // U3: ⊙
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
      numberLength: 1,
      activeUnitTarget: 'u1'
    }
  },
  {
    description: 'Set skeleton to 3 and pull 9 (test snapshot pull on U1 collapse)',
    operation: { initialSkeleton: 3, pullValue: 9 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[0] },  // U1: ⚙ (0)
        { currentSymbol: VOID_SYMBOL },         // U2: ⊙
        { currentSymbol: VOID_SYMBOL },         // U3: ⊙
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
      numberLength: 1,
      activeUnitTarget: 'u1'
    }
  },
  {
    description: 'Set skeleton to 10 and pull 1 (test contraction on pull)',
    operation: { initialSkeleton: 1001, pullValue: 1 },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[9] },  // U1: ▲ (9)
        { currentSymbol: VOID_SYMBOL },         // U2: ⊙
        { currentSymbol: VOID_SYMBOL },         // U3: ⊙
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
      console.log('Starting pull operation');
      
      // Initialize skeleton for pull operation
      const skeleton = new SkeletonInitializer();
      await skeleton.set(test.operation.initialSkeleton, false); // Pull operation
      
      // Apply pull
      const pullModule = new PullModule(skeleton);
      const state = await pullModule.pull(test.operation.pullValue);
      
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