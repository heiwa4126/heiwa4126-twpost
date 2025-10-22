// `npm run build` の 後に実行してください
import { displayWebhookResult, postTextToTeamsWebhook } from "@heiwa4126/twpost";

// 直接 import も可能
// import { displayWebhookResult, postTextToTeamsWebhook } from "../src/postText";

const webhookUrl = process.env.TEAMS_WEBHOOK_URL ?? "";
if (webhookUrl === "") {
	throw new Error("TEAMS_WEBHOOK_URL environment variable is required");
}
const result = await postTextToTeamsWebhook(webhookUrl, "**Hello!** from *example/ex2.ts*!");
displayWebhookResult(result);
