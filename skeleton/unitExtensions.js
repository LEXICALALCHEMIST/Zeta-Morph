import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';
import Contract from '../MorphLogic/contract.js';
import Unit1 from './unit1.js';
import Unit2 from './unit2.js';
import Unit3 from './unit3.js';

function morphSymbol(current, direction = 1) {
  if (current === null || current === VOID_SYMBOL) return SYMBOL_SEQUENCE[0];
  const index = SYMBOL_SEQUENCE.indexOf(current);
  return SYMBOL_SEQUENCE[(index + direction + SYMBOL_SEQUENCE.length) % SYMBOL_SEQUENCE.length];
}

export const extendUnits = () => {
  const addPullMethod = (unitClass, carryTarget) => {
    unitClass.prototype.pull = function (times = 1, carryBus) {
      console.log(`${this.state.label || 'Unit'} Pull Start: times=${times}, currentSymbol=${this.state.currentSymbol}`);
      if (times >= 10) {
        console.log(`${this.state.label || 'Unit'} Pull: Large pull, setting carry=${-Math.floor(times / 10)}`);
        this.state.collapsed = false;
        this.state.hasCollapsed = false;
        this.state.carry = -Math.floor(times / 10);
        this.state.currentSymbol = SYMBOL_SEQUENCE[0];
        if (carryBus) carryBus.registerCarry(this.state.carry, carryTarget);
        this.state.pushes = [];
        return;
      }
      const direction = -1;
      const absTimes = Math.abs(times);
      this.state.currentSymbol = this.state.currentSymbol || SYMBOL_SEQUENCE[0];
      for (let i = 0; i < absTimes; i++) {
        console.log(`${this.state.label || 'Unit'} Pull: Checking symbol=${this.state.currentSymbol}, i=${i}, absTimes=${absTimes}`);
        if (this.state.currentSymbol === SYMBOL_SEQUENCE[0]) {
          console.log(`${this.state.label || 'Unit'} Pull: Hit ⚙, triggering borrow`);
          this.state.collapsed = false;
          this.state.hasCollapsed = false;
          this.state.carry = -1;
          console.log(`${this.state.label || 'Unit'} Borrow: CARRY: ${this.state.carry} COLLAPSED: ${this.state.collapsed}`);
          if (carryBus) {
            carryBus.registerCarry(-1, carryTarget);
            console.log(`${this.state.label || 'Unit'} Borrow: Registered CARRY: -1 to ${carryTarget}`);
          }
          if (this.skeleton) {
            console.log(`${this.state.label || 'Unit'} Pull: Calling CONTRACT with remainder=9`);
            const contract = new Contract();
            contract.contract(this.skeleton, -this.state.carry, 9, this);
          }
          this.state.pushes = [];
          break;
        }
        const nextSymbol = morphSymbol(this.state.currentSymbol, direction);
        this.state.pushes.push(direction);
        this.state.currentSymbol = nextSymbol;
        console.log(`${this.state.label || 'Unit'} Pull: SYMBOL: ${this.state.currentSymbol} CARRY: ${this.state.carry} DIRECTION: ${direction}`);
      }
      this.state.pushesLength = this.state.pushes.length;
      console.log(`${this.state.label || 'Unit'} Pull End: pushesLength=${this.state.pushesLength}`);
    };
  };

  addPullMethod(Unit1, 'Unit2');
  addPullMethod(Unit2, 'Unit1');
  addPullMethod(Unit3, 'Unit2');

  return { Unit1, Unit2, Unit3 };
};