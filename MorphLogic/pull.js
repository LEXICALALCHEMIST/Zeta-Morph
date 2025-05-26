import KeyMaker from '../key/keyMaker.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class Pull {
  constructor(skeleton) {
    this.skeleton = skeleton;
    this.keyMaker = new KeyMaker();
  }

  pull(keyNumber, shiftedKey) {
    console.log(`Applying PULL for ${keyNumber}`);
    
    const key = shiftedKey || this.keyMaker.makeKey(keyNumber);
    const units = this.skeleton.units;

    for (let i = 0; i < key.push.length; i++) {
      const pushEntry = key.push[i];
      const [unitName, value] = pushEntry.split(':');
      const unitIndex = parseInt(unitName.replace('U', '')) - 1;
      const unit = units[unitIndex];
      const position = `u${unitIndex + 1}`;

      const currentSymbol = unit.state.currentSymbol || VOID_SYMBOL;

      if (value !== 'null') {
        const numValue = parseInt(value);
        if (numValue > 0) {
          console.log(`Pulling ${unitName}-${position}: ${numValue}`);
          unit.pull(numValue, this.skeleton.carryBus);
          if (this.skeleton.carryBus.carryValue < 0) {
            const { carryValue, carryTarget } = this.skeleton.carryBus.flushCarry();
            const targetIndex = parseInt(carryTarget.replace('Unit', '')) - 1;
            if (targetIndex >= 0 && targetIndex < units.length) {
              units[targetIndex].pull(-carryValue, this.skeleton.carryBus);
              console.log(`Negative carry applied to Unit${targetIndex + 1}: ${carryValue}`);
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
      unit.state.pushes = [];
      unit.state.pushesLength = 0;
    });

    const state = this.skeleton.getState();
    console.log(`Final Skeleton: <${state.units.map(u => u.currentSymbol).join('')}|⊙⊙⊙|⊙⊙⊙>`);
    return state;
  }
}    