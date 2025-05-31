import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PushModule from '../MorphLogic/PushModule.js';
import PullModule from '../MorphLogic/PullModule.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - INTENT TEST');

const tests = [
  {
    description: 'Set skeleton to 5 and push 2 (test push module loading)',
    operation: { initialSkeleton: 5, pushValue: 2, type: 'push' },
    expected: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[7] },  // U1: ¥ (7)
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
    description: 'Set skeleton to 9 and pull 3 (test pull module loading)',
    operation: { initialSkeleton: 9, pullValue: 3, type: 'pull' },
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
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log(`Starting ${test.operation.type} operation`);
      
      // Initialize skeleton based on operation type
      const skeleton = new SkeletonInitializer();
      await skeleton.set(test.operation.initialSkeleton, test.operation.type === 'push');
      
      // Apply push or pull operation
      let state;
      if (test.operation.type === 'push') {
        const pushModule = new PushModule(skeleton);
        console.log('Push module loaded');
        state = await pushModule.push(test.operation.pushValue);
      } else {
        const pullModule = new PullModule(skeleton);
        console.log('Pull module loaded');
        state = await pullModule.pull(test.operation.pullValue);
      }
      
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