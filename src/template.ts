export const ESLINT_JS_TEMPLATE = `module.exports = {
}
`;

export const ESLINT_JSON_TEMPLATE = `{
}
`;

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
}
`;
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
}`

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
`

export const ESLINT = {
	".eslintrc.js": ESLINT_JS_TEMPLATE,
	".eslintrc.json": ESLINT_JSON_TEMPLATE,
	".eslintrc.yaml": ESLINT_YAML_TEMPLATE,
};

export const PRETTIER = {
	".prettierrc": PRETTIER_JSON_TEMPLATE,
	".prettier.js": PRETTIER_JS_TEMPLATE,
	".prettier.yaml": PRETTIER_YAML_TEMPLATE,
};
