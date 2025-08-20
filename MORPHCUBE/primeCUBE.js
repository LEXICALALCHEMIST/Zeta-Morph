import { unitOne, unitTwo, unitThree, unitFour, unitFive } from '../skeletonPrime/skeletonPrime.js';
import { morphLock } from '../skeletonPrime/morphicLock/morphLock.js';
import { lengthValidation } from '../MorphLogic/Prime/lengthValidation.js';
import { MorphicPortal } from '../skeletonPrime/morphPortal/mp.js';


const skeleton = {
  unit1: unitOne,
  unit2: unitTwo,
  unit3: unitThree,
  unit4: unitFour,
  unit5: unitFive
};

export function primeCUBE(skeleton) {
  Object.keys(skeleton).forEach(unit => {
    console.log(`${unit}: ${skeleton[unit].symbol} | Locks: ${JSON.stringify(skeleton[unit].morphlocks)}`);
  });

  const factorCut = lengthValidation(skeleton);
  console.log(`factorCut: ${JSON.stringify(factorCut)}`);

  const lockCodes = {
    unitOne: skeleton.unit1.morphlocks,
    unitTwo: skeleton.unit2.morphlocks,
    unitThree: skeleton.unit3.morphlocks,
    unitFour: skeleton.unit4.morphlocks,
    unitFive: skeleton.unit5.morphlocks
  };
  
  morphLock(lockCodes, factorCut);
  MorphicPortal.distributeLockCodes(lockCodes);
}