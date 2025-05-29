import { morphInit } from '../core/MorphInit.js';

console.log('NUEROM PROTOCOL - MORPH INIT TEST');

const ecosystem = {
  userA: { currentSkeleton: 50 },
  userB: { sendRequest: 500 }
};

const tests = [
  {
    description: 'Set ecosystem with originKey 50, push 500 to verify key/skeleton switch',
    operation: { currentSkeleton: ecosystem.userA.currentSkeleton, sendRequest: ecosystem.userB.sendRequest }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log('new morph : activate');
      console.log(`Ecosystem: ${JSON.stringify(ecosystem)}`);
      
      // Use MorphInit to set skeleton and key
      const { skeleton, key } = await morphInit(test.operation.sendRequest, test.operation.currentSkeleton, true); // Push operation
      
      // Log results
      const skeletonState = skeleton.getState();
      const skeletonDisplay = `<${skeletonState.units.slice(0, 4).map(u => u.currentSymbol).join('')}|${skeletonState.units.slice(4, 8).map(u => u.currentSymbol).join('')}|${skeletonState.units.slice(8, 12).map(u => u.currentSymbol).join('')}>`;
      console.log(`Ecosystem Set!`);
      console.log(`Set Skeleton: ${skeletonDisplay}`);
      console.log(`Key: ${JSON.stringify(key)}`);
      console.log(`sequence: PUSH`);
      console.log(`extensions: pushmoduleloaded`);
      
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();