# heiwa4126-twpost

Teams の Workflows (Teams 版 Power Automate)の
「Webhook 要求を受信したらチャットに投稿する」テンプレートから作った workflow の
webhook に
Adaptive Cards 形式で投稿する関数のパッケージ

## インストール

```sh
npm install @heiwa4126/twpost
```

## 開発

```sh
npm run init  # `npm init` ではない
npm run smoketest
```

## メモ

[adaptivecards - npm](https://www.npmjs.com/package/adaptivecards)
は壊れているので
[@microsoft/teams.cards - npm](https://www.npmjs.com/package/@microsoft/teams.cards)
を使いました。
