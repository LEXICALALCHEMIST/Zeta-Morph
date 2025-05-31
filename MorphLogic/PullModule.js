import { morphInit } from '../core/MorphInit.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

export default class PullModule {
  constructor(skeleton) {
    this.skeleton = skeleton;
  }

  async pull(keyNumber) {
    console.log(`Applying pull for ${keyNumber}`);
    
    const currentSkeletonNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
    
    // Use MorphInit to determine skeleton and key
    const { skeleton, key } = await morphInit(keyNumber, currentSkeletonNumber, false);
    this.skeleton = skeleton;
    const units = this.skeleton.units;
    
    // Apply the shifted key for pulling
    for (let i = 0; i < key.push.length && i < units.length; i++) {
      const pushEntry = key.push[i];
      const [unitName, value] = pushEntry.split(':');
      const unitIndex = parseInt(unitName.replace('U', '')) - 1;
      const unit = units[unitIndex];
      const position = `u${unitIndex + 1}`;
      
      const currentSymbol = unit.state && unit.state.currentSymbol ? unit.state.currentSymbol : VOID_SYMBOL;
      
      if (value !== 'null') {
        const numValue = parseInt(value);
        if (numValue > 0) {
          console.log(`Pulling ${unitName}-${position}: ${numValue}`);
          unit.pull(numValue, this.skeleton.carryBus);
          // Propagate borrows (negative carries)
          while (this.skeleton.carryBus.carryValue < 0) {
            const { carryValue, carryTarget } = this.skeleton.carryBus.flushCarry();
            const targetIndex = parseInt(carryTarget.replace('Unit', '')) - 1;
            if (targetIndex >= 0 && targetIndex < units.length) {
              console.log(`Borrow applied to Unit${targetIndex + 1}: ${carryValue}`);
              units[targetIndex].pull(1, this.skeleton.carryBus);
            }
          }
        } else if (currentSymbol !== VOID_SYMBOL) {
          console.log(`Preserving ${unitName}-${position}: ${currentSymbol} (no pull)`);
        }
      } else {
        console.log(`Skipping ${unitName}-${position}: null`);
      }
    }
    
    // Compute the new skeleton number for logging
    const newSkeletonNumber = Math.max(currentSkeletonNumber - keyNumber, 0);
    console.log(`Computed new skeleton number: ${newSkeletonNumber}`);
    
    // Reset the skeleton to the computed number
    console.log(`Resetting skeleton to computed number: ${newSkeletonNumber}`);
    const digits = newSkeletonNumber.toString().split('').map(Number);
    this.skeleton.state.numberLength = digits.length;
    this.skeleton.state.activeUnitTarget = `u${this.skeleton.state.numberLength}`;

    this.skeleton.units.forEach((unit, i) => {
      unit.state.currentSymbol = VOID_SYMBOL;
      unit.state.carry = 0;
      unit.state.hasCollapsed = false;
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
      unit.state.u1Collapse = false;

      const digit = digits[i];
      if (digit !== undefined) {
        console.log(`Resetting unit${i + 1} to ${digit}`);
        unit.state.currentSymbol = SYMBOL_SEQUENCE[digit];
        console.log(`Reset unit${i + 1} to ${digit} (symbol: ${SYMBOL_SEQUENCE[digit]})`);
      }
    });

    const state = this.skeleton.getState();
    this.skeleton.state.snapshot = JSON.parse(JSON.stringify(state)); // Deep copy snapshot
    const skeletonDisplay = `<${state.units.slice(0, 4).map(u => u.currentSymbol).join('')}|${state.units.slice(4, 8).map(u => u.currentSymbol).join('')}|${state.units.slice(8, 12).map(u => u.currentSymbol).join('')}>`;
    console.log(`Snapshot: ${JSON.stringify({
      units: state.units.map(u => u.currentSymbol),
      numberLength: state.numberLength,
      activeUnitTarget: state.activeUnitTarget
    })}`);
    console.log(`Reset Skeleton: ${skeletonDisplay}`);
    
    units.forEach(unit => {
      if (unit.state && unit.state.pushes) {
        unit.state.pushes = [];
        unit.state.pushesLength = 0;
      }
    });
    
    const finalState = this.skeleton.getState();
    const finalSkeletonDisplay = `<${finalState.units.slice(0, 4).map(u => u.currentSymbol).join('')}|${finalState.units.slice(4, 8).map(u => u.currentSymbol).join('')}|${finalState.units.slice(8, 12).map(u => u.currentSymbol).join('')}>`;
    console.log(`Final Skeleton (after pull): ${finalSkeletonDisplay}`);
    return finalState;
  }
}