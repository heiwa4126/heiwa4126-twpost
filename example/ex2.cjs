const { displayWebhookResult, postTextToTeamsWebhook } = require("@heiwa4126/twpost");

async function main() {
	const webhookUrl = process.env.TEAMS_WEBHOOK_URL ?? "";
	const result = await postTextToTeamsWebhook(webhookUrl, "Hello from example/ex2.cjs!");
	displayWebhookResult(result);
}

main().catch(console.error);
