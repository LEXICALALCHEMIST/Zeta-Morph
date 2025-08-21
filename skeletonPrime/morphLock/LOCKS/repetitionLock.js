export function repetitionLock(primeSkeleton) {
  const digits = [
    primeSkeleton.unit1.symbol,
    primeSkeleton.unit2.symbol,
    primeSkeleton.unit3.symbol,
    primeSkeleton.unit4.symbol,
    primeSkeleton.unit5.symbol
  ].map(Number);
  
  const lockCodes = {
    unitOne: [],
    unitTwo: [],
    unitThree: [],
    unitFour: [],
    unitFive: []
  };
  
  // Unit 1 single-digit lock
  const unit1Digit = digits[0];
  if (unit1Digit) {
    lockCodes.unitOne.push(`R-U1-${[2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== unit1Digit).join('.')}`);
  }
  
  // Check for repeated digit pairs (e.g., units 1-2)
  if (digits[0] === digits[1] && digits[0] !== 0) {
    lockCodes.unitOne.push(`R-U1-${[2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== digits[0]).join('.')}`);
    lockCodes.unitTwo.push(`R-U2-${[2, 3, 4, 5, 6, 7, 8, 9].filter(d => d !== digits[1]).join('.')}`);
  }
  
  return lockCodes;
}