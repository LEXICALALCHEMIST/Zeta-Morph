// shiftKey.js
// Located in ZetaMorph/key/

import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class ShiftKey {
  shift(key, targetLength) {
    console.log(`Shifting key for ${key.number} to targetLength: ${targetLength}`);
    
    // Validate targetLength
    if (targetLength < 1 || targetLength > 3) {
      throw new Error('targetLength must be between 1 and 3');
    }
    
    // Extract original push and view
    const oldPush = [...key.push];
    const oldView = [...key.view];
    
    // Parse digits from push
    const digits = key.push.map(entry => {
      const [, value] = entry.split(':');
      return value === 'null' ? null : parseInt(value);
    });
    
    // Shift digits rightward
    const newDigits = Array(3).fill(null);
    const shiftAmount = targetLength - key.length;
    if (shiftAmount >= 0) {
      for (let i = 0; i < key.length; i++) {
        newDigits[i + shiftAmount] = digits[i];
      }
    } else {
      // Truncate if targetLength < key.length
      for (let i = 0; i < targetLength; i++) {
        newDigits[i] = digits[i + key.length - targetLength];
      }
    }
    
    // Generate new push and view
    const newPush = newDigits.map((value, i) => {
      const unit = `U${i + 1}`;
      return `${unit}:${value === null ? 'null' : value}`;
    });
    const newView = newDigits.map(value => value === null ? VOID_SYMBOL : SYMBOL_SEQUENCE[value]);
    
    // Determine new targetUnit
    let targetUnit = null;
    for (let i = newDigits.length - 1; i >= 0; i--) {
      if (newDigits[i] !== null) {
        targetUnit = `u${i + 1}`;
        break;
      }
    }
    
    const newKey = {
      number: key.number,
      length: key.length,
      targetLength,
      push: newPush,
      view: newView,
      targetUnit
    };
    
    console.log(`Shifting key: Old: PUSH[${oldPush.join(' ')}], New: PUSH[${newPush.join(' ')}]`);
    return newKey;
  }
}