import SetSkeleton from '../MorphLogic/setSkeleton.js';
import KeyMaker from '../key/keyMaker.js';
import ShiftKey from '../key/shiftKey.js';
import { extendUnits } from '../skeleton/unitExtensions.js';
import { extendUnits2 } from '../skeleton/unitExtensions2.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from './sacred9.js';

export async function morphInit(newNumber, currentSkeletonNumber, transactionType = 'push') {
  console.log(`morphInit(${newNumber}, ${currentSkeletonNumber}, ${transactionType})`);
  
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
  
  // Set skeleton with appropriate unit extensions
  const skeleton = new SetSkeleton();
  if (transactionType === 'push') {
    const units = await extendUnits();
    skeleton.units = [
      new units.Unit1(),
      new units.Unit2(),
      new units.Unit3(),
      new units.Unit4(),
      new units.Unit5(),
      new units.Unit6()
    ];
  } else if (transactionType === 'pull') {
    const units = await extendUnits2();
    skeleton.units = [
      new units.Unit1(),
      new units.Unit2(),
      new units.Unit3(),
      new units.Unit4(),
      new units.Unit5(),
      new units.Unit6()
    ];
  } else {
    throw new Error(`Invalid transactionType: ${transactionType}`);
  }
  skeleton.carryBus = skeleton.carryBus || new CarryBus();
  skeleton.units.forEach(unit => { unit.skeleton = skeleton; });
  
  await skeleton.set(setNumber);
  
  // Ensure numberLength is set
  if (!skeleton.state.numberLength) {
    console.warn(`Warning: skeleton.state.numberLength undefined, setting to ${setNumber.toString().length}`);
    skeleton.state.numberLength = setNumber.toString().length;
  }
  
  // Generate and shift key
  const keyMaker = new KeyMaker();
  const tempKey = keyMaker.makeKey(keyNumber);
  const shiftKey = new ShiftKey();
  const shiftedKey = shiftKey.shift(tempKey, skeleton.state.numberLength);
  
  // Log results
  const skeletonState = skeleton.getState();
  const skeletonDisplay = `<${skeletonState.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${skeletonState.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
  console.log(`morphInit: ${newNumber} length ${newNumberLength}, ${currentSkeletonNumber} length ${currentSkeletonLength}: if current is < new number ${newNumber}, set skeleton for: ${setNumber}, genKEY for: ${keyNumber}, new skeleton: ${skeletonDisplay}, new key: ${JSON.stringify(shiftedKey)}`);
  
  // Return module set based on transactionType
  const moduleSet = transactionType === 'push' 
    ? { snapshot: 'snapshot.js', unitExtensions: 'unitExtensions.js' }
    : { snapshot: 'snapShot2.js', unitExtensions: 'unitExtensions2.js' };
  
  return { skeleton, key: shiftedKey, moduleSet };
}