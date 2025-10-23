# heiwa4126-twpost

[![npm version](https://img.shields.io/npm/v/@heiwa4126/twpost.svg)](https://www.npmjs.com/package/@heiwa4126/twpost)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

English | [日本語](https://github.com/heiwa4126/heiwa4126-twpost/blob/main/README-ja.md)

A package of functions for posting messages in Adaptive Cards format to webhooks created from the "Post to chat when a webhook request is received" template in Teams Workflows (Teams version of Power Automate).

twpost stands for "Teams Webhook Post".

## Installation

```sh
npm install @heiwa4126/twpost
npm install @microsoft/teams.cards # if needed
```

## Usage

### Sending Basic Text Messages

```typescript
import { postText, displayWebhookResult } from "@heiwa4126/twpost";

const webhookUrl = "Your Teams Webhook URL";
const result = await postText(webhookUrl, "**Hello!** from *my application*!");
displayWebhookResult(result);
```

### Posting with Adaptive Card Objects

Create Adaptive Cards type-safely using `@microsoft/teams.cards`:

```typescript
import { postCard, displayWebhookResult, SCHEMA_URL } from "@heiwa4126/twpost";
import { AdaptiveCard, DonutChart, DonutChartData, TextBlock } from "@microsoft/teams.cards";

const card = new AdaptiveCard(
  new TextBlock("**Results Announcement**", {
    wrap: true,
    size: "Large",
  }),
  new DonutChart({
    title: "Sales Data",
  }).withData(
    new DonutChartData({ legend: "Banana", value: 292 }),
    new DonutChartData({ legend: "Kiwi", value: 179 }),
    new DonutChartData({ legend: "Apple", value: 143 })
  )
).withOptions({
  version: "1.5",
  $schema: SCHEMA_URL,
});

const result = await postCard(webhookUrl, card);
displayWebhookResult(result);
```

### Posting with Direct JSON Payload

Use JSON created directly with Adaptive Card Designer:

```typescript
import { postRawCard, displayWebhookResult, SCHEMA_URL } from "@heiwa4126/twpost";

const rawCard = {
  type: "AdaptiveCard",
  $schema: SCHEMA_URL,
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      wrap: true,
      text: "**Processing started** (ID=USO800)",
    },
    {
      type: "ProgressRing", // Not in the latest schema but renders in Teams
      label: "Processing...",
      labelPosition: "After",
      size: "Tiny",
    },
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      title: "Cancel",
      url: "https://api.example.com/cancel?id=uso800",
    },
  ],
};

const result = await postRawCard(webhookUrl, rawCard);
displayWebhookResult(result);
```

### Type-Safe JSON Payload with Type Casting

Leverage type checking while handling schema-missing elements with type casting:

```typescript
import { postCard, displayWebhookResult, SCHEMA_URL } from "@heiwa4126/twpost";
import type { IAdaptiveCard } from "@microsoft/teams.cards";

const card: IAdaptiveCard = {
  type: "AdaptiveCard",
  $schema: SCHEMA_URL,
  version: "1.5",
  body: [
    {
      type: "TextBlock",
      wrap: true,
      text: "**Processing started** (ID=USO800)",
    },
    // ProgressRing is not in the latest schema but renders in Teams
    // Use unknown cast to bypass type checking
    {
      type: "ProgressRing",
      label: "Processing...",
      labelPosition: "After",
      size: "Tiny",
    } as unknown as IAdaptiveCard["body"][0],
  ],
  actions: [
    {
      type: "Action.OpenUrl",
      iconUrl: "icon:CalendarCancel",
      style: "destructive",
      title: "Cancel",
      url: "https://api.example.com/cancel?id=uso800",
    },
    {
      type: "Action.OpenUrl",
      title: "Process Description",
      url: "https://api.example.com/description?id=uso800",
    },
  ],
};

const result = await postCard(webhookUrl, card);
displayWebhookResult(result);
```

## API Reference

### `postText(webhookUrl: string, text: string): Promise<WebHookResponse>`

Sends a simple text message. Supports limited Markdown.

### `postCard(webhookUrl: string, card: IAdaptiveCard): Promise<WebHookResponse>`

Sends an Adaptive Card with type checking.

### `postRawCard(webhookUrl: string, rawCard: object): Promise<WebHookResponse>`

Sends an object directly as Adaptive Card format. No validation is performed.

### `displayWebhookResult(webhookResponse: WebHookResponse): void`

Displays response information to the console.

## Notes

- The JSON schema for `@microsoft/teams.cards` is not complete and may not include element types that are actually available in Teams
- For new element types (e.g., ProgressRing), use `postRawCard()` or perform type casting. See [example/ex4.ts](example/ex4.ts) for casting examples.

## Development

Getting started:

```sh
npm run init  # Not `npm init`
npm run smoketest
npm install @microsoft/teams.cards # if needed
```

## License

MIT License
