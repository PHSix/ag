import { existsSync, readdirSync, statSync, writeFileSync } from "fs";
import { ESLINT_JS_TEMPLATE, PRETTIER_JSON_TEMPLATE } from "./template";

const DEBUG = false;

interface IJob {
	template: string;
	targetPath: string;
}
type TemplateType = "eslint" | "prettier";

const jobQueue: IJob[] = [];

function getTemplate(c: TemplateType): string {
	switch (c) {
		case "eslint":
			return ESLINT_JS_TEMPLATE;
		case "prettier":
			return PRETTIER_JSON_TEMPLATE;
		default:
			return "";
	}
}

function isRoot(path: string) {
	const status = statSync(path);
	if (!status.isDirectory()) {
		return false;
	}
	const dir = readdirSync(path);
	if ([...dir.entries()].some((item) => item[1] === "package.json")) {
		return true;
	}
	return false;
}

/**
 * input a job target path and output a IJob
 */
function prepareConfig(c: TemplateType, path: string): IJob {
	if (fileExisted(path)) {
		throw Error("eslint config has exiteds, panic this job.");
	}
	return {
		template: getTemplate(c),
		targetPath: path,
	};
}

function tail<T>(arr: Array<T>): Array<T> {
	arr.pop();
	return arr;
}

function valid(path: string) {
	if (path.split("/").length <= 1) {
		return false;
	}
	return true;
}

export function findRoot(path: string): Promise<string> {
	if (isRoot(path)) {
		return Promise.resolve(path);
	} else {
		if (valid(path)) {
			return findRoot(tail(path.split("/")).join("/"));
		}
		return Promise.reject("Failed find root path.");
	}
}

export function fileExisted(path: string) {
	return existsSync(path);
}

export function log(msg: unknown) {
	if (DEBUG) {
		console.log(msg);
	}
}

// add a job for jobQueue
// path ( include file name, like: /home/${User}/project/eslint.js )
export function writeConfig(c: TemplateType, rootPath: string) {
	let path = rootPath;
	switch (c) {
		case "eslint":
			path += "eslint.js";
			break;
		case "prettier":
			path += ".prettierrc";
			break;
		default:
			throw Error('config template type not exist.');
	}
	jobQueue.push(prepareConfig(c, path));
}

function pullJob(job: IJob) {
	writeFileSync(job.targetPath, job.template);
	return;
}

export function doJobs() {
	for (let job of jobQueue) {
		pullJob(job);
	}
}
