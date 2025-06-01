import { userDummy } from '../userTest/userDummy.js';
import { testDummy2 } from '../userTest/userDummy2.js';
import { send } from '../ZTRL/send.js';
import { SYMBOL_SEQUENCE } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - SEND TEST');

async function runTests() {
  console.log('Starting Send Test');
  
  try {
    // Test: Simulate UI interaction - click send 300 from userDummy (userA) to testDummy2 (Dummy2)
    console.log('Test: UI Interaction - Sending 300 from userA to Dummy2');
    
    // Define the send object to pass to NEUROM
    const sendObject = {
      intent: 'PUSH', // Intent for the recipient's operation
      value: 300,
      morphPin: '◇◇●●',
      target: 'Dummy2' // Receiver (testDummy2)
    };
    
    // Call send.js to validate the send object and update the skeleton
    const { morphOp, newSkeletonJson } = await send(sendObject, userDummy.currentSKEL);
    
    // Log the morphOp and newSkeletonJson
    console.log(`MorphOp: { INTENT: "${morphOp.INTENT}", VALUE: ${morphOp.VALUE} }`);
    console.log('New Skeleton JSON:', newSkeletonJson);
    
    // Parse the newSkeletonJson to verify the updated skeleton value
    const newSkeleton = JSON.parse(newSkeletonJson);
    const newSkeletonValue = parseInt(newSkeleton.units.slice(0, newSkeleton.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.currentSymbol)).join('') || '0', 10);
    
    // Verify the morphOp and the updated skeleton value
    const expectedSkeletonValue = userDummy.currentSKEL - sendObject.value; // 38287 - 300 = 37987
    const passed = 
      morphOp.INTENT === 'PUSH' &&
      morphOp.VALUE === 300 &&
      newSkeletonValue === expectedSkeletonValue;
    
    console.log(`Updated Skeleton Value: ${newSkeletonValue}, Expected: ${expectedSkeletonValue}`);
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Expected morphOp: { INTENT: "PUSH", VALUE: 300 }, Skeleton Value: ${expectedSkeletonValue}, Got: morphOp: ${JSON.stringify(morphOp)}, Skeleton Value: ${newSkeletonValue}`);
    }
    
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
  console.log('Test Complete');
}

runTests();