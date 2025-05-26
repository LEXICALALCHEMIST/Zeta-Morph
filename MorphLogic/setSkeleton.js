import { extendUnits } from './../skeleton/unitExtensions.js';
import CarryBus from '../core/carryBus.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class SetSkeleton {
  constructor() {
    this.units = [];
    this.carryBus = null;
    this.numberLength = 1;
    this.activeUnitTarget = 'u1';
  }

  async init() {
    const { Unit1, Unit2, Unit3 } = await extendUnits();
    this.units = [
      new Unit1(),
      new Unit2(),
      new Unit3()
    ];
    this.carryBus = new CarryBus();
    this.units.forEach(unit => { unit.skeleton = this; });
  }

  async set(number) {
    await this.init();
    console.log(`Setting skeleton for ${number}`);
    
    if (number < 0 || number > 999_999_999_999) {
      throw new Error('Number must be between 0 and 999,999,999,999');
    }
    
    const digits = number.toString().split('').map(Number);
    this.numberLength = digits.length;
    this.activeUnitTarget = `u${this.numberLength}`;
    
    this.units.forEach((unit, i) => {
      unit.state.currentSymbol = VOID_SYMBOL;
      unit.state.carry = 0;
      unit.state.hasCollapsed = false;
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
      
      const digit = digits[i];
      if (digit !== undefined) {
        console.log(`Setting unit${i + 1} to ${digit}`);
        unit.state.currentSymbol = SYMBOL_SEQUENCE[digit];
        unit.state.pushes = [];
        unit.state.pushesLength = 0;
        console.log(`Set unit${i + 1} to ${digit} (symbol: ${SYMBOL_SEQUENCE[digit]})`);
      }
    });
    
    const state = this.getState();
    console.log(`Skeleton: <${this.units.map(u => u.state.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`);
    return state;
  }

  getState() {
    return {
      units: this.units.map(unit => unit.getState()),
      numberLength: this.numberLength,
      activeUnitTarget: this.activeUnitTarget
    };
  }
}