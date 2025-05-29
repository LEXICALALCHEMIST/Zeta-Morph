import KeyMaker from '../key/KeyMaker.js';

console.log('NUEROM PROTOCOL - KEY MAKER TEST');

const tests = [
  {
    description: 'Generate key for 333',
    operation: { number: 333 }
  },
  {
    description: 'Generate key for 303,303',
    operation: { number: 303303 }
  },
  {
    description: 'Generate key for 999,999,999',
    operation: { number: 999999999 }
  },
  {
    description: 'Generate key for 777,777,888,999',
    operation: { number: 777777888999 }
  }
];

async function runTests() {
  for (let index = 0; index < tests.length; index++) {
    const test = tests[index];
    console.log(`Test Case ${index + 1}: ${test.description}`);
    
    try {
      console.log('Starting key generation');
      
      // Generate key
      const keyMaker = new KeyMaker();
      const key = keyMaker.makeKey(test.operation.number);
      
      // Log the key details
      console.log(`Key: ${JSON.stringify(key)}`);
      
    } catch (error) {
      console.error(`Test Case ${index + 1} failed:`, error.message);
    }
    console.log('---');
  }
}

runTests();