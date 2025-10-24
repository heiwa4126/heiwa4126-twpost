# heiwa4126-twpost (@heiwa4126/twpost)

[![npm version](https://img.shields.io/npm/v/@heiwa4126/twpost.svg)](https://www.npmjs.com/package/@heiwa4126/twpost)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

[English](https://github.com/heiwa4126/heiwa4126-twpost/blob/main/README.md) | 日本語

Teams の Workflows (Teams 版 Power Automate)の
「Webhook 要求を受信したらチャットに投稿する」テンプレートから作った workflow の
webhook に
Adaptive Cards 形式で投稿する関数のパッケージ

twpost は "Teams Webhook Post" の略です。

## インストール

```sh
npm install @heiwa4126/twpost
```

## 使用方法

### 基本的なテキストメッセージの送信

```typescript
import { postText, displayWebhookResult } from "@heiwa4126/twpost";

const webhookUrl = "あなたのTeams Webhook URL";
const result = await postText(webhookUrl, "**Hello!** from *my application*!");
displayWebhookResult(result);
```

### Adaptive Card オブジェクトを使用した投稿

`@microsoft/teams.cards`を使って型安全に Adaptive Card を作成：

```typescript
import { postCard, displayWebhookResult, SCHEMA_URL } from "@heiwa4126/twpost";
import { AdaptiveCard, DonutChart, DonutChartData, TextBlock } from "@microsoft/teams.cards";

const card = new AdaptiveCard(
  new TextBlock("**結果発表**", {
    wrap: true,
    size: "Large",
  }),
  new DonutChart({
    title: "売上データ",
  }).withData(
    new DonutChartData({ legend: "バナナ", value: 292 }),
    new DonutChartData({ legend: "キウイ", value: 179 }),
    new DonutChartData({ legend: "リンゴ", value: 143 })
  )
).withOptions({
  version: "1.5",
  $schema: SCHEMA_URL,
});

const result = await postCard(webhookUrl, card);
displayWebhookResult(result);
```

### JSON ペイロードを直接使用した投稿

Adaptive Card Designer で作成した JSON を直接使用：

```typescript
import { postRawCard, displayWebhookResult, SCHEMA_URL } from "@heiwa4126/twpost";

const rawCard = {
  type: "AdaptiveCard",
  $schema: SCHEMA_URL,
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      wrap: true,
      text: "**処理を開始しました** (ID=USO800)",
    },
    {
      type: "ProgressRing", // 最新のスキーマにないがTeamsでは表示される
      label: "処理進行中...",
      labelPosition: "After",
      size: "Tiny",
    },
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      title: "キャンセル",
      url: "https://api.example.com/cancel?id=uso800",
    },
  ],
};

const result = await postRawCard(webhookUrl, rawCard);
displayWebhookResult(result);
```

### 型安全を保ちつつ JSON ペイロードを使用した投稿

型チェックを活用しながら、スキーマにない要素は型キャストで対応：

```typescript
import { postCard, displayWebhookResult, SCHEMA_URL } from "@heiwa4126/twpost";
import type { IAdaptiveCard } from "@microsoft/teams.cards";

const card: IAdaptiveCard = {
  type: "AdaptiveCard",
  $schema: SCHEMA_URL,
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      wrap: true,
      text: "**処理を開始しました** (ID=USO800)",
    },
    // ProgressRing は最新のスキーマにないが Teams では表示される
    // unknown キャストで型チェックを回避
    {
      type: "ProgressRing",
      label: "処理進行中...",
      labelPosition: "After",
      size: "Tiny",
    } as unknown as IAdaptiveCard["body"][0],
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      iconUrl: "icon:CalendarCancel",
      style: "destructive",
      title: "キャンセル",
      url: "https://api.example.com/cancel?id=uso800",
    },
    {
      type: "Action.OpenUrl",
      title: "処理の説明",
      url: "https://api.example.com/description?id=uso800",
    },
  ],
};

const result = await postCard(webhookUrl, card);
displayWebhookResult(result);
```

## API リファレンス

### `postText(webhookUrl: string, text: string): Promise<WebHookResponse>`

シンプルなテキストメッセージを送信します。限定的な Markdown をサポートします。

### `postCard(webhookUrl: string, card: IAdaptiveCard): Promise<WebHookResponse>`

型チェック付きで Adaptive Card を送信します。

### `postRawCard(webhookUrl: string, rawCard: object): Promise<WebHookResponse>`

オブジェクトを直接 Adaptive Card 形式として送信します。バリデーションは行いません。

### `displayWebhookResult(webhookResponse: WebHookResponse): void`

レスポンス情報をコンソールに表示します。

## 注意事項

- `@microsoft/teams.cards`の JSON スキーマは完全ではなく、Teams で実際に使用可能な要素タイプが含まれていない場合があります
- 新しい要素タイプ（例：ProgressRing）を使用する場合は、`postRawCard()`を使用するか、型キャストを行ってください。[example/ex4.ts](example/ex4.ts) にキャストの例があります。

## 開発

はじめかた

```sh
npm run init  # `npm init` ではない
npm run smoketest
npm install @microsoft/teams.cards # 必要に応じて
```

## ライセンス

MIT ライセンス
