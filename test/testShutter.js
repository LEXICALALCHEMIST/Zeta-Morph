import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PullModule from '../MorphLogic/PullModule.js';
import { Shutter } from '../MorphLogic/shutter.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - SHUTTER TEST');

async function runTests() {
  console.log('Starting Shutter Test');
  
  try {
    // Test: Mid-Morph Snapshot After PULL 1000
    console.log('Test: Mid-Morph Snapshot After PULL 1000');
    
    // Initialize skeleton with a starting value
    const skeleton = new SkeletonInitializer();
    const initialValue = 38287; // Starting value
    await skeleton.set(initialValue, false); // Pull operation
    console.log(`Skeleton initialized with value: ${initialValue}`);
    
    // Perform a pull operation
    const pullValue = 1000;
    const pullModule = new PullModule(skeleton);
    const state = await pullModule.pull(pullValue);
    
    // Verify the mid-morph snapshot (state should already be snapped by PullModule)
    const expectedValue = Math.max(initialValue - pullValue, 0); // 38287 - 1000 = 37287
    const expectedState = {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[3] },  // U1: □ (3)
        { currentSymbol: SYMBOL_SEQUENCE[7] },  // U2: ¥ (7)
        { currentSymbol: SYMBOL_SEQUENCE[2] },  // U3: ○ (2)
        { currentSymbol: SYMBOL_SEQUENCE[8] },  // U4: ◙ (8)
        { currentSymbol: SYMBOL_SEQUENCE[7] },  // U5: ¥ (7)
        { currentSymbol: VOID_SYMBOL },         // U6: ⊙
        { currentSymbol: VOID_SYMBOL },         // U7: ⊙
        { currentSymbol: VOID_SYMBOL },         // U8: ⊙
        { currentSymbol: VOID_SYMBOL },         // U9: ⊙
        { currentSymbol: VOID_SYMBOL },         // U10: ⊙
        { currentSymbol: VOID_SYMBOL },         // U11: ⊙
        { currentSymbol: VOID_SYMBOL }          // U12: ⊙
      ],
      numberLength: 5,
      activeUnitTarget: 'u5'
    };

    // Calculate the value from the state
    const gotValue = parseInt(state.units.slice(0, state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.currentSymbol)).join('') || '0', 10);
    
    const passed = 
      gotValue === expectedValue &&
      state.units.every((unit, i) => 
        unit.currentSymbol === expectedState.units[i].currentSymbol
      ) &&
      state.numberLength === expectedState.numberLength &&
      state.activeUnitTarget === expectedState.activeUnitTarget;

    console.log(`Expected Value: ${expectedValue}, Got: ${gotValue}`);
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Got ${JSON.stringify({
        units: state.units.map(unit => ({ currentSymbol: unit.currentSymbol })),
        numberLength: state.numberLength,
        activeUnitTarget: state.activeUnitTarget
      })}, Expected: ${JSON.stringify(expectedState)}`);
    }

  } catch (error) {
    console.error('Test Failed:', error.message);
  }
  console.log('Test Complete');
}

runTests();