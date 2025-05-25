// unit2.js
// Located in ZetaMorph/skeleton/

import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

function morphSymbol(current, direction = 1) {
  if (current === null) return SYMBOL_SEQUENCE[0];
  const index = SYMBOL_SEQUENCE.indexOf(current);
  return SYMBOL_SEQUENCE[(index + direction + SYMBOL_SEQUENCE.length) % SYMBOL_SEQUENCE.length];
}

export default class Unit2 {
  constructor() {
    this.state = {
      label: 'unit2', // Secondary unit (tens)
      currentSymbol: null,
      pushes: [],
      carry: 0,
      collapsed: false,
      hasCollapsed: false
    };
    this.carryTarget = 'Unit1'; // Carry back to Unit1
  }

  push(times = 1, carryBus) {
    if (times >= 10) {
      console.log(`Unit2 Push: Bypassing ${times} to collapse`);
      this.state.collapsed = true;
      this.state.hasCollapsed = true;
      this.state.carry = Math.floor(times / 10);
      this.state.currentSymbol = SYMBOL_SEQUENCE[0]; // Reset to ⚙ (0)
      if (carryBus) {
        carryBus.registerCarry(this.state.carry, this.carryTarget);
        console.log(`Unit2 Carry: Registered CARRY: ${this.state.carry} to ${this.carryTarget}`);
      }
      this.state.pushes = [];
      return;
    }
    const direction = times >= 0 ? 1 : -1;
    const absTimes = Math.abs(times);
    for (let i = 0; i < absTimes; i++) {
      this.state.pushes.push(direction);
      this.state.currentSymbol = morphSymbol(this.state.currentSymbol, direction);
      console.log(`Unit2 Push: SYMBOL: ${this.state.currentSymbol} CARRY: ${this.state.carry} DIRECTION: ${direction}`);
      if (this.state.currentSymbol === SYMBOL_SEQUENCE[10] && direction > 0) {
        this.state.collapsed = true;
        this.state.hasCollapsed = true;
        this.state.carry = 1;
        console.log(`Unit2 Carry: CARRY: ${this.state.carry} COLLAPSED: ${this.state.collapsed}`);
        if (carryBus) {
          carryBus.registerCarry(1, this.carryTarget);
          console.log(`Unit2 Carry: Registered CARRY: 1 to ${this.carryTarget}`);
        }
        this.state.currentSymbol = SYMBOL_SEQUENCE[0]; // Reset to ⚙ (0)
        this.state.pushes = [];
      }
    }
  }

  getState() {
    return {
      ...this.state,
      currentSymbol: this.state.currentSymbol || VOID_SYMBOL
    };
  }
}