// shift.js
// Located in ZetaMorph/MorphLogic/

import SetSkeleton from './setSkeleton.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Shift {
  constructor() {
    this.setSkeleton = new SetSkeleton();
  }

  shift(setNumber, shiftIndex) {
    console.log(`Shifting skeleton for ${setNumber} by ${shiftIndex} units`);
    
    // Set initial skeleton
    const setState = this.setSkeleton.set(setNumber);
    const setLength = setNumber.toString().length;
    console.log(`Set length: ${setLength}`);
    
    // Validate shift
    if (shiftIndex < 0 || shiftIndex > 2) {
      throw new Error('Shift index must be between 0 and 2');
    }
    
    // Shift skeleton right by shiftIndex units
    let shiftedState = { ...setState };
    const units = [
      { state: setState.unit1, index: 0 },
      { state: setState.unit2, index: 1 },
      { state: setState.unit3, index: 2 }
    ];
    const newUnits = Array(3).fill().map(() => ({ currentSymbol: SYMBOL_SEQUENCE[0], carry: 0, hasCollapsed: false, pushesLength: 0 })); // Set to ⚙ (0) by default
    
    for (let i = 0; i < units.length; i++) {
      const newIndex = i + shiftIndex;
      if (newIndex < units.length && units[i].state.currentSymbol !== VOID_SYMBOL) {
        newUnits[newIndex] = { ...units[i].state }; // Move non-⊙ symbol
      }
    }
    
    shiftedState = {
      unit1: newUnits[0],
      unit2: newUnits[1],
      unit3: newUnits[2]
    };
    
    // Apply shifted state to skeleton
    this.setSkeleton.unit1.state.currentSymbol = shiftedState.unit1.currentSymbol;
    this.setSkeleton.unit2.state.currentSymbol = shiftedState.unit2.currentSymbol;
    this.setSkeleton.unit3.state.currentSymbol = shiftedState.unit3.currentSymbol;
    this.setSkeleton.unit1.state.pushes = [];
    this.setSkeleton.unit2.state.pushes = [];
    this.setSkeleton.unit3.state.pushes = [];
    
    const finalState = this.setSkeleton.getState();
    console.log(`Shifted Skeleton: <${finalState.unit1.currentSymbol}${finalState.unit2.currentSymbol}${finalState.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
    return finalState;
  }
}