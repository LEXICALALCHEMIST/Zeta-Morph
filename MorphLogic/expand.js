import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Expand {
  expand(skeleton, carryValue, remainder) {
    console.log(`Expanding skeleton with carry: ${carryValue}, remainder: ${remainder}`);
    
    const units = skeleton.units;
    const oldNumberLength = skeleton.numberLength || 1;
    const newNumberLength = Math.min(oldNumberLength + 1, 6); // Max 6 units
    
    const newSymbols = Array(units.length).fill(VOID_SYMBOL);
    newSymbols[0] = SYMBOL_SEQUENCE[carryValue]; // Unit1 = carry (e.g., 1 → ●)
    for (let i = 1; i < newNumberLength; i++) {
      newSymbols[i] = SYMBOL_SEQUENCE[0]; // New digits = ⚙ (0)
      console.log(`Setting Unit${i + 1} to ${newSymbols[i]}`);
    }
    
    units.forEach((unit, i) => {
      unit.state.currentSymbol = newSymbols[i];
      unit.state.carry = i === 0 ? carryValue : 0; // Carry only on Unit1
      unit.state.hasCollapsed = i === 0 ? true : false; // Collapse only on Unit1
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
    });
    
    skeleton.numberLength = newNumberLength;
    skeleton.activeUnitTarget = `u${newNumberLength}`;
    
    const state = skeleton.getState();
    const skeletonDisplay = `<${state.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${state.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊉⊉⊉>`;
    console.log(`Expanded skeleton: numberLength: ${oldNumberLength} → ${newNumberLength}, activeUnitTarget: u${newNumberLength}`);
    console.log(`New Skeleton: ${skeletonDisplay}`);
    
    return state;
  }
}