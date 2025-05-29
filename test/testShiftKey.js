import KeyMaker from '../key/KeyMaker.js';
import ShiftKey from '../key/ShiftKey.js';

console.log('NUEROM PROTOCOL - SHIFT KEY TEST');

const tests = [
  {
    description: 'Shift key for 333 to target length 6',
    operation: { number: 333, targetLength: 6 }
  },
  {
    description: 'Shift key for 303,303 to target length 9',
    operation: { number: 303303, targetLength: 9 }
  },
  {
    description: 'Shift key for 999,999,999 to target length 12',
    operation: { number: 999999999, targetLength: 12 }
  },
  {
    description: 'Shift key for 777,777,888,999 to target length 12',
    operation: { number: 777777888999, targetLength: 12 }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log('Starting key shift');
      
      // Generate key
      const keyMaker = new KeyMaker();
      const key = keyMaker.makeKey(test.operation.number);
      
      // Shift key
      const shiftKey = new ShiftKey();
      const shiftedKey = shiftKey.shift(key, test.operation.targetLength);
      
      // Log the shifted key details
      console.log(`Shifted Key: ${JSON.stringify(shiftedKey)}`);
      
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();