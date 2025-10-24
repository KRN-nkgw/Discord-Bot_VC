import { handleVcCommand } from './vc.js';
import { handlePingCommand } from './ping.js';
import { replyEphemeral } from '../utils/discord.js';

/**
 * コマンドハンドラーのマップ
 * 新しいコマンドを追加する場合は、ここに登録する
 */

const commandHandlers = {
  vc: handleVcCommand,
  ping: handlePingCommand,
};

/**
 * インタラクションを処理して適切なコマンドハンドラーに振り分ける
 */

export async function handleInteraction(interaction, env) {
  const commandName = interaction.data.name;
  const handler = commandHandlers[commandName];

  if (!handler) {
    return replyEphemeral(`❌ 不明なコマンド: ${commandName}`);
  }

  try {
    return await handler(interaction, env);
  } catch (error) {
    console.error(`Error handling command ${commandName}:`, error);
    return replyEphemeral('❌ コマンドの実行中にエラーが発生しマシタ。');
  }
}
