import Path from 'path';
import fs from 'fs';
import chalk from 'chalk';

const ACCEPTED_ENTRY_FILES = ['index.html'];
const getEntryFile = (files: string[]) => files.find(file => ACCEPTED_ENTRY_FILES.includes(file));

const ABSOLUTE_PATH_REG_EXP = /(src|href)="\/([^/])([^"]*)+"/g;

const fileContainsAbsolutePath = (fileContent: string) => {
  return [...fileContent.matchAll(ABSOLUTE_PATH_REG_EXP)].length > 0;
};

export const validateBundle = (path: string) => {
  const buildFolder = Path.join('./', path);
  const files = fs.readdirSync(buildFolder);
  const entry = getEntryFile(files);
  if (!entry) {
    throw new Error('Make sure your bundle includes a valid index.html file in its root folder.');
  }

  const entryFile = fs.readFileSync(Path.join(buildFolder, entry), { encoding: 'utf8' });

  if (fileContainsAbsolutePath(entryFile)) {
    console.log('----------------------------');
    console.warn(
      `${chalk.red(
        'Warning:'
      )} This bundle uses absolute paths. Please use relative paths instead for correct rendering. See more details here https://www.contentful.com/developers/docs/extensibility/app-framework/app-bundle/#limitations`
    );
    console.log('----------------------------');
  }
};
