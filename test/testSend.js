import { send } from '../ZTRL/send.js';

console.log('NUEROM PROTOCOL - SEND TEST');

const tests = [
  {
    description: 'Send number 5 to NUEROM with valid MORPH PIN',
    input: { number: 5, morphPin: '◇◇●●' },
    expectedMorphCode: 'MORPHCODE: Intent: PUSH, value: 5, MORPHPIN: ◇◇●●'
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      // Send the number via ZTRL with MORPH PIN
      const result = send(test.input.number, test.input.morphPin);
      
      // Log the morph code
      console.log(result.morphCode);
      
      // Assert the morph code matches the expected value
      const passed = result.morphCode === test.expectedMorphCode;
      
      console.log(`Result: ${passed ? 'PASS' : 'FAIL'}`);
      if (!passed) {
        console.log(`Mismatch: Got ${result.morphCode}, Expected: ${test.expectedMorphCode}`);
      }
      
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();