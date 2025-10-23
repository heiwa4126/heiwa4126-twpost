// 重要: `npm run build` の 後に実行してください
//
// [Adaptive Card Designer](https://adaptivecards.microsoft.com/designer) で作成した
// Adaptive Card の JSONペイロードを直接使用する例

import { displayWebhookResult, postPayload } from "@heiwa4126/twpost";
import { getWebhookUrl } from "./hookUrl.js";

const webhookUrl = getWebhookUrl();

const payload = {
	type: "AdaptiveCard",
	$schema: "https://adaptivecards.io/schemas/adaptive-card.json",
	version: "1.5",
	body: [
		{
			type: "TextBlock",
			wrap: true,
			text: "**処理を開始しました** (ID=USO800)",
		},
		{
			type: "ProgressRing", // ProgressRing は生objectを使うしかない
			label: "処理進行中...",
			labelPosition: "After",
			size: "Tiny",
		},
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

const result = await postPayload(webhookUrl, payload);
displayWebhookResult(result);
