/**
 * 指定されたチャンネルにメッセージを送信
 */

export async function sendMessage(channelId, content, botToken) {
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(content),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send message: ${error}`);
  }

  return await response.json();
}

/**
 * 埋め込みメッセージを送信
 */

export async function sendEmbed(channelId, embed, botToken) {
  return await sendMessage(channelId, { embeds: [embed] }, botToken);
}

/**
 * 通常テキストと埋め込みメッセージを同時に送信
 */

export async function sendMessageWithEmbed(channelId, content, embed, botToken) {
  return await sendMessage(
    channelId,
    {
      content,
      embeds: [embed],
    },
    botToken
  );
}

/**
 * 通常テキストのみを送信
 */

export async function sendTextMessage(channelId, content, botToken) {
  return await sendMessage(channelId, { content }, botToken);
}

/**
 * ボイスチャンネルのステータスを設定
 * @param {string} channelId - ボイスチャンネルのID
 * @param {string} status - 設定するステータス文字列（空文字でクリア）
 * @param {string} botToken - Bot Token
 */
export async function setVoiceChannelStatus(channelId, status, botToken) {
  const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/voice-status`, {
    method: 'PUT',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to set voice channel status: ${error}`);
  }
}

/**
 * インタラクションへの応答を作成
 */

export function createResponse(type, data) {
  return new Response(JSON.stringify({ type, data }), { headers: { 'Content-Type': 'application/json' } });
}

/**
 * エフェメラル（本人にのみ表示）メッセージで応答
 */

export function replyEphemeral(content) {
  return createResponse(4, {
    content,
    flags: 64, // ephemeral flag
  });
}

/**
 * 通常のメッセージで応答
 */

export function reply(content) {
  return createResponse(4, { content });
}
