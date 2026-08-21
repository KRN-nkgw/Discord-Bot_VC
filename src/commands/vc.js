import { sendMessageWithEmbed, sendTextMessage, setVoiceChannelStatus, replyEphemeral } from '../utils/discord.js';
import { getTargetChannelId, DEFAULT_MENTION_ID, DEFAULT_MENTION_TYPE, ADDITIONAL_MENTION_ID, ADDITIONAL_MENTION_TYPE } from '../config.js';
import { checkUserInVoice } from '../utils/voice.js';
import { checkCooldown, setCooldown, formatRemainingTime } from '../utils/cooldown.js';

/**
 * vcコマンドの処理
 */
export async function handleVcCommand(interaction, env) {
  // サブコマンドを取得
  const subcommand = interaction.data.options?.[0];

  if (!subcommand || subcommand.name !== 'start') {
    return replyEphemeral('❌ 不明なサブコマンドです。');
  }

  // startサブコマンドの処理
  return await handleVcStart(interaction, subcommand.options || [], env);
}

/**
 * /vc start サブコマンドの処理
 */
async function handleVcStart(interaction, options, env) {
  // オプションからメッセージを取得（任意）
  const messageOption = options.find((opt) => opt.name === 'message');
  const message = messageOption?.value || null;

  // オプションから追加メンションのON/OFFを取得（デフォルト: false）
  const mentionOption = options.find((opt) => opt.name === 'mention');
  const shouldMentionAdditional = mentionOption?.value === true;

  // ユーザー情報を取得
  // サーバー内での表示名（ニックネーム）を優先、なければグローバル表示名、最後にユーザー名
  const displayName = interaction.member?.nick || interaction.member?.user?.global_name || interaction.member?.user?.username || 'Unknown';
  const userId = interaction.member?.user?.id;

  // チャンネル情報を取得
  const guildId = interaction.guild_id;

  // ユーザーがボイスチャンネルに参加しているか確認
  const userVoiceState = await checkUserInVoice(guildId, userId, env.DISCORD_BOT_TOKEN);

  if (!userVoiceState.inVoice) {
    return replyEphemeral('❌ このコマンドはボイスチャンネルに参加している時のみ使用できマス。');
  }

  const channelId = userVoiceState.channelId;
  console.log('Debug - User in voice channel:', channelId);

  // コマンドを実行したチャンネルに対応する送信先チャンネルを取得
  const targetChannelId = getTargetChannelId(channelId);
  console.log('Debug - Channel mapping:', { voiceChannel: channelId, targetChannel: targetChannelId });

  // クールタイムチェック（チャンネルごと）
  const cooldownStatus = await checkCooldown(userId, channelId, env.COOLDOWN_KV);

  if (cooldownStatus.onCooldown) {
    const remainingTimeText = formatRemainingTime(cooldownStatus.remainingTime);
    return replyEphemeral(
      `⏳ クールタイム中デス！
あと ${remainingTimeText}後 に実行できマス。`
    );
  }

  // マッピングが見つからない場合
  if (!targetChannelId) {
    console.log('Debug - No mapping found for channel:', channelId);
    return replyEphemeral('❌ このチャンネルからはメッセージを送信できマセン。\n' + '設定されたボイスチャンネルでコマンドを実行してクダサイ。');
  }

  // 通常テキスト部分（ボイスチャンネルのリンク付き）
  const defaultMention = DEFAULT_MENTION_TYPE === 'role' ? `<@&${DEFAULT_MENTION_ID}>` : `<@${DEFAULT_MENTION_ID}>`;

  // オプションがtrueの場合のみ、あらかじめ決めた追加メンションを付与
  const additionalMention = shouldMentionAdditional ? ' ' + (ADDITIONAL_MENTION_TYPE === 'role' ? `<@&${ADDITIONAL_MENTION_ID}>` : `<@${ADDITIONAL_MENTION_ID}>`) : '';

  const content = `📢 **${displayName}** が配信を始めマシタ。
${defaultMention}${additionalMention}
https://discord.com/channels/${guildId}/${channelId}`;

  try {
    // メッセージの有無をチェック（空文字列やnullを除外）
    if (message && message.trim() !== '') {
      // メッセージがある場合: embed付きで送信
      // 埋め込みメッセージを作成
      const embed = {
        author: {
          name: displayName,
          icon_url: userId && interaction.member?.user?.avatar ? `https://cdn.discordapp.com/avatars/${userId}/${interaction.member.user.avatar}.png` : undefined,
        },
        description: `┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈

${message}

┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈`,
        color: 0x232222,
        timestamp: new Date().toISOString(),
      };

      await sendMessageWithEmbed(targetChannelId, content, embed, env.DISCORD_BOT_TOKEN);
    } else {
      // メッセージがない場合: contentのみ送信
      await sendTextMessage(targetChannelId, content, env.DISCORD_BOT_TOKEN);
    }

    // ボイスチャンネルのステータスにも反映（メッセージがある場合のみ）
    if (message && message.trim() !== '') {
      try {
        await setVoiceChannelStatus(channelId, message, env.DISCORD_BOT_TOKEN);
      } catch (statusError) {
        // ステータス設定に失敗してもメッセージ送信は成功しているので、ログのみ
        console.error('Error setting voice channel status:', statusError);
      }
    }

    // クールタイムを設定（チャンネルごと）
    await setCooldown(userId, channelId, env.COOLDOWN_KV);

    console.log('Debug - Message sent successfully to:', targetChannelId);

    // 実行者への応答
    return replyEphemeral(`✅ メッセージを <#${targetChannelId}> に送信しマシタ！`);
  } catch (error) {
    console.error('Error sending embed:', error);
    return replyEphemeral('❌ メッセージの送信に失敗しマシタ。');
  }
}
