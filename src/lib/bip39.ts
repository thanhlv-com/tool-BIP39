import { Mnemonic, randomBytes } from "ethers";

export type WordCount = 12 | 15 | 18 | 21 | 24;

export const generateBip39 = (wordCount: WordCount = 12): string[] => {
  const bytesNeeded = {
    12: 16,
    15: 20,
    18: 24,
    21: 28,
    24: 32,
  }[wordCount];

  const entropy = randomBytes(bytesNeeded);
  const mnemonic = Mnemonic.fromEntropy(entropy);
  
  return mnemonic.phrase.split(" ");
};
