import { SendCube } from '../MORPHCUBE/sCUBE.js';
import weaver from '../utils/weaver.js';

console.log('Starting SendCube Test');

async function runTests() {
  try {
    // Reset Weaver POM for clean test
    weaver.reset();

    // Test user with initial skeleton of 100
    const user = { id: 'usera', currentSKEL: 100 };
    const sendCube = new SendCube(user);

    // Simulate sending 50 LSD
    const morphOp = {
      INTENT: 'PUSH',
      VALUE: 50,
      morphId: 'test-morph-id-123', // Placeholder morphId
      targetId: 'testTarget' // Placeholder target
    };

    console.log(`Test: Sending 50 LSD from skeleton ${user.currentSKEL}`);
    const result = await sendCube.processMorphOps(morphOp);

    // Verify results
    const expectedSKEL = 50; // 100 - 50
    const passed = result.currentSKEL === expectedSKEL;
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    console.log(`Current SKEL: ${result.currentSKEL}, Expected: ${expectedSKEL}`);
    console.log(`New Skeleton JSON: ${result.newSkeletonJson}`);
    console.log(`Packaged MorphOp: ${JSON.stringify(result.packagedMorphOp, null, 2)}`);
    console.log(`POM: ${JSON.stringify(result.pom, null, 2)}`);

    if (!passed) {
      console.log(`Mismatch: Expected skeleton ${expectedSKEL}, got ${result.currentSKEL}`);
    }
  } catch (error) {
    console.error('Test Failed:', error.message);
  } finally {
    console.log('Test Complete');
  }
}

// Run the tests
runTests();