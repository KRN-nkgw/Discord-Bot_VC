import { verifyRequest } from './utils/verify.js';
import { handleInteraction } from './commands/index.js';

export default {
  async fetch(request, env) {
    // POSTリクエスト以外は拒否
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // リクエストの署名を検証
    const body = await request.text();
    const isValid = await verifyRequest(request, body, env.DISCORD_PUBLIC_KEY);

    if (!isValid) {
      return new Response('Invalid request signature', { status: 401 });
    }

    const interaction = JSON.parse(body);

    // Ping応答（Discordの接続確認）
    if (interaction.type === 1) {
      return new Response(JSON.stringify({ type: 1 }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // スラッシュコマンド処理
    if (interaction.type === 2) {
      return await handleInteraction(interaction, env);
    }

    return new Response('Unknown interaction type', { status: 400 });
  },
};
