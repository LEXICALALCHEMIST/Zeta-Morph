import SkeletonInitializer from '../MorphLogic/SkeletonInitializer.js';
import PushModule from '../MorphLogic/PushModule.js';
import PullModule from '../MorphLogic/PullModule.js';
import { SYMBOL_SEQUENCE, VOID_SYMBOL } from '../core/SacredSymbols.js';

export async function receive(morphCode) {
  // Define the placeholder MORPH PIN
  const VALID_MORPH_PIN = '◇◇●●';

  // Parse the morph code
  const regex = /MORPHCODE: Intent: (PUSH|PULL), value: (\d+), MORPHPIN: (.+)/;
  const match = morphCode.match(regex);
  
  if (!match) {
    throw new Error('ZTRL receive: Invalid morph code format');
  }

  const [, intent, valueStr, morphPin] = match;
  const value = parseInt(valueStr, 10);

  // Validate the MORPH PIN
  if (morphPin !== VALID_MORPH_PIN) {
    throw new Error('ZTRL receive: Invalid MORPH PIN. Verification failed.');
  }

  // Validate the value
  if (isNaN(value) || value < 0) {
    throw new Error('ZTRL receive: Value must be a non-negative integer');
  }

  // Log receipt from NUEROM
  console.log(`ZTRL received from NUEROM: Intent: ${intent}, value: ${value}, MORPHPIN: ${morphPin}`);

  // Initialize skeleton starting at 0
  const skeleton = new SkeletonInitializer();
  await skeleton.set(0, intent === 'PUSH');

  // Execute the operation based on intent
  let state;
  if (intent === 'PUSH') {
    const pushModule = new PushModule(skeleton);
    state = await pushModule.push(value);
  } else if (intent === 'PULL') {
    const pullModule = new PullModule(skeleton);
    state = await pullModule.pull(value);
  } else {
    throw new Error('ZTRL receive: Unsupported intent');
  }

  // Log the final skeleton state
  const skeletonDisplay = `<${state.units.slice(0, 4).map(u => u.currentSymbol).join('')}|${state.units.slice(4, 8).map(u => u.currentSymbol).join('')}|${state.units.slice(8, 12).map(u => u.currentSymbol).join('')}>`;
  console.log(`ZTRL operation result: Skeleton: ${skeletonDisplay}`);

  return state;
}