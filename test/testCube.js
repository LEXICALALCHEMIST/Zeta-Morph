import { userDummy } from '../userTest/userDummy.js';

console.log('MorphCube Initialized');
console.log('Imported userDummy:', userDummy);

// Morph Cube class to handle transactions
export class MorphCube {
  constructor() {
    this.user = userDummy;
  }

  // Method to access the user's current skeleton value
  getUserSkeleton() {
    console.log(`Retrieving user skeleton: ${this.user.currentSKEL}`);
    return this.user.currentSKEL;
  }
}