import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Contract {
  contract(skeleton, borrowValue, remainder, borrowingUnit) {
    console.log(`CONTRACT Start: borrowValue=${borrowValue}, remainder=${remainder}, borrowingUnit=${borrowingUnit ? borrowingUnit.state.label : 'none'}`);
    
    const units = skeleton.units;
    const oldNumberLength = skeleton.numberLength || 1;
    const newNumberLength = Math.max(oldNumberLength - 1, 1);
    console.log(`CONTRACT: oldNumberLength=${oldNumberLength}, newNumberLength=${newNumberLength}`);
    
    const newSymbols = Array(units.length).fill(VOID_SYMBOL);
    if (newNumberLength >= 1) {
      newSymbols[0] = SYMBOL_SEQUENCE[remainder]; // Set Unit1 to remainder (e.g., 9 → ▲)
      console.log(`CONTRACT: Setting Unit1 to ${SYMBOL_SEQUENCE[remainder]} (remainder=${remainder})`);
      for (let i = 1; i < newNumberLength; i++) {
        newSymbols[i] = units[i - 1].state.currentSymbol; // Shift left
        console.log(`CONTRACT: Shifting Unit${i + 1} to ${newSymbols[i]}`);
      }
    }
    
    units.forEach((unit, i) => {
      if (unit === borrowingUnit) {
        console.log(`CONTRACT: Clearing borrowing unit ${unit.state.label} to VOID_SYMBOL`);
        unit.state.currentSymbol = VOID_SYMBOL;
      } else {
        console.log(`CONTRACT: Setting Unit${i + 1} to ${newSymbols[i]}`);
        unit.state.currentSymbol = newSymbols[i];
      }
      unit.state.carry = 0;
      unit.state.hasCollapsed = false;
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
    });
    
    skeleton.numberLength = newNumberLength;
    skeleton.activeUnitTarget = `u${newNumberLength}`;
    
    const state = skeleton.getState();
    console.log(`CONTRACT End: New Skeleton: <${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`);
    
    return state;
  }
}