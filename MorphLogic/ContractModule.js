import { morphInit } from '../core/MorphInit.js';
import Snapshot2 from '../MorphLogic/SnapshotPull.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

export default class ContractModule {
  constructor(skeleton) {
    this.skeleton = skeleton;
  }

  async contract(keyNumber) {
    console.log(`Applying contraction for ${keyNumber}`);
    
    if (!this.skeleton || !this.skeleton.units || !this.skeleton.state) {
      console.error('Invalid skeleton state');
      throw new Error('Skeleton is undefined or invalid');
    }
    
    const currentSkeletonNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
    
    // Use MorphInit to determine skeleton and key
    const { skeleton, key } = await morphInit(keyNumber, currentSkeletonNumber, false); // false for pull operation
    this.skeleton = skeleton;
    const units = this.skeleton.units;
    
    // Apply the shifted key for subtraction
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
          if (this.skeleton.carryBus.carryValue < 0 && unitIndex === 0) {
            console.log(`Unit1 borrow triggered, resetting snapshot`);
            const currentNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
            const newNumber = currentNumber - numValue;
            await Snapshot2.reset(this.skeleton, newNumber);
            break;
          }
        } else if (currentSymbol === VOID_SYMBOL) {
          console.log(`Setting ${unitName}-${position}: 0 (no pull)`);
          unit.state.currentSymbol = SYMBOL_SEQUENCE[0];
        } else {
          console.log(`Preserving ${unitName}-${position}: ${currentSymbol} (no pull)`);
        }
      } else {
        console.log(`Skipping ${unitName}-${position}: null`);
      }
    }
    
    units.forEach(unit => {
      if (unit.state && unit.state.pushes) {
        unit.state.pushes = [];
        unit.state.pushesLength = 0;
      }
    });
    
    const finalState = this.skeleton.getState();
    const skeletonDisplay = `<${finalState.units.slice(0, 3).map(u => u.currentSymbol).join('')}|${finalState.units.slice(3, 6).map(u => u.currentSymbol).join('')}|⊙⊙⊙>`;
    console.log(`Final Skeleton: ${skeletonDisplay}`);
    return finalState;
  }
}