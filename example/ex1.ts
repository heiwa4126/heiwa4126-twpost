// 重要: `npm run build` の 後に実行してください

import { displayWebhookResult, postText } from "@heiwa4126/twpost";
import { getWebhookUrl } from "./hookUrl.js";

const webhookUrl = getWebhookUrl();
const result = await postText(webhookUrl, "**Hello!** from *example/ex1.ts*!");
displayWebhookResult(result);
