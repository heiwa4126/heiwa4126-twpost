# メモ

## JSONスキーマから型ファイル(.d.ts)を作るときは

```sh
npm install -D json-schema-to-typescript
curl -s https://adaptivecards.io/schemas/1.5.0/adaptive-card.json | npx json-schema-to-typescript --no-additionalProperties > src/adaptive-card-v1.5.d.ts
```

のようにしてください。いまのところ

```ts
import type { IAdaptiveCard } from "@microsoft/teams.cards";
```

で十分だし、特定のエレメントが欠けてるのは IAdaptiveCard もスキーマも同様

## 依存

[adaptivecards - npm](https://www.npmjs.com/package/adaptivecards)
は、いろいろあって放棄されたらしいので、
[@microsoft/teams.cards - npm](https://www.npmjs.com/package/@microsoft/teams.cards)
を使いました。
