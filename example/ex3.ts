// 重要: `npm run build` の 後に実行してください
// @microsoft/teams.cardsを使用してAdaptive Cardを作成するサンプル

import { displayWebhookResult, postCard, SCHEMA_URL } from "@heiwa4126/twpost";
import { AdaptiveCard, DonutChart, DonutChartData, TextBlock } from "@microsoft/teams.cards";
import { getWebhookUrl } from "./hookUrl.js";

const webhookUrl = getWebhookUrl();

// データ定義
const chartData = [
	{ legend: "バナナ", value: 292 },
	{ legend: "キウイ", value: 179 },
	{ legend: "リンゴ", value: 143 },
	{ legend: "モモ", value: 98 },
	{ legend: "ナシ", value: 59 },
];

const card = new AdaptiveCard(
	// タイトル
	new TextBlock("**結果発表** (ID=USO800)", {
		wrap: true,
		size: "Large",
	}),

	// ドーナツチャート
	new DonutChart({
		title: "New Chart.Donut",
	}).withData(
		...chartData.map(
			(item) =>
				new DonutChartData({
					legend: item.legend,
					value: item.value,
				}),
		),
	),

	// 代替として表形式でデータも表示
	// new FactSet().withFacts(...chartData.map((item) => new Fact(item.legend, item.value.toString()))),
).withOptions({
	version: "1.5",
	$schema: SCHEMA_URL,
});

const result = await postCard(webhookUrl, card);
// 実は const result = await postRawCard(webhookUrl, card); でも同じ結果。こちらは型チェックが無い

displayWebhookResult(result);
