import { unitOne, unitTwo, unitThree, unitFour, unitFive } from '../skeletonPrime/skeletonPrime.js';
import { repetitionLock } from '../skeletonPrime/morphLock/LOCKS/repetitionLock.js';

// Test 17689 (no repetition)
const skeleton17689 = {
  unit1: unitOne,
  unit2: unitTwo,
  unit3: unitThree,
  unit4: unitFour,
  unit5: unitFive
};

console.log('Repetition Locks for 17689:', repetitionLock(skeleton17689));

// Test 11869 (repetition: 1-1)
const skeleton11869 = {
  unit1: { symbol: "1", morphlocks: ["1A"] },
  unit2: { symbol: "1", morphlocks: ["1B"] },
  unit3: { symbol: "8", morphlocks: ["8C"] },
  unit4: { symbol: "6", morphlocks: ["6D"] },
  unit5: { symbol: "9", morphlocks: ["9E"] }
};

console.log('Repetition Locks for 11869:', repetitionLock(skeleton11869));