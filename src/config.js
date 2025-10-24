/**
 * ボイスチャンネルIDと送信先テキストチャンネルIDのマッピング
 */
export const CHANNEL_MAPPING = {
  // 例: 'ボイスチャンネルID': 'テキストチャンネルID'
  '1409166381953454207': '1417123430930710572', // パニグレVC → パニグレ全体
  '1409188402938642582': '1409187035230638080', // BボイスVC → Bテキスト

  // テスト用チャンネル
  '1430568917587464222': '1409318768458596413', // MTG → dev
};

/**
 * 指定されたボイスチャンネルIDに対応するテキストチャンネルIDを取得
 * @param {string} voiceChannelId - ボイスチャンネルのID
 * @returns {string|null} 対応するテキストチャンネルID、または null
 */
export function getTargetChannelId(voiceChannelId) {
  return CHANNEL_MAPPING[voiceChannelId] || null;
}
