const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';

const targetPath = isProduction
  ? `./src/environments/environment.prod.ts`
  : `./src/environments/environment.ts`;

if (!process.env['API_URL']) {
  console.error('All the required environment variables were not provided!');
  process.exit(-1);
}

if (!process.env['APP_TOKEN_STORAGE_KEY']) {
  console.error('All the required environment variables were not provided!');
  process.exit(-1);
}

if (!process.env['SOCKET_URL']) {
  console.error('All the required environment variables were not provided!');
  process.exit(-1);
}

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   API_URL: "${process.env['API_URL']}",
   SOCKET_URL: "${process.env['SOCKET_URL']}",
   APP_TOKEN_STORAGE_KEY: "${process.env['APP_TOKEN_STORAGE_KEY']}"
};
`;

// if the environment file does not exist, create it and write the environment variables
writeFile(targetPath, environmentFileContent, function (err: any) {
  if (err) {
    console.log(err);
  }

  console.log(`Wrote variables to ${targetPath}`);
});
