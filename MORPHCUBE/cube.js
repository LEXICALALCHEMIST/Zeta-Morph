import { userDummy } from '../userTest/userDummy.js';

// Morph Cube class to handle transactions
export class MorphCube {
  constructor() {
    this.user = userDummy;
  }

  // Method to access the user's current skeleton value
  getUserSkeleton() {
    console.log(`
>>> WARSHIP COMMAND: RETRIEVING USER SKELETON...
>>> SKEL DATA: ${this.user.currentSKEL}
>>> OPERATION COMPLETE
`);
    return this.user.currentSKEL;
  }
}