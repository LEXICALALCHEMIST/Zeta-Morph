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
    this.state.collapsed = true;
    this.state.hasCollapsed = true;
    this.state.carry = Math.floor(times / 10);
    this.state.currentSymbol = SYMBOL_SEQUENCE[0];
    if (carryBus) carryBus.registerCarry(this.state.carry, this.carryTarget);
    this.state.pushes = [];
    return;
  }
  const direction = times >= 0 ? 1 : -1;
  const absTimes = Math.abs(times);
  this.state.currentSymbol = this.state.currentSymbol || SYMBOL_SEQUENCE[0]; // Initialize to ⚙
  for (let i = 0; i < absTimes; i++) {
    this.state.pushes.push(direction);
    this.state.currentSymbol = morphSymbol(this.state.currentSymbol, direction);
    if (this.state.currentSymbol === SYMBOL_SEQUENCE[10] && direction > 0) {
      this.state.collapsed = true;
      this.state.hasCollapsed = true;
      this.state.carry = 1;
      this.state.currentSymbol = SYMBOL_SEQUENCE[0];
      if (carryBus) carryBus.registerCarry(1, this.carryTarget);
      this.state.pushes = [];
    }
  }
  this.state.pushesLength = this.state.pushes.length; // Update pushesLength
}

  getState() {
    return {
      ...this.state,
      currentSymbol: this.state.currentSymbol || VOID_SYMBOL
    };
  }
}