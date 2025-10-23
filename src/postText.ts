/**
 * Utility functions for Teams Webhook API
 */

import type { IAdaptiveCard } from "@microsoft/teams.cards";

/**
 * Type that stores webhook response information
 */
export interface WebHookResponse {
	payload: string;
	statusCode: number;
	response: string;
}

export const SCHEMA_URL = "https://adaptivecards.io/schemas/adaptive-card.json";

/**
 * Function to display webhook response results
 *
 * @param webhookResponse - Webhook response information
 */
export function displayWebhookResult(webhookResponse: WebHookResponse): void {
	console.log(webhookResponse);
}

/**
 * Send a text message to Teams Workflows Webhook URL
 * @param webhookUrl - Teams Workflows Webhook URL
 * @param text - Text message to post to Teams. Supports limited markdown
 * @returns Promise<WebHookResponse> - Response information
 */
export async function postText(webhookUrl: string, text: string): Promise<WebHookResponse> {
	// Compose message in Adaptive Card format
	const rawCard: IAdaptiveCard = {
		type: "AdaptiveCard",
		$schema: SCHEMA_URL,
		version: "1.5",
		body: [
			{
				type: "TextBlock",
				text,
				wrap: true,
			},
		],
	};
	return postRawCard(webhookUrl, rawCard);
}

/**
 * Send an Adaptive Card message to Teams Workflows Webhook URL.
 * TypeScript wrapper for postRawCard(). You can call postRawCard() directly if you don't need type checking.
 *
 * **Note:** The JSON schema is not properly maintained and contains non-existent element types.
 *
 * @param webhookUrl - Teams Workflows Webhook URL
 * @param card - AdaptiveCard object to post to Teams (AdaptiveCard or IAdaptiveCard type from `@microsoft/teams.cards`)
 * @returns Promise<WebHookResponse> - Response information
 */
export async function postCard(webhookUrl: string, card: IAdaptiveCard): Promise<WebHookResponse> {
	return postRawCard(webhookUrl, card);
}

/**
 * Send an object to Teams Workflows Webhook URL.
 * rawCard is expected to be in Adaptive Card format. No validation is performed.
 *
 * @param webhookUrl - Teams Workflows Webhook URL
 * @param rawCard - Object to post to Teams (expected to be in Adaptive Card format)
 * @returns Promise<WebHookResponse> - Response information
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
		// Send POST request
		const response = await fetch(webhookUrl, {
			method: "POST",
			body: encodedMsg,
			headers: {
				"Content-Type": "application/json",
			},
		});

		// Get response text
		const responseText = await response.text();

		// Create result structure
		const result: WebHookResponse = {
			payload: encodedMsg,
			statusCode: response.status,
			response: responseText,
		};

		return result;
	} catch (error) {
		// Create error response
		const errorResult: WebHookResponse = {
			payload: encodedMsg,
			statusCode: 0,
			response: error instanceof Error ? error.message : "Unknown error",
		};

		return errorResult;
	}
}
