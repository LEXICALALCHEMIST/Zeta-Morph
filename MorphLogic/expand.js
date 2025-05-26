import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Expand {
  expand(skeleton, carryValue, remainder) {
    console.log(`Expanding skeleton with carry: ${carryValue}, remainder: ${remainder}`);
    
    const units = skeleton.units;
    const oldNumberLength = skeleton.numberLength || 1;
    const newNumberLength = Math.min(oldNumberLength + 1, units.length);
    
    const newSymbols = [
      SYMBOL_SEQUENCE[carryValue], // Unit1 = carry (e.g., 1 → ●)
      SYMBOL_SEQUENCE[remainder], // Unit2 = remainder (e.g., 0 → ⚙)
      oldNumberLength > 1 ? units[1].state.currentSymbol : VOID_SYMBOL // Unit3 = old Unit2 or ⊙
    ];
    
    units.forEach((unit, i) => {
      unit.state.currentSymbol = i < newSymbols.length ? newSymbols[i] : VOID_SYMBOL;
      if (i !== 0) { // Preserve Unit1's carry and hasCollapsed
        unit.state.carry = 0;
        unit.state.hasCollapsed = false;
      }
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
    });
    
    skeleton.numberLength = newNumberLength;
    skeleton.activeUnitTarget = `u${newNumberLength}`;
    
    const state = skeleton.getState();
    console.log(`Expanded skeleton: numberLength: ${oldNumberLength} → ${newNumberLength}, activeUnitTarget: u${newNumberLength}`);
    console.log(`New Skeleton: <${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`);
    
    return state;
  }
}