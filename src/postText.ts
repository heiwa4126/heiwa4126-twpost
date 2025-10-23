/**
 * Teams Webhook API用のユーティリティ関数群
 */
import { AdaptiveCard, TextBlock } from "@microsoft/teams.cards";

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
 * Teams Workflows Webhook URL に text 形式のメッセージを送信する
 * @param webhookUrl - Teams Workflows Webhook の URL
 * @param text - Teams に投稿するテキストメッセージ。限定的な markdown をサポート
 * @returns Promise<WebHookResponse> - レスポンス情報
 */
export async function postText(webhookUrl: string, text: string): Promise<WebHookResponse> {
	// Adaptive Card フォーマットでメッセージを構成
	const card = new AdaptiveCard(
		new TextBlock(text, {
			wrap: true,
		}),
	).withOptions({
		version: "1.5",
		$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
	});

	return postPayload(webhookUrl, card);
}

/**
 * Teams Workflows Webhook URL に Adaptive Card 形式のメッセージを送信する。
 * postPayload() の TypeScript ラッパー。型チェック不要と思うなら直に postPayload() を呼んでもいい
 *
 * @param webhookUrl - Teams Workflows Webhook の URL
 * @param card - Teams に投稿する@microsoft/teams.cardsのAdaptiveCardオブジェクト
 * @returns Promise<WebHookResponse> - レスポンス情報
 */
export async function postCard(webhookUrl: string, card: AdaptiveCard): Promise<WebHookResponse> {
	return postPayload(webhookUrl, card);
}

/**
 * Teams Workflows Webhook URL に payload を送信する。
 * payload は Adaptive Card 形式の payload であることを想定しているが、ベリファイしていないので注意
 * 必要なら JSON Schema によるバリデーションを追加すること(http://adaptivecards.io/schemas/adaptive-card.json)
 *
 * @param webhookUrl - Teams Workflows Webhook の URL
 * @param payload: - Teams に投稿する
 * @returns Promise<WebHookResponse> - レスポンス情報
 */
export async function postPayload(webhookUrl: string, payload: object): Promise<WebHookResponse> {
	const encodedMsg = JSON.stringify({
		attachments: [
			{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: payload,
			},
		],
	});

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
