import { displayWebhookResult, postTextToTeamsWebhook } from "@heiwa4126/twpost";

const webhookUrl = process.env.TEAMS_WEBHOOK_URL ?? "";
const result = await postTextToTeamsWebhook(webhookUrl, "Hello from example/ex2.ts!");
displayWebhookResult(result);
