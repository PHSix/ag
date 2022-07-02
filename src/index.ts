import { findRoot, writeConfig, doJobs, configCanDetect, log } from "./utils";
import prompts from "prompts";
import { PromptObject } from "prompts";
// import { log, warn } from "console";
import { yellow as warn } from "kolorist";
import { green } from "kolorist";
import {
	eslintConfigsPath,
	eslintConfirm,
	eslintSelect,
	prettierConfigsPath,
	prettierConfirm,
	prettierSelect,
} from "./template";

const questions: PromptObject[] = [];

(async function () {
	const cwd = process.cwd();
	const rootPath = await findRoot(cwd);
	if (!eslintConfigsPath.some((item) => configCanDetect(rootPath, item))) {
		log(green("eslint config don't existed."));
		questions.push(eslintConfirm);
	} else {
		log(warn("eslint config existed."));
	}
	if (!prettierConfigsPath.some((item) => configCanDetect(rootPath, item))) {
		log(green("prettier config don't existed."));
		questions.push(prettierConfirm);
	} else {
		log(warn("eslint config existed."));
	}
	if (questions.length === 0) {
		return;
	}
	const confirmResponse = await prompts(questions);

	// clear the origin qustions
	while (questions.length !== 0) questions.pop();

	if (confirmResponse["eslint"]) questions.push(eslintSelect);
	if (confirmResponse["prettier"]) questions.push(prettierSelect);

	// get qustion answer
	const selectResponse = await prompts(questions);

	if (confirmResponse["eslint"]) writeConfig(selectResponse["eslint"], rootPath);
	if (confirmResponse["prettier"]) writeConfig(selectResponse["prettier"], rootPath);

	// at the end
	// do the all jobs
	doJobs();
})();
