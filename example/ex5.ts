// 重要: `npm run build` の 後に実行してください
//
// [Building Adaptive Cards | Teams AI Library (v2)](https://microsoft.github.io/teams-ai/typescript/in-depth-guides/adaptive-cards/building-adaptive-cards)
// のサンプルを流用

import { displayWebhookResult, postCard } from "@heiwa4126/twpost";
import type { IAdaptiveCard } from "@microsoft/teams.cards";
import { getWebhookUrl } from "./hookUrl.js";

const webhookUrl = getWebhookUrl();

const card: IAdaptiveCard = {
	type: "AdaptiveCard",
	body: [
		{
			text: "Please fill out the below form to send a game purchase request.",
			wrap: true,
			type: "TextBlock",
			style: "heading",
		},
		{
			columns: [
				{
					width: "stretch",
					items: [
						{
							choices: [
								{ title: "Call of Duty", value: "call_of_duty" },
								{ title: "Death's Door", value: "deaths_door" },
								{ title: "Grand Theft Auto V", value: "grand_theft" },
								{ title: "Minecraft", value: "minecraft" },
							],
							style: "filtered",
							placeholder: "Search for a game",
							id: "choiceGameSingle",
							type: "Input.ChoiceSet",
							label: "Game:",
						},
					],
					type: "Column",
				},
			],
			type: "ColumnSet",
		},
	],
	actions: [
		{
			title: "Request purchase",
			type: "Action.Execute",
			data: { action: "purchase_item" },
		},
	],
	version: "1.5",
};

const result = await postCard(webhookUrl, card);
displayWebhookResult(result);
