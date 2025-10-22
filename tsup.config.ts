import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm", "cjs"],
	target: "node18",
	outDir: "dist",
	bundle: true,
	splitting: false,
	sourcemap: false,
	minify: false,
	clean: true,
	dts: {
		resolve: true,
		entry: ["src/index.ts"],
	},
});
