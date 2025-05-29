import { MorphInit } from '../core/MorphInit.js';
import SnapshotPull from './SnapshotPull.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

export default class PullModule {
  constructor(skeleton) {
    this.skeleton = skeleton;
  }

  async pull(keyNumber) {
    console.log(`Applying pull for ${keyNumber}`);
    
    const currentSkeletonNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
    
    // Use MorphInit to determine skeleton and key
    const { skeleton, key } = await MorphInit(keyNumber, currentSkeletonNumber, 'pull');
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
          while (this.skeleton.carryBus.carryValue < 0) {
            const { carryValue, carryTarget } = this.skeleton.carryBus.flushCarry();
            const targetIndex = parseInt(carryTarget.replace('Unit', '')) - 1;
            if (targetIndex >= 0 && targetIndex < units.length) {
              console.log(`Borrow applied to Unit${targetIndex + 1}: ${carryValue}`);
              units[targetIndex].pull(1, this.skeleton.carryBus);
            }
            if (targetIndex === 0 && this.skeleton.carryBus.carryValue < 0) {
              console.log(`Unit1 borrow triggered, resetting snapshot`);
              const currentNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
              const newNumber = currentNumber - numValue;
              await SnapshotPull.reset(this.skeleton, newNumber);
              break;
            }
          }
        } else if (currentSymbol !== VOID_SYMBOL) {
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