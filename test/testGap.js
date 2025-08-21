import { unitOne, unitTwo, unitThree, unitFour, unitFive } from '../skeletonPrime/skeletonPrime.js';
import { gapLock } from '../skeletonPrime/morphLock/LOCKS/gapLock.js';

// Test 17689
const skeleton17689 = {
  unit1: unitOne,
  unit2: unitTwo,
  unit3: unitThree,
  unit4: unitFour,
  unit5: unitFive
};

console.log('Factor Distance Locks for 17689:', gapLock(skeleton17689));