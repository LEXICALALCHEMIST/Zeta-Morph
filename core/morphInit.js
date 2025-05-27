import SetSkeleton from '../MorphLogic/setSkeleton.js';
import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from './sacred9.js';

export async function morphInit(newNumber, currentSkeletonNumber) {
  console.log(`morphInit(${newNumber}, ${currentSkeletonNumber})`);
  
  const newNumberLength = newNumber.toString().length;
  const currentSkeletonLength = currentSkeletonNumber.toString().length;
  
  let setNumber, keyNumber;
  
  // Compare lengths to decide skeleton and key
  if (newNumberLength > currentSkeletonLength) {
    setNumber = newNumber; // Larger number for skeleton
    keyNumber = currentSkeletonNumber; // Smaller number for key
  } else {
    setNumber = currentSkeletonNumber; // Keep current skeleton
    keyNumber = newNumber; // New number for key
  }
  
  // Set skeleton
  const skeleton = new SetSkeleton();
  await skeleton.set(setNumber);
  
  // Generate and shift key
  const keyMaker = new KeyMaker();
  const tempKey = keyMaker.makeKey(keyNumber);
  const shiftKey = new ShiftKey();
  const shiftedKey = shiftKey.shift(tempKey, skeleton.numberLength);
  
  // Log results
  const skeletonState = skeleton.getState();
  const skeletonDisplay = `<${skeletonState.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${skeletonState.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊉⊉⊉>`;
  console.log(`morphInit: ${newNumber} length ${newNumberLength}, ${currentSkeletonNumber} length ${currentSkeletonLength}: if current is < new number ${newNumber}, set skeleton for: ${setNumber}, genKEY for: ${keyNumber}, new skeleton: ${skeletonDisplay}, new key: ${JSON.stringify(shiftedKey)}`);
  
  return { skeleton, key: shiftedKey };
}