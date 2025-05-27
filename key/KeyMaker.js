import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/sacred9.js';

export default class KeyMaker {
  makeKey(number) {
    console.log(`Generating key for ${number}`);
    
    if (number < 0 || number > 999999) {
      throw new Error('Number must be between 0 and 999999');
    }
    
    const digits = number.toString().split('').map(Number);
    const length = digits.length;
    
    const push = [];
    const view = [];
    
    for (let i = 0; i < 6; i++) {
      const digit = digits[i];
      const unit = `U${i + 1}`;
      if (digit !== undefined) {
        push.push(`${unit}:${digit}`);
        view.push(SYMBOL_SEQUENCE[digit]);
      } else {
        push.push(`${unit}:null`);
        view.push(VOID_SYMBOL);
      }
    }
    
    const key = {
      number,
      length,
      push,
      view
    };
    
    console.log(`KEY:${key.number} LENGTH:${key.length} PUSH[${key.push.join(' ')}] VIEW:${key.view.join('|')}`);
    return key;
  }
}