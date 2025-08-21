export function gapLock(primeSkeleton) {
  const numberStr = [
    primeSkeleton.unit1.symbol,
    primeSkeleton.unit2.symbol,
    primeSkeleton.unit3.symbol,
    primeSkeleton.unit4.symbol,
    primeSkeleton.unit5.symbol
  ].join('');
  const N = Number(numberStr);
  const sqrtN = Math.ceil(Math.sqrt(N)); // Start with ceil(sqrt(N))
  let a = sqrtN;
  let b2 = a * a - N;
  let b = Math.sqrt(b2);
  
  // Increment a until b^2 is close to a square or within reasonable range
  while (!Number.isInteger(b) && a < sqrtN + 100) {
    a++;
    b2 = a * a - N;
    b = Math.sqrt(b2);
  }
  
  // Estimate range: sqrt(N) ± b
  const rangeMin = Math.max(1, sqrtN - Math.floor(b));
  const rangeMax = sqrtN + Math.floor(b);
  
  // Generate full-spectrum lock code
  const lockCodes = {
    unitOne: [`G-FS-DistE-50%-${rangeMin}-${rangeMax}`],
    unitTwo: [],
    unitThree: [],
    unitFour: [],
    unitFive: []
  };
  
  return lockCodes;
}