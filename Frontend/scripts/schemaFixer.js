/* eslint-disable no-undef */
import { readFileSync, writeFileSync } from 'node:fs';

if(process.argv.length !== 4) {
    throw new Error('The schema fixer should be called with the following arguments: ./path/to/source ./path/to/destination');
}

const source = process.argv[2];
const destination = process.argv[3];

let schemas = '';
try {
  schemas = readFileSync(source, 'utf8');
  schemas = schemas.replace(/oneOf/g, 'anyOf');
  schemas = schemas.replace(/#\/definitions\//g, '');
} catch (err) {
  console.error(err);
}

try {
  writeFileSync(destination, schemas, { encoding: 'utf8' });
  console.log(`Schemas successfully fixed: ${destination}`);
} catch (err) {
  console.error(err);
}