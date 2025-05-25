// setSkeleton.js
// Located in ZetaMorph/MorphLogic/

import Unit1 from '../skeleton/unit1.js';
import Unit2 from '../skeleton/unit2.js';
import Unit3 from '../skeleton/unit3.js';
import CarryBus from '../core/carryBus.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class SetSkeleton {
  constructor() {
    this.unit1 = new Unit1();
    this.unit2 = new Unit2();
    this.unit3 = new Unit3();
    this.carryBus = new CarryBus();
    this.numberLength = 1;
    this.activeUnitTarget = 'u1';
    
    // Bind skeleton to units
    this.unit1.skeleton = this;
    this.unit2.skeleton = this;
    this.unit3.skeleton = this;
  }

  set(number) {
    console.log(`Setting skeleton for ${number}`);
    
    if (number < 0 || number > 999) {
      throw new Error('Number must be between 0 and 999');
    }
    
    const digits = number.toString().split('').map(Number);
    this.numberLength = digits.length;
    this.activeUnitTarget = `u${this.numberLength}`;
    
    const units = [this.unit1, this.unit2, this.unit3];
    
    for (let i = 0; i < units.length; i++) {
      const unit = units[i];
      unit.state.currentSymbol = VOID_SYMBOL;
      unit.state.carry = 0;
      unit.state.hasCollapsed = false;
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
      
      const digit = digits[digits.length - 1 - i]; // Right-to-left
      if (digit !== undefined) {
        console.log(`Setting unit${i + 1} to ${digit}`);
        unit.state.currentSymbol = SYMBOL_SEQUENCE[digit];
        unit.state.pushes = Array(digit).fill(SYMBOL_SEQUENCE[digit]);
        unit.state.pushesLength = digit;
        console.log(`Set unit${i + 1} to ${digit} (symbol: ${SYMBOL_SEQUENCE[digit]})`);
      }
    }
    
    const state = this.getState();
    console.log(`Skeleton: <${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
    return state;
  }

  getState() {
    return {
      unit1: this.unit1.state,
      unit2: this.unit2.state,
      unit3: this.unit3.state,
      numberLength: this.numberLength,
      activeUnitTarget: this.activeUnitTarget
    };
  }
}