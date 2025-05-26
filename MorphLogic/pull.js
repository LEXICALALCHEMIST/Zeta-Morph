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
          // Skip negative carry application, handled by Contract
          if (this.skeleton.carryBus.carryValue < 0) {
            console.log(`Skipping negative carry application: ${this.skeleton.carryBus.carryValue}`);
            this.skeleton.carryBus.flushCarry(); // Clear carry without applying
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