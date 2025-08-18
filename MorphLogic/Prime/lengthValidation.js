export function lengthValidation(skeleton) {
  const numberStr = [
    skeleton.unit1.symbol,
    skeleton.unit2.symbol,
    skeleton.unit3.symbol,
    skeleton.unit4.symbol,
    skeleton.unit5.symbol
  ].join('');
  const digitLength = numberStr.length;
  const factorLength = Math.ceil(digitLength / 2);
  return { pLength: factorLength, qLength: factorLength };
}