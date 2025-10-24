import { verifyKey } from 'discord-interactions';

/**
 * Discordからのリクエストの署名を検証
 */
export async function verifyRequest(request, body, publicKey) {
  const signature = request.headers.get('X-Signature-Ed25519');
  const timestamp = request.headers.get('X-Signature-Timestamp');

  return verifyKey(body, signature, timestamp, publicKey);
}
