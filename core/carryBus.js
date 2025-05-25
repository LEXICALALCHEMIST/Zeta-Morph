// carryBus.js
// Located in ZetaMorph/core/

export default class CarryBus {
  constructor() {
    this.carryValue = 0;
    this.carryTarget = null;
    this.carryHistory = [];
  }

  registerCarry(value, target) {
    this.carryValue = value;
    this.carryTarget = target;
    this.carryHistory.push({ from: 'unknown', to: target, value });
    console.log(`CarryBus: Registered CARRY: ${value} to ${target}`); // Debug log
  }

  flushCarry() {
    const carry = {
      carryValue: this.carryValue,
      carryTarget: this.carryTarget
    };
    console.log(`CarryBus: Flushed CARRY: ${this.carryValue} to ${this.carryTarget}`); // Debug log
    this.carryValue = 0;
    this.carryTarget = null;
    return carry;
  }
}