// ex1,2などで使うユーティリティ関数

export function getWebhookUrl(): string {
	const webhookUrl = process.env.TEAMS_WEBHOOK_URL ?? "";
	if (webhookUrl === "") {
		throw new Error("TEAMS_WEBHOOK_URL environment variable is required");
	}
	return webhookUrl;
}
