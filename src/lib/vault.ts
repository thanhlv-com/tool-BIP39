import CryptoJS from "crypto-js";

export interface VaultItem {
  id: string;
  name: string;
  phrase: string[];
  createdAt: number;
  wordCount: number;
}

const VAULT_KEY = "bip39_offline_vault_data";

export const getHasVault = (): boolean => {
  return !!localStorage.getItem(VAULT_KEY);
};

export const encryptVault = (data: VaultItem[], password: string): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
};

export const decryptVault = (ciphertext: string, password: string): VaultItem[] | null => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, password);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    if (!decrypted) return null;
    return JSON.parse(decrypted);
  } catch (error) {
    return null; // Incorrect password or corrupted data
  }
};

export const saveToVault = (password: string, newItem: VaultItem): boolean => {
  const encryptedLocal = localStorage.getItem(VAULT_KEY);
  let currentData: VaultItem[] = [];

  if (encryptedLocal) {
    const decrypted = decryptVault(encryptedLocal, password);
    if (!decrypted) return false; // Password incorrect
    currentData = decrypted;
  }

  currentData.push(newItem);
  const newEncrypted = encryptVault(currentData, password);
  localStorage.setItem(VAULT_KEY, newEncrypted);
  return true;
};

export const loadVault = (password: string): VaultItem[] | null => {
  const encryptedLocal = localStorage.getItem(VAULT_KEY);
  if (!encryptedLocal) return [];
  return decryptVault(encryptedLocal, password);
};

export const updateVaultWhole = (password: string, newItems: VaultItem[]): boolean => {
  const newEncrypted = encryptVault(newItems, password);
  localStorage.setItem(VAULT_KEY, newEncrypted);
  return true;
};
