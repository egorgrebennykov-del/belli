import * as Crypto from 'expo-crypto';

/**
 * Hashes the user's password client-side with SHA-256 and a domain+email salt
 * so the raw plaintext password never leaves the device.
 */
export async function hashPassword(email: string, password: string): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  const payload = `wavie-auth-v1:${normalizedEmail}:${password}`;
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, payload);
}
