import { userDummy } from '../userTest/userDummy.js';
import { testDummy2 } from '../userTest/userDummy2.js';
import { receive } from '../ZTRL/receive.js';

console.log('NUEROM PROTOCOL - RECEIVE TEST');

async function runTests() {
  console.log('Starting Receive Test');
  
  try {
    // Test: Receive a send object with a random value of 300
    console.log('Test: Receiving Send Object - PUSH 300');
    
    // Define the send object
    const sendObject = {
      intent: 'PUSH',
      value: 300,
      morphPin: '◇◇●●',
      target: 'Dummy2'
    };
    
    // Log the reception of the send object
    console.log('Received Send Object:', sendObject);
    
    // Call receive.js to validate the send object and get the morphOp
    const morphOp = await receive(sendObject);
    
    // Log the morphOp
    console.log(`MorphOp: { INTENT: "${morphOp.INTENT}", VALUE: ${morphOp.VALUE} }`);
    
    // Verify the morphOp
    const passed = 
      morphOp.INTENT === 'PUSH' &&
      morphOp.VALUE === 300;
    
    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Expected INTENT: PUSH, VALUE: 300, Got: ${JSON.stringify(morphOp)}`);
    }
    
  } catch (error) {
    console.error('Test Failed:', error.message);
  }
  console.log('Test Complete');
}

runTests();