import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PushModule from '../MorphLogic/PushModule.js';
import { SYMBOL_SEQUENCE } from '../core/SacredSymbols.js';
import watcher from '../utils/watcher.js';
import weaver from '../utils/weaver.js';

export class ReceiveCube {
  constructor(user) {
    this.user = user; // {id: string, currentSKEL: number}
  }

  async processMorphOps(morphOps) {
    if (!morphOps || !Array.isArray(morphOps)) {
      throw new Error('ReceiveCube: Invalid morphOps format');
    }

    let currentSKEL = this.user.currentSKEL;
    let newSkeletonJson = null;

    // Initialize skeleton for set phase
    const skeleton = new SkeletonInitializer();
    await skeleton.set(currentSKEL, true);
    const initialState = skeleton.getState();
    
    // Capture set phase
    watcher({
      phase: 'set',
      state: {
        initialSKEL: currentSKEL,
        units: initialState.units.map(u => u.currentSymbol),
        numberLength: initialState.numberLength
      }
    });

    // Process each morphOp
    for (const morphOp of morphOps) {
      if (morphOp.INTENT !== 'PUSH' || !Number.isInteger(morphOp.VALUE) || morphOp.VALUE < 0) {
        throw new Error(`ReceiveCube: Invalid morphOp - INTENT: ${morphOp.INTENT}, VALUE: ${morphOp.VALUE}`);
      }

      // Process PUSH
      newSkeletonJson = await this.morph(currentSKEL, morphOp);

      // Update currentSKEL
      const newSkeleton = JSON.parse(newSkeletonJson);
      currentSKEL = parseInt(newSkeleton.units.slice(0, newSkeleton.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.currentSymbol)).join('') || '0', 10);
      this.user.currentSKEL = currentSKEL;
    }

    // Capture final phase
    if (newSkeletonJson) {
      const finalState = JSON.parse(newSkeletonJson);
      watcher({
        phase: 'final',
        skeleton: currentSKEL,
        units: finalState.units.map(u => u.currentSymbol),
        length: finalState.numberLength,
        userId: this.user.id || 'user-placeholder'
      });
    }

    return {
      currentSKEL,
      newSkeletonJson,
      pom: weaver.pom
    };
  }

  // In rCUBE.js, update morph method
  async morph(currentSKEL, morphOp) {
    const skeleton = new SkeletonInitializer();
    await skeleton.set(currentSKEL, true);

    const pushModule = new PushModule(skeleton);
    const updatedState = await pushModule.push(morphOp.VALUE, morphOp.morphId); // Pass morphId

    const newSkeletonJson = JSON.stringify(updatedState);
    return newSkeletonJson;
  }

  getPOM() {
    return weaver.pom || null;
  }
}