# Discord Bot - VC通知Bot

ボイスチャンネルから指定のテキストチャンネルへ通知を送信するDiscord Bot

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example` をコピーして `.env` を作成：

```bash
cp .env.example .env
```

`.env` に実際の値を設定：

```env
DISCORD_APPLICATION_ID=123456789012345678
DISCORD_BOT_TOKEN=your_actual_bot_token
DISCORD_GUILD_ID=987654321098765432
```

### 3. チャンネルマッピングの設定

`src/config.js` を編集して、ボイスチャンネルとテキストチャンネルの対応を設定：

```javascript
export const CHANNEL_MAPPING = {
  'ボイスチャンネルID1': 'テキストチャンネルID1',
  'ボイスチャンネルID2': 'テキストチャンネルID2',
};
```

### 4. Cloudflare KV Namespaceの作成

```bash
npx wrangler kv:namespace create "COOLDOWN_KV"
```

表示された ID を `wrangler.jsonc` に設定。

### 5. Cloudflare Workersのシークレット設定

```bash
npx wrangler secret put DISCORD_PUBLIC_KEY
npx wrangler secret put DISCORD_BOT_TOKEN
```

### 6. コマンドの登録

```bash
npm run register
```

### 7. デプロイ

```bash
npm run deploy
```

### 8. Discord Developer Portalでエンドポイント設定

デプロイしたWorkerのURLを Discord Developer Portal の「INTERACTIONS ENDPOINT URL」に設定。

## コマンド

- `/vc start` - VC開始通知を送信
- `/vc start message:メッセージ` - メッセージ付きで送信
- `/ping` - Bot動作確認

## 管理コマンド

```bash
# クールタイムをクリア
npm run clear-cooldowns

# ログを確認
npx wrangler tail
```

## 注意事項

- `.env` ファイルは Git にコミットしないでください
- `wrangler.jsonc` も機密情報を含むため Git 管理から除外してください
- BOT_TOKEN は絶対に公開しないでください


```
discord-bot_vc/
├── src/
│   ├── index.js           # メインエントリーポイント
│   ├── commands/
│   │   ├── index.js       # コマンドルーター
│   │   ├── vc.js          # vcコマンド
│   │   └── ping.js        # pingコマンド
│   ├── utils/
│   │   ├── verify.js      # 署名検証
│   │   ├── discord.js     # Discord API
│   │   ├── voice.js       # ボイス状態確認
│   │   └── cooldown.js    # クールタイム管理
│   ├── config.js          # チャンネルマッピング
│   └── constants.js       # 定数定義
├── register-commands.js
├── clear-cooldowns.js
├── wrangler.jsonc
├── package.json
├── .env                   # Git管理外
├── .env.example
├── .gitignore
└── README.md
```