import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';
import KeyMaker from '../key/keyMaker.js';
import Snapshot from '../MorphLogic/snapshot.js';

console.log('unit1.js loaded');

export default class Unit1 {
  constructor() {
    this.state = {
      currentSymbol: VOID_SYMBOL,
      carry: 0,
      hasCollapsed: false,
      pushes: [],
      pushesLength: 0,
      u1Collapse: false
    };
  }

  push(count, carryBus) {
    let currentIndex = this.state.currentSymbol && this.state.currentSymbol !== VOID_SYMBOL
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
        this.state.u1Collapse = true;
        console.log(
          `Unit1 Carry: CARRY: ${this.state.carry} COLLAPSED: ${this.state.hasCollapsed} U1COLLAPSE: ${this.state.u1Collapse}`
        );
        
        if (this.skeleton) {
          const currentNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
          const newNumber = currentNumber; // No extra +1, carry handled by cascade
          Snapshot.reset(this.skeleton, newNumber);
          
          const keyMaker = new KeyMaker();
          const newKey = keyMaker.makeKey(newNumber);
          console.log(`Regenerated Key: ${JSON.stringify(newKey)}`);
        }
        break;
      }
    }
    
    this.state.pushesLength = this.state.pushes.length;
  }

  getState() {
    return this.state;
  }
}