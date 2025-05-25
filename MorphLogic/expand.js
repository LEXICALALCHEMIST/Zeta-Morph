// expand.js
// Located in ZetaMorph/MorphLogic/

import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Expand {
  expand(skeleton, carryValue, remainder) {
    console.log(`Expanding skeleton with carry: ${carryValue}, remainder: ${remainder}`);
    
    // Current skeleton state
    const units = [skeleton.unit1, skeleton.unit2, skeleton.unit3];
    const oldNumberLength = skeleton.numberLength || 1;
    const newNumberLength = Math.min(oldNumberLength + 1, 3); // Max 3 units
    
    // Shift units right
    const newSymbols = [SYMBOL_SEQUENCE[carryValue]]; // Unit1 = carry (e.g., 1 → ●)
    newSymbols.push(SYMBOL_SEQUENCE[remainder]); // Unit2 = remainder (e.g., 1 → ●)
    newSymbols.push(oldNumberLength > 1 ? units[1].state.currentSymbol : VOID_SYMBOL); // Unit3 = old Unit2
    
    // Apply new symbols
    units.forEach((unit, i) => {
      unit.state.currentSymbol = newSymbols[i];
      unit.state.carry = 0;
      unit.state.hasCollapsed = false;
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
    });
    
    // Update skeleton metadata
    skeleton.numberLength = newNumberLength;
    skeleton.activeUnitTarget = `u${newNumberLength}`;
    
    const state = skeleton.getState();
    console.log(`Expanded skeleton: numberLength: ${oldNumberLength} → ${newNumberLength}, activeUnitTarget: u${newNumberLength}`);
    console.log(`New Skeleton: <${state.unit1.currentSymbol}${state.unit2.currentSymbol}${state.unit3.currentSymbol}|⊙⊙⊙|⊙⊙⊙>`);
    
    return state;
  }
}