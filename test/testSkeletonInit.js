import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';

console.log('NUEROM PROTOCOL - SKELETON INIT TEST');

const tests = [
  {
    description: 'Set skeleton to 999,999,999,999',
    operation: { number: 999999999999 }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log('Starting skeleton initialization');
      
      // Initialize skeleton
      const skeleton = new SkeletonInitializer();
      await skeleton.set(test.operation.number);
      
      // Log the skeleton state
      const state = skeleton.getState();
      const skeletonDisplay = `<${state.units.slice(0, 4).map(u => u.currentSymbol).join('')}|${state.units.slice(4, 8).map(u => u.currentSymbol).join('')}|${state.units.slice(8, 12).map(u => u.currentSymbol).join('')}>`;
      console.log(`Skeleton: ${skeletonDisplay}`);
      console.log(`Number Length: ${state.numberLength}`);
      console.log(`Active Unit Target: ${state.activeUnitTarget}`);
      
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();