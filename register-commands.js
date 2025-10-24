// このスクリプトを使ってDiscordにスラッシュコマンドを登録します
// Node.jsで実行: node register-commands.js

// 環境変数から取得（.envファイルまたはシェルから設定）
const APPLICATION_ID = process.env.DISCORD_APPLICATION_ID; // Discord Developer Portalから取得
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN; // Discord Developer Portalから取得
const GUILD_ID = process.env.DISCORD_GUILD_ID; // サーバーIDを右クリックでコピー（開発者モードON必要）

// 必須チェック
if (!APPLICATION_ID || !BOT_TOKEN || !GUILD_ID) {
  console.error('❌ 環境変数が設定されていません。');
  console.error('以下を設定してください:');
  console.error('  DISCORD_APPLICATION_ID');
  console.error('  DISCORD_BOT_TOKEN');
  console.error('  DISCORD_GUILD_ID');
  process.exit(1);
}

// コマンドの定義
const commands = [
  {
    name: 'vc',
    description: 'ボイスチャンネル関連コマンド',
    options: [
      {
        name: 'start',
        description: '配信をアピールする',
        type: 1, // SUB_COMMAND型
        options: [
          {
            name: 'message',
            description: '配信内容など一言（任意）',
            type: 3, // STRING型
            required: false,
          },
        ],
      },
    ],
  },
  // {
  //   name: 'ping',
  //   description: 'Botの動作確認をします',
  // },
];

// コマンドを登録する関数
async function registerCommands() {
  const url = `https://discord.com/api/v10/applications/${APPLICATION_ID}/guilds/${GUILD_ID}/commands`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bot ${BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commands),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ コマンドの登録に成功しました！');
      console.log(JSON.stringify(data, null, 2));
    } else {
      const error = await response.text();
      console.error('❌ コマンド登録エラー:', error);
    }
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

registerCommands();
