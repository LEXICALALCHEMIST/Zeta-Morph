export function morphLock(lockCodes, factorCut) {
  console.log(`factorCut: ${JSON.stringify(factorCut)}`);
  console.log('MorphicLocks:', {
    unitOne: lockCodes.unitOne || [],
    unitTwo: lockCodes.unitTwo || [],
    unitThree: lockCodes.unitThree || [],
    unitFour: lockCodes.unitFour || [],
    unitFive: lockCodes.unitFive || []
  });
}