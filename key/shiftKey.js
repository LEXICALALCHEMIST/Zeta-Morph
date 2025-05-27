import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class ShiftKey {
  shift(key, targetLength) {
    console.log(`Shifting key for ${key.number} to targetLength: ${targetLength}`);
    
    if (targetLength < 1 || targetLength > 6) {
      throw new Error('Target length must be between 1 and 6');
    }
    
    const oldPush = key.push;
    console.log(`Shifting key: Old: PUSH[${oldPush.join(', ')}]`);
    
    const newPush = Array(targetLength).fill().map((_, i) => `U${i + 1}:null`);
    const newView = Array(targetLength).fill(VOID_SYMBOL);
    
    const digits = key.number.toString().split('').map(Number);
    const startIndex = Math.max(0, targetLength - digits.length);
    
    for (let i = 0; i < digits.length && startIndex + i < targetLength; i++) {
      const unit = `U${startIndex + i + 1}`;
      newPush[startIndex + i] = `${unit}:${digits[i]}`;
      newView[startIndex + i] = SYMBOL_SEQUENCE[digits[i]];
    }
    
    const newKey = {
      number: key.number,
      length: key.length,
      targetLength,
      push: newPush,
      view: newView,
      targetUnit: `u${targetLength}`
    };
    
    console.log(`Shifting key: New: PUSH[${newPush.join(', ')}]`);
    return newKey;
  }
}