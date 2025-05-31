import { receive } from '../ZTRL/receive.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - RECEIVE TEST');

const tests = [
  {
    description: 'Receive PUSH 5 with valid MORPH PIN',
    input: 'MORPHCODE: Intent: PUSH, value: 5, MORPHPIN: ◇◇●●',
    expectedState: {
      units: [
        { currentSymbol: SYMBOL_SEQUENCE[5] },  // U1: ■ (5)
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
      // Receive and process the morph code
      const state = await receive(test.input);
      
      // Assert the resulting state matches the expected state
      const passed = 
        state.units.every((unit, i) => 
          unit.currentSymbol === test.expectedState.units[i].currentSymbol
        ) &&
        state.numberLength === test.expectedState.numberLength &&
        state.activeUnitTarget === test.expectedState.activeUnitTarget;
      
      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`Mismatch: Got ${JSON.stringify({
          units: state.units.map(unit => ({ currentSymbol: unit.currentSymbol })),
          numberLength: state.numberLength,
          activeUnitTarget: state.activeUnitTarget
        })}, Expected: ${JSON.stringify(test.expectedState)}`);
      }
      
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();