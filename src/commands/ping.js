import { reply } from '../utils/discord.js';

/**
 * pingコマンドの処理（動作確認用）
 */
export async function handlePingCommand(interaction, env) {
  return reply('🏓 Pong!');
}
