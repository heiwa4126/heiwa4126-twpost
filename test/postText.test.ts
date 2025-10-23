import { AdaptiveCard, TextBlock } from "@microsoft/teams.cards";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
	displayWebhookResult,
	postCard,
	postPayload,
	postText,
	type WebHookResponse,
} from "../src/postText";

// fetch をモック
const mockFetch = vi.fn();
global.fetch = mockFetch;

// console.log をモック
const mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});

describe("postText", () => {
	const testWebhookUrl = "https://example.com/webhook";
	const testText = "Hello, **World**!";

	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe("displayWebhookResult", () => {
		it("should log the webhook response to console", () => {
			const testResponse: WebHookResponse = {
				payload: '{"test": "data"}',
				statusCode: 200,
				response: "OK",
			};

			displayWebhookResult(testResponse);

			expect(mockConsoleLog).toHaveBeenCalledWith(testResponse);
		});
	});

	describe("postText", () => {
		it("should create an adaptive card and send it via postPayload", async () => {
			// Mock successful response
			mockFetch.mockResolvedValueOnce({
				status: 200,
				text: () => Promise.resolve("1"),
			});

			const result = await postText(testWebhookUrl, testText);

			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(mockFetch).toHaveBeenCalledWith(
				testWebhookUrl,
				expect.objectContaining({
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: expect.stringContaining(testText),
				}),
			);

			expect(result.statusCode).toBe(200);
			expect(result.response).toBe("1");
			expect(result.payload).toContain(testText);
		});

		it("should handle markdown in text", async () => {
			mockFetch.mockResolvedValueOnce({
				status: 200,
				text: () => Promise.resolve("1"),
			});

			const markdownText = "**Bold** and *italic* text";
			await postText(testWebhookUrl, markdownText);

			const call = mockFetch.mock.calls[0];
			const body = call[1].body;

			expect(body).toContain(markdownText);
			expect(body).toContain('"wrap":true');
		});
	});

	describe("postCard", () => {
		it("should send an AdaptiveCard via postPayload", async () => {
			mockFetch.mockResolvedValueOnce({
				status: 200,
				text: () => Promise.resolve("1"),
			});

			const card = new AdaptiveCard(new TextBlock("Test message", { wrap: true })).withOptions({
				version: "1.5",
				$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
			});

			const result = await postCard(testWebhookUrl, card);

			expect(mockFetch).toHaveBeenCalledTimes(1);
			expect(result.statusCode).toBe(200);
			expect(result.payload).toContain("Test message");
		});
	});

	describe("postPayload", () => {
		it("should send a POST request with correct headers and body structure", async () => {
			mockFetch.mockResolvedValueOnce({
				status: 200,
				text: () => Promise.resolve("1"),
			});

			const testPayload = {
				type: "AdaptiveCard",
				version: "1.5",
				body: [{ type: "TextBlock", text: "Test" }],
			};

			const result = await postPayload(testWebhookUrl, testPayload);

			expect(mockFetch).toHaveBeenCalledWith(testWebhookUrl, {
				method: "POST",
				body: JSON.stringify({
					attachments: [
						{
							contentType: "application/vnd.microsoft.card.adaptive",
							content: testPayload,
						},
					],
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});

			expect(result.statusCode).toBe(200);
			expect(result.response).toBe("1");
		});

		it("should handle successful responses", async () => {
			const mockResponseText = '{"result": "success"}';
			mockFetch.mockResolvedValueOnce({
				status: 201,
				text: () => Promise.resolve(mockResponseText),
			});

			const result = await postPayload(testWebhookUrl, {});

			expect(result.statusCode).toBe(201);
			expect(result.response).toBe(mockResponseText);
			expect(result.payload).toBeDefined();
		});

		it("should handle error responses", async () => {
			mockFetch.mockResolvedValueOnce({
				status: 400,
				text: () => Promise.resolve("Bad Request"),
			});

			const result = await postPayload(testWebhookUrl, {});

			expect(result.statusCode).toBe(400);
			expect(result.response).toBe("Bad Request");
		});

		it("should handle network errors", async () => {
			const errorMessage = "Network error";
			mockFetch.mockRejectedValueOnce(new Error(errorMessage));

			const result = await postPayload(testWebhookUrl, {});

			expect(result.statusCode).toBe(0);
			expect(result.response).toBe(errorMessage);
			expect(result.payload).toBeDefined();
		});

		it("should handle unknown errors", async () => {
			mockFetch.mockRejectedValueOnce("Unknown error");

			const result = await postPayload(testWebhookUrl, {});

			expect(result.statusCode).toBe(0);
			expect(result.response).toBe("Unknown error");
		});
	});

	describe("payload structure", () => {
		it("should create correct Teams webhook payload structure", async () => {
			mockFetch.mockResolvedValueOnce({
				status: 200,
				text: () => Promise.resolve("1"),
			});

			const testPayload = { test: "data" };
			await postPayload(testWebhookUrl, testPayload);

			const call = mockFetch.mock.calls[0];
			const body = JSON.parse(call[1].body);

			expect(body).toEqual({
				attachments: [
					{
						contentType: "application/vnd.microsoft.card.adaptive",
						content: testPayload,
					},
				],
			});
		});
	});

	describe("integration test", () => {
		it("should work end-to-end with postText", async () => {
			mockFetch.mockResolvedValueOnce({
				status: 200,
				text: () => Promise.resolve("1"),
			});

			const result = await postText(testWebhookUrl, "**Test** message");

			// Verify the full payload structure
			const payload = JSON.parse(result.payload);
			expect(payload.attachments).toHaveLength(1);
			expect(payload.attachments[0].contentType).toBe("application/vnd.microsoft.card.adaptive");
			expect(payload.attachments[0].content.type).toBe("AdaptiveCard");
			expect(payload.attachments[0].content.body).toHaveLength(1);
			expect(payload.attachments[0].content.body[0].type).toBe("TextBlock");
			expect(payload.attachments[0].content.body[0].text).toBe("**Test** message");
			expect(payload.attachments[0].content.body[0].wrap).toBe(true);
		});
	});
});
