// import { displayWebhookResult, postTextToTeamsWebhook } from "@heiwa4126/twpost";
import { displayWebhookResult, postTextToTeamsWebhook } from "../src/postText";

const webhookUrl = process.env.TEAMS_WEBHOOK_URL ?? "";
if (webhookUrl === "") {
	throw new Error("TEAMS_WEBHOOK_URL environment variable is required");
}
const result = await postTextToTeamsWebhook(webhookUrl, "Hello from example/ex2.mjs!");
displayWebhookResult(result);
