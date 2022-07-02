import { PromptObject } from "prompts";

export const ESLINT_JS_TEMPLATE = `module.exports = {
}`;

export const ESLINT_JSON_TEMPLATE = `{
}`;

export const ESLINT_YAML_TEMPLATE = ``;

export const PRETTIER_JSON_TEMPLATE = `{
	"useTabs": true,
	"tabWidth": 2,
	"jsxSingleQuote": true,
	"bracketSpacing": true,
	"arrowParens": "always",
	"jsxBracketSameLine": true,
	"semi": true,
	"printWidth": 120,
	"singleQuote": false,
	"requirePragma": false
}`;
export const PRETTIER_JS_TEMPLATE = `module.exports = {
	useTabs: true,
	tabWidth: 2,
	jsxSingleQuote: true,
	bracketSpacing: true,
	arrowParens: "always",
	jsxBracketSameLine: true,
	semi: true,
	printWidth: 120,
	singleQuote: false,
	requirePragma: false
}`;

export const PRETTIER_YAML_TEMPLATE = `useTabs: true
tabWidth: 2
jsxSingleQuote: true
bracketSpacing: true
arrowParens: "always"
jsxBracketSameLine: true
semi: true
printWidth: 120
singleQuote: false
requirePragma: false
`;

export const prettierConfirm: PromptObject = {
	type: "confirm",
	initial: true,
	message: "Will you auto generate prettier config in this project?",
	name: "prettier",
};

export const eslintConfirm: PromptObject = {
	type: "confirm",
	initial: false,
	message: "Will you auto generate eslint config in this project?",
	name: "eslint",
};

export const eslintSelect: PromptObject = {
	type: "select",
	name: "eslint",
	message: "select a eslint config template.",
	choices: [
		{ title: ".eslintrc.js", value: ".eslintrc.js" },
		{ title: ".eslintrc.json", value: ".eslintrc.json" },
		{ title: ".eslintrc.yaml", value: ".eslintrc.yaml" },
	],
	initial: 0,
};

export const prettierSelect: PromptObject = {
	type: "select",
	name: "prettier",
	message: "select a prettier config template.",
	choices: [
		{ title: ".prettierrc", value: ".prettierrc" },
		{ title: ".prettierrc.js", value: ".prettierrc.js" },
		{ title: ".prettierrc.json", value: ".prettierrc.json" },
		{ title: ".prettierrc.yaml", value: ".prettierrc.yaml" },
	],
	initial: 0,
};

const ESLINT = {
	".eslintrc.js": ESLINT_JS_TEMPLATE,
	".eslintrc.json": ESLINT_JSON_TEMPLATE,
	".eslintrc.yaml": ESLINT_YAML_TEMPLATE,
};

const PRETTIER = {
	".prettierrc": PRETTIER_JSON_TEMPLATE,
	".prettierrc.json": PRETTIER_JSON_TEMPLATE,
	".prettierrc.js": PRETTIER_JS_TEMPLATE,
	".prettierrc.yaml": PRETTIER_YAML_TEMPLATE,
};

export const TEMPLATE = { ...ESLINT, ...PRETTIER };

export type TemplateType = keyof typeof TEMPLATE;

export const eslintConfigsPath: (keyof typeof ESLINT)[] = Object.keys(ESLINT) as any;
export const prettierConfigsPath: (keyof typeof PRETTIER)[] = Object.keys(PRETTIER) as any;
