import prompts from 'prompts';
import { green, red, yellow } from 'kolorist';
import { existsSync, statSync, readdirSync, writeFileSync } from 'fs';

const ESLINT_JS_TEMPLATE = `module.exports = {
}`;
const ESLINT_JSON_TEMPLATE = `{
}`;
const ESLINT_YAML_TEMPLATE = ``;
const PRETTIER_JSON_TEMPLATE = `{
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
const PRETTIER_JS_TEMPLATE = `module.exports = {
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
const PRETTIER_YAML_TEMPLATE = `useTabs: true
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
const prettierConfirm = {
  type: "confirm",
  initial: true,
  message: "Will you auto generate prettier config in this project?",
  name: "prettier"
};
const eslintConfirm = {
  type: "confirm",
  initial: false,
  message: "Will you auto generate eslint config in this project?",
  name: "eslint"
};
const eslintSelect = {
  type: "select",
  name: "eslint",
  message: "select a eslint config template.",
  choices: [
    { title: ".eslintrc.js", value: ".eslintrc.js" },
    { title: ".eslintrc.json", value: ".eslintrc.json" },
    { title: ".eslintrc.yaml", value: ".eslintrc.yaml" }
  ],
  initial: 0
};
const prettierSelect = {
  type: "select",
  name: "prettier",
  message: "select a prettier config template.",
  choices: [
    { title: ".prettierrc", value: ".prettierrc" },
    { title: ".prettierrc.js", value: ".prettierrc.js" },
    { title: ".prettierrc.json", value: ".prettierrc.json" },
    { title: ".prettierrc.yaml", value: ".prettierrc.yaml" }
  ],
  initial: 0
};
const ESLINT = {
  ".eslintrc.js": ESLINT_JS_TEMPLATE,
  ".eslintrc.json": ESLINT_JSON_TEMPLATE,
  ".eslintrc.yaml": ESLINT_YAML_TEMPLATE
};
const PRETTIER = {
  ".prettierrc": PRETTIER_JSON_TEMPLATE,
  ".prettierrc.json": PRETTIER_JSON_TEMPLATE,
  ".prettierrc.js": PRETTIER_JS_TEMPLATE,
  ".prettierrc.yaml": PRETTIER_YAML_TEMPLATE
};
const TEMPLATE = { ...ESLINT, ...PRETTIER };
const eslintConfigsPath = Object.keys(ESLINT);
const prettierConfigsPath = Object.keys(PRETTIER);

const jobQueue = [];
function getTemplate(c) {
  return TEMPLATE[c];
}
function isRoot(path) {
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
function prepareConfig(c, path) {
  if (fileExisted(path)) {
    throw Error(c + " has exiteds, panic this job.");
  }
  return {
    template: getTemplate(c),
    targetPath: path
  };
}
function tail(arr) {
  arr.pop();
  return arr;
}
function valid(path) {
  if (path.split("/").length <= 1) {
    return false;
  }
  return true;
}
function findRoot(path) {
  if (isRoot(path)) {
    return Promise.resolve(path);
  } else {
    if (valid(path)) {
      return findRoot(tail(path.split("/")).join("/"));
    }
    return Promise.reject("Failed find root path.");
  }
}
function fileExisted(path) {
  return existsSync(path);
}
function log(msg) {
}
function writeConfig(c, rootPath) {
  let path = rootPath;
  if (TEMPLATE[c]) {
    path += "/" + c;
  } else {
    throw Error("config template type not exist.");
  }
  jobQueue.push(prepareConfig(c, path));
}
function pullJob(job) {
  writeFileSync(job.targetPath, job.template);
  return;
}
function doJobs() {
  for (let job of jobQueue) {
    pullJob(job);
  }
  console.log(green("Jobs all have finish."));
}
function configCanDetect(rootPath, t) {
  if (t.match("eslint")) {
    if (eslintConfigsPath.some((item) => {
      return fileExisted(rootPath + "/" + item);
    })) {
      return true;
    } else {
      return false;
    }
  }
  if (t.match("prettier")) {
    if (prettierConfigsPath.some((item) => {
      return fileExisted(rootPath + "/" + item);
    })) {
      return true;
    } else {
      return false;
    }
  }
}

const questions = [];
(async function() {
  const cwd = process.cwd();
  let rootPath;
  try {
    rootPath = await findRoot(cwd);
  } catch (err) {
    console.log(red("Can not detect your project in " + cwd + "."));
    return;
  }
  console.log(green("Detect your current project is " + rootPath + "."));
  if (!eslintConfigsPath.some((item) => configCanDetect(rootPath, item))) {
    log(green("eslint config don't existed."));
    questions.push(eslintConfirm);
  } else {
    log(yellow("eslint config existed."));
  }
  if (!prettierConfigsPath.some((item) => configCanDetect(rootPath, item))) {
    log(green("prettier config don't existed."));
    questions.push(prettierConfirm);
  } else {
    log(yellow("eslint config existed."));
  }
  if (questions.length === 0) {
    return;
  }
  const confirmResponse = await prompts(questions);
  while (questions.length !== 0)
    questions.pop();
  if (confirmResponse["eslint"])
    questions.push(eslintSelect);
  if (confirmResponse["prettier"])
    questions.push(prettierSelect);
  const selectResponse = await prompts(questions);
  if (confirmResponse["eslint"])
    writeConfig(selectResponse["eslint"], rootPath);
  if (confirmResponse["prettier"])
    writeConfig(selectResponse["prettier"], rootPath);
  doJobs();
})();
