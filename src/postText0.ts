/**
 * Teams Webhook API用のユーティリティ関数群
 */
// import * as AdaptiveCards from "adaptivecards";

/**
 * Webhook のレスポンス情報を格納する型
 */
export interface WebHookResponse {
	payload: string;
	statusCode: number;
	response: string;
}

/**
 * Webhook のレスポンス結果を表示する関数
 *
 * @param webhookResponse - Webhook のレスポンス情報
 */
export function displayWebhookResult(webhookResponse: WebHookResponse): void {
	console.log(webhookResponse);
}

/**
 * Teams Workflows Webhook URL に Adaptive Card 形式のメッセージを送信する関数
 *
 * @param webhookUrl - Teams Workflows Webhook の URL
 * @param messageText - Teams に投稿するメッセージ本文
 * @returns Promise<WebHookResponse> - レスポンス情報
 */
export async function postTextToTeamsWebhook(
	webhookUrl: string,
	messageText: string,
): Promise<WebHookResponse> {
	// Adaptive Card フォーマットでメッセージを構成
	// テキストだけなのでライブラリ不使用
	const payload = {
		attachments: [
			{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: {
					$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
					type: "AdaptiveCard",
					version: "1.2",
					body: [
						{
							type: "TextBlock",
							text: messageText,
							wrap: true,
							markdown: true,
						},
					],
				},
			},
		],
	};

	// JSON をエンコード
	const encodedMsg = JSON.stringify(payload);

	try {
		// POST リクエストの送信
		const response = await fetch(webhookUrl, {
			method: "POST",
			body: encodedMsg,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// レスポンステキストを取得
		const responseText = await response.text();

		// 結果の構造体を作成
		const result: WebHookResponse = {
			payload: encodedMsg,
			statusCode: response.status,
			response: responseText,
		};

		return result;
	} catch (error) {
		// エラー時のレスポンスを作成
		const errorResult: WebHookResponse = {
			payload: encodedMsg,
			statusCode: 0,
			response: error instanceof Error ? error.message : "Unknown error",
		};

		return errorResult;
	}
}
