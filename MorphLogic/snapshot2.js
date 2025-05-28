import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Snapshot2 {
  static async reset(skeleton, number) {
    console.log(`Resetting skeleton snapshot for ${number}`);
    
    const digits = number.toString().split('').map(Number);
    skeleton.state.numberLength = digits.length;
    skeleton.state.activeUnitTarget = `u${skeleton.state.numberLength}`;
    
    skeleton.units.forEach((unit, i) => {
      unit.state.currentSymbol = VOID_SYMBOL;
      unit.state.carry = 0;
      unit.state.hasCollapsed = false;
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
      
      const digit = digits[i];
      if (digit !== undefined) {
        console.log(`Resetting unit${i + 1} to ${digit}`);
        unit.state.currentSymbol = SYMBOL_SEQUENCE[digit];
        console.log(`Reset unit${i + 1} to ${digit} (symbol: ${SYMBOL_SEQUENCE[digit]})`);
      }
    });
    
    const state = skeleton.getState();
    skeleton.state.snapshot = JSON.parse(JSON.stringify(state)); // Deep copy snapshot
    const skeletonDisplay = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
    console.log(`Snapshot: ${JSON.stringify({
      units: state.units.map(u => u.currentSymbol),
      numberLength: state.numberLength,
      activeUnitTarget: state.activeUnitTarget
    })}`);
    console.log(`Reset Skeleton: ${skeletonDisplay}`);
    
    return state;
  }
}