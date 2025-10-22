import { AdaptiveCard, TextBlock, RichTextBlock, TextRun } from "@microsoft/teams.cards";

console.log("=== TextBlock with Markdown Test ===");

// TextBlock with Markdown
const cardWithMarkdown = new AdaptiveCard(
	new TextBlock("**Bold text**, *italic text*, and [link](https://example.com)", {
		wrap: true,
	})
).withOptions({
	version: "1.5",
	$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
});

console.log(JSON.stringify(cardWithMarkdown, null, 2));

console.log("\n=== RichTextBlock with TextRun Test ===");

// RichTextBlock with TextRun (alternative for rich formatting)
const cardWithRichText = new AdaptiveCard(
	new RichTextBlock().withInlines(
		new TextRun("Bold text", { weight: "Bolder" }),
		", ",
		new TextRun("italic text", { italic: true }),
		", and regular text"
	)
).withOptions({
	version: "1.5",
	$schema: "http://adaptivecards.io/schemas/adaptive-card.json",
});

console.log(JSON.stringify(cardWithRichText, null, 2));