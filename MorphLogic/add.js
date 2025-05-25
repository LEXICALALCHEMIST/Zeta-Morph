// add.js
// Located in ZetaMorph/MorphLogic/

import KeyMaker from '../key/keyMaker.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Add {
  constructor(skeleton) {
    this.skeleton = skeleton;
    this.keyMaker = new KeyMaker();
  }

  add(keyNumber, shiftedKey) {
    console.log(`Applying key for ${keyNumber}`);
    
    // Use the shifted key
    const key = shiftedKey || this.keyMaker.makeKey(keyNumber);
    
    // Apply key to skeleton
    const units = [this.skeleton.unit1, this.skeleton.unit2, this.skeleton.unit3];
    
    for (let i = 0; i < key.push.length; i++) {
      const pushEntry = key.push[i];
      const [unitName, value] = pushEntry.split(':');
      const unitIndex = parseInt(unitName.replace('U', '')) - 1;
      const unit = units[unitIndex];
      const position = i === 0 ? 'first' : i === 1 ? 'second' : 'third';
      
      const currentSymbol = unit.state && unit.state.currentSymbol ? unit.state.currentSymbol : VOID_SYMBOL;
      
      if (value !== 'null') {
        const numValue = parseInt(value);
        if (numValue > 0) {
          console.log(`Pushing ${unitName}-${position}: ${numValue}`);
          unit.push(numValue, this.skeleton.carryBus);
          if (this.skeleton.carryBus.carryValue > 0) {
            const { carryValue, carryTarget } = this.skeleton.carryBus.flushCarry();
            if (carryTarget === 'Unit1' && i > 0) {
              this.skeleton.unit1.push(carryValue, this.skeleton.carryBus);
              console.log(`Carry applied to Unit1: ${carryValue}`);
            } else if (carryTarget === 'Unit2' && i > 1) {
              this.skeleton.unit2.push(carryValue, this.skeleton.carryBus);
              console.log(`Carry applied to Unit2: ${carryValue}`);
            }
          }
        } else if (currentSymbol === VOID_SYMBOL) {
          console.log(`Setting ${unitName}-${position}: 0 (no push)`);
          unit.state.currentSymbol = SYMBOL_SEQUENCE[0]; // Set to ⚙
        } else {
          console.log(`Preserving ${unitName}-${position}: ${currentSymbol} (no push)`);
        }
      } else {
        console.log(`Skipping ${unitName}-${position}: null`);
      }
    }
    
    // Reset pushesLength
    units.forEach(unit => {
      if (unit.state && unit.state.pushes) {
        unit.state.pushes = [];
      }
    });
    
    const state = this.skeleton.getState();
    console.log(`Final Skeleton: <${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
    return state;
  }
}