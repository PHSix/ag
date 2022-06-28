import { existsSync, readdirSync, statSync, writeFileSync } from "fs";
import { ESLINT_TEMPLATE, PRETTIER_TEMPLATE } from "./template"

const DEBUG = false

interface IJob {
	template: string;
	targetPath: string;
}

const jobQueue: IJob[] = []

function isRoot(path: string) {
	const status = statSync(path)
	if (!status.isDirectory()) {
		return false
	}
	const dir = readdirSync(path)
	if ([...dir.entries()].some((item) => item[1] === "package.json")) {
		return true
	}
	return false
}


function tail<T>(arr: Array<T>): Array<T> {
	arr.pop()
	return arr
}

function valid(path: string) {
	if (path.split("/").length === 1) {
		return false
	}
	return true
}

export function findRoot(path :string) : Promise<string> {
	if (isRoot(path)) {
		return Promise.resolve(path)
	}
	else {
		if (valid(path)) {
			return findRoot(tail(path.split("/")).join("/"))
		}
		return Promise.reject("Failed find root path.")
	}
}

export function fileExisted(path: string) {
	return existsSync(path)
}

export function log(msg: unknown) {
	if (DEBUG) {
		console.log(msg)
	}
}

type EConfigTemplate = "eslint" | "prettier"

// add a job for jobQueue
// path ( include file name, like: /home/${User}/project/eslint.js )
export function writeConfig(c: EConfigTemplate, path: string) {
	if (c === "eslint") {
		log(`write eslint config file to ${path}`)
		if (fileExisted(path)) {
			throw Error("eslint config has exiteds, panic this job.")
		}
		jobQueue.push({
			template: ESLINT_TEMPLATE,
			targetPath: path
		})
	}else if(c === "prettier") {
		log(`write prettier config file to ${path}`)
		if (fileExisted(path)) {
			throw Error("prettier config has exiteds, panic this job.")
		}
		jobQueue.push({
			template: PRETTIER_TEMPLATE,
			targetPath: path
		})
	}
}

function pullJob(job: IJob) {
	writeFileSync(job.targetPath, job.template);
	return
}

export function doJobs() {
	for (let job of jobQueue) {
		pullJob(job)
	}
}
