import { Shard } from '../morphPortal/shard.js';

export const MorphicPortal = {
  shards: Array.from({ length: 100 }, (_, i) => Shard(`shard-${i + 1}`, (i % 9) + 1)),
  distributeLockCodes(lockCodes) {
    this.shards.forEach(shard => {
      shard.receiveLockCodes(lockCodes);
    });
  }
};