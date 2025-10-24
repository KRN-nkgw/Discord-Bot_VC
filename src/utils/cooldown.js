/**
 * クールタイムの長さ（ミリ秒）
 * 30分 = 30 * 60 * 1000
 */

const COOLDOWN_DURATION = 30 * 60 * 1000;

/**
 * ユーザーがクールタイム中かチェック
 * @param {string} userId - ユーザーID
 * @param {KVNamespace} kv - Cloudflare KV namespace
 * @returns {Promise<{onCooldown: boolean, remainingTime: number|null}>}
 */

export async function checkCooldown(userId, kv) {
  try {
    const key = `cooldown:${userId}`;
    const lastExecutionTime = await kv.get(key);

    if (!lastExecutionTime) {
      // 初回実行
      return { onCooldown: false, remainingTime: null };
    }

    const lastTime = parseInt(lastExecutionTime, 10);
    const now = Date.now();
    const timeSinceLastExecution = now - lastTime;

    if (timeSinceLastExecution < COOLDOWN_DURATION) {
      // クールタイム中
      const remainingTime = COOLDOWN_DURATION - timeSinceLastExecution;
      return { onCooldown: true, remainingTime };
    }

    // クールタイム終了
    return { onCooldown: false, remainingTime: null };
  } catch (error) {
    console.error('Error checking cooldown:', error);
    // エラー時はクールタイムなしとして処理
    return { onCooldown: false, remainingTime: null };
  }
}

/**
 * クールタイムを設定
 * @param {string} userId - ユーザーID
 * @param {KVNamespace} kv - Cloudflare KV namespace
 */
export async function setCooldown(userId, kv) {
  try {
    const key = `cooldown:${userId}`;
    const now = Date.now().toString();
    // 31分後に自動削除（30分 + 余裕1分）
    await kv.put(key, now, { expirationTtl: 31 * 60 });
  } catch (error) {
    console.error('Error setting cooldown:', error);
  }
}

/**
 * 残り時間を人間が読める形式に変換
 * @param {number} milliseconds - ミリ秒
 * @returns {string} - "X分Y秒" の形式
 */
export function formatRemainingTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes > 0 && seconds > 0) {
    return `${minutes}分${seconds}秒`;
  } else if (minutes > 0) {
    return `${minutes}分`;
  } else {
    return `${seconds}秒`;
  }
}
