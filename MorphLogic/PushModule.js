import { morphInit } from '../core/MorphInit.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

export default class PushModule {
  constructor(skeleton) {
    this.skeleton = skeleton;
  }

  async push(keyNumber) {
    console.log(`Applying push for ${keyNumber}`);
    
    const currentSkeletonNumber = parseInt(this.skeleton.units.slice(0, this.skeleton.state.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.state.currentSymbol)).join('') || '0', 10);
    
    // Use MorphInit to determine skeleton and key
    const { skeleton, key } = await morphInit(keyNumber, currentSkeletonNumber, true);
    this.skeleton = skeleton;
    const units = this.skeleton.units;
    
    // Apply the shifted key for pushing
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
          console.log(`Pushing ${unitName}-${position}: ${numValue}`);
          unit.push(numValue, this.skeleton.carryBus);
          // Propagate carries
          while (this.skeleton.carryBus.carryValue > 0) {
            const { carryValue, carryTarget } = this.skeleton.carryBus.flushCarry();
            const targetIndex = parseInt(carryTarget.replace('Unit', '')) - 1;
            if (targetIndex >= 0 && targetIndex < units.length) {
              console.log(`Carry applied to Unit${targetIndex + 1}: ${carryValue}`);
              units[targetIndex].push(carryValue, this.skeleton.carryBus);
            }
          }
        } else if (currentSymbol !== VOID_SYMBOL) {
          console.log(`Preserving ${unitName}-${position}: ${currentSymbol} (no push)`);
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
    const skeletonDisplay = `<${finalState.units.slice(0, 4).map(u => u.currentSymbol).join('')}|${finalState.units.slice(4, 8).map(u => u.currentSymbol).join('')}|${finalState.units.slice(8, 12).map(u => u.currentSymbol).join('')}>`;
    console.log(`Final Skeleton (after carry propagation): ${skeletonDisplay}`);
    return finalState;
  }
}