import { AdaptiveCard, TextBlock } from "@microsoft/teams.cards";

// AdaptiveCard と TextBlock を使用してAdaptive Cardを作成
const card = new AdaptiveCard(
	new TextBlock("Hello from example/ac1.ts using @microsoft/teams.cards!", {
		wrap: true,
	}),
).withOptions({
	version: "1.5",
	$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
});

// カードをJSONにシリアライズして出力
console.log(JSON.stringify(card, null, 2));
