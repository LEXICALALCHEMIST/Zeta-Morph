import { ReceiveCube } from '../MORPHCUBE/rCUBE.js';
import weaver from '../utils/weaver.js';
import { SYMBOL_SEQUENCE } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - RECEIVE CUBE TEST');

const tests = [
  {
    description: 'Receive single morphOp - UserB receives 300 LSD',
    user: { id: 'Dummy2', currentSKEL: 45678 },
    morphOps: [{ INTENT: 'PUSH', VALUE: 300, morphId: 'uuid-placeholder' }], // Keep for now
    expected: {
      currentSKEL: 45978,
      numberLength: 5,
      units: ['¤', '■', '▲', '¥', '◇', '⊙', '⊙', '⊙', '⊙', '⊙', '⊙', '⊙']
    }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);

    try {
      weaver.reset();
      const user = { ...test.user };
      const receiverCube = new ReceiveCube(user);
      console.log('Starting receive operation');
      const { currentSKEL, newSkeletonJson, pom } = await receiverCube.processMorphOps(test.morphOps);

      const newSkeleton = JSON.parse(newSkeletonJson);
      const actualUnits = newSkeleton.units.map(u => u.currentSymbol);
      const passed =
        currentSKEL === test.expected.currentSKEL &&
        newSkeleton.numberLength === test.expected.numberLength &&
        actualUnits.length === test.expected.units.length &&
        actualUnits.every((symbol, i) => symbol === test.expected.units[i]) &&
        pom.final?.skeleton === test.expected.currentSKEL &&
        pom.final?.userId === user.id &&
        pom.morphops.length === test.morphOps.length &&
        typeof pom.proofId === 'string' && pom.proofId.length > 0; // Check proofId is UUID

      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      console.log(`Current SKEL: ${currentSKEL}, Expected: ${test.expected.currentSKEL}`);
      console.log(`Number Length: ${newSkeleton.numberLength}, Expected: ${test.expected.numberLength}`);
      console.log(`Units: ${JSON.stringify(actualUnits)}`);
      console.log(`POM: ${JSON.stringify(pom, null, 2)}`);

      if (!passed) {
        console.log(`Mismatch: Expected Units: ${JSON.stringify(test.expected.units)}`);
        console.log(`Debug: actualUnits length: ${actualUnits.length}, expected length: ${test.expected.units.length}`);
      }
    } catch (error) {
      console.error(`Test Case ${index + 1} failed: ${error.message}`);
    }
    console.log('---');
  }
}

runTests().then(() => {
  console.log('All Tests Complete');
}).catch(error => {
  console.error('Test Run Failed:', error.message);
});