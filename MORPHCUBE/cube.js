import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PushModule from '../MorphLogic/PushModule.js';
import { Signal } from '../ZTRL/signal.js';
import { SYMBOL_SEQUENCE } from '../core/SacredSymbols.js';

console.log('MorphCube Initialized');

// Class for receiving money (push to recipient's skeleton)
export class Cube {
  constructor(user) {
    this.user = user;
    this.skeleton = null;
    this.signal = new Signal(); // Initialize the Signal dispatcher
  }

  // Initialize the skeleton from user.currentSKEL
  async initializeSkeleton() {
    if (!this.skeleton) {
      this.skeleton = new SkeletonInitializer();
      await this.skeleton.set(this.user.currentSKEL, false);
      console.log(`Cube: Skeleton initialized with value: ${this.user.currentSKEL} for user: ${JSON.stringify(this.user)}`);
    }
    return this.skeleton;
  }

  // Method to access the user's current skeleton value
  getUserSkeleton() {
    console.log(`Cube: Retrieving user skeleton: ${this.user.currentSKEL}`);
    return this.user.currentSKEL;
  }

  // Method to process a received morphOp and update the skeleton
  async morph(currentSKEL, morphOp) {
    // Validate the morphOp
    if (!morphOp || typeof morphOp !== 'object') {
      throw new Error('Cube morph: Invalid morphOp format');
    }

    const { INTENT, VALUE } = morphOp;

    if (INTENT !== 'PUSH') {
      throw new Error('Cube morph: INTENT must be PUSH');
    }

    if (typeof VALUE !== 'number' || VALUE < 0 || !Number.isInteger(VALUE)) {
      throw new Error('Cube morph: VALUE must be a non-negative integer');
    }

    // Initialize the skeleton with the currentSKEL value
    const skeleton = new SkeletonInitializer();
    await skeleton.set(currentSKEL, false);
    console.log(`Cube morph: Skeleton initialized with value: ${currentSKEL}`);

    // Perform the PUSH operation using PushModule
    const pushModule = new PushModule(skeleton);
    const updatedState = await pushModule.push(VALUE);

    // Convert the updated state to a JSON string
    const newSkeletonJson = JSON.stringify(updatedState);
    console.log(`Cube morph: Updated skeleton JSON after pushing ${VALUE}: ${newSkeletonJson}`);

    return newSkeletonJson;
  }

  // Method to receive money by pushing to the recipient's skeleton
  async receiveRequest(value, morphPin) {
    try {
      // Step 1: Create the send object
      const sendObject = {
        intent: 'PUSH',
        value,
        morphPin,
        target: 'Dummy2'
      };

      // Step 2: Dispatch the receive request via Signal to get the morphOp
      console.log(`Cube: Receiving request - PUSH ${value} to recipient's skeleton`);
      const morphOp = await this.signal.receiveRequest(sendObject);

      // Step 3: Log the receive request
      console.log(`Cube: Processing morphOp - PUSH ${morphOp.VALUE} to recipient's skeleton`);

      // Step 4: Call morph() to process the morphOp and update the skeleton
      const newSkeletonJson = await this.morph(this.user.currentSKEL, morphOp);

      // Step 5: Update user's currentSKEL with the new value
      const newSkeleton = JSON.parse(newSkeletonJson);
      const newValue = parseInt(newSkeleton.units.slice(0, newSkeleton.numberLength).map(u => SYMBOL_SEQUENCE.indexOf(u.currentSymbol)).join('') || '0', 10);
      this.user.currentSKEL = newValue;
      console.log(`Cube: Recipient's skeleton updated to: ${this.user.currentSKEL}`);

      // Return the newSkeletonJson for further processing
      return newSkeletonJson;
    } catch (error) {
      console.error('Cube: Receive request failed:', error.message);
      throw error;
    }
  }

  // Method to export the finished skeleton as a JSON string
  finishMorph() {
    if (!this.skeleton) {
      throw new Error('No skeleton available. Run a transaction first.');
    }
    const skeletonJson = JSON.stringify(this.skeleton.getState());
    console.log(`Cube: Finish Morph: Exporting skeleton as JSON: ${skeletonJson}`);
    return skeletonJson;
  }
}