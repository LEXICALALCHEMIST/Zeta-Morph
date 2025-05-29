import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

export async function extendUnits() {
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

    getState() {
      return this.state;
    }
  }

  class Unit1 extends UnitBase { constructor() { super(1); this.state.u1Collapse = false; } }
  class Unit2 extends UnitBase { constructor() { super(2); } }
  class Unit3 extends UnitBase { constructor() { super(3); } }
  class Unit4 extends UnitBase { constructor() { super(4); } }
  class Unit5 extends UnitBase { constructor() { super(5); } }
  class Unit6 extends UnitBase { constructor() { super(6); } }

  return { Unit1, Unit2, Unit3, Unit4, Unit5, Unit6 };
}