/**
 * Teams Webhook API用のユーティリティ関数群
 */

import type { IAdaptiveCard } from "@microsoft/teams.cards";
import { AdaptiveCard, TextBlock } from "@microsoft/teams.cards";
// import type { AdaptiveCard as AC15 } from "./adaptive-card-v1.5.d.ts";

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

	return postRawCard(webhookUrl, card);
}

/**
 * Teams Workflows Webhook URL に Adaptive Card 形式のメッセージを送信する。
 * postRawCard() の TypeScript ラッパー。型チェック不要と思うなら直に postRawCard() を呼んでもいい
 *
 * **注意:** JSONスキーマがちゃんとメンテされておらず、存在しない要素タイプがある

 * @param webhookUrl - Teams Workflows Webhook の URL
 * @param card - Teams に投稿するAdaptiveCardオブジェクト(@microsoft/teams.cards または AC15 (Adaptive Cards v1.5))
 * @returns Promise<WebHookResponse> - レスポンス情報
 */
export async function postCard(webhookUrl: string, card: IAdaptiveCard): Promise<WebHookResponse> {
	return postRawCard(webhookUrl, card);
}

/**
 * Teams Workflows Webhook URL にオブジェクトを送信する。
 * rawCard は Adaptive Card 形式であることを期待。バリデーションはしない
 *
 * @param webhookUrl - Teams Workflows Webhook の URL
 * @param rawCard - Teams に投稿するオブジェクト(Adaptive Card 形式を期待)
 * @returns Promise<WebHookResponse> - レスポンス情報
 */
export async function postRawCard(webhookUrl: string, rawCard: object): Promise<WebHookResponse> {
	const encodedMsg = JSON.stringify({
		attachments: [
			{
				contentType: "application/vnd.microsoft.card.adaptive",
				content: rawCard,
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
