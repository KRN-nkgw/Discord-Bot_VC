/**
 * ユーザーがボイスチャンネルに参加しているかを確認
 * @param {string} guildId - サーバーID
 * @param {string} userId - ユーザーID
 * @param {string} botToken - Bot Token
 * @returns {Promise<{inVoice: boolean, channelId: string|null}>}
 */

export async function checkUserInVoice(guildId, userId, botToken) {
  try {
    // Guild Voice States APIを使用してユーザーのボイス状態を取得
    const response = await fetch(`https://discord.com/api/v10/guilds/${guildId}/voice-states/${userId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });

    // 404が返ってきた場合、ユーザーはボイスチャンネルに参加していない
    if (response.status === 404) {
      return { inVoice: false, channelId: null };
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch voice state:', response.status, errorText);
      return { inVoice: false, channelId: null };
    }

    const voiceState = await response.json();
    const channelId = voiceState.channel_id || null;

    return {
      inVoice: channelId !== null,
      channelId: channelId,
    };
  } catch (error) {
    console.error('Error checking voice state:', error);
    return { inVoice: false, channelId: null };
  }
}
