// 重要: `npm run build` の 後に実行してください
// [Adaptive Card Designer](https://adaptivecards.microsoft.com/designer) で作成した
// Adaptive Card の JSONペイロードを直接使用する例

import { type AC15, displayWebhookResult, postAdaptiveCard15 } from "@heiwa4126/twpost";
import { getWebhookUrl } from "./hookUrl.js";

const webhookUrl = getWebhookUrl();

const payload: AC15 = {
	type: "AdaptiveCard",
	$schema: "https://adaptivecards.io/schemas/adaptive-card.json",
	version: "1.5",
	body: [
		{
			type: "TextBlock",
			wrap: true,
			text: "**処理を開始しました** (ID=USO800)",
		},
		// https://adaptivecards.io/schemas/1.5.0/adaptive-card.json に存在しないので
		// 型チェックエラーになる。ProgressRing は最新のスキーマ(1.6.0)にも無い
		// {
		// 	type: "ProgressRing",
		// 	label: "処理進行中...",
		// 	labelPosition: "After",
		// 	size: "Tiny",
		// },
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

const result = await postAdaptiveCard15(webhookUrl, payload);
displayWebhookResult(result);
