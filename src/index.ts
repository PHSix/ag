import { findRoot, writeConfig, doJobs } from "./utils"
import prompts from 'prompts'
import { PromptObject } from "prompts"

const questions: PromptObject[] = [
	{
		type: 'confirm',
		initial: true,
		message: "Will you auto generate `.prettierrc` in this project?",
		name: "prettier",
	},
	{
		type: 'confirm',
		initial: false,
		message: "Will you auto generate `.eslint.js` in this project?",
		name: "eslint",
	}
];


(async function () {
	const cwd = process.cwd()
	const rootPath = await findRoot(cwd)
	const response = await prompts(questions)
	if (response["eslint"]) {
		writeConfig("eslint", rootPath)
	}
	if (response["prettier"]) {
		writeConfig("prettier", rootPath)
	}
	doJobs()
})()


