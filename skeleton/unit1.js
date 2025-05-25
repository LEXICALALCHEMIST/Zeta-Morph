// unit1.js
// Located in ZetaMorph/skeleton/

import { SYMBOL_SEQUENCE } from '../core/sacred9.js';
import Expand from '../MorphLogic/expand.js';

console.log('unit1.js loaded');

export default class Unit1 {
  constructor() {
    this.state = {
      currentSymbol: '⊙',
      carry: 0,
      hasCollapsed: false,
      pushes: [],
      pushesLength: 0
    };
  }

  push(count, carryBus) {
    let currentIndex = this.state.currentSymbol && this.state.currentSymbol !== '⊙'
      ? SYMBOL_SEQUENCE.indexOf(this.state.currentSymbol)
      : -1;
    
    for (let i = 0; i < count; i++) {
      currentIndex = (currentIndex + 1) % SYMBOL_SEQUENCE.length;
      this.state.currentSymbol = SYMBOL_SEQUENCE[currentIndex];
      this.state.pushes.push(this.state.currentSymbol);
      
      console.log(
        `Unit1 Push: SYMBOL: ${this.state.currentSymbol} CARRY: ${this.state.carry} DIRECTION: 1`
      );
      
      if (currentIndex === SYMBOL_SEQUENCE.length - 1) {
        this.state.carry = 1;
        this.state.hasCollapsed = true;
        const remainder = currentIndex % 10; // Fix: Correct remainder for 10 (0 → ⚙)
        this.state.currentSymbol = SYMBOL_SEQUENCE[remainder];
        carryBus.registerCarry(1, 'Unit2');
        console.log(
          `Unit1 Carry: CARRY: ${this.state.carry} COLLAPSED: ${this.state.hasCollapsed}`
        );
        console.log(`CarryBus: Registered CARRY: 1 to Unit2`);
        console.log(`Remainder set to: ${remainder}`);
        
        // Trigger expansion
        const expand = new Expand();
        expand.expand(this.skeleton, this.state.carry, remainder);
        break; // Stop pushing after collapse
      }
    }
    
    this.state.pushesLength = this.state.pushes.length;
  }

  getState() {
    return this.state;
  }
}