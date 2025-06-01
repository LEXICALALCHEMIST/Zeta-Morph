import { userDummy } from '../userTest/userDummy.js';
import { testDummy2 } from '../userTest/userDummy2.js';
import { Cube } from '../MORPHCUBE/cube.js';
import { send } from '../ZTRL/send.js';
import { SYMBOL_SEQUENCE } from '../core/SacredSymbols.js';

console.log('NUEROM PROTOCOL - CUBE TEST');

async function runTests() {
  console.log('Starting Cube Test');

  try {
    // Test: Simulate a send transaction - userA sends 300 to userB
    console.log('Test: Send Transaction - userA sends 300 to userB');

    // Step 1: Use ZTRL/send.js directly to handle the send operation for userA (userDummy)
    const initialSenderSKEL = userDummy.currentSKEL; // 38287
    const sendValue = 300;
    console.log(`Sender (userA) initial skeleton value: ${initialSenderSKEL}`);

    const sendObject = {
      intent: 'PUSH',
      value: sendValue,
      morphPin: '◇◇●●',
      target: 'Dummy2'
    };

    const { morphOp, newSkeletonJson: senderNewSkeletonJson } = await send(sendObject, userDummy.currentSKEL);

    // Verify sender's updated skeleton
    const senderNewSkeleton = JSON.parse(senderNewSkeletonJson);
    const senderNewValue = parseInt(senderNewSkeleton.units.slice(0, senderNewSkeleton.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.currentSymbol)).join('') || '0', 10);
    const expectedSenderValue = initialSenderSKEL - sendValue; // 38287 - 300 = 37987
    userDummy.currentSKEL = senderNewValue; // Update userDummy's currentSKEL
    console.log(`Sender (userA) updated skeleton value: ${senderNewValue}, Expected: ${expectedSenderValue}`);

    // Step 2: Create Cube for userB (testDummy2) and receive 300
    const receiverCube = new Cube(testDummy2);
    const initialReceiverSKEL = testDummy2.currentSKEL; // 45678
    console.log(`Receiver (userB) initial skeleton value: ${initialReceiverSKEL}`);

    const receiverNewSkeletonJson = await receiverCube.receiveRequest(sendValue, '◇◇●●');

    // Verify receiver's updated skeleton
    const receiverNewSkeleton = JSON.parse(receiverNewSkeletonJson);
    const receiverNewValue = parseInt(receiverNewSkeleton.units.slice(0, receiverNewSkeleton.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.currentSymbol)).join('') || '0', 10);
    const expectedReceiverValue = initialReceiverSKEL + sendValue; // 45678 + 300 = 45978
    console.log(`Receiver (userB) updated skeleton value: ${receiverNewValue}, Expected: ${expectedReceiverValue}`);
    console.log('Receiver New Skeleton JSON:', receiverNewSkeletonJson);

    // Verify the transaction
    const passed =
      morphOp.INTENT === 'PUSH' &&
      morphOp.VALUE === sendValue &&
      senderNewValue === expectedSenderValue &&
      receiverNewValue === expectedReceiverValue;

    console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
    if (!passed) {
      console.log(`Mismatch: Expected morphOp: { INTENT: "PUSH", VALUE: ${sendValue} }, Sender Value: ${expectedSenderValue}, Receiver Value: ${expectedReceiverValue}, Got: morphOp: ${JSON.stringify(morphOp)}, Sender Value: ${senderNewValue}, Receiver Value: ${receiverNewValue}`);
    }

    // Return the newSkeletonJson for userB's local update
    return receiverNewSkeletonJson;

  } catch (error) {
    console.error('Test Failed:', error.message);
    throw error;
  } finally {
    console.log('Test Complete');
  }
}

// Run the tests and log the result
runTests().then(receiverNewSkeletonJson => {
  console.log('Final Output - Receiver New Skeleton JSON for Local Update:', receiverNewSkeletonJson);
}).catch(error => {
  console.error('Test Run Failed:', error.message);
});