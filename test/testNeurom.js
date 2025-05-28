import SetSkeleton from '../MorphLogic/setSkeleton.js';
import { morphInit } from '../core/morphInit.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

console.log('NUEROM PROTOCOL - TEST KIT');

const ecosystem = {
  userA: { currentSkeleton: 50 },
  userB: { sendRequest: 100 }
};

const tests = [
  {
    description: 'Initialize ecosystem with userA skeleton 50 and userB sendRequest 100, verify morphInit sets skeleton to 100 and key for 50',
    operation: { currentSkeleton: ecosystem.userA.currentSkeleton, sendRequest: ecosystem.userB.sendRequest },
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
      console.log('Starting ecosystem initialization');
      
      // Log ecosystem state
      console.log(`Ecosystem: ${JSON.stringify(ecosystem)}`);
      
      // Initialize currentSkeleton for userA
      const currentSkeleton = new SetSkeleton();
      await currentSkeleton.set(test.operation.currentSkeleton);
      const setState = currentSkeleton.getState();
      const initialSkeleton = `<${setState.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${setState.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
      console.log(`userA currentSkeleton: ${initialSkeleton}`);
      
      // Run morphInit with userB sendRequest and userA currentSkeleton
      const { skeleton, key } = await morphInit(test.operation.sendRequest, test.operation.currentSkeleton);
      const state = skeleton.getState();
      
      const skeletonDisplay = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
      console.log(`New Skeleton: ${skeletonDisplay}`);
      console.log(`New Push (Key): ${JSON.stringify(key)}`);
      
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