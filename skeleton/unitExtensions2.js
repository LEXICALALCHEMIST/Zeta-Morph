import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';
import Snapshot2 from '../MorphLogic/snapShot2.js';

export async function extendUnits2() {
  class UnitBase {
    constructor(unitNumber) {
      this.unitNumber = unitNumber;
      this.state = {
        currentSymbol: VOID_SYMBOL,
        carry: 0,
        hasCollapsed: false,
        pushes: [],
        pushesLength: 0
      };
    }

    pull(times, carryBus) {
      console.log(`unit${this.unitNumber} Pull Start: times=${times}, currentSymbol=${this.state.currentSymbol}`);
      
      let currentIndex = this.state.currentSymbol && this.state.currentSymbol !== VOID_SYMBOL
        ? SYMBOL_SEQUENCE.indexOf(this.state.currentSymbol)
        : -1;
      
      let absTimes = Math.abs(times);
      for (let i = 0; i < absTimes; i++) {
        if (currentIndex === 0) {
          console.log(`unit${this.unitNumber} Pull: Hit ⚙, triggering borrow`);
          this.state.carry = -1;
          carryBus.registerCarry(this.state.carry, `Unit${this.unitNumber - 1}`);
          console.log(`unit${this.unitNumber} Borrow: CARRY: ${this.state.carry} COLLAPSED: ${this.state.hasCollapsed}`);
          break;
        } else {
          currentIndex = currentIndex - 1;
          this.state.currentSymbol = SYMBOL_SEQUENCE[currentIndex];
          this.state.pushes.push(this.state.currentSymbol);
          console.log(
            `unit${this.unitNumber} Pull: SYMBOL: ${this.state.currentSymbol} CARRY: ${this.state.carry} DIRECTION: -1`
          );
        }
      }
      
      this.state.pushesLength = this.state.pushes.length;
      console.log(`unit${this.unitNumber} Pull End: pushesLength=${this.state.pushesLength}`);
    }

    getState() {
      return this.state;
    }
  }

  class Unit1 extends UnitBase {
    constructor() {
      super(1);
      this.state.u1Collapse = false;
    }

    pull(count, carryBus) {
      console.log(`unit1 Pull Start: times=${count}, currentSymbol=${this.state.currentSymbol}`);
      
      let currentIndex = this.state.currentSymbol && this.state.currentSymbol !== VOID_SYMBOL
        ? SYMBOL_SEQUENCE.indexOf(this.state.currentSymbol)
        : -1;
      
      let absCount = Math.abs(count);
      for (let i = 0; i < absCount; i++) {
        if (currentIndex === 0) {
          console.log(`unit1 Pull: Hit zero, triggering borrow and snapshot`);
          this.state.carry = -1;
          this.state.hasCollapsed = true;
          this.state.u1Collapse = true;
          carryBus.registerCarry(this.state.carry, `Unit${this.unitNumber - 1}`);
          console.log(
            `unit1 Borrow: CARRY: ${this.state.carry} COLLAPSED: ${this.state.hasCollapsed} U1COLLAPSE: ${this.state.u1Collapse}`
          );
          
          if (this.skeleton) {
            const currentNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
            const newNumber = currentNumber - count; // Adjust for pull
            Snapshot2.reset(this.skeleton, newNumber);
            break;
          }
        } else {
          currentIndex = currentIndex - 1;
          this.state.currentSymbol = SYMBOL_SEQUENCE[currentIndex];
          this.state.pushes.push(this.state.currentSymbol);
          console.log(
            `unit1 Pull: SYMBOL: ${this.state.currentSymbol} CARRY: ${this.state.carry} DIRECTION: -1`
          );
        }
      }
      
      this.state.pushesLength = this.state.pushes.length;
      console.log(`unit1 Pull End: pushesLength=${this.state.pushesLength}`);
    }
  }

  class Unit2 extends UnitBase { constructor() { super(2); } }
  class Unit3 extends UnitBase { constructor() { super(3); } }
  class Unit4 extends UnitBase { constructor() { super(4); } }
  class Unit5 extends UnitBase { constructor() { super(5); } }
  class Unit6 extends UnitBase { constructor() { super(6); } }

  return { Unit1, Unit2, Unit3, Unit4, Unit5, Unit6 };
}