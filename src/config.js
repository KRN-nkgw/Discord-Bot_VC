/**
 * ボイスチャンネルIDと送信先テキストチャンネルIDのマッピング
 */
export const CHANNEL_MAPPING = {
  // 例: 'ボイスチャンネルID': 'テキストチャンネルID'
  '1409166381953454207': '1417123430930710572', // パニグレVC → パニグレ全体
  '1409188402938642582': '1409187035230638080', // 鳴潮VC → 鳴潮全体
  '1430568917587464222': '1409318768458596413', // MTG → dev
};

/**
 * デフォルトで常にメンションする対象（ロールIDまたはユーザーID）
 * ロールの場合: <@&ID> 形式でメンションされます
 * ユーザーの場合: <@ID> 形式でメンションされます
 *
 * ロールIDの取得方法:
 * サーバー設定 → ロール → 対象ロールを右クリック → IDをコピー（開発者モードON必要）
 */
export const DEFAULT_MENTION_ID = '1530156698759856308';

/**
 * DEFAULT_MENTION_ID がロールかユーザーかを指定
 * 'role' または 'user'
 */
export const DEFAULT_MENTION_TYPE = 'role';

/**
 * 任意で追加できるメンション対象（ロールIDまたはユーザーID）
 * コマンドの mention オプションを true にした場合のみ付与されます
 */
export const ADDITIONAL_MENTION_ID = '1530157155485745293';

/**
 * ADDITIONAL_MENTION_ID がロールかユーザーかを指定
 * 'role' または 'user'
 */
export const ADDITIONAL_MENTION_TYPE = 'role';

/**
 * 指定されたボイスチャンネルIDに対応するテキストチャンネルIDを取得
 * @param {string} voiceChannelId - ボイスチャンネルのID
 * @returns {string|null} 対応するテキストチャンネルID、または null
 */
export function getTargetChannelId(voiceChannelId) {
  return CHANNEL_MAPPING[voiceChannelId] || null;
}
