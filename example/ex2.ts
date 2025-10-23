// 重要: `npm run build` の 後に実行してください
//
// [Adaptive Card Designer](https://adaptivecards.microsoft.com/designer) で作成した
// Adaptive Card の JSONペイロードを直接使用する例. 間違った書式でも送信できてしまう

import { displayWebhookResult, postRawCard, SCHEMA_URL } from "@heiwa4126/twpost";
import { getWebhookUrl } from "./hookUrl.js";

const webhookUrl = getWebhookUrl();

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

const result = await postRawCard(webhookUrl, rawCard);
displayWebhookResult(result);
