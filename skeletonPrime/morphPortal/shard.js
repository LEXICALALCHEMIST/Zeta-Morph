export function Shard(id, digitFilter) {
  const skeleton = {
    unit1: { symbol: null, morphlocks: {} },
    unit2: { symbol: null, morphlocks: {} },
    unit3: { symbol: null, morphlocks: {} },
    unit4: { symbol: null, morphlocks: {} },
    unit5: { symbol: null, morphlocks: {} },
    unit6: { symbol: null, morphlocks: {} }
  };

  return {
    id,
    digitFilter,
    skeleton,
    applyLocks(lockCodes) {
      Object.keys(lockCodes).forEach(unit => {
        const unitNum = unit.replace('unit', '').toLowerCase();
        const targetUnit = `unit${unitNum}`;
        if (skeleton[targetUnit]) {
          skeleton[targetUnit].morphlocks = lockCodes[unit];
        }
      });
    },
    receiveLockCodes(lockCodes) {
      this.applyLocks(lockCodes);
      console.log(`Shard ${this.id} (Digit ${this.digitFilter}) Skeleton: ${JSON.stringify(this.skeleton)}`);
    }
  };
}